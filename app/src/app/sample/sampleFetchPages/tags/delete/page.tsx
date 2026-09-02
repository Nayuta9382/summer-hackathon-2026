// app/tags/page.tsx
'use client';

import { useDeleteTag } from '@/app/hooks/tags/useDeleteTag';
import { useTags } from '@/app/hooks/tags/useTags';
import Link from 'next/link';

export default function TagListPage() {
    const { tags, isLoading, error, refetch } = useTags();
    const { deleteTag, isDeleting, error: deleteError } = useDeleteTag();

    const handleDelete = async (tagId: number) => {
        const ok = window.confirm('このタグを削除しますか?');
        if (!ok) return;

        const result = await deleteTag(tagId);

        if (result) {
            refetch();
        }
    };

    if (isLoading) return <p>読み込み中...</p>;
    if (error) return <p>{error}</p>;

    return (
        <div>
            <h1>タグ一覧</h1>

            {deleteError && <p style={{ color: 'red' }}>{deleteError}</p>}

            <ul>
                {tags.map((tag) => (
                    <li key={tag.tagId} style={{ marginBottom: '8px' }}>
                        <span
                            style={{
                                display: 'inline-block',
                                width: '12px',
                                height: '12px',
                                backgroundColor: tag.colorCode,
                                marginRight: '6px',
                            }}
                        />
                        {tag.tagName}
                        <Link href={`/tags/${tag.tagId}/edit`}>
                            <button>編集</button>
                        </Link>
                        <button onClick={() => handleDelete(tag.tagId)} disabled={isDeleting}>
                            {isDeleting ? '削除中...' : '削除'}
                        </button>
                    </li>
                ))}
            </ul>
        </div>
    );
}
