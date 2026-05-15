const PARADISE_API_KEY  = process.env.PARADISE_API_KEY;
const PARADISE_BASE_URL = 'https://multi.paradisepags.com';

module.exports = async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Content-Type', 'application/json');

  /* ID vem como query param via rewrite no vercel.json:
     /api/status-pix/:id  →  /api/status-pix?id=:id       */
  const id = req.query.id
    || (req.url || '').split('/').filter(Boolean).pop().split('?')[0];

  if (!id) {
    return res.status(400).json({ error: 'ID não fornecido' });
  }

  try {
    const url = `${PARADISE_BASE_URL}/api/v1/query.php?action=get_transaction&id=${encodeURIComponent(id)}`;

    const response = await fetch(url, {
      method:  'GET',
      headers: { 'X-API-Key': PARADISE_API_KEY }
    });

    const text = await response.text();
    let data;
    try { data = JSON.parse(text); } catch { data = { raw: text }; }

    return res.status(response.status).json(data);

  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
};
