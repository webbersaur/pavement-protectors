// Vercel serverless function — handles the Contact form and sends email via Resend.
// Env vars (set in Vercel project settings):
//   RESEND_API_KEY     - Resend API key (secret)
//   CONTACT_TO_EMAIL   - where leads are delivered (e.g. owner@pavement-protectors.com)
//   CONTACT_FROM_EMAIL - verified sender on webbersaurus.com
//                        (e.g. "Pavement Protectors <noreply@webbersaurus.com>")

module.exports = async (req, res) => {
  if (req.method !== 'POST') {
    res.setHeader('Allow', 'POST');
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const apiKey = process.env.RESEND_API_KEY;
  const to = process.env.CONTACT_TO_EMAIL;
  const from = process.env.CONTACT_FROM_EMAIL || 'Pavement Protectors <noreply@webbersaurus.com>';
  if (!apiKey || !to) {
    console.error('Contact form not configured: missing RESEND_API_KEY or CONTACT_TO_EMAIL');
    return res.status(500).json({ error: 'Form is not configured. Please call us at (203) 903-3273.' });
  }

  // Vercel parses JSON bodies automatically; guard for string bodies too.
  let body = req.body;
  if (typeof body === 'string') {
    try { body = JSON.parse(body); } catch (_) { body = {}; }
  }
  body = body || {};

  const name = (body.name || '').toString().trim();
  const email = (body.email || '').toString().trim();
  const phone = (body.phone || '').toString().trim();
  const address = (body.address || '').toString().trim();
  const service = (body.service || '').toString().trim();
  const message = (body.message || '').toString().trim();
  const honeypot = (body.company || '').toString().trim(); // spam trap (hidden field)
  const isFeedback = (body.type || '').toString().trim() === 'private-feedback';

  // Silently accept and drop bot submissions.
  if (honeypot) return res.status(200).json({ ok: true });

  if (isFeedback) {
    // Private feedback (Not Happy path): name + message required, email optional.
    if (!name || !message) {
      return res.status(400).json({ error: 'Please add your name and a short message.' });
    }
  } else {
    if (!name || !email || !phone || !message) {
      return res.status(400).json({ error: 'Please fill in your name, email, phone, and message.' });
    }
  }
  if (email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    return res.status(400).json({ error: 'Please enter a valid email address.' });
  }

  const esc = (s) => String(s).replace(/[&<>"]/g, (c) => (
    { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]
  ));

  const heading = isFeedback
    ? 'Private feedback (not happy) — Pavement Protectors'
    : 'New quote request — Pavement Protectors';
  const messageLabel = isFeedback ? 'What happened' : 'Message';

  const fields = isFeedback
    ? [['Name', name], ['Email', email || '—']]
    : [['Name', name], ['Email', email], ['Phone', phone], ['Property Address', address || '—'], ['Service Needed', service || '—']];

  const rows = fields
    .map(([k, v]) => `<tr><td style="padding:4px 12px 4px 0;font-weight:bold;vertical-align:top">${k}</td><td style="padding:4px 0">${esc(v)}</td></tr>`)
    .join('');

  const html = `
    <h2 style="margin:0 0 12px">${heading}</h2>
    <table style="border-collapse:collapse;font-family:Arial,sans-serif;font-size:14px">${rows}</table>
    <p style="font-family:Arial,sans-serif;font-size:14px;margin:16px 0 4px"><strong>${messageLabel}</strong></p>
    <p style="font-family:Arial,sans-serif;font-size:14px;white-space:pre-wrap;margin:0">${esc(message)}</p>
  `;

  const text = `${heading}

${fields.map(([k, v]) => `${k}: ${v}`).join('\n')}

${messageLabel}:
${message}`;

  try {
    const r = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${apiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        from,
        to: [to],
        ...(email ? { reply_to: `${name} <${email}>` } : {}),
        subject: isFeedback
          ? `Private feedback (not happy) — ${name}`
          : `New quote request from ${name}${service ? ' — ' + service : ''}`,
        html,
        text,
      }),
    });

    if (!r.ok) {
      const detail = await r.text();
      console.error('Resend error', r.status, detail);
      return res.status(502).json({ error: 'We could not send your message. Please call us at (203) 903-3273.' });
    }

    return res.status(200).json({ ok: true });
  } catch (err) {
    console.error('Contact handler error', err);
    return res.status(500).json({ error: 'Something went wrong. Please call us at (203) 903-3273.' });
  }
};
