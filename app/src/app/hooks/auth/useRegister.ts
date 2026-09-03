// hooks/auth/useRegister.ts
import { useState, useCallback } from 'react';

type RegisterUser = { userId: number; userName: string };

type UseRegisterResult = {
    register: (userName: string, password: string) => Promise<{ user: RegisterUser | null; status: number; error: string | null }>;
    isRegistering: boolean;
};

export function useRegister(): UseRegisterResult {
    const [isRegistering, setIsRegistering] = useState(false);

    const register = useCallback(async (userName: string, password: string): Promise<{ user: RegisterUser | null; status: number; error: string | null }> => {
        setIsRegistering(true);
        try {
            const res = await fetch('/api/auth/register', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                credentials: 'include',
                body: JSON.stringify({ userName, password }),
            });
            const json = await res.json();

            if (!res.ok) {
                return { user: null, status: res.status, error: json.error ?? '登録に失敗しました' };
            }

            return { user: json.data as RegisterUser, status: res.status, error: null };
        } catch (err) {
            return { user: null, status: 500, error: err instanceof Error ? err.message : '登録に失敗しました' };
        } finally {
            setIsRegistering(false);
        }
    }, []);

    return { register, isRegistering };
}
