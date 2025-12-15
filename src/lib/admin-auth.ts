const COOKIE_NAME = "admin_session";

function getEnv(name: string) {
  return process.env[name] || "";
}

export function getAdminCookieName() {
  return COOKIE_NAME;
}

function safeEqual(a: string, b: string) {
  // Constant-time-ish string compare without Node's timingSafeEqual (Edge-compatible).
  if (a.length !== b.length) return false;
  let out = 0;
  for (let i = 0; i < a.length; i++) out |= a.charCodeAt(i) ^ b.charCodeAt(i);
  return out === 0;
}

export function verifyAdminCredentials(username: string, password: string) {
  const u = getEnv("ADMIN_USERNAME");
  const p = getEnv("ADMIN_PASSWORD");
  if (!u || !p) return false;

  return safeEqual(username, u) && safeEqual(password, p);
}

function secret() {
  return getEnv("ADMIN_SESSION_SECRET");
}

function base64UrlEncode(bytes: Uint8Array) {
  // Works in Edge + Node.
  if (typeof btoa === "function") {
    let binary = "";
    for (const b of bytes) binary += String.fromCharCode(b);
    return btoa(binary).replace(/\+/g, "-").replace(/\//g, "_").replace(/=+$/g, "");
  }
  return Buffer.from(bytes).toString("base64").replace(/\+/g, "-").replace(/\//g, "_").replace(/=+$/g, "");
}

let hmacKeyPromise: Promise<CryptoKey> | null = null;

async function getHmacKey() {
  const s = secret();
  if (!s) return null;
  if (!hmacKeyPromise) {
    const enc = new TextEncoder();
    hmacKeyPromise = crypto.subtle.importKey(
      "raw",
      enc.encode(s),
      { name: "HMAC", hash: "SHA-256" },
      false,
      ["sign"],
    );
  }
  return hmacKeyPromise;
}

async function sign(payload: string) {
  const s = secret();
  if (!s) return "";
  const key = await getHmacKey();
  if (!key) return "";
  const enc = new TextEncoder();
  const sig = await crypto.subtle.sign("HMAC", key, enc.encode(payload));
  return base64UrlEncode(new Uint8Array(sig));
}

export async function createAdminSessionCookieValue() {
  // Keep it minimal: timestamp only (prevents trivial replay across long periods).
  const issuedAt = Date.now().toString();
  const sig = await sign(issuedAt);
  if (!sig) return "";
  return `${issuedAt}.${sig}`;
}

export async function isValidAdminSessionCookieValue(value: string | undefined | null) {
  if (!value) return false;
  const s = secret();
  if (!s) return false;

  const [issuedAt, sig] = value.split(".");
  if (!issuedAt || !sig) return false;

  const expected = await sign(issuedAt);
  if (!expected) return false;

  // Optional max age (7 days)
  const maxAgeMs = 7 * 24 * 60 * 60 * 1000;
  const iat = Number(issuedAt);
  if (!Number.isFinite(iat) || Date.now() - iat > maxAgeMs) return false;

  return safeEqual(sig, expected);
}

