// Vercel Serverless Function — GitHub API proxy for China accessibility

export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  if (req.method === 'OPTIONS') return res.status(200).end();
  if (req.method !== 'GET') return res.status(405).json({ error: 'Method not allowed' });

  const { path } = req.query;
  if (!path) return res.status(400).json({ error: 'Missing path parameter' });

  // Only allow requests to the ai-frontier-insight repo
  const allowed = path.startsWith('repos/Amb2rZhou/ai-frontier-insight/');
  if (!allowed) return res.status(403).json({ error: 'Forbidden' });

  try {
    // Forward additional query params (e.g., per_page)
    const queryEntries = Object.entries(req.query).filter(([k]) => k !== 'path');
    const queryString = queryEntries.length > 0 ? '?' + queryEntries.map(([k, v]) => `${k}=${v}`).join('&') : '';
    const url = `https://api.github.com/${path}${queryString}`;
    const headers = { 'User-Agent': 'VercelProxy/1.0' };
    if (process.env.GITHUB_TOKEN) {
      headers['Authorization'] = `token ${process.env.GITHUB_TOKEN}`;
    }

    const response = await fetch(url, { headers });
    const data = await response.text();

    res.setHeader('Content-Type', response.headers.get('Content-Type') || 'application/json');
    res.setHeader('Cache-Control', 'public, max-age=300'); // 5 min cache
    return res.status(response.status).send(data);
  } catch (err) {
    console.error('GitHub proxy error:', err);
    return res.status(502).json({ error: 'Failed to fetch from GitHub' });
  }
}
