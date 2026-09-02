// hooks/useCreateTag.ts
import { useState, useCallback } from 'react';
import { TagResponse } from '@/backend/types/response/tag/tagResponse';
import { AddTagRequest } from '@/backend/types/request/tag/TagRequest';

type UseCreateTagResult = {
    createTag: (request: AddTagRequest) => Promise<{ tag: TagResponse | null; status: number }>;
    isCreating: boolean;
    error: string | null;
};

// タグを新規作成するフック
export function useCreateTag(): UseCreateTagResult {
    const [isCreating, setIsCreating] = useState<boolean>(false);
    const [error, setError] = useState<string | null>(null);

    const createTag = useCallback(async (request: AddTagRequest): Promise<{ tag: TagResponse | null; status: number }> => {
        setIsCreating(true);
        setError(null);

        try {
            const res = await fetch('/api/tags', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                credentials: 'include',
                body: JSON.stringify(request),
            });

            const json = await res.json();
            console.log(json.data);

            if (!res.ok) {
                setError('タグの作成に失敗しました');
                return { tag: null, status: res.status };
            }

            return { tag: json.data as TagResponse, status: res.status };
        } catch (err) {
            setError(err instanceof Error ? err.message : 'タグの作成に失敗しました');
            return { tag: null, status: 500 };
        } finally {
            setIsCreating(false);
        }
    }, []);

    return { createTag, isCreating, error };
}
