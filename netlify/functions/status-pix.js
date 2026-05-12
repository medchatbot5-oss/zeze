const BYNET_API_KEY = process.env.BYNET_API_KEY || 'cec7d462-1f91-4f37-ae33-9052e2bc90d9';

exports.handler = async (event) => {
  const headers = { 'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*' };

  const id = (event.queryStringParameters && event.queryStringParameters.id)
    || event.path.split('/').filter(Boolean).pop();

  if (!id) return { statusCode: 400, headers, body: JSON.stringify({ error: 'ID não fornecido' }) };

  try {
    const response = await fetch(`https://api-gateway.techbynet.com/api/user/transactions/${id}`, {
      method:  'GET',
      headers: {
        'x-api-key':  BYNET_API_KEY,
        'User-Agent': 'AtivoB2B/1.0'
      }
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
