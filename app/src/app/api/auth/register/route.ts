import { handleApiError } from '@/backend/errors/errors';
import { registerUser } from '@/backend/services/usersService';

export async function POST(request: Request) {
    try {
        const body = await request.json();
        const { userName, password } = body;

        if (typeof userName !== 'string' || typeof password !== 'string') {
            return Response.json({ error: 'invalid request body' }, { status: 400 });
        }

        const user = await registerUser(userName, password);

        return Response.json({ data: { userId: user.userId, userName: user.userName } }, { status: 201 });
    } catch (err) {
        return handleApiError(err);
    }
}
