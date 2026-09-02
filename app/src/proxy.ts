import { NextRequest, NextResponse } from 'next/server';
import { SESSION_COOKIE_NAME } from '@/backend/auth/authConfig';
import { authorizeRequest } from '@/backend/auth/authService';

// API の共通認可チェック
export async function proxy(request: NextRequest) {
    const { pathname } = request.nextUrl;
    console.log('pathNameえす');
    console.log('pathNameえす');
    console.log('pathNameえす');
    console.log('pathNameえす');
    console.log('pathNameえす');
    console.log('pathNameえす');
    console.log('pathNameえす');
    console.log('pathNameえす');
    console.log('pathNameえす');
    console.log('pathNameえす');
    console.log('pathNameえす');
    console.log('pathNameえす');
    console.log('pathNameえす');

    console.log(pathname);

    // /api/auth/login は認可対象外
    if (pathname.startsWith('/api/auth/login') || !pathname.startsWith('/api/')) {
        console.log('認可対象外');

        return NextResponse.next();
    }

    // cookie から JWT を取得
    const token = request.cookies.get(SESSION_COOKIE_NAME)?.value ?? null;

    // JWT の検証 + DB でユーザー存在確認
    const userId = await authorizeRequest(token);

    // 認証失敗時は 403 を返す
    if (!userId) {
        return NextResponse.json(
            {
                code: 'FORBIDDEN',
                message: 'あなたにはこの操作を行う権限がありません。再度ログインしてください。',
                status: 403,
            },
            { status: 403 },
        );
    }

    // 認証成功時は次の route に userId を渡す
    const response = NextResponse.next();
    console.log('成功');
    response.headers.set('x-user-id', String(userId));

    return response;
}

export const config = {
    matcher: ['/api/:path*'],
};
