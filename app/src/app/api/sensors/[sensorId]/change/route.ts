import { handleApiError } from '@/backend/errors/errors';
import { toggleSensor } from '@/backend/services/sensorService';

// センサーの有効/無効を切り替える
export async function PUT(request: Request, { params }: { params: Promise<{ sensorId: string }> }) {
    try {
        const { sensorId } = await params;

        const sensorResponse = await toggleSensor(Number(sensorId));

        return Response.json({ data: sensorResponse }, { status: 200 });
    } catch (error) {
        return handleApiError(error);
    }
}
