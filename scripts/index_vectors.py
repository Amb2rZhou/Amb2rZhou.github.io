"""
Index documents from ai-frontier-insight and personal-context repos
into Supabase pgvector for RAG.

Usage:
    export SILICONFLOW_API_KEY=...
    export SUPABASE_URL=https://xxx.supabase.co
    export SUPABASE_KEY=...
    python scripts/index_vectors.py
"""

import json
import os
import sys
import time
from typing import List, Dict, Any, Tuple

import requests

# ---------------------------------------------------------------------------
# Config
# ---------------------------------------------------------------------------

SILICONFLOW_API_KEY = os.environ.get("SILICONFLOW_API_KEY", "")
SUPABASE_URL = os.environ.get("SUPABASE_URL", "").rstrip("/")
SUPABASE_KEY = os.environ.get("SUPABASE_KEY", "")

EMBEDDING_MODEL = "BAAI/bge-m3"
EMBEDDING_ENDPOINT = "https://api.siliconflow.cn/v1/embeddings"
EMBEDDING_BATCH_SIZE = 16

CHUNK_SIZE = 500
CHUNK_OVERLAP = 50

GH_API = "https://api.github.com"
GH_RAW = "https://raw.githubusercontent.com"

GITHUB_TOKEN = os.environ.get("GITHUB_TOKEN", "")

PERSONAL_CONTEXT_FILES = [
    "agent-skill-ecosystem-report.md",
    "research-report-SKILL.md",
    "openclaw-insight.md",
]


def check_env():
    missing = []
    if not SILICONFLOW_API_KEY:
        missing.append("SILICONFLOW_API_KEY")
    if not SUPABASE_URL:
        missing.append("SUPABASE_URL")
    if not SUPABASE_KEY:
        missing.append("SUPABASE_KEY")
    if missing:
        print(f"[ERROR] Missing env vars: {', '.join(missing)}")
        sys.exit(1)


# ---------------------------------------------------------------------------
# Fetching helpers
# ---------------------------------------------------------------------------

def gh_get(url: str, retries: int = 3) -> requests.Response:
    """GET with simple retry / rate-limit handling."""
    headers = {"User-Agent": "RAG-Indexer"}
    if GITHUB_TOKEN:
        headers["Authorization"] = f"token {GITHUB_TOKEN}"
    for attempt in range(retries):
        resp = requests.get(url, headers=headers, timeout=30)
        if resp.status_code == 200:
            return resp
        if resp.status_code == 403 and "rate limit" in resp.text.lower():
            wait = int(resp.headers.get("Retry-After", 60))
            print(f"  Rate limited, sleeping {wait}s ...")
            time.sleep(wait)
            continue
        if resp.status_code >= 500:
            time.sleep(5 * (attempt + 1))
            continue
        # 404 or other client error — no retry
        break
    return resp


def fetch_daily_briefs() -> List[Dict[str, Any]]:
    """Return list of {source, filename, chunks} for daily briefs."""
    print("[1/3] Fetching daily brief list ...")
    listing_url = (
        f"{GH_API}/repos/Amb2rZhou/ai-frontier-insight/contents/data/daily"
        f"?per_page=100"
    )
    resp = gh_get(listing_url)
    if resp.status_code != 200:
        print(f"  WARNING: could not list daily folders ({resp.status_code})")
        return []

    folders = [item for item in resp.json() if item.get("type") == "dir"]
    print(f"  Found {len(folders)} date folders")

    results = []
    for folder in folders:
        date_str = folder["name"]
        raw_url = (
            f"{GH_RAW}/Amb2rZhou/ai-frontier-insight/main"
            f"/data/daily/{date_str}/brief.json"
        )
        r = gh_get(raw_url)
        if r.status_code != 200:
            print(f"  Skip {date_str}: no brief.json ({r.status_code})")
            continue

        try:
            brief = r.json()
        except json.JSONDecodeError:
            print(f"  Skip {date_str}: invalid JSON")
            continue

        chunks = chunks_from_daily_brief(brief)
        if chunks:
            results.append({
                "source": "daily",
                "filename": date_str,
                "chunks": chunks,
            })
            print(f"  {date_str}: {len(chunks)} chunks")

    return results


def chunks_from_daily_brief(brief: Any) -> List[str]:
    """Parse brief.json and turn signals into chunks.

    The brief can be a dict with a 'signals' list, or a plain list of signals.
    Each signal may have fields like title, insight, implications, summary, etc.
    """
    signals = []
    if isinstance(brief, dict):
        signals = brief.get("signals", brief.get("items", []))
        if not signals and isinstance(brief, dict):
            # Maybe the whole dict is one signal
            signals = [brief]
    elif isinstance(brief, list):
        signals = brief

    chunks = []
    buffer = ""
    for sig in signals:
        if isinstance(sig, str):
            text = sig
        elif isinstance(sig, dict):
            parts = []
            for key in ["title", "headline", "summary", "insight",
                        "implications", "implication", "analysis",
                        "content", "description"]:
                val = sig.get(key)
                if val:
                    if isinstance(val, list):
                        val = " ".join(str(v) for v in val)
                    parts.append(f"{key}: {val}")
            text = "\n".join(parts) if parts else json.dumps(sig, ensure_ascii=False)
        else:
            text = str(sig)

        # If this signal is big enough on its own, flush buffer and emit
        if len(text) >= CHUNK_SIZE:
            if buffer:
                chunks.append(buffer.strip())
                buffer = ""
            # chunk the large signal text
            chunks.extend(chunk_text(text))
        else:
            # Try to group small signals (2-3 per chunk)
            if len(buffer) + len(text) + 2 > CHUNK_SIZE:
                if buffer:
                    chunks.append(buffer.strip())
                buffer = text
            else:
                buffer = (buffer + "\n\n" + text).strip() if buffer else text

    if buffer.strip():
        chunks.append(buffer.strip())

    return chunks


def fetch_weekly_reports() -> List[Dict[str, Any]]:
    """Return list of {source, filename, chunks} for weekly .md files."""
    print("[2/3] Fetching weekly report list ...")
    listing_url = (
        f"{GH_API}/repos/Amb2rZhou/ai-frontier-insight/contents/data/weekly"
        f"?per_page=100"
    )
    resp = gh_get(listing_url)
    if resp.status_code != 200:
        print(f"  WARNING: could not list weekly files ({resp.status_code})")
        return []

    md_files = [
        item for item in resp.json()
        if item.get("type") == "file" and item["name"].endswith(".md")
    ]
    print(f"  Found {len(md_files)} weekly .md files")

    results = []
    for item in md_files:
        fname = item["name"]
        raw_url = (
            f"{GH_RAW}/Amb2rZhou/ai-frontier-insight/main"
            f"/data/weekly/{fname}"
        )
        r = gh_get(raw_url)
        if r.status_code != 200:
            print(f"  Skip {fname}: ({r.status_code})")
            continue

        chunks = chunk_text(r.text)
        results.append({
            "source": "weekly",
            "filename": fname,
            "chunks": chunks,
        })
        print(f"  {fname}: {len(chunks)} chunks")

    return results


def fetch_personal_context() -> List[Dict[str, Any]]:
    """Return list of {source, filename, chunks} for personal context files."""
    print("[3/3] Fetching personal context files ...")
    results = []
    for fname in PERSONAL_CONTEXT_FILES:
        raw_url = f"{GH_RAW}/Amb2rZhou/personal-context/main/{fname}"
        r = gh_get(raw_url)
        if r.status_code != 200:
            print(f"  Skip {fname}: ({r.status_code})")
            continue

        chunks = chunk_text(r.text)
        results.append({
            "source": "personal",
            "filename": fname,
            "chunks": chunks,
        })
        print(f"  {fname}: {len(chunks)} chunks")

    return results


# ---------------------------------------------------------------------------
# Chunking
# ---------------------------------------------------------------------------

def chunk_text(text: str, size: int = CHUNK_SIZE, overlap: int = CHUNK_OVERLAP) -> List[str]:
    """Split text into ~size-char chunks with ~overlap-char overlap."""
    text = text.strip()
    if not text:
        return []
    if len(text) <= size:
        return [text]

    chunks = []
    start = 0
    while start < len(text):
        end = start + size
        # Try to break at a newline or space near the end
        if end < len(text):
            # Look for a natural break in the last 20% of the chunk
            search_start = max(start, end - size // 5)
            nl_pos = text.rfind("\n", search_start, end)
            if nl_pos > start:
                end = nl_pos + 1
            else:
                sp_pos = text.rfind(" ", search_start, end)
                if sp_pos > start:
                    end = sp_pos + 1

        chunk = text[start:end].strip()
        if chunk:
            chunks.append(chunk)

        # Next chunk starts overlap chars before the end of current
        start = end - overlap if end < len(text) else end

    return chunks


# ---------------------------------------------------------------------------
# Embeddings
# ---------------------------------------------------------------------------

def generate_embeddings(texts: List[str]) -> List[List[float]]:
    """Call Silicon Flow to embed a list of texts, in batches of EMBEDDING_BATCH_SIZE."""
    all_embeddings: List[List[float]] = []
    headers = {
        "Authorization": f"Bearer {SILICONFLOW_API_KEY}",
        "Content-Type": "application/json",
    }

    for i in range(0, len(texts), EMBEDDING_BATCH_SIZE):
        batch = texts[i : i + EMBEDDING_BATCH_SIZE]
        payload = {
            "model": EMBEDDING_MODEL,
            "input": batch,
        }

        for attempt in range(3):
            try:
                resp = requests.post(
                    EMBEDDING_ENDPOINT,
                    headers=headers,
                    json=payload,
                    timeout=60,
                )
            except requests.RequestException as e:
                print(f"  Embedding request error: {e}, retrying ...")
                time.sleep(3 * (attempt + 1))
                continue

            if resp.status_code == 200:
                data = resp.json()["data"]
                # Sort by index to ensure order
                data.sort(key=lambda x: x["index"])
                all_embeddings.extend([d["embedding"] for d in data])
                break
            elif resp.status_code == 429:
                wait = int(resp.headers.get("Retry-After", 10))
                print(f"  Embedding rate limited, sleeping {wait}s ...")
                time.sleep(wait)
            else:
                print(f"  Embedding error {resp.status_code}: {resp.text[:200]}")
                time.sleep(3 * (attempt + 1))
        else:
            print(f"  FAILED to embed batch starting at index {i}, using empty vectors")
            all_embeddings.extend([[] for _ in batch])

    return all_embeddings


# ---------------------------------------------------------------------------
# Supabase upsert
# ---------------------------------------------------------------------------

def upsert_documents(rows: List[Dict[str, Any]]):
    """Upsert rows into Supabase documents table via REST API, batched."""
    url = f"{SUPABASE_URL}/rest/v1/documents"
    headers = {
        "apikey": SUPABASE_KEY,
        "Authorization": f"Bearer {SUPABASE_KEY}",
        "Content-Type": "application/json",
        "Prefer": "resolution=merge-duplicates",
    }

    batch_size = 50
    for i in range(0, len(rows), batch_size):
        batch = rows[i : i + batch_size]

        for attempt in range(3):
            try:
                resp = requests.post(url, headers=headers, json=batch, timeout=30)
            except requests.RequestException as e:
                print(f"  Supabase request error: {e}, retrying ...")
                time.sleep(3 * (attempt + 1))
                continue

            if resp.status_code in (200, 201):
                break
            elif resp.status_code == 429:
                wait = int(resp.headers.get("Retry-After", 10))
                print(f"  Supabase rate limited, sleeping {wait}s ...")
                time.sleep(wait)
            else:
                print(f"  Supabase upsert error {resp.status_code}: {resp.text[:300]}")
                time.sleep(3 * (attempt + 1))
        else:
            print(f"  FAILED to upsert batch starting at index {i}")

    print(f"  Upserted {len(rows)} rows total")


# ---------------------------------------------------------------------------
# Main
# ---------------------------------------------------------------------------

def main():
    check_env()

    # 1. Collect all documents
    all_docs = []
    all_docs.extend(fetch_daily_briefs())
    all_docs.extend(fetch_weekly_reports())
    all_docs.extend(fetch_personal_context())

    if not all_docs:
        print("No documents fetched. Exiting.")
        return

    # Flatten into (source, filename, chunk_index, content) tuples
    records: List[Tuple[str, str, int, str]] = []
    for doc in all_docs:
        for idx, chunk in enumerate(doc["chunks"]):
            records.append((doc["source"], doc["filename"], idx, chunk))

    total = len(records)
    print(f"\nTotal chunks to index: {total}")

    # 2. Generate embeddings
    print("\nGenerating embeddings ...")
    all_texts = [r[3] for r in records]
    embeddings = generate_embeddings(all_texts)
    print(f"  Generated {len(embeddings)} embeddings")

    # 3. Build rows and upsert
    print("\nUpserting to Supabase ...")
    rows = []
    for (source, filename, chunk_index, content), embedding in zip(records, embeddings):
        if not embedding:
            # Skip chunks where embedding failed
            continue
        rows.append({
            "source": source,
            "filename": filename,
            "chunk_index": chunk_index,
            "content": content,
            "embedding": embedding,
            "metadata": json.dumps({"source": source, "filename": filename}),
        })

    if rows:
        upsert_documents(rows)
    else:
        print("  No valid rows to upsert.")

    print("\nDone!")


if __name__ == "__main__":
    main()
