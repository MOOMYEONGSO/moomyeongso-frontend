const ACCESS_TOKEN_KEY = "accessToken";
const REFRESH_TOKEN_KEY = "refreshToken";
const EMAIL_KEY = "email";
const LAST_UPDATE_KEY = "auth:lastUpdate";
const NICKNAME_KEY = "nickname";

export function getNickname() {
  return localStorage.getItem(NICKNAME_KEY);
}

export function setNickname(nickname: string) {
  try {
    localStorage.setItem(NICKNAME_KEY, nickname);
  } catch (e) {
    if (import.meta.env.DEV) console.warn("Failed to set nickname:", e);
  }
  notifyAuthUpdate();
}

export function clearNickname() {
  try {
    localStorage.removeItem(NICKNAME_KEY);
  } catch (e) {
    if (import.meta.env.DEV) console.warn("Failed to clear nickname:", e);
  }
  notifyAuthUpdate();
}

export function getAccessToken(): string | null {
  return localStorage.getItem(ACCESS_TOKEN_KEY);
}
export function getRefreshToken(): string | null {
  return localStorage.getItem(REFRESH_TOKEN_KEY);
}
export function getEmail(): string | null {
  return localStorage.getItem(EMAIL_KEY);
}

function pokeStorageBroadcast() {
  try {
    localStorage.setItem(LAST_UPDATE_KEY, String(Date.now()));
  } catch (e) {
    if (import.meta.env.DEV) {
      console.warn("Failed to broadcast auth update via storage", e);
    }
  }
}

export function notifyAuthUpdate() {
  window.dispatchEvent(new Event("auth:update"));
  pokeStorageBroadcast();
}

export function persistAuth(res: {
  accessToken: string;
  refreshToken?: string;
  email?: string;
  nickname?: string;
}) {
  localStorage.setItem(ACCESS_TOKEN_KEY, res.accessToken);
  if (res.refreshToken)
    localStorage.setItem(REFRESH_TOKEN_KEY, res.refreshToken);
  if (res.email) localStorage.setItem(EMAIL_KEY, res.email);
  if (res.nickname) localStorage.setItem(NICKNAME_KEY, res.nickname);
  notifyAuthUpdate();
}

export function clearAuth() {
  localStorage.removeItem(ACCESS_TOKEN_KEY);
  localStorage.removeItem(REFRESH_TOKEN_KEY);
  localStorage.removeItem(EMAIL_KEY);
  localStorage.removeItem(NICKNAME_KEY);
  notifyAuthUpdate();
}

export type UserRole = "USER" | "ANONYMOUS" | string;
type JwtPayload = { sub?: string; role?: UserRole; exp?: number };

function safeAtob(b64: string): string | null {
  try {
    if (typeof atob !== "function") return null;
    return atob(b64);
  } catch {
    return null;
  }
}

function base64UrlToBase64(s: string) {
  const b64 = s.replace(/-/g, "+").replace(/_/g, "/");
  const pad = b64.length % 4 === 2 ? "==" : b64.length % 4 === 3 ? "=" : "";
  return b64 + pad;
}

export function parseJwtPayload(token: string | null): JwtPayload | null {
  if (!token) return null;
  try {
    const parts = token.split(".");
    if (parts.length < 2) return null;
    const jsonStr = safeAtob(base64UrlToBase64(parts[1]));
    if (!jsonStr) return null;
    const payload = JSON.parse(jsonStr);
    return payload && typeof payload === "object" ? payload : null;
  } catch {
    return null;
  }
}

export function parseJwtExp(token: string | null): number | null {
  const payload = parseJwtPayload(token);
  return typeof payload?.exp === "number" ? payload.exp : null;
}

export function getCurrentIdentity(): {
  userId: string;
  role: UserRole;
} | null {
  const payload = parseJwtPayload(getAccessToken());
  const userId = payload?.sub;
  const role = payload?.role;
  if (!userId || !role) return null;
  return { userId, role };
}

export function isAuthenticatedUser(): boolean {
  const id = getCurrentIdentity();
  return !!id && id.role !== "ANONYMOUS";
}

export function isAdminUser(): boolean {
  const identity = getCurrentIdentity();
  if (!identity) return false;

  const role = identity.role;
  return role === "ADMIN" || role === "ROLE_ADMIN";
}

export function hasValidToken(nowSec = Math.floor(Date.now() / 1000)): boolean {
  const token = getAccessToken();
  if (!token) return false;
  const exp = parseJwtExp(token);
  if (exp == null) return true;
  return exp > nowSec + 5;
}

export function hasValidRefreshToken(
  nowSec = Math.floor(Date.now() / 1000)
): boolean {
  const rt = getRefreshToken();
  if (!rt) return false;
  const exp = parseJwtExp(rt);
  if (exp == null) return true;
  return exp > nowSec + 5;
}
