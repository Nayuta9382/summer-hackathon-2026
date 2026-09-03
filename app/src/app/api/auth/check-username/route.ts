import { handleApiError } from '@/backend/errors/errors';
import { checkUserNameAvailable } from '@/backend/services/usersService';

export async function GET(request: Request) {
    try {
        const { searchParams } = new URL(request.url);
        const userName = searchParams.get('userName');

        if (!userName) {
            return Response.json({ error: 'userName is required' }, { status: 400 });
        }

        const available = await checkUserNameAvailable(userName);

        return Response.json({ available });
    } catch (err) {
        return handleApiError(err);
    }
}
