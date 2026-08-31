import { handleApiError } from '@/backend/errors/errors';
import { addSensor } from '@/backend/services/sensorService';

// センサーを登録する処理
export async function POST(request: Request) {
    try {
        // ユーザIDを取得する
        const userId = 1;

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
