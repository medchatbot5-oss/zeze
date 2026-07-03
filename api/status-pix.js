const crypto = require('crypto');

const PARADISE_API_KEY  = process.env.PARADISE_API_KEY;
const PARADISE_BASE_URL = 'https://multi.paradisepags.com';

// ── Meta Conversions API (CAPI) ───────────────────────────────────────────────
// Dispara o evento Purchase server-side quando o PIX é confirmado, garantindo que
// TODA venda paga seja reportada — inclusive de quem paga no banco e não volta ao
// site. Deduplicado com o Purchase client-side do obrigado.html via event_id.
const META_PIXEL_ID   = process.env.META_PIXEL_ID   || '1510776000355013';
const META_CAPI_TOKEN = process.env.META_CAPI_TOKEN;
const META_API_VER    = 'v21.0';

const PAID_STATUSES = ['authorized', 'paid', 'approved', 'completed'];

function sha256(v) {
  return crypto.createHash('sha256').update(String(v).trim().toLowerCase()).digest('hex');
}

function onlyDigits(v) { return String(v || '').replace(/\D/g, ''); }

async function enviarPurchaseCapi(txObj, meta) {
  if (!META_PIXEL_ID || !META_CAPI_TOKEN) return;

  const c = (txObj.customer_data && txObj.customer_data.customer) || {};
  const valor = parseFloat(
    txObj.amount_in_reais != null ? String(txObj.amount_in_reais).replace(',', '.')
      : (txObj.amount != null ? txObj.amount / 100 : 0)
  ) || 0;

  const user_data = {};
  if (c.email) user_data.em = [sha256(c.email)];
  if (c.phone) {
    let ph = onlyDigits(c.phone);
    if (ph && !ph.startsWith('55')) ph = '55' + ph;
    if (ph) user_data.ph = [sha256(ph)];
  }
  if (c.name) {
    const parts = String(c.name).trim().toLowerCase().split(/\s+/);
    if (parts[0])         user_data.fn = [sha256(parts[0])];
    if (parts.length > 1) user_data.ln = [sha256(parts[parts.length - 1])];
  }
  if (c.document) user_data.external_id = [sha256(onlyDigits(c.document))];
  if (meta.ip) user_data.client_ip_address = meta.ip;
  if (meta.ua) user_data.client_user_agent = meta.ua;
  if (meta.fbp) user_data.fbp = meta.fbp;
  // fbc: usa o cookie _fbc se veio; senão reconstrói a partir do fbclid
  if (meta.fbc) user_data.fbc = meta.fbc;
  else if (meta.fbclid) user_data.fbc = 'fb.1.' + Date.now() + '.' + meta.fbclid;

  const event = {
    event_name:    'Purchase',
    event_time:    Math.floor(Date.now() / 1000),
    event_id:      'purchase_' + (meta.txId || ''),   // dedup com o pixel client-side
    action_source: 'website',
    user_data:     user_data,
    custom_data:   { currency: 'BRL', value: valor }
  };
  if (meta.url) event.event_source_url = meta.url;

  const url = `https://graph.facebook.com/${META_API_VER}/${META_PIXEL_ID}/events?access_token=${encodeURIComponent(META_CAPI_TOKEN)}`;
  const resp = await fetch(url, {
    method:  'POST',
    headers: { 'Content-Type': 'application/json' },
    body:    JSON.stringify({ data: [event] })
  });
  const txt = await resp.text();
  if (!resp.ok) console.error('[CAPI] erro:', txt);
  else          console.log('[CAPI] Purchase enviado:', meta.txId, 'R$', valor);
}

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

    // Normaliza: Paradise pode retornar { status:"success", data:{ status:"paid" } }
    // Garante que o status da transação esteja sempre no raiz para o frontend ler
    const txObj    = data.data || data;
    const txStatus = (txObj && txObj.status) || data.status || '';
    const normalized = Object.assign({}, data, { status: txStatus });

    // Pagamento confirmado → dispara Purchase via CAPI (dedup com o pixel client-side)
    if (PAID_STATUSES.indexOf(String(txStatus).toLowerCase()) !== -1) {
      try {
        const ip = (req.headers['x-forwarded-for'] || '').split(',')[0].trim();
        await enviarPurchaseCapi(txObj, {
          txId:   id,
          ip:     ip,
          ua:     req.headers['user-agent'] || '',
          url:    req.headers['referer'] || '',
          fbp:    req.query.fbp    || '',
          fbc:    req.query.fbc    || '',
          fbclid: req.query.fbclid || ''
        });
      } catch (e) { console.error('[CAPI] exceção:', e.message); }
    }

    return res.status(response.status).json(normalized);

  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
};
