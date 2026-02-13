'use client';
import { useState, useMemo } from 'react';
import ToolLayout from '../../components/ToolLayout';
import { inputClass, labelClass } from '../../components/styles';

const CODES = [
  // 1xx Informational
  { code: 100, text: 'Continue', cat: '1xx', desc: 'Server received request headers. Client should proceed with body.', when: 'Client sent Expect: 100-continue header. Server signals it is ready to receive the body.', fix: 'Usually handled automatically by HTTP clients. No action needed.' },
  { code: 101, text: 'Switching Protocols', cat: '1xx', desc: 'Server is switching to protocol requested by client.', when: 'Client requested protocol upgrade (e.g., HTTP to WebSocket via Upgrade header).', fix: 'Expected during WebSocket handshake. Verify Upgrade header is correct.' },
  { code: 103, text: 'Early Hints', cat: '1xx', desc: 'Server sends preliminary headers before final response.', when: 'Server uses Link headers to let browser preload resources while the final response is being prepared.', fix: 'No action needed. Browser uses hints to preload CSS/JS.' },

  // 2xx Success
  { code: 200, text: 'OK', cat: '2xx', desc: 'Request succeeded. Response body contains the result.', when: 'Standard success response for GET, POST, PUT, PATCH requests.', fix: 'Everything is working. This is the expected response.' },
  { code: 201, text: 'Created', cat: '2xx', desc: 'Request succeeded and a new resource was created.', when: 'Returned after a successful POST that creates a resource (user, record, file).', fix: 'Check Location header for the URL of the newly created resource.' },
  { code: 202, text: 'Accepted', cat: '2xx', desc: 'Request accepted for processing, but not yet completed.', when: 'Server queued the request for async processing (batch jobs, email sending, report generation).', fix: 'Poll the provided status URL or wait for a webhook callback.' },
  { code: 204, text: 'No Content', cat: '2xx', desc: 'Request succeeded but there is no content to return.', when: 'Returned after DELETE or PUT when no response body is needed.', fix: 'Expected. Do not try to parse a response body.' },
  { code: 206, text: 'Partial Content', cat: '2xx', desc: 'Server is returning only part of the resource.', when: 'Client sent a Range header (e.g., resuming a download or streaming video).', fix: 'Check Content-Range header. Send subsequent Range requests for remaining data.' },

  // 3xx Redirection
  { code: 301, text: 'Moved Permanently', cat: '3xx', desc: 'Resource has permanently moved to a new URL.', when: 'Domain migration, HTTP→HTTPS redirect, URL structure change. SEO authority transfers.', fix: 'Update links and bookmarks to the new URL in the Location header.' },
  { code: 302, text: 'Found', cat: '3xx', desc: 'Resource temporarily moved to a different URL.', when: 'Temporary redirect during maintenance, A/B testing, or geo-routing.', fix: 'Follow the redirect. Keep using the original URL for future requests.' },
  { code: 303, text: 'See Other', cat: '3xx', desc: 'Redirect to a different resource using GET.', when: 'After POST form submission, server redirects to a result page (POST/Redirect/GET pattern).', fix: 'Follow redirect with GET method, regardless of original method.' },
  { code: 304, text: 'Not Modified', cat: '3xx', desc: 'Resource has not changed since last request.', when: 'Client sent If-None-Match or If-Modified-Since. Server confirms cache is still valid.', fix: 'Use cached version. No body is returned. This saves bandwidth.' },
  { code: 307, text: 'Temporary Redirect', cat: '3xx', desc: 'Temporary redirect preserving the HTTP method.', when: 'Like 302 but guarantees method and body are not changed. HTTPS redirect while preserving POST.', fix: 'Follow redirect using the same HTTP method and body.' },
  { code: 308, text: 'Permanent Redirect', cat: '3xx', desc: 'Permanent redirect preserving the HTTP method.', when: 'Like 301 but guarantees method is preserved. Used for API endpoint migrations.', fix: 'Update code to use the new URL. Method stays the same.' },

  // 4xx Client Errors
  { code: 400, text: 'Bad Request', cat: '4xx', desc: 'Server cannot process the request due to client error.', when: 'Malformed JSON body, missing required fields, invalid query parameters, wrong Content-Type.', fix: 'Check request body format, required fields, and Content-Type header. Validate input before sending.' },
  { code: 401, text: 'Unauthorized', cat: '4xx', desc: 'Authentication is required but was not provided or is invalid.', when: 'Missing or expired JWT/API key, invalid credentials, token not in Authorization header.', fix: 'Send valid credentials. Check if token is expired. Verify Authorization: Bearer <token> format.' },
  { code: 403, text: 'Forbidden', cat: '4xx', desc: 'Server understood the request but refuses to authorize it.', when: 'Valid authentication but insufficient permissions. User role lacks access. IP blocked. CORS issue.', fix: 'Check user permissions/roles. Verify API key scope. Check CORS headers if browser request.' },
  { code: 404, text: 'Not Found', cat: '4xx', desc: 'Requested resource does not exist on the server.', when: 'Wrong URL, deleted resource, typo in endpoint path, missing trailing slash.', fix: 'Verify URL spelling. Check API documentation. Ensure resource exists. Check trailing slash requirements.' },
  { code: 405, text: 'Method Not Allowed', cat: '4xx', desc: 'HTTP method is not supported for this endpoint.', when: 'Sending POST to a GET-only endpoint, or DELETE to a read-only resource.', fix: 'Check Allow response header for supported methods. Verify API documentation.' },
  { code: 406, text: 'Not Acceptable', cat: '4xx', desc: 'Server cannot produce response matching Accept headers.', when: 'Client requested a format (e.g., XML) that the server does not support.', fix: 'Check Accept header. Try Accept: application/json or remove the header.' },
  { code: 408, text: 'Request Timeout', cat: '4xx', desc: 'Server timed out waiting for the client request.', when: 'Client took too long to send the complete request. Slow network or large upload.', fix: 'Retry the request. Check network connection. Reduce payload size.' },
  { code: 409, text: 'Conflict', cat: '4xx', desc: 'Request conflicts with the current state of the resource.', when: 'Duplicate unique field (email, username), concurrent edit conflict, version mismatch.', fix: 'Fetch current state, resolve the conflict, and retry. Check unique constraints.' },
  { code: 410, text: 'Gone', cat: '4xx', desc: 'Resource has been permanently deleted and will not return.', when: 'API version sunset, intentionally removed content, expired temporary resource.', fix: 'Unlike 404, this is permanent. Remove references to this resource.' },
  { code: 413, text: 'Payload Too Large', cat: '4xx', desc: 'Request body exceeds the server size limit.', when: 'File upload too large, JSON body exceeds limit, multipart form too big.', fix: 'Reduce payload size. Check server upload limits (nginx: client_max_body_size). Use chunked upload.' },
  { code: 415, text: 'Unsupported Media Type', cat: '4xx', desc: 'Server does not support the request body format.', when: 'Sending JSON without Content-Type: application/json, or uploading unsupported file type.', fix: 'Set correct Content-Type header. Check supported formats in API docs.' },
  { code: 422, text: 'Unprocessable Entity', cat: '4xx', desc: 'Request is well-formed but contains semantic errors.', when: 'Valid JSON but business logic validation failed: invalid email format, price < 0, date in the past.', fix: 'Check response body for validation error details. Fix input data and retry.' },
  { code: 429, text: 'Too Many Requests', cat: '4xx', desc: 'Client has sent too many requests in a given time.', when: 'Rate limit exceeded. API throttling. DDoS protection triggered.', fix: 'Check Retry-After header. Implement exponential backoff. Reduce request frequency.' },
  { code: 431, text: 'Request Header Fields Too Large', cat: '4xx', desc: 'Server refuses request because headers are too large.', when: 'Huge cookies, overly long Authorization token, too many custom headers.', fix: 'Clear cookies. Reduce header sizes. Check for cookie bloat.' },
  { code: 451, text: 'Unavailable For Legal Reasons', cat: '4xx', desc: 'Resource is blocked due to legal demands.', when: 'Government censorship, court order, GDPR takedown, copyright claim.', fix: 'No technical fix. Resource is legally restricted in your jurisdiction.' },

  // 5xx Server Errors
  { code: 500, text: 'Internal Server Error', cat: '5xx', desc: 'Server encountered an unexpected error.', when: 'Unhandled exception, null pointer, database error, misconfigured server, deployment bug.', fix: 'Check server logs. This is a server-side bug. If you are the API consumer, retry later or contact support.' },
  { code: 501, text: 'Not Implemented', cat: '5xx', desc: 'Server does not support the functionality required.', when: 'Server does not recognize the HTTP method, or feature is not yet built.', fix: 'Check if the endpoint and method exist in the API. May be a planned but unimplemented feature.' },
  { code: 502, text: 'Bad Gateway', cat: '5xx', desc: 'Server acting as proxy received an invalid response from upstream.', when: 'Upstream server crashed, returned malformed response, or connection refused. Common with nginx/load balancers.', fix: 'Check upstream server health. Verify proxy configuration. Restart upstream service.' },
  { code: 503, text: 'Service Unavailable', cat: '5xx', desc: 'Server is temporarily unable to handle requests.', when: 'Server overloaded, in maintenance mode, deploying, or dependencies are down.', fix: 'Check Retry-After header. Wait and retry. Verify server health and resource usage.' },
  { code: 504, text: 'Gateway Timeout', cat: '5xx', desc: 'Proxy/gateway did not receive a timely response from upstream.', when: 'Upstream server is too slow. Long-running query. Database timeout. Network issues between proxy and backend.', fix: 'Increase proxy timeout settings. Optimize slow upstream queries. Check network connectivity.' },
  { code: 507, text: 'Insufficient Storage', cat: '5xx', desc: 'Server cannot store the representation needed to complete the request.', when: 'Disk full on server. Database storage limit reached. File system quota exceeded.', fix: 'Free disk space. Increase storage quota. Clean up old files or logs.' },
  { code: 508, text: 'Loop Detected', cat: '5xx', desc: 'Server detected an infinite loop while processing the request.', when: 'Circular redirects, recursive proxy configuration, infinite rewrite rules.', fix: 'Check redirect rules and proxy configuration for circular references.' },
  { code: 511, text: 'Network Authentication Required', cat: '5xx', desc: 'Client needs to authenticate to gain network access.', when: 'Captive portal (hotel, airport Wi-Fi) intercepting requests.', fix: 'Open browser and complete the network login page.' },
];

const CAT_COLORS = {
  '1xx': { bg: 'bg-blue-500/10', border: 'border-blue-500/20', text: 'text-blue-400', label: 'Informational' },
  '2xx': { bg: 'bg-green-500/10', border: 'border-green-500/20', text: 'text-green-400', label: 'Success' },
  '3xx': { bg: 'bg-yellow-500/10', border: 'border-yellow-500/20', text: 'text-yellow-400', label: 'Redirection' },
  '4xx': { bg: 'bg-orange-500/10', border: 'border-orange-500/20', text: 'text-orange-400', label: 'Client Error' },
  '5xx': { bg: 'bg-red-500/10', border: 'border-red-500/20', text: 'text-red-400', label: 'Server Error' },
};

export default function Client() {
  const [search, setSearch] = useState('');
  const [filter, setFilter] = useState('all');
  const [expanded, setExpanded] = useState(null);

  const filtered = useMemo(() => {
    let list = CODES;
    if (filter !== 'all') list = list.filter(c => c.cat === filter);
    if (search) {
      const q = search.toLowerCase();
      list = list.filter(c =>
        c.code.toString().includes(q) ||
        c.text.toLowerCase().includes(q) ||
        c.desc.toLowerCase().includes(q) ||
        c.when.toLowerCase().includes(q)
      );
    }
    return list;
  }, [search, filter]);

  const toggleExpand = (code) => {
    setExpanded(expanded === code ? null : code);
  };

  return (
    <ToolLayout title="HTTP Status Codes" description="Quick reference for all HTTP response status codes. Search by code number or keyword, see causes and how to fix common errors.">
      {/* Search + filter */}
      <div className="flex flex-wrap gap-3 mb-5">
        <input
          className={inputClass + ' flex-1 min-w-[200px] max-w-[400px]'}
          placeholder="Search by code, name, or keyword... (e.g. 404, forbidden, cache)"
          value={search}
          onChange={e => setSearch(e.target.value)}
          autoFocus
        />
        <div className="flex gap-1.5 flex-wrap">
          {['all', '1xx', '2xx', '3xx', '4xx', '5xx'].map(f => (
            <button
              key={f}
              onClick={() => setFilter(f)}
              className={`text-xs px-3 py-1.5 rounded-lg transition-all ${
                filter === f
                  ? (f === 'all' ? 'bg-brand-600/20 text-brand-400 border border-brand-500/30' : `${CAT_COLORS[f]?.bg || ''} ${CAT_COLORS[f]?.text || ''} border ${CAT_COLORS[f]?.border || ''}`)
                  : 'bg-dark-800 text-dark-400 border border-dark-700 hover:text-dark-200'
              }`}
            >
              {f === 'all' ? 'All' : `${f} ${CAT_COLORS[f]?.label || ''}`}
            </button>
          ))}
        </div>
      </div>

      {/* Count */}
      <div className="text-xs text-dark-500 mb-3">{filtered.length} status code{filtered.length !== 1 ? 's' : ''}</div>

      {/* Codes list */}
      <div className="space-y-1.5">
        {filtered.map(c => {
          const cat = CAT_COLORS[c.cat];
          const isOpen = expanded === c.code;

          return (
            <div
              key={c.code}
              className={`border rounded-xl overflow-hidden transition-all cursor-pointer ${
                isOpen ? `${cat.bg} ${cat.border}` : 'border-dark-700 hover:border-dark-600'
              }`}
              onClick={() => toggleExpand(c.code)}
            >
              {/* Header row */}
              <div className="flex items-center gap-3 px-4 py-3">
                <span className={`font-mono font-bold text-lg w-12 ${cat.text}`}>{c.code}</span>
                <div className="flex-1 min-w-0">
                  <span className="text-sm font-semibold text-dark-100">{c.text}</span>
                  <span className="text-xs text-dark-500 ml-2 hidden sm:inline">{c.desc}</span>
                </div>
                <span className={`text-[10px] px-2 py-0.5 rounded-full ${cat.bg} ${cat.text} border ${cat.border}`}>
                  {c.cat}
                </span>
                <span className="text-dark-600 text-xs">{isOpen ? '▲' : '▼'}</span>
              </div>

              {/* Expanded details */}
              {isOpen && (
                <div className="px-4 pb-4 border-t border-dark-700/50">
                  <div className="grid gap-3 mt-3 sm:grid-cols-3">
                    <div className="bg-dark-900/50 rounded-lg p-3">
                      <div className="text-[10px] font-bold text-dark-500 uppercase tracking-wider mb-1">What it means</div>
                      <div className="text-xs text-dark-300 leading-relaxed">{c.desc}</div>
                    </div>
                    <div className="bg-dark-900/50 rounded-lg p-3">
                      <div className="text-[10px] font-bold text-dark-500 uppercase tracking-wider mb-1">When it happens</div>
                      <div className="text-xs text-dark-300 leading-relaxed">{c.when}</div>
                    </div>
                    <div className="bg-dark-900/50 rounded-lg p-3">
                      <div className="text-[10px] font-bold text-dark-500 uppercase tracking-wider mb-1">How to fix</div>
                      <div className="text-xs text-dark-300 leading-relaxed">{c.fix}</div>
                    </div>
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>

      {filtered.length === 0 && (
        <div className="text-center text-dark-500 py-12">No status codes match your search.</div>
      )}

      {/* SEO content */}
      <section className="mt-10 border-t border-dark-700 pt-6">
        <h2 className="text-base font-bold text-dark-200 mb-3">About HTTP Status Codes</h2>
        <div className="text-xs text-dark-400 leading-relaxed space-y-2">
          <p>HTTP status codes are three-digit numbers returned by a server in response to a client request. They are grouped into five classes: 1xx (Informational), 2xx (Success), 3xx (Redirection), 4xx (Client Error), and 5xx (Server Error). Understanding these codes is essential for debugging APIs, web applications, and server infrastructure.</p>
          <p>The most commonly encountered codes are 200 (OK), 301 (Moved Permanently), 400 (Bad Request), 401 (Unauthorized), 403 (Forbidden), 404 (Not Found), 500 (Internal Server Error), and 502 (Bad Gateway). Each has specific causes and solutions. This reference covers {CODES.length} status codes with practical explanations of when they occur and how to resolve them.</p>
        </div>
      </section>
    </ToolLayout>
  );
}
