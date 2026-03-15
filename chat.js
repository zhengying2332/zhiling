// api/chat.js
// 从 Vercel 环境变量读取 system prompt，转发到用户自己的 API

const PROMPT_MAP = {
  p1: 'PROMPT_P1',
  p2: 'PROMPT_P2',
  p3: 'PROMPT_P3',
  p4: 'PROMPT_P4',
  // ➕ 新增时在这里加一行，如 p5: 'PROMPT_P5'
};

export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  if (req.method === 'OPTIONS') return res.status(200).end();
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' });

  const { promptId, history, baseUrl, apiKey, model } = req.body;
  if (!promptId || !apiKey || !baseUrl || !model) {
    return res.status(400).json({ error: '缺少必要参数' });
  }

  const envKey = PROMPT_MAP[promptId];
  const systemPrompt = envKey ? process.env[envKey] : null;
  if (!systemPrompt) {
    return res.status(400).json({ error: '指令未配置，请在 Vercel 环境变量中添加 ' + envKey });
  }

  try {
    const upstream = await fetch(baseUrl.replace(/\/$/, '') + '/chat/completions', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', 'Authorization': 'Bearer ' + apiKey },
      body: JSON.stringify({ model, messages: [{ role: 'system', content: systemPrompt }, ...(history || [])], stream: false })
    });
    const data = await upstream.json();
    if (data.error) return res.status(200).json({ error: data.error.message });
    return res.status(200).json({ reply: data.choices?.[0]?.message?.content || '（无回复）' });
  } catch (e) {
    return res.status(500).json({ error: '转发失败：' + e.message });
  }
}
