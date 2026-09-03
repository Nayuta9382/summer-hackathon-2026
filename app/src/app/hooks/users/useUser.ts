// hooks/useMe.ts
import { UsersResponse } from '@/backend/types/response/users/usersResponse';
import { useState, useEffect, useCallback } from 'react';

type UseMeResult = {
    user: UsersResponse | null;
    status: number | null;
    isLoading: boolean;
    error: string | null;
    refetch: () => void;
};

// 自分自身のユーザー情報を取得するフック
export function useUser(): UseMeResult {
    const [user, setUser] = useState<UsersResponse | null>(null);
    const [status, setStatus] = useState<number | null>(null);
    const [isLoading, setIsLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);

    const fetchMe = useCallback(async () => {
        setIsLoading(true);
        setError(null);

        try {
            const res = await fetch('/api/users/me', {
                credentials: 'include',
            });

            const json = await res.json();
            setStatus(res.status);

            if (!res.ok) {
                setError('ユーザー情報の取得に失敗しました');
                setUser(null);
                return;
            }

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

    return { user, status, isLoading, error, refetch: fetchMe };
}
