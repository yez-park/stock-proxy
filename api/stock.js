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

    // 모든 blind 값을 찾기
    const matches = [...html.matchAll(/<span class="[^"]*?blind[^"]*?">([\d,.\-%↑↓+]+)<\/span>/g)];

    // 순서에 따라 값을 가져옴
    const priceStr = matches[0]?.[1] || null; // 현재가
    const diffAmountStr = matches[1]?.[1] || null; // 전일 대비 금액
    const diffRateStr = matches[2]?.[1] || null; // 전일 대비 퍼센트

    if (!priceStr || !diffAmountStr || !diffRateStr) {
      return res.status(404).json({ error: "stock info not found in HTML" });
    }

    res.status(200).json({
      code,
      price: priceStr,
      diffAmount: diffAmountStr,
      diffRate: diffRateStr
    });
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch or parse", details: err.message });
  }
}
