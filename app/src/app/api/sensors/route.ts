import { handleApiError } from '@/backend/errors/errors';
import { AUTH_ERROR_RESPONSE, getUserIdFromRequest } from '@/backend/auth/authService';
import { addSensor, getSensors } from '@/backend/services/sensorService';

// センサー一覧を取得する処理
export async function GET(request: Request) {
    try {
        // proxyが認証後に設定したユーザーIDを取得する
        const userId = getUserIdFromRequest(request);

        if (!userId) {
            return Response.json(AUTH_ERROR_RESPONSE, { status: AUTH_ERROR_RESPONSE.status });
        }

        // ユーザーに紐づくセンサー一覧をサービス層で取得する
        const sensorsResponse = await getSensors(userId);

        return Response.json({ data: sensorsResponse }, { status: 200 });
    } catch (error) {
        return handleApiError(error);
    }
}

// センサーを登録する処理
export async function POST(request: Request) {
    try {
        // proxyが認証後に設定したユーザーIDを取得する
        const userId = getUserIdFromRequest(request);

        if (!userId) {
            return Response.json(AUTH_ERROR_RESPONSE, { status: AUTH_ERROR_RESPONSE.status });
        }

        // リクエストbodyを取得する
        // JSONリクエストを読み取り、サービス層へ渡す
        const body = await request.json();

        // センサー登録とタグ紐付けをサービス層で実行する
        const sensorResponse = await addSensor(userId, body);

        return Response.json({ data: sensorResponse }, { status: 201 });
    } catch (error) {
        return handleApiError(error);
    }
}
