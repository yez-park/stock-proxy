// api/stock.js
export default async function handler(req, res) {
  const { code } = req.query;

  if (!code) {
    return res.status(400).json({ error: 'code query parameter is required' });
  }

  try {
    const response = await fetch(`https://finance.naver.com/item/main.nhn?code=${code}`);
    const html = await response.text();

    const match = html.match(/<span class="[^"]*?blind[^"]*?">([\d,]+)<\/span>/);
    const price = match ? match[1] : null;

    if (!price) {
      return res.status(404).json({ error: 'Price not found' });
    }

    res.status(200).json({
      code,
      price,
    });
  } catch (err) {
    res.status(500).json({ error: 'Server error', details: err.message });
  }
}
