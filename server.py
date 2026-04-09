#!/usr/bin/env python3
"""Proxy local para Polymarket — resolve CORS ao abrir o scanner no browser."""

from http.server import HTTPServer, SimpleHTTPRequestHandler
import urllib.request
import json
import os

PORT = int(os.environ.get("PORT", 8765))
POLYMARKET_URL = "https://gamma-api.polymarket.com/markets?closed=false&limit=100&order=volume&ascending=false"

class Handler(SimpleHTTPRequestHandler):
    def do_GET(self):
        if self.path == "/markets":
            self._proxy_polymarket()
        else:
            super().do_GET()

    def _proxy_polymarket(self):
        try:
            req = urllib.request.Request(
                POLYMARKET_URL,
                headers={"User-Agent": "Mozilla/5.0", "Accept": "application/json"}
            )
            with urllib.request.urlopen(req, timeout=10) as resp:
                data = resp.read()
            self.send_response(200)
            self.send_header("Content-Type", "application/json")
            self.send_header("Access-Control-Allow-Origin", "*")
            self.end_headers()
            self.wfile.write(data)
        except Exception as e:
            self.send_response(502)
            self.send_header("Content-Type", "application/json")
            self.send_header("Access-Control-Allow-Origin", "*")
            self.end_headers()
            self.wfile.write(json.dumps({"error": str(e)}).encode())

    def log_message(self, fmt, *args):
        print(f"  {args[0]} {args[1]}")

if __name__ == "__main__":
    os.chdir(os.path.dirname(os.path.abspath(__file__)))
    print(f"Servidor rodando na porta {PORT}")
    HTTPServer(("", PORT), Handler).serve_forever()
