#!/usr/bin/env python
"""
Simple HTTP Server for Web Interface
Serves index.html on port 8000 to avoid CORS issues
"""

import http.server
import socketserver
import os
import webbrowser
import time
from threading import Timer

PORT = 8080

class MyHTTPRequestHandler(http.server.SimpleHTTPRequestHandler):
    def end_headers(self):
        # Add CORS headers
        self.send_header('Access-Control-Allow-Origin', '*')
        self.send_header('Access-Control-Allow-Methods', 'GET, POST, OPTIONS')
        self.send_header('Access-Control-Allow-Headers', 'Content-Type')
        super().end_headers()
    
    def log_message(self, format, *args):
        # Suppress log messages for cleaner output
        pass

def open_browser():
    """Open browser after a short delay"""
    time.sleep(1)
    webbrowser.open(f'http://localhost:{PORT}')

if __name__ == '__main__':
    # Change to script directory
    os.chdir(os.path.dirname(os.path.abspath(__file__)))
    
    print("=" * 70)
    print("🌐 Starting Web Server for Bakong KHQR")
    print("=" * 70)
    print(f"\n📍 Server running at: http://localhost:{PORT}")
    print(f"📄 Serving: index.html")
    print("\n⚠️  Make sure API is running on port 5000:")
    print("   python api.py")
    print("\n🌐 Opening browser...")
    print("\nPress Ctrl+C to stop the server")
    print("=" * 70)
    print()
    
    # Open browser in background
    Timer(1.5, open_browser).start()
    
    # Start server
    with socketserver.TCPServer(("", PORT), MyHTTPRequestHandler) as httpd:
        try:
            httpd.serve_forever()
        except KeyboardInterrupt:
            print("\n\n⏹  Server stopped")
            print("=" * 70)
