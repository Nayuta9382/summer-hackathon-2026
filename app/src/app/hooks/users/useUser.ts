// hooks/useUpdateTag.ts
import { useState, useCallback } from 'react';
import { TagResponse } from '@/backend/types/response/tag/tagResponse';
import { UpdateTagRequest } from '@/backend/types/request/tag/updateTagRequest';

type UseUpdateTagResult = {
    updateTag: (tagId: number, request: UpdateTagRequest) => Promise<{ tag: TagResponse | null; status: number }>;
    isUpdating: boolean;
    error: string | null;
};

// タグを更新するフック
export function useUpdateTag(): UseUpdateTagResult {
    const [isUpdating, setIsUpdating] = useState<boolean>(false);
    const [error, setError] = useState<string | null>(null);

    const updateTag = useCallback(async (tagId: number, request: UpdateTagRequest): Promise<{ tag: TagResponse | null; status: number }> => {
        setIsUpdating(true);
        setError(null);

        try {
            const res = await fetch(`/api/tags/${tagId}`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                credentials: 'include',
                body: JSON.stringify(request),
            });

            const json = await res.json();

            if (!res.ok) {
                setError('タグの更新に失敗しました');
                return { tag: null, status: res.status };
            }

            return { tag: json.data as TagResponse, status: res.status };
        } catch (err) {
            setError(err instanceof Error ? err.message : 'タグの更新に失敗しました');
            return { tag: null, status: 500 };
        } finally {
            setIsUpdating(false);
        }
    }, []);

    return { updateTag, isUpdating, error };
}
