// hooks/useNotificationProviders.ts
import { useState, useEffect, useCallback } from 'react';

type NotificationProvidersResponse = {
    slack: boolean;
    line: boolean;
};

type UseNotificationProvidersResult = {
    providers: NotificationProvidersResponse | null;
    status: number | null;
    isLoading: boolean;
    error: string | null;
    refetch: () => void;
};

// 認証済みユーザーに有効な通知プロバイダーが登録されているかどうかを取得するフック
export function useNotificationProviders(): UseNotificationProvidersResult {
    const [providers, setProviders] = useState<NotificationProvidersResponse | null>(null);
    const [status, setStatus] = useState<number | null>(null);
    const [isLoading, setIsLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);

    const fetchNotificationProviders = useCallback(async () => {
        setIsLoading(true);
        setError(null);

        try {
            const res = await fetch('/api/notification-providers', {
                credentials: 'include',
            });
            console.log('aaaaaa');

            const json = await res.json();
            setStatus(res.status);

            if (!res.ok) {
                setError('通知プロバイダー情報の取得に失敗しました');
                setProviders(null);
                return;
            }

            setProviders(json as NotificationProvidersResponse);
        } catch (err) {
            setError(err instanceof Error ? err.message : '通知プロバイダー情報の取得に失敗しました');
        } finally {
            setIsLoading(false);
        }
    }, []);

    useEffect(() => {
        queueMicrotask(() => {
            fetchNotificationProviders();
        });
    }, [fetchNotificationProviders]);

    return { providers, status, isLoading, error, refetch: fetchNotificationProviders };
}
