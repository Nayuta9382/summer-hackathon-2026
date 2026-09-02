// app/sample/sampleFetchPages/tags/updateTag/[tagId]/page.tsx
'use client';

import { useRouter, useParams } from 'next/navigation';
import { TagResponse } from '@/backend/types/response/tag/tagResponse';
import { useState } from 'react';
import { useTags } from '@/app/hooks/tags/useTags';
import { useUpdateTag } from '@/app/hooks/tags/useUpdateTag';

export default function EditTagPage() {
    const router = useRouter();
    const params = useParams();
    const tagId = Number(params.tagId);
    console.log(tagId);

    const { tags, isLoading, error } = useTags();

    console.log(tags);
    if (isLoading) return <p>読み込み中...</p>;
    if (error) return <p>{error}</p>;

    const target = tags.find((tag) => tag.tagId === tagId);
    if (!target) return <p>タグが見つかりません</p>;

    return <TagEditForm tag={target} onCancel={() => router.push('/sample/sampleFetchPages/tags')} />;
}

function TagEditForm({ tag, onCancel }: { tag: TagResponse; onCancel: () => void }) {
    const router = useRouter();
    const { updateTag, isUpdating, error: updateError } = useUpdateTag();

    const [tagName, setTagName] = useState(tag.tagName);
    const [colorCode, setColorCode] = useState(tag.colorCode);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        const result = await updateTag(tag.tagId, { tagName, colorCode });

        if (result) {
            router.push('/sample/sampleFetchPages/tags/');
        }
    };

    return (
        <div>
            <h1>タグ編集</h1>

            <form onSubmit={handleSubmit}>
                <div>
                    <label htmlFor="tagName">タグ名</label>
                    <input id="tagName" type="text" value={tagName} onChange={(e) => setTagName(e.target.value)} maxLength={100} required />
                </div>

                <div>
                    <label htmlFor="colorCode">カラーコード</label>
                    <input id="colorCode" type="color" value={colorCode} onChange={(e) => setColorCode(e.target.value)} />
                    <input type="text" value={colorCode} onChange={(e) => setColorCode(e.target.value)} placeholder="#FF0000" />
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
