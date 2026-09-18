const endpoint = import.meta.env.VITE_AI_BACKEND_URL || '';

export async function askMasterObrixAI(messages) {
  if (!endpoint) return null;

  try {
    const response = await fetch(endpoint, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ messages })
    });

    if (!response.ok) return null;
    const data = await response.json();
    return typeof data.content === 'string' && data.content.trim() ? data.content.trim() : null;
  } catch {
    return null;
  }
}
