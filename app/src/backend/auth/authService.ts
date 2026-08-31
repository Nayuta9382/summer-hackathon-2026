import { getJwtCookie, setJwtCookie } from './cookieService';
import { createToken, verifyToken } from './jwtService';
import { SessionPayload } from './jwtType';

//  JWTを発行してcookieにセットする
export async function createSession(userId: number, userName: string): Promise<void> {
    const token = await createToken({ userId, userName });
    await setJwtCookie(token);
}
// cookieからセッション（JWT）を検証しペイロードを取得する
export async function ValidateSession(): Promise<SessionPayload | null> {
    const token = await getJwtCookie();
    if (!token) return null;

    return verifyToken(token);
}
