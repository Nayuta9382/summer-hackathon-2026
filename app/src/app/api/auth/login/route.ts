// app/api/login/route.ts
import { handleLogin } from '@/backend/auth/authService';

// ログイン処理を行う
export async function POST(req: Request) {
    const result = await handleLogin(await req.json());

    if (!result.ok) {
        return Response.json({ error: result.error }, { status: result.status });
    }

    return Response.json({ userId: result.userId, userName: result.userName });
}
