// app/api/sensors/[sensorId]/read/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { readSensorDetectionHistories } from '@/backend/services/SensorDetectionHistoryService';

// 通知を既読にする
export async function PUT(request: NextRequest, { params }: { params: Promise<{ sensorId: string }> }) {
    const { sensorId } = await params;
    const sensorIdNum = Number(sensorId);

    if (Number.isNaN(sensorIdNum)) {
        return NextResponse.json({ error: 'invalid sensorId' }, { status: 400 });
    }

    try {
        const histories = await readSensorDetectionHistories(sensorIdNum);

        return NextResponse.json({ data: histories }, { status: 200 });
    } catch (err) {
        console.error(err);
        return NextResponse.json({ error: 'failed to mark as read' }, { status: 500 });
    }
}
