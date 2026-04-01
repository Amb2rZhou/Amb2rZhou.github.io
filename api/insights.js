// Vercel Serverless Function — DeepSeek API proxy for AI Frontier Insight RAG chatbot
// Vector-based RAG via Silicon Flow embeddings + Supabase vector search

import { rateLimit } from './_ratelimit.js';

async function embedQuestion(question) {
  const res = await fetch('https://api.siliconflow.cn/v1/embeddings', {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${process.env.SILICONFLOW_API_KEY}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      model: 'BAAI/bge-m3',
      input: question,
    }),
  });

  if (!res.ok) {
    const errText = await res.text();
    throw new Error(`Embedding API error (${res.status}): ${errText}`);
  }

  const data = await res.json();
  return data.data[0].embedding;
}

async function searchDocuments(embedding, matchCount = 20) {
  const supabaseUrl = process.env.SUPABASE_URL;
  const supabaseKey = process.env.SUPABASE_KEY;

  const baseUrl = supabaseUrl.startsWith('http') ? supabaseUrl : `https://${supabaseUrl}`;
  const res = await fetch(`${baseUrl}/rest/v1/rpc/match_documents`, {
    method: 'POST',
    headers: {
      'apikey': supabaseKey,
      'Authorization': `Bearer ${supabaseKey}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      query_embedding: embedding,
      match_threshold: 0.2,
      match_count: matchCount,
    }),
  });

  if (!res.ok) {
    const errText = await res.text();
    throw new Error(`Supabase search error (${res.status}): ${errText}`);
  }

  return await res.json();
}

function buildContext(documents) {
  if (!documents || documents.length === 0) {
    return 'No relevant documents found.';
  }

  // Separate personal research from other sources — personal gets priority
  const personal = documents.filter(d => d.source === 'personal');
  const others = documents.filter(d => d.source !== 'personal');

  // Take all personal chunks (up to 8) + top 8 from other sources
  const selectedPersonal = personal.slice(0, 8);
  const selectedOthers = others.slice(0, 8);
  const selected = [...selectedPersonal, ...selectedOthers];

  // Group by source type for display
  const groups = {};
  for (const doc of selected) {
    const source = doc.source || 'unknown';
    if (!groups[source]) groups[source] = [];
    groups[source].push(doc);
  }

  let context = '';
  // Put personal research first so it gets priority in LLM attention
  const sourceOrder = ['personal', ...Object.keys(groups).filter(s => s !== 'personal')];
  for (const source of sourceOrder) {
    const docs = groups[source];
    if (!docs) continue;
    const label = source === 'personal' ? "Zhile's Original Research & Analysis" : source === 'daily' ? 'Daily Briefs' : source === 'weekly' ? 'Weekly Reports' : source;
    context += `\n=== ${label} ===\n`;
    for (const doc of docs) {
      const fname = doc.filename || doc.id;
      const sim = doc.similarity ? ` (relevance: ${doc.similarity.toFixed(3)})` : '';
      context += `\n--- ${fname}${sim} ---\n${doc.content}\n`;
    }
  }

  return context;
}

export default async function handler(req, res) {
  // CORS
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  if (req.method === 'OPTIONS') return res.status(200).end();
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' });

  if (!rateLimit(req)) {
    return res.status(429).json({ error: 'Too many requests. Please wait a moment.' });
  }

  try {
    const { question, history } = req.body;
    if (!question || typeof question !== 'string' || question.length > 1000) {
      return res.status(400).json({ error: 'Invalid question' });
    }

    // Step 1: Embed the question
    let embedding;
    try {
      embedding = await embedQuestion(question);
    } catch (err) {
      console.error('Embedding error:', err);
      return res.status(502).json({ error: 'Failed to generate embedding' });
    }

    // Step 2: Search for relevant documents (fetch 20 results)
    let documents;
    try {
      documents = await searchDocuments(embedding);
    } catch (err) {
      console.error('Vector search error:', err);
      return res.status(502).json({ error: 'Failed to search documents' });
    }

    // Step 3: Build context and call DeepSeek
    const context = buildContext(documents);

    const systemPrompt = `You are an AI assistant for the AI Frontier Insight system, a daily AI intelligence briefing service built by Zhile Zhou (周芷乐).

The data comes from three sources:
1. Zhile's original research — her personal deep-dive analysis and perspectives on AI topics (HIGHEST PRIORITY — always cite these when available)
2. Weekly reports — in-depth weekly trend analysis and strategic insights
3. Daily briefs — automated daily AI news digests with signals, insights, and implications

Below are the most relevant retrieved chunks from the knowledge base:

${context}

---

Instructions:
- Prioritize Zhile's original research when it is present in the retrieved chunks. Her analysis represents unique, first-hand perspectives.
- Answer based on the retrieved content above. Do not fabricate information not present in the chunks.
- When citing, mention the source — document titles for research (e.g., "In Zhile's OpenClaw deep-dive analysis..."), dates for daily briefs, report names for weekly reports.
- If the retrieved chunks do not contain enough information to answer the question, clearly say so.
- Answer in the same language the user asks in (Chinese or English).
- Be concise, informative, and factual.`;

    const response = await fetch('https://api.deepseek.com/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${process.env.DEEPSEEK_API_KEY}`,
      },
    // Build messages with conversation history (keep last 6 turns to limit tokens)
    const messages = [{ role: 'system', content: systemPrompt }];
    if (Array.isArray(history)) {
      for (const msg of history.slice(-6)) {
        if (msg.role === 'user' || msg.role === 'assistant') {
          messages.push({ role: msg.role, content: String(msg.content).slice(0, 500) });
        }
      }
    }
    messages.push({ role: 'user', content: question });

      body: JSON.stringify({
        model: 'deepseek-chat',
        messages,
        max_tokens: 1000,
        temperature: 0.7,
      }),
    });

    if (!response.ok) {
      const errText = await response.text();
      console.error('DeepSeek API error:', errText);
      return res.status(502).json({ error: 'AI service error' });
    }

    const data = await response.json();
    const answer = data.choices?.[0]?.message?.content || 'Sorry, I could not generate a response.';
    return res.status(200).json({ answer });
  } catch (err) {
    console.error('Handler error:', err);
    return res.status(500).json({ error: 'Internal error' });
  }
}
