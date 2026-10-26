const { createHmac, timingSafeEqual, randomUUID } = require('node:crypto');
const attempts = new Map();
const MAX_BYTES = 8192;
function signature(value) { return createHmac('sha256', process.env.RESEND_API_KEY).update(value).digest('hex'); }
function validToken(token) {
  if (typeof token !== 'string' || token.length > 200) return false;
  const [time, id, mac] = token.split('.');
  if (!/^\d+$/.test(time) || !/^[a-f0-9-]{36}$/.test(id || '') || !/^[a-f0-9]{64}$/.test(mac || '')) return false;
  const age = Date.now() - Number(time);
  return age >= 3000 && age < 30 * 60 * 1000 && timingSafeEqual(Buffer.from(mac), Buffer.from(signature(`${time}.${id}`)));
}
module.exports = async function handler(req, res) {
  res.setHeader('Cache-Control', 'no-store');
  res.setHeader('X-Content-Type-Options', 'nosniff');
  const reply = (code, error) => res.status(code).json({ error });
  if (!['GET', 'POST'].includes(req.method)) { res.setHeader('Allow', 'GET, POST'); return reply(405, 'Method not allowed.'); }
  if (!process.env.RESEND_API_KEY) return reply(503, 'Registration is temporarily unavailable.');
  if (req.method === 'GET') {
    const value = `${Date.now()}.${randomUUID()}`;
    return res.status(200).json({ token: `${value}.${signature(value)}` });
  }
  // Browsers may submit only from the same deployed website. No CORS access is granted.
  let origin;
  try { origin = new URL(req.headers.origin); } catch { return reply(403, 'Request not allowed.'); }
  if (origin.host !== req.headers.host || (process.env.VERCEL && origin.protocol !== 'https:')) return reply(403, 'Request not allowed.');
  if (!(req.headers['content-type'] || '').startsWith('application/json')) return reply(415, 'JSON required.');
  if (Number(req.headers['content-length']) > MAX_BYTES) return reply(413, 'Request too large.');
  const now = Date.now();
  for (const [key, value] of attempts) if (value.until < now) attempts.delete(key);
  const ip = String(req.headers['x-vercel-forwarded-for'] || req.socket?.remoteAddress || 'unknown').split(',')[0];
  const bucket = attempts.get(ip) || { count: 0, until: now + 15 * 60 * 1000 };
  if (bucket.count >= 5 || attempts.size >= 10000) { res.setHeader('Retry-After', '900'); return reply(429, 'Too many attempts. Please try again later.'); }
  bucket.count++; attempts.set(ip, bucket);
  let body;
  try {
    if (req.body !== undefined) body = typeof req.body === 'string' ? JSON.parse(req.body) : req.body;
    else {
      let size = 0; const chunks = [];
      for await (const chunk of req) { size += chunk.length; if (size > MAX_BYTES) return reply(413, 'Request too large.'); chunks.push(chunk); }
      body = JSON.parse(Buffer.concat(chunks).toString('utf8'));
    }
    if (Buffer.byteLength(JSON.stringify(body)) > MAX_BYTES) return reply(413, 'Request too large.');
  } catch { return reply(400, 'Invalid request.'); }
  if (!body || typeof body !== 'object' || Array.isArray(body)) return reply(400, 'Invalid request.');
  if (body.website) return reply(400, 'Invalid request.');
  if (!validToken(body.token)) return reply(400, 'Please refresh the page and try again.');
  const text = (key, max, required = false) => typeof body[key] === 'string' && body[key].trim().length <= max && (!required || body[key].trim().length > 0) && !/[\x00-\x08\x0b\x0c\x0e-\x1f\x7f]/.test(body[key]);
  if (!text('name', 100, true) || !text('email', 254, true) || !text('town', 100, true) || !text('difficulty', 2000) || !text('age', 30) || body.consent !== true || !/^[^\s@<>]+@[^\s@<>]+\.[^\s@<>]+$/.test(body.email) || /[\r\n]/.test(body.email) || !['', 'Under 5', '5–8', '9–12', '13–17', '18 or over'].includes(body.age)) return reply(400, 'Please check your details and consent.');
  try {
    const response = await fetch('https://api.resend.com/emails', {
      method: 'POST', signal: AbortSignal.timeout(10000),
      headers: { Authorization: `Bearer ${process.env.RESEND_API_KEY}`, 'Content-Type': 'application/json', 'Idempotency-Key': `families-${body.token.split('.')[1]}` },
      body: JSON.stringify({ from: process.env.RESEND_FROM || 'airCeption Families <families@airception.com>', to: ['families@airception.com'], reply_to: body.email.trim(), subject: 'Overnight family pilot — registration of interest', text: `Name: ${body.name.trim()}\nEmail: ${body.email.trim()}\nTown / district: ${body.town.trim()}\nAge range: ${body.age || 'Not provided'}\n\nOvernight difficulty:\n${body.difficulty.trim() || 'Not provided'}\n\nConsent to contact and privacy notice: confirmed\nReceived: ${new Date().toISOString()}` })
    });
    if (!response.ok) return reply(502, 'We could not send your registration. Please try again later.');
    return res.status(200).json({ ok: true });
  } catch { return reply(502, 'We could not send your registration. Please try again later.'); }
};
