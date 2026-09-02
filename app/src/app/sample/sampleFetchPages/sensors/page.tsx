// app/sample/sampleFetchPages/sensors/page.tsx
'use client';

import { useSensors } from '@/app/hooks/sensors/useSensors';
import Link from 'next/link';

export default function SensorListPage() {
    const { sensors, isLoading, error } = useSensors();

    if (isLoading) return <p>読み込み中...</p>;
    if (error) return <p>{error}</p>;

    return (
        <div>
            <h1>センサー一覧</h1>

            <ul>
                {sensors.map((sensor) => (
                    <li key={sensor.sensorId} style={{ marginBottom: '8px' }}>
                        <Link href={`/sample/sampleFetchPages/sensors/${sensor.sensorId}`}>{sensor.sensorName}</Link> <span>({sensor.status})</span> <span>{sensor.isEnabled ? '有効' : '無効'}</span>{' '}
                        {sensor.tags.length > 0 && <span>タグ: {sensor.tags.map((t) => t.tagName).join(', ')}</span>} <span>未読: {sensor.unreadDetectedAts.length}件</span>
                    </li>
                ))}
            </ul>
        </div>
    );
}
