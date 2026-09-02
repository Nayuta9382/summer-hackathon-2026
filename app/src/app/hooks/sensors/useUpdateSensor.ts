// hooks/useUpdateSensor.ts
import { useState, useCallback } from 'react';
import { GetSensorResponse } from '@/backend/types/response/sensor/getSensorResponse';
import { UpdateSensorRequest } from '@/backend/types/request/sensor/updateSensorRequest';

type UseUpdateSensorResult = {
    updateSensor: (sensorId: number, request: UpdateSensorRequest) => Promise<GetSensorResponse | null>;
    isUpdating: boolean;
    error: string | null;
};

// センサー情報を更新するフック
export function useUpdateSensor(): UseUpdateSensorResult {
    const [isUpdating, setIsUpdating] = useState<boolean>(false);
    const [error, setError] = useState<string | null>(null);

    const updateSensor = useCallback(async (sensorId: number, request: UpdateSensorRequest): Promise<GetSensorResponse | null> => {
        setIsUpdating(true);
        setError(null);

        try {
            const res = await fetch(`/api/sensors/${sensorId}`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                credentials: 'include',
                body: JSON.stringify(request),
            });

            if (!res.ok) {
                throw new Error('センサーの更新に失敗しました');
            }

            const json = await res.json();
            return json.data as GetSensorResponse;
        } catch (err) {
            setError(err instanceof Error ? err.message : 'センサーの更新に失敗しました');
            return null;
        } finally {
            setIsUpdating(false);
        }
    }, []);

    return { updateSensor, isUpdating, error };
}
