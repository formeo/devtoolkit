export const metadata = {
  title: 'Nginx Config Generator — Build nginx.conf Online',
  description: 'Free Nginx config generator. Build optimized nginx.conf for reverse proxy, static sites, PHP, Node.js, SSL, and load balancing.',
  alternates: { canonical: '/nginx-config/' },
  keywords: ['nginx config generator', 'nginx.conf builder', 'nginx reverse proxy config', 'nginx ssl config', 'nginx configuration tool', 'nginx generator online', 'nginx php-fpm config', 'nginx load balancer'],
};
import Client from './client';
export default function Page() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "FAQPage",
            "mainEntity": [
              {
                "@type": "Question",
                "name": "How do I configure Nginx as a reverse proxy?",
                "acceptedAnswer": {
                  "@type": "Answer",
                  "text": "Set up a server block with proxy_pass pointing to your backend (e.g., proxy_pass http://127.0.0.1:3000). Add proxy_set_header directives for Host, X-Real-IP, and X-Forwarded-For to pass client info to the backend. For WebSocket support, add proxy_http_version 1.1 and Upgrade headers."
                }
              },
              {
                "@type": "Question",
                "name": "How do I enable SSL/HTTPS in Nginx?",
                "acceptedAnswer": {
                  "@type": "Answer",
                  "text": "Add ssl_certificate and ssl_certificate_key directives pointing to your cert files. Use 'listen 443 ssl http2' and add a separate server block on port 80 that redirects to HTTPS. For Let's Encrypt, use certbot to auto-generate certificates."
                }
              },
              {
                "@type": "Question",
                "name": "What is the best Nginx gzip configuration?",
                "acceptedAnswer": {
                  "@type": "Answer",
                  "text": "Enable gzip with 'gzip on', set gzip_comp_level to 5-6, gzip_min_length to 256 bytes, and include types like text/plain, text/css, application/json, application/javascript, image/svg+xml, and application/xml."
                }
              },
              {
                "@type": "Question",
                "name": "How do I configure Nginx for PHP-FPM?",
                "acceptedAnswer": {
                  "@type": "Answer",
                  "text": "Add a location block for PHP files: 'location ~ \\.php$ { fastcgi_pass unix:/run/php/php-fpm.sock; fastcgi_param SCRIPT_FILENAME $document_root$fastcgi_script_name; include fastcgi_params; }'. Adjust the socket path to match your PHP-FPM installation."
                }
              }
            ]
          })
        }}
      />
      <Client />
    </>
  );
}
