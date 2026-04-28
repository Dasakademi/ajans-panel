export default async function handler(req, res) {
  const TOKEN = process.env.META_ACCESS_TOKEN;
  let ACCOUNT = process.env.META_AD_ACCOUNT_ID;
  const VERSION = 'v19.0';
  const BASE = `https://graph.facebook.com/${VERSION}`;

  if (!TOKEN || !ACCOUNT) return res.status(500).json({ error: 'Token eksik' });
  if (!ACCOUNT.startsWith('act_')) ACCOUNT = 'act_' + ACCOUNT;

  const { tip = 'ozet', days = 7 } = req.query;
  const since = new Date(Date.now() - days * 86400000).toISOString().split('T')[0];
  const until = new Date().toISOString().split('T')[0];

  try {
    if (tip === 'ozet') {
      const p = new URLSearchParams({ fields: 'impressions,clicks,spend,ctr,cpc', time_range: JSON.stringify({since,until}), access_token: TOKEN });
      const r = await fetch(`${BASE}/${ACCOUNT}/insights?${p}`);
      const d = await r.json();
      if (d.error) return res.status(400).json({ error: d.error.message });
      return res.json(d.data?.[0] || {});
    }

    if (tip === 'kampanyalar') {
      const p = new URLSearchParams({ fields: 'id,name,status,objective', limit: 20, access_token: TOKEN });
      const r = await fetch(`${BASE}/${ACCOUNT}/campaigns?${p}`);
      const d = await r.json();
      if (d.error) return res.status(400).json({ error: d.error.message });

      const sonuclar = await Promise.all((d.data||[]).map(async k => {
        try {
          const ip = new URLSearchParams({ fields: 'impressions,clicks,spend,ctr,cpc', time_range: JSON.stringify({since,until}), access_token: TOKEN });
          const ir = await fetch(`${BASE}/${k.id}/insights?${ip}`);
          const id = await ir.json();
          return { ...k, insights: id.data?.[0] || null };
        } catch { return { ...k, insights: null }; }
      }));
      return res.json(sonuclar);
    }

    return res.status(400).json({ error: 'Geçersiz tip' });
  } catch(e) { return res.status(500).json({ error: e.message }); }
}
