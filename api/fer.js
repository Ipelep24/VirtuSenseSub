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
        api_key: 'AC9X2gGAk5cBF5NUAJI1LuM2oCL7tnda',
        api_secret: 'yTKrE2ftkweHivzzPzmwpz5ZCHtOMu4d',
        image_base64: base64,
        return_attributes: 'emotion',
      }),
    });

    const result = await response.json();
    res.status(200).json(result);
    console.log(result)
  } catch (err) {
    console.error('FER proxy error:', err.stack || err.message);
    res.status(500).json({ error: 'FER proxy failed', details: err.message });
  }
}