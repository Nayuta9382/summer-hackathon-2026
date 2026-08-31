import { getJwtCookie, setJwtCookie } from './cookieService';
import { createToken, verifyToken } from './jwtService';
import { SessionPayload } from './jwtType';
import { LoginRequest, LoginRequestSchema, LoginResult } from '../types/request/auth/LoginRequest';
import { verifyPassword } from './passwordService';
import { getUserByName } from '../services/usersService';

// リクエストボディのバリデーション → ログイン処理 →
// 成功時はJWTセッションの発行(cookieセット)まで行う
export async function handleLogin(rawBody: unknown): Promise<LoginResult> {
    // バリデーションを行う
    const parsed = LoginRequestSchema.safeParse(rawBody);

    // バリデーションの結果が正しくない場合は該当する情報をreturnする
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

    // ログイン処理を実行する
    const loginResult: LoginResult = await login(parsed.data);

    // ログイン成功時はjwtをcookieにセットする
    if (loginResult.ok) {
        await createSession(loginResult.userId, loginResult.userName);
    }
    return loginResult;
}

// ログイン処理
async function login(request: LoginRequest): Promise<LoginResult> {
    // メールアドレスからユーザーを検索する
    const user = await getUserByName(request.userName);

    // ユーザが存在しない
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

    // パスワードを検証する
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
