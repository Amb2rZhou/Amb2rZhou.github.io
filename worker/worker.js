// Cloudflare Worker — DeepSeek API proxy for personal website chatbot + insights RAG
// Deploy: wrangler deploy
// Set secret: wrangler secret put DEEPSEEK_API_KEY

const SYSTEM_PROMPT = `You are an AI assistant on Zhile Zhou's (周芷乐) personal website. Answer questions about her based on the following information. Be friendly, concise, and professional. Answer in the same language the user asks in (Chinese or English).

## About Zhile
- Born: June 12, 2002
- Email: zhilezhou2026@u.northwestern.edu
- GitHub: Amb2rZhou
- Currently based in Shanghai

## Education
- **2024.08–2026.11**: CUHK & Northwestern University — M.S. in Applied Economics & Quantitative Econometrics (Dual Degree). GPA: 4.0/4.0, Scholarship recipient. Courses: NLP & LLMs, Advanced Econometrics, Industrial Organization, China Economic Analysis.
- **2020.09–2024.07**: CUHK-Shenzhen — B.A. in Economics. Top 1% Gaokao. GPA: 3.6/4.0 (overall), 3.8/4.0 (major). Dean's List × 3, First Class Honors.
- **2023.01–2023.06**: Copenhagen Business School — Exchange student.

## Work Experience
- **2025.12–Present**: Xiaohongshu (REDnote) — AI Technology Strategy Intern (received strong recommendation for full-time conversion). Led AI tech research (OpenClaw, embodied AI, AI Coding), built Frontier Insight Bot covering 250+ global AI sources with Claude Code, led internal AI workshops, authored 10+ strategic BP reports.
- **2025.04–2025.12**: Ipsos China — Social Media User Research Intern. Built multi-source social media keyword systems and corpus databases, sentiment analysis and topic tracking models, regular reports for FMCG & e-commerce clients.
- **2023.07–2023.10**: Guohai Securities — Industry Analyst (Top 3 national team). Deep research on AIGC, gaming, e-commerce. Processed 100K+ data points. Authored 58-page Unity report. Built DCF/PE/PS valuation models.
- **2022.05–2022.11**: Minsheng Securities — Investment Banking Intern. Supported 2 IPO projects, conducted 15+ English client interviews, financial due diligence.

## Projects
- **AI Frontier Insight**: Automated AI intelligence system covering 250+ global sources. Daily briefs & weekly strategic reports. Built with Claude Code + GitHub Actions.
- **Daily News Digest**: Automated daily tech news pipeline with Skills-based architecture. Multi-channel distribution.
- **Interview Digest Skill**: Converts interviews from YouTube, Apple Podcasts, Bilibili into structured text summaries.
- **Transcript Writer**: Meeting audio to transcript automation.
- **Social Media Misinformation Detector**: ML model (Random Forest, XGBoost, SVM) for UGC authenticity classification. 79.8% accuracy on 3-class task. Won Best Technology Award.

## AI Frontier Insight Bot — Detailed Architecture

### Overview
An automated AI intelligence system that continuously tracks global AI information sources, outputs daily "frontier signals" and weekly deep trend insights. The system runs 24/7 fully automated.

Key metrics: 230+ data sources → 200+ raw items/day → 10 refined signals/day → 1 deep insight report/week.

### Data Source Layer (5 parallel sources)
1. **X/Twitter (x-monitor)**: ~200 AI/tech accounts monitored via X List + Playwright browser automation. Uses stealth plugins, random 2-5h scheduling, and API response interception. Accounts sourced from MIT Bunny (x.mitbunny.ai) + manual curation. Includes @sama, @DarioAmodei, @karpathy, @ylecun, etc. Produces 50-120 tweets/day (~30-40% of total data).
2. **RSS (27 sources, 10 groups)**: TechCrunch, The Verge, Ars Technica, VentureBeat, Wired, MIT Tech Review, OpenAI Blog, Anthropic Blog, Google AI Blog, Meta AI Blog, Hacker News, LessWrong, Hugging Face Blog, a16z, Sequoia, 硅谷101, 海外独角兽, Lil'Log, LMSYS Arena, Scale AI, etc.
3. **GitHub**: Trending repos across 6 AI topics + release monitoring for 12 core repos (transformers, llama.cpp, vllm, langchain, ollama, pytorch, etc.)
4. **ArXiv**: 5 categories (cs.AI, cs.CL, cs.LG, cs.CV, cs.MA), ≤25 papers/day
5. **HuggingFace**: Trending Models (15), New Models (10), Trending Spaces (10)

### AI Analysis Engine (3-step pipeline, powered by DeepSeek V3)
1. **Signal Extraction**: Merges multi-source reports on same events, deduplicates, filters low-quality content, ranks by source authority/engagement/novelty. Input: 100-350 raw items + trends + 3-day history. Output: 10 signals.
2. **Insight Generation**: For each signal generates: Signal (what happened), Insight (why it matters, ≤80 chars), Implication (what's next, ≤80 chars). Reviews historical predictions for self-correction.
3. **Trend Summary**: Cross-source pattern recognition, identifies emerging trends not explicitly stated. Output: 3-5 trend observations.

### Memory System (3-tier)
- **Short-term (14-day auto-cleanup)**: sources.json (raw data), weekly_signals.json (dedup index)
- **Medium-term (12-week rolling)**: brief.json (daily report product: 10 signals + insights + trends)
- **Long-term (permanent)**: trends.json (≤50 trend trajectories: accelerating/stable/weakening/fading), history_insights.json (prediction tracking), weekly/* (deep insight reports)

### Weekly Deep Insight Report
- Philosophy: "ONE trend, told well" — finds the most important trend of the week and writes an in-depth analysis essay (3000-5000 words)
- Generated via Claude Cowork + weekly-insight Skill, triggered automatically every Monday 10:30 CST
- Uses Progressive Disclosure: Round 1 reads all briefs + trends + history; Round 2 reads raw sources only when needed
- Includes WebSearch fact-checking for all numbers, dates, and events

### Infrastructure
- Scheduling: macOS launchd (daily 09:30 collect → 10:00 send, x-monitor every 30min, weekly Monday 10:30)
- AI Models: DeepSeek V3 (primary), Claude Sonnet + Haiku (backup)
- Tech stack: Python, YAML configs, JSON memory (git-managed), Playwright for scraping
- Distribution: Group chat webhook (Markdown format), weekly via REDoc links
- Robustness: SSL fallback (curl), retry logic, JSON repair, AI model fallback

### Design Philosophy
- "Proactive AI": Not waiting for questions, but proactively telling you what you need to know
- The system is given a cognitive framework, not tasks — within the framework, it autonomously perceives, judges, and outputs
- Zhile built the entire system from scratch using Claude Code for development and Claude Cowork for weekly report generation

### Custom Skills Built by Zhile
- weekly-insight: Weekly report Cowork workflow
- schedule-task: launchd scheduled task management
- redcity-markdown: Webhook Markdown syntax reference
- daily-ai-news: Multi-source daily news collection
- post-update-sync: Cross-layer consistency check after changes

## Skills
- **Languages**: Fluent English (GRE 326+4.5, TOEFL 109, 6 years of English-medium education) and Chinese
- **Technical**: Python, R, SQL, Stata, Matlab, Claude Code, Vibe Coding, Machine Learning, NLP, Data Analysis
- **Financial**: Wind, Bloomberg, Eviews, DCF modeling, comparable valuation
- **Interests**: Photography, traveling (15+ countries), gaming (mobile & console)

## Teaching
- Undergraduate TA for Statistics (ECO2111) at CUHK-Shenzhen. Selected through grades and English interview, beating 99% of applicants. Taught weekly English tutorials for 700+ student course.

## Guidelines
- If asked something not covered above, politely say you don't have that specific information and suggest contacting Zhile directly.
- Keep answers concise but informative.
- Do NOT make up information not in the profile above.
- Use "Zhile" or "她" to refer to her, not "I".`;

const CORS_HEADERS = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'POST, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type',
};

function jsonResponse(body, status = 200) {
  return new Response(JSON.stringify(body), {
    status,
    headers: { ...CORS_HEADERS, 'Content-Type': 'application/json' },
  });
}

// === Insights RAG helpers ===

const GITHUB_API_BASE = 'https://api.github.com/repos/Amb2rZhou/ai-frontier-insight/contents/data';
const GITHUB_RAW_BASE = 'https://raw.githubusercontent.com/Amb2rZhou/ai-frontier-insight/main/data';

async function cachedFetch(url, cacheName = 'insights-cache', ttlSeconds = 1800) {
  const cache = await caches.open(cacheName);
  const cacheKey = new Request(url);
  const cached = await cache.match(cacheKey);
  if (cached) {
    const age = Date.now() - new Date(cached.headers.get('x-cache-time')).getTime();
    if (age < ttlSeconds * 1000) return cached;
  }
  const res = await fetch(url, {
    headers: { 'User-Agent': 'CloudflareWorker/1.0' }
  });
  if (res.ok) {
    const body = await res.text();
    const cachedRes = new Response(body, {
      headers: {
        'Content-Type': res.headers.get('Content-Type') || 'text/plain',
        'x-cache-time': new Date().toISOString(),
      }
    });
    await cache.put(cacheKey, cachedRes.clone());
    return cachedRes;
  }
  return res;
}

function parseDateReferences(question) {
  const dates = [];
  const today = new Date();

  // Match YYYY-MM-DD
  const isoMatch = question.match(/\d{4}-\d{2}-\d{2}/g);
  if (isoMatch) dates.push(...isoMatch);

  // Match "March 25" or "3月25" style
  const monthDayEN = question.match(/(?:January|February|March|April|May|June|July|August|September|October|November|December)\s+(\d{1,2})/gi);
  if (monthDayEN) {
    const monthMap = { january: 0, february: 1, march: 2, april: 3, may: 4, june: 5, july: 6, august: 7, september: 8, october: 9, november: 10, december: 11 };
    monthDayEN.forEach(m => {
      const parts = m.match(/(\w+)\s+(\d+)/);
      if (parts) {
        const mo = monthMap[parts[1].toLowerCase()];
        const day = parseInt(parts[2]);
        const d = new Date(today.getFullYear(), mo, day);
        dates.push(d.toISOString().slice(0, 10));
      }
    });
  }

  const monthDayCN = question.match(/(\d{1,2})月(\d{1,2})[日号]?/g);
  if (monthDayCN) {
    monthDayCN.forEach(m => {
      const parts = m.match(/(\d+)月(\d+)/);
      if (parts) {
        const d = new Date(today.getFullYear(), parseInt(parts[1]) - 1, parseInt(parts[2]));
        dates.push(d.toISOString().slice(0, 10));
      }
    });
  }

  // Relative dates
  const lower = question.toLowerCase();
  const zhQuestion = question;
  if (lower.includes('yesterday') || zhQuestion.includes('昨天')) {
    const d = new Date(today); d.setDate(d.getDate() - 1);
    dates.push(d.toISOString().slice(0, 10));
  }
  if (lower.includes('today') || zhQuestion.includes('今天')) {
    dates.push(today.toISOString().slice(0, 10));
  }
  if (lower.includes('day before yesterday') || zhQuestion.includes('前天')) {
    const d = new Date(today); d.setDate(d.getDate() - 2);
    dates.push(d.toISOString().slice(0, 10));
  }

  return [...new Set(dates)];
}

function isWeeklyQuestion(question) {
  const lower = question.toLowerCase();
  return lower.includes('week') || lower.includes('trend') || lower.includes('周报') ||
    lower.includes('本周') || lower.includes('上周') || lower.includes('趋势') ||
    lower.includes('last week') || lower.includes('this week') ||
    lower.includes('weekly') || lower.includes('深度') || lower.includes('洞察');
}

function extractBriefContent(briefJson) {
  try {
    const brief = JSON.parse(briefJson);
    let content = '';

    if (brief.date) content += `Date: ${brief.date}\n`;

    if (brief.signals && Array.isArray(brief.signals)) {
      content += 'Signals:\n';
      brief.signals.forEach((s, i) => {
        content += `${i + 1}. ${s.signal || s.title || ''}`;
        if (s.insight) content += ` — Insight: ${s.insight}`;
        if (s.implication) content += ` | Implication: ${s.implication}`;
        content += '\n';
      });
    }

    if (brief.trends) {
      content += 'Trends:\n';
      if (Array.isArray(brief.trends)) {
        brief.trends.forEach(t => {
          content += `- ${typeof t === 'string' ? t : (t.description || t.trend || JSON.stringify(t))}\n`;
        });
      } else if (typeof brief.trends === 'string') {
        content += brief.trends + '\n';
      }
    }

    return content;
  } catch {
    return briefJson.slice(0, 500);
  }
}

async function fetchInsightsContext(question) {
  const referencedDates = parseDateReferences(question);
  const wantWeekly = isWeeklyQuestion(question);

  // Fetch daily and weekly listings in parallel
  let dailyDirs = [];
  let weeklyFiles = [];

  try {
    const [dailyRes, weeklyRes] = await Promise.all([
      cachedFetch(`${GITHUB_API_BASE}/daily?per_page=100`),
      cachedFetch(`${GITHUB_API_BASE}/weekly?per_page=100`),
    ]);

    if (dailyRes.ok) {
      const dailyData = JSON.parse(await dailyRes.text());
      dailyDirs = dailyData
        .filter(f => f.type === 'dir')
        .map(f => f.name)
        .sort()
        .reverse();
    }

    if (weeklyRes.ok) {
      const weeklyData = JSON.parse(await weeklyRes.text());
      weeklyFiles = weeklyData
        .filter(f => f.name.endsWith('.md'))
        .map(f => f.name)
        .sort()
        .reverse();
    }
  } catch (err) {
    console.error('GitHub listing error:', err);
  }

  // Determine which daily briefs to fetch
  const datesToFetch = new Set();

  // Always include most recent 7
  dailyDirs.slice(0, 7).forEach(d => datesToFetch.add(d));

  // Add specifically referenced dates
  referencedDates.forEach(d => {
    if (dailyDirs.includes(d)) datesToFetch.add(d);
  });

  // Determine which weekly reports to fetch
  const weeklyToFetch = [];
  if (weeklyFiles.length > 0) {
    weeklyToFetch.push(weeklyFiles[0]); // latest
    if (wantWeekly && weeklyFiles.length > 1) {
      weeklyToFetch.push(weeklyFiles[1]); // second latest for trend comparison
    }
  }

  // Fetch all content in parallel
  const fetchPromises = [];

  const dailyDatesArr = [...datesToFetch];
  dailyDatesArr.forEach(date => {
    fetchPromises.push(
      cachedFetch(`${GITHUB_RAW_BASE}/daily/${date}/brief.json`)
        .then(async r => r.ok ? { type: 'daily', date, content: await r.text() } : null)
        .catch(() => null)
    );
  });

  weeklyToFetch.forEach(filename => {
    fetchPromises.push(
      cachedFetch(`${GITHUB_RAW_BASE}/weekly/${filename}`)
        .then(async r => r.ok ? { type: 'weekly', filename, content: await r.text() } : null)
        .catch(() => null)
    );
  });

  const results = (await Promise.all(fetchPromises)).filter(Boolean);

  // Build context string, respecting ~6000 char limit
  let context = '';
  let charBudget = 6000;

  // If weekly-focused question, put weekly reports first
  const orderedResults = wantWeekly
    ? [...results.filter(r => r.type === 'weekly'), ...results.filter(r => r.type === 'daily')]
    : [...results.filter(r => r.type === 'daily'), ...results.filter(r => r.type === 'weekly')];

  for (const result of orderedResults) {
    let chunk = '';
    if (result.type === 'daily') {
      chunk = `\n--- Daily Brief: ${result.date} ---\n${extractBriefContent(result.content)}\n`;
    } else {
      // Truncate weekly reports more aggressively
      const weeklyContent = result.content.slice(0, wantWeekly ? 3000 : 1500);
      chunk = `\n--- Weekly Report: ${result.filename} ---\n${weeklyContent}\n`;
    }

    if (chunk.length > charBudget) {
      chunk = chunk.slice(0, charBudget);
    }
    context += chunk;
    charBudget -= chunk.length;
    if (charBudget <= 0) break;
  }

  return {
    context,
    availableDates: dailyDirs.slice(0, 30),
    availableWeekly: weeklyFiles.slice(0, 10),
  };
}

// === Personal chatbot handler ===
async function handlePersonalChat(request, env) {
  const { question } = await request.json();
  if (!question || typeof question !== 'string' || question.length > 1000) {
    return jsonResponse({ error: 'Invalid question' }, 400);
  }

  const response = await fetch('https://api.deepseek.com/chat/completions', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${env.DEEPSEEK_API_KEY}`,
    },
    body: JSON.stringify({
      model: 'deepseek-chat',
      messages: [
        { role: 'system', content: SYSTEM_PROMPT },
        { role: 'user', content: question },
      ],
      max_tokens: 500,
      temperature: 0.7,
    }),
  });

  if (!response.ok) {
    const errText = await response.text();
    console.error('DeepSeek API error:', errText);
    return jsonResponse({ error: 'AI service error' }, 502);
  }

  const data = await response.json();
  const answer = data.choices?.[0]?.message?.content || 'Sorry, I could not generate a response.';
  return jsonResponse({ answer });
}

// === Insights RAG handler ===
async function handleInsightsChat(request, env) {
  const { question } = await request.json();
  if (!question || typeof question !== 'string' || question.length > 1000) {
    return jsonResponse({ error: 'Invalid question' }, 400);
  }

  let insightsContext;
  try {
    insightsContext = await fetchInsightsContext(question);
  } catch (err) {
    console.error('Failed to fetch insights context:', err);
    return jsonResponse({ error: 'Failed to retrieve report data' }, 502);
  }

  const insightsSystemPrompt = `You are an AI assistant for the AI Frontier Insight system, a daily AI intelligence briefing service built by Zhile Zhou (周芷乐). You answer questions based on the actual reports produced by the system.

Below are the retrieved report contents. Use them to answer the user's question accurately.

${insightsContext.context}

---

Instructions:
- Cite specific dates and report names when answering (e.g., "According to the March 25 daily brief..." or "In the W13 weekly report...").
- If the user asks about dates or periods not covered in the retrieved data above, clearly say "I don't have data for that period" and mention what dates are available.
- Available daily brief dates: ${insightsContext.availableDates.slice(0, 10).join(', ')}
- Available weekly reports: ${insightsContext.availableWeekly.slice(0, 5).join(', ')}
- Answer in the same language the user asks in (Chinese or English).
- Be concise, informative, and factual. Do not make up information not present in the reports.`;

  const response = await fetch('https://api.deepseek.com/chat/completions', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${env.DEEPSEEK_API_KEY}`,
    },
    body: JSON.stringify({
      model: 'deepseek-chat',
      messages: [
        { role: 'system', content: insightsSystemPrompt },
        { role: 'user', content: question },
      ],
      max_tokens: 800,
      temperature: 0.7,
    }),
  });

  if (!response.ok) {
    const errText = await response.text();
    console.error('DeepSeek API error:', errText);
    return jsonResponse({ error: 'AI service error' }, 502);
  }

  const data = await response.json();
  const answer = data.choices?.[0]?.message?.content || 'Sorry, I could not generate a response.';
  return jsonResponse({ answer });
}

// === Main handler ===
export default {
  async fetch(request, env) {
    // Handle CORS preflight
    if (request.method === 'OPTIONS') {
      return new Response(null, { headers: CORS_HEADERS });
    }

    if (request.method !== 'POST') {
      return jsonResponse({ error: 'Method not allowed' }, 405);
    }

    const url = new URL(request.url);
    const path = url.pathname;

    try {
      // Route based on path
      if (path === '/insights') {
        return await handleInsightsChat(request, env);
      }
      // /chat or / (root) — personal chatbot (backward compatible)
      return await handlePersonalChat(request, env);
    } catch (err) {
      console.error('Worker error:', err);
      return jsonResponse({ error: 'Internal error' }, 500);
    }
  },
};
