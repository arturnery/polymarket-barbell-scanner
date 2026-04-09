export default async function handler(req, res) {
  const url = "https://gamma-api.polymarket.com/markets?closed=false&active=true&limit=500&order=endDate&ascending=true";

  try {
    const response = await fetch(url, {
      headers: { "User-Agent": "Mozilla/5.0", "Accept": "application/json" }
    });
    const data = await response.json();

    const now = new Date();
    const in48h = new Date(now.getTime() + 48 * 60 * 60 * 1000);

    // Filtra: apenas mercados que expiram entre agora e 48h, e que estão ativos
    const filtered = data.filter(m => {
      if (!m.endDate) return false;
      const end = new Date(m.endDate);
      return end > now && end <= in48h && m.active === true && m.closed === false;
    });

    res.setHeader("Access-Control-Allow-Origin", "*");
    res.status(200).json(filtered);
  } catch (e) {
    res.setHeader("Access-Control-Allow-Origin", "*");
    res.status(502).json({ error: e.message });
  }
}
