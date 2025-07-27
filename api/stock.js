export default async function handler(req, res) {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "GET, OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type");

  if (req.method === "OPTIONS") {
    return res.status(200).end();
  }

  const code = req.query.code;
  if (!code) {
    return res.status(400).json({ error: "code query parameter is required" });
  }

  try {
    const response = await fetch(`https://finance.naver.com/item/main.nhn?code=${code}`, {
      headers: {
        "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64)",
      },
    });
    const html = await response.text();

    // blind span 중 첫 번째 값만 가져오기 (현재가)
    const match = html.match(/<span class="[^"]*?blind[^"]*?">([\d,]+)<\/span>/);
    const priceStr = match ? match[1] : null;

    if (!priceStr) {
      return res.status(404).json({ error: "price not found in HTML" });
    }

    res.status(200).json({
      code,
      price: priceStr,
    });
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch or parse", details: err.message });
  }
}
