'use client';
import { useState, useEffect } from 'react';
import ToolLayout from '../../components/ToolLayout';
import { textareaClass, labelClass } from '../../components/styles';

export default function Client() {
  const [input, setInput] = useState('eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMjM0NTY3ODkwIiwibmFtZSI6IkpvaG4gRG9lIiwiaWF0IjoxNTE2MjM5MDIyLCJleHAiOjE3MTYyMzkwMjIsInJvbGUiOiJhZG1pbiJ9.SflKxwRJSMeKKF2QT4fwpMeJf36POk6yJV_adQssw5c');
  const [header, setHeader] = useState('');
  const [payload, setPayload] = useState('');
  const [error, setError] = useState('');

  useEffect(() => {
    try {
      const parts = input.split('.');
      if (parts.length !== 3) throw new Error('Invalid JWT: must have 3 parts');
      const h = JSON.parse(atob(parts[0].replace(/-/g, '+').replace(/_/g, '/')));
      const p = JSON.parse(atob(parts[1].replace(/-/g, '+').replace(/_/g, '/')));
      setHeader(JSON.stringify(h, null, 2));
      setPayload(JSON.stringify(p, null, 2));
      setError('');
    } catch (e) { setError(e.message); setHeader(''); setPayload(''); }
  }, [input]);

  return (
    <ToolLayout title="JWT Decoder" description="Decode and inspect JWT tokens. View header, payload, and expiration info.">
      <label className={labelClass}>JWT Token</label>
      <textarea className={`${textareaClass} mb-4`} value={input} onChange={e => setInput(e.target.value)} rows={4} spellCheck={false} />
      {error && <div className="text-red-400 mb-3 text-[13px]">⚠ {error}</div>}
      <div className="flex gap-4 flex-wrap">
        <div className="flex-1 min-w-[280px]">
          <label className={labelClass}>Header <span className="text-red-400 font-normal text-[11px] normal-case">ALGORITHM & TOKEN TYPE</span></label>
          <textarea className={`${textareaClass} text-red-400`} value={header} readOnly rows={6} />
        </div>
        <div className="flex-1 min-w-[280px]">
          <label className={labelClass}>Payload <span className="text-purple-400 font-normal text-[11px] normal-case">DATA</span></label>
          <textarea className={`${textareaClass} text-purple-400`} value={payload} readOnly rows={6} />
        </div>
      </div>
    
      {/* SEO content */}
      <section className="mt-10 border-t border-dark-700 pt-6">
        <h2 className="text-base font-bold text-dark-200 mb-3">About JSON Web Tokens (JWT)</h2>
        <div className="text-xs text-dark-400 leading-relaxed space-y-2">
          <p>JSON Web Tokens (JWT) are the industry standard for stateless authentication in modern web applications, APIs, and microservices. Defined in <strong className="text-dark-300">RFC 7519</strong>, a JWT is a compact, URL-safe token that carries claims between two parties. JWTs are widely used in OAuth 2.0, OpenID Connect, and single sign-on (SSO).</p>

          <h3 className="text-sm font-semibold text-dark-300 mt-4 mb-2">JWT Structure: Header, Payload, Signature</h3>
          <p>Every JWT has three Base64URL-encoded parts separated by dots: <code className="text-dark-300">header.payload.signature</code>. The <strong className="text-dark-300">header</strong> specifies the signing algorithm (HS256, RS256, ES256) and token type. The <strong className="text-dark-300">payload</strong> contains claims — standard ones like <code className="text-dark-300">iss</code> (issuer), <code className="text-dark-300">exp</code> (expiration), <code className="text-dark-300">sub</code> (subject), and <code className="text-dark-300">iat</code> (issued at), plus custom claims like user roles. The <strong className="text-dark-300">signature</strong> is a cryptographic hash signed with a secret (HMAC) or private key (RSA/ECDSA).</p>

          <h3 className="text-sm font-semibold text-dark-300 mt-4 mb-2">Why Decode JWT Tokens?</h3>
          <p>Decoding a JWT is essential when debugging authentication flows: verifying the payload contains the correct user ID and roles, checking the <code className="text-dark-300">exp</code> claim for expiration, inspecting <code className="text-dark-300">iss</code> and <code className="text-dark-300">aud</code> claims to confirm the token issuer, and validating the algorithm in the header matches your server&apos;s expectations (to prevent algorithm confusion attacks).</p>

          <h3 className="text-sm font-semibold text-dark-300 mt-4 mb-2">JWT Security Best Practices</h3>
          <p>JWTs are Base64-encoded, <strong className="text-dark-300">not encrypted</strong> — anyone with the token can read the payload. Never store passwords or credit card numbers in claims. Always verify signatures server-side. Set short expiration times (15–60 min for access tokens) and use refresh tokens for long sessions. Prefer <code className="text-dark-300">RS256</code> (asymmetric) over <code className="text-dark-300">HS256</code> (symmetric) in distributed systems.</p>

          <p>This decoder runs entirely in your browser. Your tokens are never sent to any server — paste, inspect claims, and check expiration safely. Works with tokens from Auth0, Firebase Auth, AWS Cognito, Keycloak, and any OAuth 2.0 provider.</p>
        </div>
      </section>
    </ToolLayout>
  );
}
