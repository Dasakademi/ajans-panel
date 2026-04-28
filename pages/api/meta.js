// pages/api/meta.js - Meta Ads API route

export default async function handler(req, res) {
  const TOKEN = process.env.META_ACCESS_TOKEN;
  const ACCOUNT = process.env.META_AD_ACCOUNT_ID; // act_XXXXXXXXX
  const VERSION = 'v19.0';
  const BASE = `https://graph.facebook.com/${VERSION}`;

  if (!TOKEN || !ACCOUNT) {
    return res.status(500).json({ error: 'META_ACCESS_TOKEN veya META_AD_ACCOUNT_ID eksik' });
  }

  const { tip = 'ozet', days = 7 } = req.query;
  const since = new Date(Date.now() - days * 86400000).toISOString().split('T')[0];
  const until = new Date().toISOString().split('T')[0];
  const timeRange = `{"since":"${since}","until":"${until}"}`;

  try {
    if (tip === 'ozet') {
      const url = `${BASE}/${ACCOUNT}/insights?fields=impressions,clicks,spend,reach,ctr,cpc&time_range=${encodeURIComponent(timeRange)}&access_token=${TOKEN}`;
      const r = await fetch(url);
      const d = await r.json();
      if (d.error) return res.status(400).json({ error: d.error.message });
      return res.json(d.data?.[0] || {});
    }

    if (tip === 'kampanyalar') {
      const url = `${BASE}/${ACCOUNT}/campaigns?fields=name,status,objective,daily_budget,insights{impressions,clicks,spend,ctr,cpc}&time_range=${encodeURIComponent(timeRange)}&access_token=${TOKEN}`;
      const r = await fetch(url);
      const d = await r.json();
      if (d.error) return res.status(400).json({ error: d.error.message });
      return res.json(d.data || []);
    }

    return res.status(400).json({ error: 'Geçersiz tip' });
  } catch (e) {
    return res.status(500).json({ error: e.message });
  }
}
