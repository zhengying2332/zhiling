// api/prompts.js
// 只返回指令的公开信息（名称、图标、描述），不含 prompt 内容

const PROMPTS = [
  { id: 'p1', icon: '✍️', name: '文案助手',  desc: '写出吸引人的文案、标题和广告语' },
  { id: 'p2', icon: '🌍', name: '翻译专家',  desc: '中英文互译，表达地道自然' },
  { id: 'p3', icon: '💻', name: '代码助手',  desc: '写代码、查 Bug、解释逻辑' },
  { id: 'p4', icon: '📊', name: '数据分析',  desc: '解读数据、提炼洞察、生成报告' },
  // ➕ 新增指令：在这里加一行，同时在 Vercel 环境变量里加对应的 PROMPT_P5
];

export default function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.status(200).json(PROMPTS);
}
