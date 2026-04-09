export default async function handler(req, res) {
  const url = "https://gamma-api.polymarket.com/markets?closed=false&limit=100&order=volume&ascending=false";
  try {
    const response = await fetch(url, {
      headers: { "User-Agent": "Mozilla/5.0", "Accept": "application/json" }
    });
    const data = await response.json();
    res.setHeader("Access-Control-Allow-Origin", "*");
    res.status(200).json(data);
  } catch (e) {
    res.setHeader("Access-Control-Allow-Origin", "*");
    res.status(502).json({ error: e.message });
  }
}
