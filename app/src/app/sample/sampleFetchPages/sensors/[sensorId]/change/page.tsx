// app/sample/sampleFetchPages/sensors/page.tsx
'use client';

import { useSensors } from '@/app/hooks/sensors/useSensors';
import { useToggleSensorEnabled } from '@/app/hooks/sensors/useToggleSensorEnabled';
import Link from 'next/link';

export default function SensorListPage() {
    const { sensors, isLoading, error, refetch } = useSensors();
    const { toggleSensorEnabled, isToggling, error: toggleError } = useToggleSensorEnabled();

    const handleToggle = async (sensorId: number) => {
        const result = await toggleSensorEnabled(sensorId);

        if (result) {
            refetch(); // 一覧を最新化
        }
    };

    if (isLoading) return <p>読み込み中...</p>;
    if (error) return <p>{error}</p>;

    return (
        <div>
            <h1>センサー一覧</h1>

            {toggleError && <p style={{ color: 'red' }}>{toggleError}</p>}

            <ul>
                {sensors.map((sensor) => (
                    <li key={sensor.sensorId} style={{ marginBottom: '8px' }}>
                        <Link href={`/sample/sampleFetchPages/sensors/${sensor.sensorId}`}>{sensor.sensorName}</Link> <span>{sensor.isEnabled ? '有効' : '無効'}</span>{' '}
                        <button onClick={() => handleToggle(sensor.sensorId)} disabled={isToggling}>
                            {sensor.isEnabled ? '無効にする' : '有効にする'}
                        </button>
                    </li>
                ))}
            </ul>
        </div>
    );
}
