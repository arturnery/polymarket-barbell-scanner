export default async function handler(req, res) {
  // Busca mercados que expiram em breve (ordenado por endDate ascendente)
  // Filtra apenas os que expiram nas próximas 48h e têm liquidez mínima
  const now = new Date();
  const in48h = new Date(now.getTime() + 48 * 60 * 60 * 1000).toISOString();

  const url = `https://gamma-api.polymarket.com/markets?closed=false&active=true&limit=500&order=endDate&ascending=true&endDateMax=${encodeURIComponent(in48h)}`;

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
