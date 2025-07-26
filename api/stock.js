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
    const response = await fetch(`https://finance.naver.com/item/main.nhn?code=${code}`);
    const html = await response.text();

    // HTML에서 현재가 추출
    // 주가 정보는 <span class="blind">XXXXX</span> 형태로 포함돼 있음
    const match = html.match(/<span class="[^"]*?blind[^"]*?">([\d,]+)<\/span>/);
    const priceStr = match ? match[1] : null;

    if (!priceStr) {
      return res.status(404).json({ error: "price not found in HTML" });
    }

    res.status(200).json({
      code,
      price: priceStr
    });
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch or parse", details: err.message });
  }
}
