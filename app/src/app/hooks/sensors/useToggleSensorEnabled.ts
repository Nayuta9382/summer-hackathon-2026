import { ToggleSensorResponse } from '@/backend/types/response/sensor/toggleSensorResponse';
import { useState, useCallback } from 'react';

type UseToggleSensorEnabledResult = {
    toggleSensorEnabled: (sensorId: number) => Promise<ToggleSensorResponse | null>;
    isToggling: boolean;
    error: string | null;
};

// センサーの有効/無効を切り替えるフック
export function useToggleSensorEnabled(): UseToggleSensorEnabledResult {
    const [isToggling, setIsToggling] = useState<boolean>(false);
    const [error, setError] = useState<string | null>(null);

    const toggleSensorEnabled = useCallback(async (sensorId: number): Promise<ToggleSensorResponse | null> => {
        setIsToggling(true);
        setError(null);

        try {
            const res = await fetch(`/api/sensors/${sensorId}/change`, {
                method: 'PUT',
                credentials: 'include',
            });

            if (!res.ok) {
                if (res.status === 404) {
                    throw new Error('センサーが見つかりません');
                }
                throw new Error('切り替えに失敗しました');
            }

            const json = await res.json();
            return json.data as ToggleSensorResponse;
        } catch (err) {
            setError(err instanceof Error ? err.message : '切り替えに失敗しました');
            return null;
        } finally {
            setIsToggling(false);
        }
    }, []);

    return { toggleSensorEnabled, isToggling, error };
}
