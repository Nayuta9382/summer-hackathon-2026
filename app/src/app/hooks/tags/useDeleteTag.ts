// hooks/useDeleteTag.ts
import { useState, useCallback } from 'react';
import { TagResponse } from '@/backend/types/response/tag/tagResponse';

type UseDeleteTagResult = {
    deleteTag: (tagId: number) => Promise<TagResponse | null>;
    isDeleting: boolean;
    error: string | null;
};

// タグを削除するフック
export function useDeleteTag(): UseDeleteTagResult {
    const [isDeleting, setIsDeleting] = useState<boolean>(false);
    const [error, setError] = useState<string | null>(null);

    const deleteTag = useCallback(async (tagId: number): Promise<TagResponse | null> => {
        setIsDeleting(true);
        setError(null);

        try {
            const res = await fetch(`/api/tags/${tagId}`, {
                method: 'DELETE',
             credentials: 'include',
            });

            if (!res.ok) {
                throw new Error('タグの削除に失敗しました');
            }

            const json = await res.json();
            return json.data as TagResponse;
        } catch (err) {
            setError(err instanceof Error ? err.message : 'タグの削除に失敗しました');
            return null;
        } finally {
            setIsDeleting(false);
        }
    }, []);

    return { deleteTag, isDeleting, error };
}
