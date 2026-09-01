// cookieに登録するcookieの名前
export const SESSION_COOKIE_NAME = 'session';
// 署名鍵。
export const secret = new TextEncoder().encode(process.env.AUTH_SECRET!);
// JWTの有効期限
export const TOKEN_EXPIRATION = process.env.TOKEN_EXPIRATION ?? '7d';
// cookieのexpiresに使うミリ秒値
export const TOKEN_EXPIRATION_MS = 1000 * 60 * 60 * 24 * 7;
