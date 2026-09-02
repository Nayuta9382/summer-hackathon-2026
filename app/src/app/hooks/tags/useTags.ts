import { useState, useEffect, useCallback } from 'react';
import { TagResponse } from '@/backend/types/response/tag/tagResponse';

type UseTagsResult = {
    tags: TagResponse[];
    isLoading: boolean;
    error: string | null;
    refetch: () => void;
};

// タグ一覧を取得するフック
export function useTags(): UseTagsResult {
    const [tags, setTags] = useState<TagResponse[]>([]);
    const [isLoading, setIsLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);

    const fetchTags = useCallback(async () => {
        setIsLoading(true);
        setError(null);

        try {
            const res = await fetch('/api/tags/me', {
                credentials: 'include',
            });

            if (!res.ok) {
                throw new Error('タグ一覧の取得に失敗しました');
            }

            const json = await res.json();

            setTags(json as TagResponse[]);
        } catch (err) {
            setError(err instanceof Error ? err.message : 'タグ一覧の取得に失敗しました');
        } finally {
            setIsLoading(false);
        }
    }, []);

    useEffect(() => {
        queueMicrotask(() => {
            fetchTags();
        });
    }, [fetchTags]);

    return { tags, isLoading, error, refetch: fetchTags };
}
