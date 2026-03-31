// Vercel Serverless Function — DeepSeek API proxy for AI Frontier Insight RAG chatbot
// Vector-based RAG via Silicon Flow embeddings + Supabase vector search

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

async function searchDocuments(embedding) {
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
      match_count: 8,
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

  // Group by source type
  const groups = {};
  for (const doc of documents) {
    const source = doc.source || 'unknown';
    if (!groups[source]) groups[source] = [];
    groups[source].push(doc);
  }

  let context = '';
  for (const [source, docs] of Object.entries(groups)) {
    context += `\n=== Source: ${source} ===\n`;
    for (const doc of docs) {
      const label = doc.filename || doc.id;
      const sim = doc.similarity ? ` (similarity: ${doc.similarity.toFixed(3)})` : '';
      context += `\n--- ${label}${sim} ---\n${doc.content}\n`;
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

  try {
    const { question } = req.body;
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

    // Step 2: Search for relevant documents
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
1. Daily briefs — automated daily AI news digests with signals, insights, and implications
2. Weekly reports — in-depth weekly trend analysis and strategic insights
3. Zhile's original research — her personal analysis and perspectives on AI topics

Below are the most relevant retrieved chunks from the knowledge base:

${context}

---

Instructions:
- Answer based on the retrieved content above. Do not fabricate information not present in the chunks.
- When citing information, mention the source — dates for daily briefs (e.g., "According to the March 25 daily brief..."), report names for weekly reports (e.g., "In the W13 weekly report..."), or document titles for research reports.
- If the retrieved chunks do not contain enough information to answer the question, clearly say so.
- Answer in the same language the user asks in (Chinese or English).
- Be concise, informative, and factual.`;

    const response = await fetch('https://api.deepseek.com/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${process.env.DEEPSEEK_API_KEY}`,
      },
      body: JSON.stringify({
        model: 'deepseek-chat',
        messages: [
          { role: 'system', content: systemPrompt },
          { role: 'user', content: question },
        ],
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
