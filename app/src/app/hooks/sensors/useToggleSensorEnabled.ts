// hooks/useToggleSensorEnabled.ts
import { ToggleSensorResponse } from '@/backend/types/response/sensor/toggleSensorResponse';
import { useState, useCallback } from 'react';

type UseToggleSensorEnabledResult = {
    toggleSensorEnabled: (sensorId: number) => Promise<{ sensor: ToggleSensorResponse | null; status: number }>;
    isToggling: boolean;
    error: string | null;
};

// センサーの有効/無効を切り替えるフック
export function useToggleSensorEnabled(): UseToggleSensorEnabledResult {
    const [isToggling, setIsToggling] = useState<boolean>(false);
    const [error, setError] = useState<string | null>(null);

    const toggleSensorEnabled = useCallback(async (sensorId: number): Promise<{ sensor: ToggleSensorResponse | null; status: number }> => {
        setIsToggling(true);
        setError(null);

        try {
            const res = await fetch(`/api/sensors/${sensorId}/change`, {
                method: 'PUT',
                credentials: 'include',
            });

            const json = await res.json();

            if (!res.ok) {
                setError(res.status === 404 ? 'センサーが見つかりません' : '切り替えに失敗しました');
                return { sensor: null, status: res.status };
            }

            return { sensor: json.data as ToggleSensorResponse, status: res.status };
        } catch (err) {
            setError(err instanceof Error ? err.message : '切り替えに失敗しました');
            return { sensor: null, status: 500 };
        } finally {
            setIsToggling(false);
        }
    }, []);

    return { toggleSensorEnabled, isToggling, error };
}
