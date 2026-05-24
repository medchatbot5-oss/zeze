const PARADISE_API_KEY  = process.env.PARADISE_API_KEY;
const PARADISE_BASE_URL = 'https://multi.paradisepags.com';

const CORS_HEADERS = {
  'Access-Control-Allow-Origin': '*',
  'Content-Type': 'application/json'
};

exports.handler = async (event) => {
  if (event.httpMethod === 'OPTIONS') {
    return { statusCode: 200, headers: CORS_HEADERS, body: '' };
  }

  const pathParts = (event.path || '').split('/');
  const idFromPath = pathParts[pathParts.length - 1];
  const id = (event.queryStringParameters || {}).id || idFromPath;

  if (!id) {
    return { statusCode: 400, headers: CORS_HEADERS, body: JSON.stringify({ error: 'ID não fornecido' }) };
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

    return { statusCode: response.status, headers: CORS_HEADERS, body: JSON.stringify(data) };

  } catch (err) {
    return { statusCode: 500, headers: CORS_HEADERS, body: JSON.stringify({ error: err.message }) };
  }
};
