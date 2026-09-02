// hooks/useMe.ts
import { UsersResponse } from '@/backend/types/response/users/usersResponse';
import { useState, useEffect, useCallback } from 'react';

type UseMeResult = {
    user: UsersResponse | null;
    isLoading: boolean;
    error: string | null;
    refetch: () => void;
};

// 自分自身のユーザー情報を取得するフック
export function useUser(): UseMeResult {
    const [user, setUser] = useState<UsersResponse | null>(null);
    const [isLoading, setIsLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);

    const fetchMe = useCallback(async () => {
        setIsLoading(true);
        setError(null);

        try {
            const res = await fetch('/api/users/me');

            if (!res.ok) {
                throw new Error('ユーザー情報の取得に失敗しました');
            }

            const json = await res.json();

            setUser(json as UsersResponse);
        } catch (err) {
            setError(err instanceof Error ? err.message : 'ユーザー情報の取得に失敗しました');
        } finally {
            setIsLoading(false);
        }
    }, []);

    useEffect(() => {
        queueMicrotask(() => {
            fetchMe();
        });
    }, [fetchMe]);

    return { user, isLoading, error, refetch: fetchMe };
}
