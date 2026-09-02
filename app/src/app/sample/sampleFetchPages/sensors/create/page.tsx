// app/sample/sampleFetchPages/sensors/create/page.tsx
'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useTags } from '@/app/hooks/tags/useTags';
import { useCreateSensor } from '@/app/hooks/sensors/useCreateSensor';

export default function CreateSensorPage() {
    const router = useRouter();
    const { tags, isLoading: isLoadingTags, error: tagsError } = useTags();
    const { createSensor, isCreating, error: createError } = useCreateSensor();

    const [sensorName, setSensorName] = useState('');
    const [url, setUrl] = useState('');
    const [selectedTagIds, setSelectedTagIds] = useState<number[]>([]);

    const toggleTag = (tagId: number) => {
        setSelectedTagIds((prev) => (prev.includes(tagId) ? prev.filter((id) => id !== tagId) : [...prev, tagId]));
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        const result = await createSensor({
            sensor: { sensorName, url },
            tag: { tagId: selectedTagIds },
        });

        if (result) {
            // router.push("/sample/sampleFetchPages/sensors");
        }
    };

    if (isLoadingTags) return <p>読み込み中...</p>;
    if (tagsError) return <p>{tagsError}</p>;

    return (
        <div>
            <h1>センサー新規登録</h1>

            <form onSubmit={handleSubmit}>
                <div>
                    <label htmlFor="sensorName">センサー名</label>
                    <input id="sensorName" type="text" value={sensorName} onChange={(e) => setSensorName(e.target.value)} maxLength={100} required />
                </div>

                <div>
                    <label htmlFor="url">URL</label>
                    <input id="url" type="text" value={url} onChange={(e) => setUrl(e.target.value)} />
                </div>

                <div>
                    <p>タグ</p>
                    {tags.map((tag) => (
                        <label key={tag.tagId} style={{ display: 'block' }}>
                            <input type="checkbox" checked={selectedTagIds.includes(tag.tagId)} onChange={() => toggleTag(tag.tagId)} />
                            {tag.tagName}
                        </label>
                    ))}
                </div>

                <button type="submit" disabled={isCreating}>
                    {isCreating ? '登録中...' : '登録する'}
                </button>
            </form>

            {createError && <p style={{ color: 'red' }}>{createError}</p>}
        </div>
    );
}
