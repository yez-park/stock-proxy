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

    // 종목명
    const nameMatch = html.match(/<div class="wrap_company">\s*<h2><a[^>]*>(.*?)<\/a><\/h2>/);
    const name = nameMatch ? nameMatch[1].trim() : null;

    // 주가 정보
    const matches = [...html.matchAll(/<span class="[^"]*?blind[^"]*?">([\d,.\-%↑↓+]+)<\/span>/g)];

    const priceStr = matches[0]?.[1] || null;
    const diffAmountStr = matches[1]?.[1] || null;
    const diffRateStr = matches[2]?.[1] || null;

    if (!priceStr || !diffAmountStr || !diffRateStr || !name) {
      return res.status(404).json({ error: "stock info not found in HTML" });
    }

    res.status(200).json({
      code,
      name,
      price: priceStr,
      diffAmount: diffAmountStr,
      diffRate: diffRateStr,
    });
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch or parse", details: err.message });
  }
}
