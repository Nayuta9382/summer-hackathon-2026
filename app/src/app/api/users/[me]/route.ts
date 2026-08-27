import { handleApiError } from '@/backend/errors';
import { getUserById } from '@/backend/services/usersService';
import { UsersResponse } from '@/backend/types/response/users/usersResponse';

export async function GET(req: Request) {
    try {
        const userId = '11111111-1111-1111-1111-111111111111';

        const userResponse: UsersResponse = await getUserById(userId);

        return Response.json(userResponse);
    } catch (err) {
        return handleApiError(err);
    }
}
