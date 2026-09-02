// app/sample/sampleFetchPages/sensors/[sensorId]/edit/page.tsx
'use client';

import { useRouter, useParams } from 'next/navigation';
import { GetSensorResponse } from '@/backend/types/response/sensor/getSensorResponse';
import { TagResponse } from '@/backend/types/response/tag/tagResponse';
import { useState } from 'react';
import { useSensor } from '@/app/hooks/sensors/useSensor';
import { useTags } from '@/app/hooks/tags/useTags';
import { useUpdateSensor } from '@/app/hooks/sensors/useUpdateSensor';

export default function EditSensorPage() {
    const router = useRouter();
    const params = useParams();
    const sensorId = Number(params.sensorId);

    const { sensor, isLoading: isLoadingSensor, error: sensorError } = useSensor(sensorId);
    const { tags, isLoading: isLoadingTags, error: tagsError } = useTags();

    if (isLoadingSensor || isLoadingTags) return <p>読み込み中...</p>;
    if (sensorError) return <p>{sensorError}</p>;
    if (tagsError) return <p>{tagsError}</p>;
    if (!sensor) return <p>センサーが見つかりません</p>;

    return <SensorEditForm sensor={sensor} allTags={tags} onCancel={() => router.push('/sample/sampleFetchPages/sensors')} />;
}

function SensorEditForm({ sensor, allTags, onCancel }: { sensor: GetSensorResponse; allTags: TagResponse[]; onCancel: () => void }) {
    const router = useRouter();
    const { updateSensor, isUpdating, error: updateError } = useUpdateSensor();

    const [sensorName, setSensorName] = useState(sensor.sensorName);
    const [url, setUrl] = useState(sensor.url ?? '');
    const [selectedTagIds, setSelectedTagIds] = useState<number[]>(sensor.tags.map((tag) => tag.tagId));

    const toggleTag = (tagId: number) => {
        setSelectedTagIds((prev) => (prev.includes(tagId) ? prev.filter((id) => id !== tagId) : [...prev, tagId]));
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        const result = await updateSensor(sensor.sensorId, {
            sensorName,
            url,
            tagIds: selectedTagIds,
        });

        if (result) {
            router.push('/sample/sampleFetchPages/sensors/getSensors');
        }
    };

    return (
        <div>
            <h1>センサー編集</h1>

            <form onSubmit={handleSubmit}>
                <div>
                    <label htmlFor="sensorName">センサー名</label>
                    <input id="sensorName" type="text" value={sensorName} onChange={(e) => setSensorName(e.target.value)} maxLength={100} required />
                </div>

                <div>
                    <label htmlFor="url">URL</label>
                    <input id="url" type="text" value={url} onChange={(e) => setUrl(e.target.value)} required />
                </div>

                <div>
                    <p>タグ</p>
                    {allTags.map((tag) => (
                        <label key={tag.tagId} style={{ display: 'block' }}>
                            <input type="checkbox" checked={selectedTagIds.includes(tag.tagId)} onChange={() => toggleTag(tag.tagId)} />
                            {tag.tagName}
                        </label>
                    ))}
                </div>

                <button type="submit" disabled={isUpdating}>
                    {isUpdating ? '保存中...' : '保存'}
                </button>
                <button type="button" onClick={onCancel}>
                    キャンセル
                </button>
            </form>

            {updateError && <p style={{ color: 'red' }}>{updateError}</p>}
        </div>
    );
}
