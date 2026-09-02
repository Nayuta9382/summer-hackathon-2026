'use client';

import { useTags } from '@/app/hooks/tags/useTags';

export default function TagListPage() {
    const { tags, isLoading, error } = useTags();

    if (isLoading) return <p>読み込み中...</p>;
    if (error) return <p>{error}</p>;

    return (
        <div>
            <ul>{tags && tags.map((tag) => <li key={tag.tagId}>{tag.tagName}</li>)}</ul>
        </div>
    );
}
