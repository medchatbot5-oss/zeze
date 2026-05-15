const PARADISE_API_KEY = process.env.PARADISE_API_KEY;
const PARADISE_BASE_URL = 'https://multi.paradisepags.com';

/* ── productHash do produto cadastrado no painel Paradise ── */
const PRODUCT_HASH = process.env.PARADISE_PRODUCT_HASH || 'prod_070b3fe70888f682';

exports.handler = async (event) => {
  const headers = { 'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*' };

  if (event.httpMethod === 'OPTIONS') return { statusCode: 200, headers, body: '' };
  if (event.httpMethod !== 'POST')    return { statusCode: 405, headers, body: JSON.stringify({ error: 'Método não permitido' }) };

  let body;
  try { body = JSON.parse(event.body); }
  catch { return { statusCode: 400, headers, body: JSON.stringify({ error: 'Body inválido' }) }; }

  const { produto, valor, nome, cpf, tel, email } = body;

  if (!produto || !valor) {
    return { statusCode: 400, headers, body: JSON.stringify({ error: 'Campos obrigatórios faltando.' }) };
  }

  const cpfLimpo      = String(cpf || '').replace(/\D/g, '') || gerarCpfAleatorio();
  const telLimpo      = String(tel || '').replace(/\D/g, '') || gerarTelAleatorio();
  const nomeCliente   = nome || gerarNomeAleatorio();
  const emailCliente  = email || `cliente_${Date.now()}_${Math.random().toString(36).substring(2,8)}@mail.com`;
  const valorCentavos = Math.round(parseFloat(valor) * 100);

  /* Referência única por transação */
  const reference = `REF-${Date.now()}-${Math.random().toString(36).substring(2, 8)}`;

  /* Captura tracking enviado pelo frontend no body */
  const trackingKeys = ['utm_source', 'utm_medium', 'utm_campaign', 'utm_content', 'utm_term', 'src', 'sck'];
  const tracking = {};
  trackingKeys.forEach(k => { if (body[k]) tracking[k] = body[k]; });

  const payload = {
    amount:      valorCentavos,
    description: produto,
    reference:   reference,
    productHash: PRODUCT_HASH,
    customer: {
      name:     nomeCliente,
      email:    emailCliente,
      phone:    telLimpo,
      document: cpfLimpo
    }
  };

  if (Object.keys(tracking).length > 0) payload.tracking = tracking;

  try {
    const response = await fetch(`${PARADISE_BASE_URL}/api/v1/transaction.php`, {
      method:  'POST',
      headers: {
        'X-API-Key':    PARADISE_API_KEY,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(payload)
    });

    const text = await response.text();
    let data;
    try { data = JSON.parse(text); } catch { data = { raw: text }; }

    if (!response.ok || data.status !== 'success') {
      return { statusCode: response.status || 500, headers, body: JSON.stringify(data) };
    }

    /* Normaliza resposta para o formato que o frontend espera:
       carrinho.html lê: d.pix.qr_code  e  d.id              */
    const normalized = {
      pix: {
        qr_code: data.qr_code || ''
      },
      id: String(data.transaction_id || ''),
      _paradise: data   /* mantém campos originais para debug */
    };

    return { statusCode: 200, headers, body: JSON.stringify(normalized) };

  } catch (err) {
    return { statusCode: 500, headers, body: JSON.stringify({ error: err.message }) };
  }
};

/* ── Helpers para dados aleatórios ── */
function gerarNomeAleatorio() {
  const nomes      = ['Ana','Carlos','Maria','Pedro','Julia','Lucas','Fernanda','Rafael','Camila','Bruno'];
  const sobrenomes = ['Silva','Santos','Oliveira','Souza','Lima','Pereira','Costa','Ferreira','Almeida','Ribeiro'];
  return nomes[Math.floor(Math.random()*nomes.length)] + ' ' + sobrenomes[Math.floor(Math.random()*sobrenomes.length)];
}

function gerarCpfAleatorio() {
  const n = Array.from({ length: 9 }, () => Math.floor(Math.random() * 10));
  const d1 = ((n.reduce((s, v, i) => s + v * (10 - i), 0) * 10) % 11);
  n.push(d1 >= 10 ? 0 : d1);
  const d2 = ((n.reduce((s, v, i) => s + v * (11 - i), 0) * 10) % 11);
  n.push(d2 >= 10 ? 0 : d2);
  return n.join('');
}

function gerarTelAleatorio() {
  const ddds = ['11','21','31','41','51','61','71','81','85','27'];
  const ddd  = ddds[Math.floor(Math.random()*ddds.length)];
  return ddd + '9' + Array.from({ length: 8 }, () => Math.floor(Math.random()*10)).join('');
}
