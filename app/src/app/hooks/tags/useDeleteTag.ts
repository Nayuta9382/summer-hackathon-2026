// hooks/useDeleteTag.ts
import { useState, useCallback } from 'react';
import { TagResponse } from '@/backend/types/response/tag/tagResponse';

type UseDeleteTagResult = {
    deleteTag: (tagId: number) => Promise<{ tag: TagResponse | null; status: number }>;
    isDeleting: boolean;
    error: string | null;
};

// タグを削除するフック
export function useDeleteTag(): UseDeleteTagResult {
    const [isDeleting, setIsDeleting] = useState<boolean>(false);
    const [error, setError] = useState<string | null>(null);

    const deleteTag = useCallback(async (tagId: number): Promise<{ tag: TagResponse | null; status: number }> => {
        setIsDeleting(true);
        setError(null);

        try {
            const res = await fetch(`/api/tags/${tagId}`, {
                method: 'DELETE',
                credentials: 'include',
            });

            const json = await res.json();

            if (!res.ok) {
                setError('タグの削除に失敗しました');
                return { tag: null, status: res.status };
            }

            return { tag: json.data as TagResponse, status: res.status };
        } catch (err) {
            setError(err instanceof Error ? err.message : 'タグの削除に失敗しました');
            return { tag: null, status: 500 };
        } finally {
            setIsDeleting(false);
        }
    }, []);

    return { deleteTag, isDeleting, error };
}
