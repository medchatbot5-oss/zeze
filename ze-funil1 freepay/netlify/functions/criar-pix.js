const BYNET_API_KEY = process.env.BYNET_API_KEY || 'cec7d462-1f91-4f37-ae33-9052e2bc90d9';
const BYNET_URL     = 'https://api-gateway.techbynet.com/api/user/transactions';

exports.handler = async (event) => {
  const headers = { 'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*' };

  if (event.httpMethod === 'OPTIONS') return { statusCode: 200, headers, body: '' };
  if (event.httpMethod !== 'POST')    return { statusCode: 405, headers, body: JSON.stringify({ error: 'Método não permitido' }) };

  let body;
  try { body = JSON.parse(event.body); }
  catch { return { statusCode: 400, headers, body: JSON.stringify({ error: 'Body inválido' }) }; }

  const { produto, valor, nome, cpf, tel, email, endereco } = body;

  if (!produto || !valor || !nome || !cpf || !tel) {
    return { statusCode: 400, headers, body: JSON.stringify({ error: 'Campos obrigatórios faltando.' }) };
  }

  const cpfLimpo      = String(cpf).replace(/\D/g, '');
  const telLimpo      = String(tel).replace(/\D/g, '');
  const valorCentavos = Math.round(parseFloat(valor) * 100);
  const en            = endereco || {};
  const externalRef   = 'ZE' + Date.now();

  const address = {
    street:       en.rua      || 'Rua não informada',
    streetNumber: en.numero   || 'S/N',
    complement:   en.compl    || '',
    zipCode:      String(en.cep || '04750000').replace(/\D/g, ''),
    neighborhood: en.bairro   || 'Centro',
    city:         en.cidade   || 'São Paulo',
    state:        en.estado   || 'SP',
    country:      'br'
  };

  const payload = {
    amount:        valorCentavos,
    paymentMethod: 'PIX',
    customer: {
      name:        nome,
      email:       email || `pedido${Date.now()}@gmail.com`,
      phone:       telLimpo,
      externalRef: externalRef,
      document: {
        type:   'CPF',
        number: cpfLimpo
      },
      address
    },
    shipping: {
      fee:     0,
      address
    },
    items: [{
      title:       produto,
      unitPrice:   valorCentavos,
      quantity:    1,
      tangible:    true,
      externalRef: 'item-01'
    }],
    pix: {
      expiresInDays: 1
    }
  };

  try {
    const response = await fetch(BYNET_URL, {
      method:  'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-api-key':    BYNET_API_KEY,
        'User-Agent':   'AtivoB2B/1.0'
      },
      body: JSON.stringify(payload)
    });

    const text = await response.text();
    let data;
    try { data = JSON.parse(text); }
    catch { data = { raw: text }; }

    return { statusCode: response.status, headers, body: JSON.stringify(data) };

  } catch (err) {
    return { statusCode: 500, headers, body: JSON.stringify({ error: err.message }) };
  }
};
