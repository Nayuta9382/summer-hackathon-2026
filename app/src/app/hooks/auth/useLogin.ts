// app/hooks/auth/useLogin.ts
import { LoginRequest } from '@/backend/types/request/auth/LoginRequest';
import { useState, useCallback } from 'react';

type LoginData = { userId: number; userName: string };

type UseLoginResult = {
    login: (params: LoginRequest) => Promise<{ user: LoginData | null; status: number }>;
    isLoading: boolean;
    error: string | null;
};

// ログイン処理を行うフック
export function useLogin(): UseLoginResult {
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const [error, setError] = useState<string | null>(null);

    const login = useCallback(async (params: LoginRequest): Promise<{ user: LoginData | null; status: number }> => {
        setIsLoading(true);
        setError(null);

        try {
            const res = await fetch('/api/auth/login', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                credentials: 'include',
                body: JSON.stringify(params),
            });

            const json = await res.json();
            console.log(json);

            if (!res.ok) {
                setError('ログインに失敗しました');
                return { user: null, status: res.status };
            }

            return { user: json as LoginData, status: res.status };
        } catch (err) {
            setError(err instanceof Error ? err.message : 'ログインに失敗しました');
            return { user: null, status: 500 };
        } finally {
            setIsLoading(false);
        }
    }, []);

    return { login, isLoading, error };
}
