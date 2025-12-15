import { createHmac, timingSafeEqual } from "crypto";

const COOKIE_NAME = "admin_session";

function getEnv(name: string) {
  return process.env[name] || "";
}

export function getAdminCookieName() {
  return COOKIE_NAME;
}

export function verifyAdminCredentials(username: string, password: string) {
  const u = getEnv("ADMIN_USERNAME");
  const p = getEnv("ADMIN_PASSWORD");
  if (!u || !p) return false;

  // Constant-time compare
  const ub = Buffer.from(username);
  const pb = Buffer.from(password);
  const uref = Buffer.from(u);
  const pref = Buffer.from(p);

  return (
    ub.length === uref.length &&
    pb.length === pref.length &&
    timingSafeEqual(ub, uref) &&
    timingSafeEqual(pb, pref)
  );
}

function secret() {
  return getEnv("ADMIN_SESSION_SECRET");
}

function sign(payload: string) {
  const s = secret();
  if (!s) return "";
  return createHmac("sha256", s).update(payload).digest("base64url");
}

export function createAdminSessionCookieValue() {
  // Keep it minimal: timestamp only (prevents trivial replay across long periods).
  const issuedAt = Date.now().toString();
  const sig = sign(issuedAt);
  if (!sig) return "";
  return `${issuedAt}.${sig}`;
}

export function isValidAdminSessionCookieValue(value: string | undefined | null) {
  if (!value) return false;
  const s = secret();
  if (!s) return false;

  const [issuedAt, sig] = value.split(".");
  if (!issuedAt || !sig) return false;

  const expected = sign(issuedAt);
  if (!expected) return false;

  const a = Buffer.from(sig);
  const b = Buffer.from(expected);
  if (a.length !== b.length) return false;

  // Optional max age (7 days)
  const maxAgeMs = 7 * 24 * 60 * 60 * 1000;
  const iat = Number(issuedAt);
  if (!Number.isFinite(iat) || Date.now() - iat > maxAgeMs) return false;

  return timingSafeEqual(a, b);
}

