export default async function handler(req, res) {
  const url = "https://gamma-api.polymarket.com/markets?closed=false&active=true&limit=500&order=volume&ascending=false";

  try {
    const response = await fetch(url, {
      headers: { "User-Agent": "Mozilla/5.0", "Accept": "application/json" }
    });
    const data = await response.json();

    const now = new Date();

    // Filtra apenas mercados com endDate no futuro, ordena por quem expira primeiro
    const filtered = data
      .filter(m => m.active === true && m.closed === false && m.endDate && new Date(m.endDate) > now)
      .sort((a, b) => new Date(a.endDate) - new Date(b.endDate));

    res.setHeader("Access-Control-Allow-Origin", "*");
    res.status(200).json(filtered);
  } catch (e) {
    res.setHeader("Access-Control-Allow-Origin", "*");
    res.status(502).json({ error: e.message });
  }
}
