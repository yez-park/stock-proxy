export default async function handler(req, res) {
  const response = await fetch("https://api.stock.naver.com/stockDOM?code=005930"); // 네이버 주식 예시
  const data = await response.json();
  res.status(200).json(data);
}
