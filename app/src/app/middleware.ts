const PUBLIC_PATHS = ['/api/auth/login'];

export async function middleware(request: NextRequest) {
    const { pathname } = request.nextUrl;

    // ログインAPIは認証対象外
    if (PUBLIC_PATHS.includes(pathname)) {
        return NextResponse.next();
    }

    const payload = await verifyToken(request.cookies.get('token')?.value ?? '');
}
