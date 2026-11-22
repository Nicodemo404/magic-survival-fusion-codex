import http.server
import socketserver
import threading
import urllib.request
import time
import os

PORT = 8765
DIRECTORY = r"X:\Ai\Antigravity\Magic Survival\Code"

class Handler(http.server.SimpleHTTPRequestHandler):
    def __init__(self, *args, **kwargs):
        super().__init__(*args, directory=DIRECTORY, **kwargs)

server = socketserver.TCPServer(("127.0.0.1", PORT), Handler)
t = threading.Thread(target=server.serve_forever)
t.daemon = True
t.start()
print(f"Local server started on port {PORT}")
time.sleep(0.5)

urls = [
    "http://127.0.0.1:8765/index.html",
    "http://127.0.0.1:8765/manifest.json",
    "http://127.0.0.1:8765/sw.js",
    "http://127.0.0.1:8765/data/combinations_v09941.json",
    "http://127.0.0.1:8765/assets/icon-192.png",
    "http://127.0.0.1:8765/assets/icon-512.png",
    "http://127.0.0.1:8765/assets/icon-maskable-512.png",
    "http://127.0.0.1:8765/assets/og-banner.png",
    "http://127.0.0.1:8765/assets/thumbs/telekinetic_sword.webp",
    "http://127.0.0.1:8765/assets/cards/telekinetic_sword.webp",
    "http://127.0.0.1:8765/assets/thumbs/blaster.webp",
    "http://127.0.0.1:8765/assets/cards/blaster.webp"
]

all_ok = True
for u in urls:
    try:
        req = urllib.request.Request(u)
        with urllib.request.urlopen(req) as resp:
            path_part = u.replace("http://127.0.0.1:8765/", "")
            body = resp.read()
            print(f"HTTP {resp.status} - {path_part} ({len(body)} bytes)")
    except Exception as e:
        print(f"FAILED {u}: {e}")
        all_ok = False

server.shutdown()
assert all_ok, "Some HTTP requests failed!"
print("\nAll HTTP server requests returned 200 OK cleanly!")
