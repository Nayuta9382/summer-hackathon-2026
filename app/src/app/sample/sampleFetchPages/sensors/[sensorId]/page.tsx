// app/sample/sampleFetchPages/sensors/[sensorId]/page.tsx
'use client';

import { useSensor } from '@/app/hooks/sensors/useSensor';
import { useParams, useRouter } from 'next/navigation';

export default function SensorDetailPage() {
    const params = useParams();
    const router = useRouter();
    const sensorId = Number(params.sensorId);

    const { sensor, isLoading, error } = useSensor(sensorId);

    if (isLoading) return <p>読み込み中...</p>;
    if (error) return <p>{error}</p>;
    if (!sensor) return <p>センサーが見つかりません</p>;

    return (
        <div>
            <h1>{sensor.sensorName}</h1>

            <p>ステータス: {sensor.status}</p>
            <p>有効: {sensor.isEnabled ? 'はい' : 'いいえ'}</p>
            <p>URL: {sensor.url ?? '未設定'}</p>
            <p>作成日: {new Date(sensor.createdAt).toLocaleString()}</p>

            <h2>タグ</h2>
            <ul>
                {sensor.tags.map((tag) => (
                    <li key={tag.tagId}>{tag.tagName}</li>
                ))}
            </ul>

            <h2>検知日時(未読)</h2>
            <ul>
                {sensor.unreadDetectedAts.map((d, i) => (
                    <li key={i}>{new Date(d).toLocaleString()}</li>
                ))}
            </ul>

            <h2>検知日時(既読)</h2>
            <ul>
                {sensor.readDetectedAts.map((d, i) => (
                    <li key={i}>{new Date(d).toLocaleString()}</li>
                ))}
            </ul>

            <button onClick={() => router.push('/sample/sampleFetchPages/sensors')}>一覧に戻る</button>
        </div>
    );
}
