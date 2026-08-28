// src/lib/auth/jwt.ts
import { SignJWT, jwtVerify, type JWTPayload } from 'jose';
import { SessionPayload } from './jwtType';
import { secret, TOKEN_EXPIRATION } from './authConfig';

// ユーザー情報を署名付きJWTにして発行する
export async function createToken(payload: Omit<SessionPayload, keyof JWTPayload>): Promise<string> {
    return new SignJWT(payload).setProtectedHeader({ alg: 'HS256' }).setIssuedAt().setExpirationTime(TOKEN_EXPIRATION).sign(secret);
}

// JWTの署名・有効期限を検証し、ペイロードを返す
export async function verifyToken(token: string): Promise<SessionPayload | null> {
    try {
        const { payload } = await jwtVerify(token, secret);
        return payload as SessionPayload;
    } catch {
        // 署名不正・改ざん・期限切れ、理由を問わず無効なトークンとして扱う
        return null;
    }
}
