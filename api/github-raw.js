// Vercel Serverless Function — GitHub raw content proxy for China accessibility

export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  if (req.method === 'OPTIONS') return res.status(200).end();
  if (req.method !== 'GET') return res.status(405).json({ error: 'Method not allowed' });

  const { path } = req.query;
  if (!path) return res.status(400).json({ error: 'Missing path parameter' });

  // Only allow requests to the ai-frontier-insight repo
  const allowed = path.startsWith('Amb2rZhou/ai-frontier-insight/');
  if (!allowed) return res.status(403).json({ error: 'Forbidden' });

  try {
    const url = `https://raw.githubusercontent.com/${path}`;
    const response = await fetch(url, {
      headers: { 'User-Agent': 'VercelProxy/1.0' },
    });
    const data = await response.text();

    res.setHeader('Content-Type', response.headers.get('Content-Type') || 'text/plain');
    res.setHeader('Cache-Control', 'public, max-age=300');
    return res.status(response.status).send(data);
  } catch (err) {
    console.error('GitHub raw proxy error:', err);
    return res.status(502).json({ error: 'Failed to fetch from GitHub' });
  }
}
