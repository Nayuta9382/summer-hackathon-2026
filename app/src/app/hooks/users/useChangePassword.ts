// hooks/useChangePassword.ts
import { useState, useCallback } from 'react';

type UseChangePasswordResult = {
    changePassword: (currentPassword: string, newPassword: string) => Promise<{ success: boolean; status: number }>;
    isChanging: boolean;
    error: string | null;
};

// パスワードを変更するフック
export function useChangePassword(): UseChangePasswordResult {
    const [isChanging, setIsChanging] = useState<boolean>(false);
    const [error, setError] = useState<string | null>(null);

    const changePassword = useCallback(async (currentPassword: string, newPassword: string): Promise<{ success: boolean; status: number }> => {
        setIsChanging(true);
        setError(null);

        try {
            const res = await fetch('/api/users/me', {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                credentials: 'include',
                body: JSON.stringify({ currentPassword, newPassword }),
            });

            const json = await res.json();

            if (!res.ok) {
                setError(json.error ?? 'パスワードの変更に失敗しました');
                return { success: false, status: res.status };
            }

            return { success: true, status: res.status };
        } catch (err) {
            setError(err instanceof Error ? err.message : 'パスワードの変更に失敗しました');
            return { success: false, status: 500 };
        } finally {
            setIsChanging(false);
        }
    }, []);

    return { changePassword, isChanging, error };
}
