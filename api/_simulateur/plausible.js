// =============================================================================
// Helper Plausible — events sans PII
// =============================================================================
// Cohérent avec le pattern existant des api/submit-*.js.

export async function trackPlausibleEvent(req, eventName, props = {}) {
  const domain = 'lagencesauvage.com';
  const pageUrl = req.headers?.referer || `https://www.${domain}/simulateur-opco/`;
  const userAgent = req.headers?.['user-agent'] || 'Mozilla/5.0';
  const ip = req.headers?.['x-forwarded-for']?.split(',')[0]?.trim()
    || req.headers?.['x-real-ip']
    || req.socket?.remoteAddress
    || '127.0.0.1';

  const res = await fetch('https://plausible.io/api/event', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', 'User-Agent': userAgent, 'X-Forwarded-For': ip },
    body: JSON.stringify({ name: eventName, url: pageUrl, domain, props }),
  });
  if (!res.ok) throw new Error(`Plausible HTTP ${res.status}`);
}
