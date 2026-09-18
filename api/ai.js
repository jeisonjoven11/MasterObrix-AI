export default async function handler(req, res) {
  if (req.method !== 'POST') {
    res.status(405).json({ error: 'Method not allowed' });
    return;
  }

  try {
    const body = typeof req.body === 'string' ? JSON.parse(req.body) : req.body || {};
    const messages = Array.isArray(body.messages) ? body.messages : [];
    if (!messages.length) {
      res.status(400).json({ error: 'messages are required' });
      return;
    }

    const apiKey = process.env.OPENROUTER_API_KEY;
    if (!apiKey) {
      res.status(503).json({ error: 'AI service is not configured' });
      return;
    }

    const response = await fetch('https://openrouter.ai/api/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${apiKey}`,
        'Content-Type': 'application/json',
        'HTTP-Referer': process.env.APP_ORIGIN || 'https://masterobrix-ai.vercel.app',
        'X-Title': 'MasterObrix-AI'
      },
      body: JSON.stringify({
        model: 'openrouter/free',
        messages,
        temperature: 0.2,
        max_tokens: 700
      })
    });

    const data = await response.json();
    if (!response.ok) {
      res.status(response.status).json({ error: data?.error?.message || 'AI provider error' });
      return;
    }

    const content = data?.choices?.[0]?.message?.content;
    if (!content) {
      res.status(502).json({ error: 'AI provider returned no content' });
      return;
    }

    res.status(200).json({ content });
  } catch {
    res.status(500).json({ error: 'AI backend error' });
  }
}
