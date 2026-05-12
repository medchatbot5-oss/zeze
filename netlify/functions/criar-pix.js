const PUBLIC_KEY = process.env.ENKI_PUBLIC_KEY || 'pk_zu4GGDmXN2xYTDghhxSZ926mzwl3wWPMDoYiC9U14EA';
const SECRET_KEY = process.env.ENKI_SECRET_KEY || 'sk_leaIrR6j-tHy4WcozizYIGM1V_rthbAGW_5uLGfVE1c';
const ENKI_AUTH  = 'Basic ' + Buffer.from(`${PUBLIC_KEY}:${SECRET_KEY}`).toString('base64');

exports.handler = async (event) => {
  const headers = { 'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*' };

  if (event.httpMethod === 'OPTIONS') return { statusCode: 200, headers, body: '' };
  if (event.httpMethod !== 'POST')    return { statusCode: 405, headers, body: JSON.stringify({ error: 'Método não permitido' }) };

  let body;
  try { body = JSON.parse(event.body); }
  catch { return { statusCode: 400, headers, body: JSON.stringify({ error: 'Body inválido' }) }; }

  const { produto, valor, nome, cpf, tel, email } = body;

  if (!produto || !valor || !nome || !cpf || !tel) {
    return { statusCode: 400, headers, body: JSON.stringify({ error: 'Campos obrigatórios faltando.' }) };
  }

  const cpfLimpo      = String(cpf).replace(/\D/g, '');
  const telLimpo      = String(tel).replace(/\D/g, '');
  const valorCentavos = Math.round(parseFloat(valor) * 100);

  /* Monta string UTM opcional */
  const utmKeys  = ['utm_source','utm_medium','utm_campaign','utm_content','utm_term'];
  const utmParts = utmKeys.filter(k => body[k]).map(k => `${k}=${encodeURIComponent(body[k])}`);
  const utmStr   = utmParts.length ? '?' + utmParts.join('&') : undefined;

  const payload = {
    amount:         valorCentavos,
    payment_method: 'PIX',
    postback_url:   process.env.POSTBACK_URL || 'https://ze-onlinedelivery.netlify.app/webhook/enki',
    items: [{
      title:        produto,
      unit_price:   valorCentavos,
      quantity:     1,
      tangible:     false,
      external_ref: 'PROD-001'
    }],
    customer: {
      name:  nome,
      email: email || ('pedido' + Date.now() + '@gmail.com'),
      phone: telLimpo,
      document: {
        number: cpfLimpo,
        type:   'CPF'
      }
    }
  };

  if (utmStr) payload.utm = utmStr;

  try {
    const response = await fetch('https://api.enki-bank.com/v1/transactions', {
      method:  'POST',
      headers: { 'Content-Type': 'application/json', 'Authorization': ENKI_AUTH },
      body:    JSON.stringify(payload)
    });

    const text = await response.text();
    let data;
    try { data = JSON.parse(text); } catch { data = { raw: text }; }

    /* Normaliza: copy_paste → qr_code para compatibilidade com o frontend */
    if (data && data.pix && data.pix.copy_paste) {
      data.pix.qr_code = data.pix.copy_paste;
    }

    return { statusCode: response.status, headers, body: JSON.stringify(data) };

  } catch (err) {
    return { statusCode: 500, headers, body: JSON.stringify({ error: err.message }) };
  }
};
