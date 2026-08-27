import { handleApiError } from '@/backend/errors/errors';
import { getUserById } from '@/backend/services/usersService';
import { UsersResponse } from '@/backend/types/response/users/usersResponse';

export async function GET(req: Request) {
    try {
        const userId = 1;

        const userResponse: UsersResponse = await getUserById(userId);

        return Response.json(userResponse);
    } catch (err) {
        return handleApiError(err);
    }
}
