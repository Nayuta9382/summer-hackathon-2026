import { getJwtCookie, setJwtCookie } from './cookieService';
import { createToken, verifyToken } from './jwtService';
import { SessionPayload } from './jwtType';
import { LoginRequest, LoginRequestSchema, LoginResult } from '../types/request/auth/LoginRequest';
import { verifyPassword } from './passwordService';
import { getUserById, getUserByName } from '../services/usersService';

// 認証失敗時のレスポンス
export const AUTH_ERROR_RESPONSE = {
    code: 'UNAUTHORIZED',
    message: '認証に失敗しました。再度ログインしてください。',
    status: 401,
} as const;

// ログイン処理
export async function handleLogin(rawBody: unknown): Promise<LoginResult> {
    // 1. リクエストのバリデーション
    const parsed = LoginRequestSchema.safeParse(rawBody);

    if (!parsed.success) {
        const { fieldErrors } = parsed.error.flatten();

        return {
            ok: false,
            status: 400,
            error: {
                code: 'VALIDATION_ERROR',
                message: 'リクエストが不正です',
                fields: fieldErrors,
            },
        };
    }

    // 2. ログイン処理
    const loginResult: LoginResult = await login(parsed.data);

    // 3. ログイン成功時に JWT を発行して cookie に保存
    if (loginResult.ok) {
        await createSession(loginResult.userId, loginResult.userName);
    }

    return loginResult;
}

// ログイン認証の本体
async function login(request: LoginRequest): Promise<LoginResult> {
    // 1. ユーザー名でユーザーを検索
    const user = await getUserByName(request.userName);

    if (!user) {
        return {
            ok: false,
            status: 401,
            error: {
                code: 'INVALID_CREDENTIALS',
                message: 'ユーザ名またはパスワードが正しくありません',
            },
        };
    }

    // 2. パスワード検証
    const isPasswordValid = await verifyPassword(request.password, user.passwordHash);

    if (!isPasswordValid) {
        return {
            ok: false,
            status: 401,
            error: {
                code: 'INVALID_CREDENTIALS',
                message: 'ユーザ名またはパスワードが正しくありません',
            },
        };
    }

    return { ok: true, userId: user.userId, userName: user.userName };
}

// JWT を発行して cookie に保存
export async function createSession(userId: number, userName: string): Promise<void> {
    const token = await createToken({ userId, userName });
    await setJwtCookie(token);
}

// cookie から JWT を取得し、署名・期限を検証して payload を返す
export async function ValidateSession(tokenOverride?: string | null): Promise<SessionPayload | null> {
    const token = tokenOverride ?? (await getJwtCookie());

    if (!token) {
        return null;
    }

    // jwtService 側で署名・有効期限の確認をしている前提
    return verifyToken(token);
}

// 認証済みユーザーか確認する
// - JWT の存在確認
// - JWT の userId を取得
// - DB にそのユーザーが存在するか確認
export async function authorizeRequest(tokenOverride?: string | null): Promise<number | null> {
    const payload = await ValidateSession(tokenOverride);

    if (!payload?.userId) {
        return null;
    }

    try {
        const user = await getUserById(payload.userId);

        if (!user) {
            return null;
        }

        return payload.userId;
    } catch {
        // DB エラー時も認証失敗扱い
        return null;
    }
}
