// hooks/useUpdateSensor.ts
import { useState, useCallback } from 'react';
import { GetSensorResponse } from '@/backend/types/response/sensor/getSensorResponse';
import { UpdateSensorRequest } from '@/backend/types/request/sensor/updateSensorRequest';

type UseUpdateSensorResult = {
    updateSensor: (sensorId: number, request: UpdateSensorRequest) => Promise<{ sensor: GetSensorResponse | null; status: number }>;
    isUpdating: boolean;
    error: string | null;
};

// センサー情報を更新するフック
export function useUpdateSensor(): UseUpdateSensorResult {
    const [isUpdating, setIsUpdating] = useState<boolean>(false);
    const [error, setError] = useState<string | null>(null);

    const updateSensor = useCallback(async (sensorId: number, request: UpdateSensorRequest): Promise<{ sensor: GetSensorResponse | null; status: number }> => {
        setIsUpdating(true);
        setError(null);

        try {
            const res = await fetch(`/api/sensors/${sensorId}`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                credentials: 'include',
                body: JSON.stringify(request),
            });

            const json = await res.json();

            if (!res.ok) {
                setError('センサーの更新に失敗しました');
                return { sensor: null, status: res.status };
            }

            return { sensor: json.data as GetSensorResponse, status: res.status };
        } catch (err) {
            setError(err instanceof Error ? err.message : 'センサーの更新に失敗しました');
            return { sensor: null, status: 500 };
        } finally {
            setIsUpdating(false);
        }
    }, []);

    return { updateSensor, isUpdating, error };
}
