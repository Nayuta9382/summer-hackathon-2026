import { cookies } from 'next/headers';
import { SESSION_COOKIE_NAME, TOKEN_EXPIRATION_MS } from './authConfig';

// JWTをcookieにセットする（有効期限はTOKEN_EXPIRATION_MSから算出）
export async function setJwtCookie(token: string): Promise<void> {
    const cookieStore = await cookies();
    cookieStore.set(SESSION_COOKIE_NAME, token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'lax',
        path: '/',
        expires: new Date(Date.now() + TOKEN_EXPIRATION_MS),
    });
}

// cookieからJWTの生トークンを取得する（無ければnull）
export async function getJwtCookie(): Promise<string | null> {
    const cookieStore = await cookies();
    return cookieStore.get(SESSION_COOKIE_NAME)?.value ?? null;
}

// cookieからJWTを削除する
export async function deleteJwtCookie(): Promise<void> {
    const cookieStore = await cookies();
    cookieStore.delete(SESSION_COOKIE_NAME);
}
