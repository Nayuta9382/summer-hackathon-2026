import { useState, useCallback } from 'react';
import { TagResponse } from '@/backend/types/response/tag/tagResponse';
import { AddTagRequest } from '@/backend/types/request/tag/TagRequest';

type UseCreateTagResult = {
    createTag: (request: AddTagRequest) => Promise<TagResponse | null>;
    isCreating: boolean;
    error: string | null;
};

// タグを新規作成するフック
export function useCreateTag(): UseCreateTagResult {
    const [isCreating, setIsCreating] = useState<boolean>(false);
    const [error, setError] = useState<string | null>(null);

    const createTag = useCallback(async (request: AddTagRequest): Promise<TagResponse | null> => {
        setIsCreating(true);
        setError(null);

        try {
            const res = await fetch('/api/tags', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(request),
            });

            if (!res.ok) {
                throw new Error('タグの作成に失敗しました');
            }

            const json = await res.json();
            console.log(json.data);
            return json as TagResponse;
        } catch (err) {
            setError(err instanceof Error ? err.message : 'タグの作成に失敗しました');
            return null;
        } finally {
            setIsCreating(false);
        }
    }, []);

    return { createTag, isCreating, error };
}
