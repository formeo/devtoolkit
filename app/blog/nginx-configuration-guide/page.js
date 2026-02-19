export const metadata = {
  title: 'Nginx Config Guide — Reverse Proxy, SSL, Gzip, LB',
  description: 'Practical Nginx config guide: reverse proxy for Node.js/Python/Go, SSL with Let\'s Encrypt, gzip, security headers, load balancing.',
  alternates: { canonical: '/blog/nginx-configuration-guide/' },
  keywords: ['nginx configuration guide', 'nginx reverse proxy', 'nginx ssl letsencrypt', 'nginx gzip config', 'nginx load balancer setup', 'nginx security headers', 'nginx php-fpm', 'nginx websocket proxy'],
};
import Link from 'next/link';

export default function NginxGuide() {
  return (
    <div className="max-w-2xl mx-auto">
      <div className="mb-6">
        <Link href="/blog/" className="text-xs text-dark-500 hover:text-dark-300 no-underline">&larr; Blog</Link>
      </div>
      <h1 className="text-2xl font-bold text-dark-50 mb-2">Nginx Configuration Guide for Developers</h1>
      <p className="text-sm text-dark-500 mb-8">Reverse proxy, SSL, gzip, security headers, load balancing — practical examples</p>

      <article className="text-sm text-dark-300 leading-relaxed space-y-4">
        <p>Nginx is the most popular web server and reverse proxy, powering over 30% of all websites. This guide covers the most common configurations with production-ready examples you can copy and adapt.</p>

        <p>Want to skip the manual work? Use our <Link href="/nginx-config/" className="text-brand-400 hover:underline">free Nginx Config Generator</Link> to build a complete config visually.</p>

        <h2 className="text-lg font-bold text-dark-100 mt-8 mb-3">1. Nginx as a Reverse Proxy</h2>
        <p>The most common setup: Nginx sits in front of your Node.js, Python, Go, or Java application, handling SSL, static files, and load balancing while proxying dynamic requests to the backend.</p>

        <div className="bg-dark-800 rounded-lg p-4 border border-dark-700 font-mono text-xs my-3 overflow-x-auto">
          <pre className="whitespace-pre">{`server {
    listen 443 ssl http2;
    server_name example.com;

    ssl_certificate /etc/letsencrypt/live/example.com/fullchain.pem;
    ssl_certificate_key /etc/letsencrypt/live/example.com/privkey.pem;

    location / {
        proxy_pass http://127.0.0.1:3000;
        proxy_http_version 1.1;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
    }
}`}</pre>
        </div>

        <p>Key headers to always include: <code className="bg-dark-800 px-1.5 py-0.5 rounded text-dark-200">X-Real-IP</code> passes the client&apos;s actual IP to the backend (otherwise it sees 127.0.0.1). <code className="bg-dark-800 px-1.5 py-0.5 rounded text-dark-200">X-Forwarded-Proto</code> lets the backend know the original request was HTTPS — critical for correct redirect URLs and cookie settings.</p>

        <h3 className="text-base font-semibold text-dark-200 mt-6 mb-2">WebSocket Proxying</h3>
        <p>For WebSocket connections (Socket.IO, ws), you need additional headers:</p>
        <div className="bg-dark-800 rounded-lg p-4 border border-dark-700 font-mono text-xs my-3 overflow-x-auto">
          <pre className="whitespace-pre">{`proxy_set_header Upgrade $http_upgrade;
proxy_set_header Connection "upgrade";
proxy_read_timeout 86400;`}</pre>
        </div>
        <p>Without these, WebSocket connections fail with 400 errors. The <code className="bg-dark-800 px-1.5 py-0.5 rounded text-dark-200">proxy_read_timeout</code> prevents Nginx from closing idle WebSocket connections after the default 60 seconds.</p>

        <h2 className="text-lg font-bold text-dark-100 mt-8 mb-3">2. SSL/TLS with Let&apos;s Encrypt</h2>
        <p>The fastest way to get HTTPS working:</p>
        <div className="bg-dark-800 rounded-lg p-4 border border-dark-700 font-mono text-xs my-3 overflow-x-auto">
          <pre className="whitespace-pre">{`# Install certbot
sudo apt install certbot python3-certbot-nginx

# Get certificate (automatically configures Nginx)
sudo certbot --nginx -d example.com -d www.example.com

# Auto-renewal is set up automatically
# Test it:
sudo certbot renew --dry-run`}</pre>
        </div>

        <p>For optimal SSL configuration, use only TLSv1.2 and TLSv1.3 (older versions have known vulnerabilities), enable OCSP stapling for faster certificate validation, and configure session caching to reduce TLS handshake overhead:</p>
        <div className="bg-dark-800 rounded-lg p-4 border border-dark-700 font-mono text-xs my-3 overflow-x-auto">
          <pre className="whitespace-pre">{`ssl_protocols TLSv1.2 TLSv1.3;
ssl_prefer_server_ciphers off;
ssl_session_cache shared:SSL:10m;
ssl_session_timeout 1d;
ssl_session_tickets off;
ssl_stapling on;
ssl_stapling_verify on;`}</pre>
        </div>

        <h2 className="text-lg font-bold text-dark-100 mt-8 mb-3">3. Gzip Compression</h2>
        <p>Gzip typically reduces text-based responses by 60-80%. Essential config:</p>
        <div className="bg-dark-800 rounded-lg p-4 border border-dark-700 font-mono text-xs my-3 overflow-x-auto">
          <pre className="whitespace-pre">{`gzip on;
gzip_vary on;
gzip_proxied any;
gzip_comp_level 5;
gzip_min_length 256;
gzip_types
    text/plain
    text/css
    text/javascript
    application/json
    application/javascript
    application/xml
    image/svg+xml;`}</pre>
        </div>
        <p><strong className="text-dark-100">comp_level 5</strong> is the sweet spot — level 1-4 barely compress, level 7-9 use significantly more CPU for minimal extra compression. <strong className="text-dark-100">min_length 256</strong> skips tiny responses where gzip overhead exceeds savings. Never compress already-compressed formats (JPEG, PNG, WOFF2, ZIP).</p>

        <h2 className="text-lg font-bold text-dark-100 mt-8 mb-3">4. Security Headers</h2>
        <p>Five headers that cost nothing but protect against common attacks:</p>
        <div className="bg-dark-800 rounded-lg p-4 border border-dark-700 font-mono text-xs my-3 overflow-x-auto">
          <pre className="whitespace-pre">{`# Prevent clickjacking
add_header X-Frame-Options "SAMEORIGIN" always;

# Prevent MIME-type sniffing
add_header X-Content-Type-Options "nosniff" always;

# Force HTTPS for 2 years (enable after confirming HTTPS works)
add_header Strict-Transport-Security "max-age=63072000; includeSubDomains; preload" always;

# Control referrer information
add_header Referrer-Policy "strict-origin-when-cross-origin" always;

# Restrict browser features
add_header Permissions-Policy "camera=(), microphone=(), geolocation=()" always;`}</pre>
        </div>

        <h2 className="text-lg font-bold text-dark-100 mt-8 mb-3">5. Load Balancing</h2>
        <p>Distribute traffic across multiple backend servers:</p>
        <div className="bg-dark-800 rounded-lg p-4 border border-dark-700 font-mono text-xs my-3 overflow-x-auto">
          <pre className="whitespace-pre">{`upstream backend {
    least_conn;  # or: ip_hash for sticky sessions
    server 10.0.0.1:8080 weight=3;
    server 10.0.0.2:8080 weight=1;
    server 10.0.0.3:8080 backup;
}

server {
    location / {
        proxy_pass http://backend;
        proxy_next_upstream error timeout http_502 http_503;
    }
}`}</pre>
        </div>
        <p>Three methods: <strong className="text-dark-100">Round Robin</strong> (default) distributes equally. <strong className="text-dark-100">Least Connections</strong> sends traffic to the least busy server — better when request times vary. <strong className="text-dark-100">IP Hash</strong> ensures the same client always hits the same backend — useful for apps that store sessions in memory.</p>

        <h2 className="text-lg font-bold text-dark-100 mt-8 mb-3">6. Static File Caching</h2>
        <div className="bg-dark-800 rounded-lg p-4 border border-dark-700 font-mono text-xs my-3 overflow-x-auto">
          <pre className="whitespace-pre">{`location ~* \\.(jpg|jpeg|png|gif|ico|svg|webp|woff2|css|js)$ {
    expires 30d;
    add_header Cache-Control "public, immutable";
    access_log off;
}`}</pre>
        </div>
        <p>This tells browsers to cache static assets for 30 days. <code className="bg-dark-800 px-1.5 py-0.5 rounded text-dark-200">immutable</code> means the browser won&apos;t even send a conditional request to check if the file changed — it trusts the cache completely. Disable access logs for static files to reduce I/O.</p>

        <h2 className="text-lg font-bold text-dark-100 mt-8 mb-3">7. Rate Limiting</h2>
        <div className="bg-dark-800 rounded-lg p-4 border border-dark-700 font-mono text-xs my-3 overflow-x-auto">
          <pre className="whitespace-pre">{`# Define zone (in http block)
limit_req_zone $binary_remote_addr zone=api:10m rate=10r/s;

# Apply to location
location /api/ {
    limit_req zone=api burst=20 nodelay;
    proxy_pass http://backend;
}`}</pre>
        </div>
        <p><code className="bg-dark-800 px-1.5 py-0.5 rounded text-dark-200">rate=10r/s</code> allows 10 requests per second per IP. <code className="bg-dark-800 px-1.5 py-0.5 rounded text-dark-200">burst=20</code> allows short bursts of up to 20 extra requests. <code className="bg-dark-800 px-1.5 py-0.5 rounded text-dark-200">nodelay</code> processes burst requests immediately instead of queuing them.</p>

        <h2 className="text-lg font-bold text-dark-100 mt-8 mb-3">Generate Your Config</h2>
        <p>Instead of assembling these blocks manually, use our <Link href="/nginx-config/" className="text-brand-400 hover:underline font-semibold">free Nginx Config Generator</Link>. Select your server type (reverse proxy, static, PHP, load balancer), configure SSL, security headers, and gzip — get a complete production-ready nginx.conf in seconds.</p>
      </article>
    </div>
  );
}
