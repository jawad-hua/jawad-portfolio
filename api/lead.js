// Vercel Serverless Function: /api/lead  (contact form inside the chat)
const { geo, geoText, notify } = require('./_notify.js');

const ALLOWED_ORIGINS = [
  'https://muhammadjawad-ai.vercel.app',
  'http://localhost:3000'
];
const hits = new Map(); // simple per-IP rate limit (best effort)

const str = (v, max) => String(v == null ? '' : v).trim().slice(0, max);

module.exports = async (req, res) => {
  const origin = req.headers.origin || '';
  res.setHeader('Access-Control-Allow-Origin', ALLOWED_ORIGINS.includes(origin) ? origin : ALLOWED_ORIGINS[0]);
  res.setHeader('Vary', 'Origin');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') return res.status(204).end();
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' });

  const ip = String(req.headers['x-forwarded-for'] || '').split(',')[0].trim() || 'unknown';
  const now = Date.now();
  const recent = (hits.get(ip) || []).filter((t) => now - t < 3600000);
  if (recent.length >= 5) return res.status(429).json({ error: 'Too many requests' });
  recent.push(now);
  hits.set(ip, recent);

  let body = req.body;
  if (typeof body === 'string') { try { body = JSON.parse(body); } catch (e) { body = {}; } }
  body = body || {};

  if (body.website) return res.status(200).json({ ok: true }); // honeypot: bots fill this hidden field

  const name = str(body.name, 80);
  const email = str(body.email, 120);
  const whatsapp = str(body.whatsapp, 40);
  const message = str(body.message, 1500);
  if (!name || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    return res.status(400).json({ error: 'Name and a valid email are required' });
  }

  const chat = (Array.isArray(body.transcript) ? body.transcript : [])
    .slice(-6)
    .filter((m) => m && typeof m.content === 'string')
    .map((m) => (m.role === 'user' ? 'Visitor: ' : 'Assistant: ') + str(m.content, 300))
    .join('\n');

  const text =
    'Name: ' + name + '\n' +
    'Email: ' + email + '\n' +
    'WhatsApp/Phone: ' + (whatsapp || '-') + '\n' +
    'Location: ' + geoText(geo(req)) + '\n' +
    'Time (UTC): ' + new Date().toISOString() + '\n\n' +
    'Message:\n' + (message || '-') + '\n\n' +
    'Recent chat:\n' + (chat || '-');

  console.log('LEAD', JSON.stringify({ name, email, whatsapp, message }));
  const ok = await notify('New lead from portfolio: ' + name, text);
  if (!ok) return res.status(502).json({ error: 'Could not send notification' });
  return res.status(200).json({ ok: true });
};
