export const CLIENT_ID = 'Gf-9illGARspLUMIUAyOjcwEBLt1hYmEfi6BjteCq3I';

// Must exactly match the URI registered in your Are.na OAuth app.
// In dev the OAuth redirect won't work; use a Personal Access Token instead.
const REDIRECT_URI = 'https://arena-batch-uploader.netlify.app/';

// ── PKCE helpers ────────────────────────────────────────────────────────────

const generateVerifier = () => {
  const chars =
    'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789-._~';
  const bytes = crypto.getRandomValues(new Uint8Array(64));
  return Array.from(bytes, (b) => chars[b % chars.length]).join('');
};

const base64UrlEncode = (buffer) => {
  const bytes = new Uint8Array(buffer);
  const str = Array.from(bytes, (b) => String.fromCharCode(b)).join('');
  return btoa(str).replace(/\+/g, '-').replace(/\//g, '_').replace(/=/g, '');
};

const deriveChallenge = async (verifier) => {
  const encoded = new TextEncoder().encode(verifier);
  const digest = await crypto.subtle.digest('SHA-256', encoded);
  return base64UrlEncode(digest);
};

// ── Public API ───────────────────────────────────────────────────────────────

/** Redirects the browser to the Are.na OAuth authorization page. */
export const initiateOAuth = async () => {
  const verifier = generateVerifier();
  const challenge = await deriveChallenge(verifier);
  sessionStorage.setItem('arena_pkce_verifier', verifier);

  const url = new URL('https://www.are.na/oauth/authorize');
  url.searchParams.set('client_id', CLIENT_ID);
  url.searchParams.set('redirect_uri', REDIRECT_URI);
  url.searchParams.set('response_type', 'code');
  url.searchParams.set('scope', 'write');
  url.searchParams.set('code_challenge', challenge);
  url.searchParams.set('code_challenge_method', 'S256');

  window.location.href = url.toString();
};

/**
 * Exchanges an authorization code for an access token.
 * Call this after the browser returns to the app with ?code=...
 */
export const exchangeCodeForToken = async (code) => {
  const verifier = sessionStorage.getItem('arena_pkce_verifier');
  if (!verifier) throw new Error('No PKCE verifier in session — please try authorizing again.');

  const res = await fetch('https://api.are.na/v3/oauth/token', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      grant_type: 'authorization_code',
      code,
      redirect_uri: REDIRECT_URI,
      client_id: CLIENT_ID,
      code_verifier: verifier,
    }),
  });

  const data = await res.json().catch(() => ({}));
  if (!res.ok) {
    throw new Error(data.error_description || data.error || `HTTP ${res.status}`);
  }

  sessionStorage.removeItem('arena_pkce_verifier');
  return data.access_token;
};
