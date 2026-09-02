// app/tags/create/page.tsx
'use client';

import { useCreateTag } from '@/app/hooks/tags/useCreateTag';
import { useState } from 'react';

export default function CreateTagPage() {
    const { createTag, isCreating, error } = useCreateTag();

    const [tagName, setTagName] = useState('');
    const [colorCode, setColorCode] = useState('#000000');
    const [successMessage, setSuccessMessage] = useState<string | null>(null);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setSuccessMessage(null);

        const { tag } = await createTag({ tagName, colorCode });

        if (tag) {
            setSuccessMessage(`タグ「${tag.tagName}」を作成しました`);
            setTagName('');
            setColorCode('#000000');
        }
    };

    return (
        <div>
            <h1>タグ新規作成</h1>

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

                <button type="submit" disabled={isCreating}>
                    {isCreating ? '作成中...' : '作成する'}
                </button>
            </form>

            {error && <p style={{ color: 'red' }}>{error}</p>}
            {successMessage && <p style={{ color: 'green' }}>{successMessage}</p>}
        </div>
    );
}
