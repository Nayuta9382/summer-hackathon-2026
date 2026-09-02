// hooks/useCreateSensor.ts
import { useState, useCallback } from 'react';
import { SensorRequest } from '@/backend/types/request/sensor/SensorRequest';
import { SensorResponse } from '@/backend/types/response/sensor/sensorResponse';

type UseCreateSensorResult = {
    createSensor: (request: SensorRequest) => Promise<{ sensor: SensorResponse | null; status: number }>;
    isCreating: boolean;
    error: string | null;
};

// センサーを新規登録するフック
export function useCreateSensor(): UseCreateSensorResult {
    const [isCreating, setIsCreating] = useState<boolean>(false);
    const [error, setError] = useState<string | null>(null);

    const createSensor = useCallback(async (request: SensorRequest): Promise<{ sensor: SensorResponse | null; status: number }> => {
        setIsCreating(true);
        setError(null);

        try {
            const res = await fetch('/api/sensors', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                credentials: 'include',
                body: JSON.stringify(request),
            });

            const json = await res.json();
            console.log(json);

            if (!res.ok) {
                setError('センサーの登録に失敗しました');
                return { sensor: null, status: res.status };
            }

            return { sensor: json.data as SensorResponse, status: res.status };
        } catch (err) {
            setError(err instanceof Error ? err.message : 'センサーの登録に失敗しました');
            return { sensor: null, status: 500 };
        } finally {
            setIsCreating(false);
        }
    }, []);

    return { createSensor, isCreating, error };
}
