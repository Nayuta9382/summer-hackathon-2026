import { handleApiError } from '@/backend/errors/errors';
import { getUserById } from '@/backend/services/usersService';
import { UsersResponse } from '@/backend/types/response/users/usersResponse';

export async function GET(request: Request) {
    try {
        // middleware がセットした userId を取得
        const userIdHeader = request.headers.get('x-user-id');
        console.log('userIdHeader:', userIdHeader);
        const userId = Number(userIdHeader);

        // 認証済みユーザーの情報を取得
        const userResponse: UsersResponse = await getUserById(userId);

        return Response.json(userResponse);
    } catch (err) {
        return handleApiError(err);
    }
}
