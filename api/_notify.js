// Shared helpers: visitor location (from Vercel headers) + notifications to Jawad.
// Notifications go to Telegram and/or email (Resend). Set whichever you want in Vercel env vars:
//   TELEGRAM_BOT_TOKEN, TELEGRAM_CHAT_ID        (free, instant on phone)
//   RESEND_API_KEY, NOTIFY_EMAIL                (NOTIFY_EMAIL = your Resend account email)

function geo(req) {
  const h = req.headers || {};
  const dec = (v) => { try { return decodeURIComponent(v || ''); } catch (e) { return v || ''; } };
  return {
    country: h['x-vercel-ip-country'] || '',
    region: dec(h['x-vercel-ip-country-region']),
    city: dec(h['x-vercel-ip-city'])
  };
}

function geoText(g) {
  return [g.city, g.region, g.country].filter(Boolean).join(', ') || 'Unknown';
}

async function notify(subject, text) {
  const jobs = [];
  const body = String(subject + '\n\n' + text).slice(0, 3800);

  if (process.env.TELEGRAM_BOT_TOKEN && process.env.TELEGRAM_CHAT_ID) {
    jobs.push(fetch('https://api.telegram.org/bot' + process.env.TELEGRAM_BOT_TOKEN + '/sendMessage', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        chat_id: process.env.TELEGRAM_CHAT_ID,
        text: body,
        disable_web_page_preview: true
      })
    }));
  }

  if (process.env.RESEND_API_KEY && process.env.NOTIFY_EMAIL) {
    jobs.push(fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: 'Bearer ' + process.env.RESEND_API_KEY
      },
      body: JSON.stringify({
        from: process.env.MAIL_FROM || 'Portfolio Chat <onboarding@resend.dev>',
        to: [process.env.NOTIFY_EMAIL],
        subject: subject,
        text: text
      })
    }));
  }

  if (!jobs.length) return false;
  const results = await Promise.allSettled(jobs);
  const ok = results.some((r) => r.status === 'fulfilled' && r.value && r.value.ok);
  if (!ok) console.error('notify failed', JSON.stringify(results.map((r) => r.status === 'fulfilled' ? r.value.status : String(r.reason))));
  return ok;
}

module.exports = { geo, geoText, notify };
