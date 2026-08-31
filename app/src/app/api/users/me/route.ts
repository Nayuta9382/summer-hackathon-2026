import { handleApiError } from '@/backend/errors/errors';
import { getUserById } from '@/backend/services/usersService';
import { UsersResponse } from '@/backend/types/response/users/usersResponse';

// ログイン中ユーザーの情報を取得する API
export async function GET() {
    try {
        // 今は仮のユーザー ID を使っている
        const userId = 1;

        // サービス層で DB から取得したユーザー情報を API レスポンス形式に変換
        const userResponse: UsersResponse = await getUserById(userId);

        return Response.json(userResponse);
    } catch (err) {
        return handleApiError(err);
    }
}
