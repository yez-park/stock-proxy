export default async function handler(req, res) {
  const code = req.query.code || "005930";

  try {
    const response = await fetch(`https://finance.naver.com/item/main.naver?code=${code}`);
    const html = await response.text();

    const priceMatch = html.match(/<em class="no_up.*?">.*?<span class="blind">([\d,]+)<\/span>/);
    const changeMatch = html.match(/<span class="blind">([\d,]+)<\/span><\/span>\s*<span class="bu_p">/);

    const price = priceMatch ? priceMatch[1] : null;
    const change = changeMatch ? changeMatch[1] : null;

    // ✅ CORS 허용 헤더 추가
    res.setHeader("Access-Control-Allow-Origin", "*");
    res.status(200).json({ currentPrice: price, change });
  } catch (error) {
    res.setHeader("Access-Control-Allow-Origin", "*");
    res.status(500).json({ error: "데이터 수집 실패" });
  }
}
