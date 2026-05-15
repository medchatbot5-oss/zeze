const PARADISE_API_KEY = process.env.PARADISE_API_KEY;
const PARADISE_BASE_URL = 'https://multi.paradisepags.com';

exports.handler = async (event) => {
  const headers = { 'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*' };

  /* Pega o ID: último segmento do path ou query string */
  const id = (event.queryStringParameters && event.queryStringParameters.id)
    || event.path.split('/').filter(Boolean).pop();

  if (!id) {
    return { statusCode: 400, headers, body: JSON.stringify({ error: 'ID não fornecido' }) };
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

    /* Paradise retorna { status: 'approved' | 'pending' | 'failed' | 'refunded' }
       O frontend já checa 'approved' nativamente — retorna direto.           */
    return { statusCode: response.status, headers, body: JSON.stringify(data) };

  } catch (err) {
    return { statusCode: 500, headers, body: JSON.stringify({ error: err.message }) };
  }
};
