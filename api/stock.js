export default async function handler(req, res) {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "GET");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type");

  const code = req.query.code || "005930";

  try {
    const response = await fetch(`https://api.finance.naver.com/siseJson.naver?symbol=${code}&requestType=1&startTime=20240701&endTime=20250726&timeframe=day`, {
      headers: {
        Referer: "https://finance.naver.com"
      }
    });

    const text = await response.text();
    const json = JSON.parse(text.replace(/^\s*\/\/.*\n/, ''));
    const latest = json[json.length - 1];

    res.status(200).json({ code, price: latest[1].toString() });

  } catch (error) {
    res.status(500).json({ error: "Error fetching stock data", details: error.message });
  }
}
