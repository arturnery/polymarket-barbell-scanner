import urllib.request
import json

def handler(request):
    url = "https://gamma-api.polymarket.com/markets?closed=false&limit=100&order=volume&ascending=false"
    try:
        req = urllib.request.Request(url, headers={"User-Agent": "Mozilla/5.0", "Accept": "application/json"})
        with urllib.request.urlopen(req, timeout=10) as resp:
            data = resp.read()
        return Response(data, headers={"Content-Type": "application/json", "Access-Control-Allow-Origin": "*"})
    except Exception as e:
        return Response(json.dumps({"error": str(e)}), status=502, headers={"Content-Type": "application/json", "Access-Control-Allow-Origin": "*"})
