import { handleApiError } from '@/backend/errors/errors';
import { getSensorById } from '@/backend/services/sensorService';

// センサーIDを指定してセンサー情報を取得する
export async function GET(request: Request, { params }: { params: Promise<{ sensorId: string }> }) {
    try {
        const { sensorId } = await params;

        const sensorResponse = await getSensorById(Number(sensorId));

        return Response.json({ data: sensorResponse }, { status: 200 });
    } catch (error) {
        return handleApiError(error);
    }
}
