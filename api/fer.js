export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const base64 = req.body.image_base64;
  if (!base64) return res.status(400).json({ error: 'Missing image_base64' });

  try {
    const response = await fetch('https://api-us.faceplusplus.com/facepp/v3/detect', {
      method: 'POST',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      body: new URLSearchParams({
        api_key: 'aucWDnPrW5RKzSioOqf9zZzSqGeS1nKk',
        api_secret: 'ZhEI7ViTO7ZPfQYYctEBKuFaFbRdnt1S',
        image_base64: base64,
        return_attributes: 'emotion',
      }),
    });

    const result = await response.json();
    res.status(200).json(result);
  } catch (err) {
    console.error('FER proxy error:', err.stack || err.message);
    res.status(500).json({ error: 'FER proxy failed', details: err.message });
  }
}