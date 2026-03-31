// Vercel Serverless Function — DeepSeek API proxy for AI Frontier Insight RAG chatbot
// Converted from Cloudflare Worker

const GITHUB_API_BASE = 'https://api.github.com/repos/Amb2rZhou/ai-frontier-insight/contents/data';
const GITHUB_RAW_BASE = 'https://raw.githubusercontent.com/Amb2rZhou/ai-frontier-insight/main/data';

// Simple in-memory cache (persists within a warm function invocation)
const memoryCache = new Map();

async function cachedFetch(url, ttlSeconds = 1800) {
  const now = Date.now();
  const cached = memoryCache.get(url);
  if (cached && (now - cached.time) < ttlSeconds * 1000) {
    return new Response(cached.body, {
      status: 200,
      headers: { 'Content-Type': cached.contentType || 'text/plain' },
    });
  }

  const res = await fetch(url, {
    headers: { 'User-Agent': 'VercelServerless/1.0' },
  });

  if (res.ok) {
    const body = await res.text();
    memoryCache.set(url, {
      body,
      contentType: res.headers.get('Content-Type') || 'text/plain',
      time: now,
    });
    return new Response(body, {
      status: 200,
      headers: { 'Content-Type': res.headers.get('Content-Type') || 'text/plain' },
    });
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

export default async function handler(req, res) {
  // CORS
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  if (req.method === 'OPTIONS') return res.status(200).end();
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' });

  try {
    const { question } = req.body;
    if (!question || typeof question !== 'string' || question.length > 1000) {
      return res.status(400).json({ error: 'Invalid question' });
    }

    let insightsContext;
    try {
      insightsContext = await fetchInsightsContext(question);
    } catch (err) {
      console.error('Failed to fetch insights context:', err);
      return res.status(502).json({ error: 'Failed to retrieve report data' });
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
        'Authorization': `Bearer ${process.env.DEEPSEEK_API_KEY}`,
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
