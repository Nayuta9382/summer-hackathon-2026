// hooks/auth/useCheckUserName.ts
import { useState, useCallback } from 'react';

type UseCheckUserNameResult = {
    checkUserName: (userName: string) => Promise<{ available: boolean | null; status: number }>;
    isChecking: boolean;
};

export function useCheckUserName(): UseCheckUserNameResult {
    const [isChecking, setIsChecking] = useState(false);

    const checkUserName = useCallback(async (userName: string): Promise<{ available: boolean | null; status: number }> => {
        setIsChecking(true);
        try {
            const res = await fetch(`/api/auth/check-username?userName=${encodeURIComponent(userName)}`, {
                credentials: 'include',
            });
            const json = await res.json();

            if (!res.ok) {
                return { available: null, status: res.status };
            }

            return { available: json.available as boolean, status: res.status };
        } catch {
            return { available: null, status: 500 };
        } finally {
            setIsChecking(false);
        }
    }, []);

    return { checkUserName, isChecking };
}
