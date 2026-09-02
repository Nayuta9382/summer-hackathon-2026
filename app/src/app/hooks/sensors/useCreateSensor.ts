// hooks/useCreateSensor.ts
import { useState, useCallback } from 'react';
import { GetSensorResponse } from '@/backend/types/response/sensor/getSensorResponse';
import { SensorRequest } from '@/backend/types/request/sensor/SensorRequest';
import { SensorResponse } from '@/backend/types/response/sensor/sensorResponse';

type UseCreateSensorResult = {
    createSensor: (request: SensorRequest) => Promise<SensorResponse | null>;
    isCreating: boolean;
    error: string | null;
};

// センサーを新規登録するフック
export function useCreateSensor(): UseCreateSensorResult {
    const [isCreating, setIsCreating] = useState<boolean>(false);
    const [error, setError] = useState<string | null>(null);

    const createSensor = useCallback(async (request: SensorRequest): Promise<SensorResponse | null> => {
        setIsCreating(true);
        setError(null);

        try {
            const res = await fetch('/api/sensors', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(request),
            });

            if (!res.ok) {
                throw new Error('センサーの登録に失敗しました');
            }

            const json = await res.json();
            console.log(json);

            return json.data as SensorResponse;
        } catch (err) {
            setError(err instanceof Error ? err.message : 'センサーの登録に失敗しました');
            return null;
        } finally {
            setIsCreating(false);
        }
    }, []);

    return { createSensor, isCreating, error };
}
