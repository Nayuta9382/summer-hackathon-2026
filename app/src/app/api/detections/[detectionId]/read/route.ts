// app/api/detections/[detectionId]/read/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { readSensorDetectionHistoryById } from '@/backend/services/SensorDetectionHistoryService';

// 通知を既読にする(1件)
export async function PUT(request: NextRequest, { params }: { params: Promise<{ detectionId: string }> }) {
    const { detectionId } = await params;
    const detectionIdNum = Number(detectionId);

    if (Number.isNaN(detectionIdNum)) {
        return NextResponse.json({ error: 'invalid detectionId' }, { status: 400 });
    }

    try {
        const history = await readSensorDetectionHistoryById(detectionIdNum);

        return NextResponse.json({ data: history }, { status: 200 });
    } catch (err) {
        console.error(err);
        return NextResponse.json({ error: 'failed to mark as read' }, { status: 500 });
    }
}
