const PUBLIC_KEY = process.env.ENKI_PUBLIC_KEY || 'pk_zu4GGDmXN2xYTDghhxSZ926mzwl3wWPMDoYiC9U14EA';
const SECRET_KEY = process.env.ENKI_SECRET_KEY || 'sk_leaIrR6j-tHy4WcozizYIGM1V_rthbAGW_5uLGfVE1c';
const ENKI_AUTH  = 'Basic ' + Buffer.from(`${PUBLIC_KEY}:${SECRET_KEY}`).toString('base64');

exports.handler = async (event) => {
  const headers = { 'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*' };

  /* Pega o ID: último segmento do path ou query string */
  const id = (event.queryStringParameters && event.queryStringParameters.id)
    || event.path.split('/').filter(Boolean).pop();

  if (!id) {
    return { statusCode: 400, headers, body: JSON.stringify({ error: 'ID não fornecido' }) };
  }

  try {
    const response = await fetch(`https://api.enki-bank.com/v1/transactions/${encodeURIComponent(id)}`, {
      method:  'GET',
      headers: { 'Authorization': ENKI_AUTH }
    });

    const text = await response.text();
    let data;
    try { data = JSON.parse(text); } catch { data = { raw: text }; }

    return { statusCode: response.status, headers, body: JSON.stringify(data) };

  } catch (err) {
    return { statusCode: 500, headers, body: JSON.stringify({ error: err.message }) };
  }
};
