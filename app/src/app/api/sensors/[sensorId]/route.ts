import { handleApiError } from '@/backend/errors/errors';
import { editSensor, getSensorById } from '@/backend/services/sensorService';
import { UpdateSensorRequestSchema } from '@/backend/types/request/sensor/updateSensorRequest';

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

// センサーIDを指定してセンサー情報（名前・URL・タグ）を編集する
export async function PUT(request: Request, { params }: { params: Promise<{ sensorId: string }> }) {
    try {
        const { sensorId } = await params;

        const rawBody = await request.json();
        const body = UpdateSensorRequestSchema.parse(rawBody);

        const sensorResponse = await editSensor(Number(sensorId), body);

        return Response.json({ data: sensorResponse }, { status: 200 });
    } catch (error) {
        return handleApiError(error);
    }
}
