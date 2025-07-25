export default async function handler(req, res) {
  const { code } = req.query;

  if (!code) {
    return res.status(400).json({ error: "종목 코드를 입력하세요 (예: 005930)" });
  }

  const url = `https://finance.naver.com/item/main.nhn?code=${code}`;
  const response = await fetch(url);
  const html = await response.text();

  const match = html.match(/<strong class="tah p11">([^<]+)<\/strong>/);
  const price = match ? match[1].replace(/,/g, '') : null;

  if (price) {
    res.status(200).json({ code, price });
  } else {
    res.status(500).json({ error: "주가를 찾을 수 없음" });
  }
}
