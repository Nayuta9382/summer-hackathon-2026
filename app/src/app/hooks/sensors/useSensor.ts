// hooks/useSensor.ts
import { useState, useEffect, useCallback } from 'react';
import { GetSensorResponse } from '@/backend/types/response/sensor/getSensorResponse';

type UseSensorResult = {
    sensor: GetSensorResponse | null;
    isLoading: boolean;
    error: string | null;
    refetch: () => void;
};

// センサーIDを指定して単一のセンサー情報を取得するフック
export function useSensor(sensorId: number): UseSensorResult {
    const [sensor, setSensor] = useState<GetSensorResponse | null>(null);
    const [isLoading, setIsLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);

    const fetchSensor = useCallback(async () => {
        setIsLoading(true);
        setError(null);

        try {
            const res = await fetch(`/api/sensors/${sensorId}`, {
                credentials: 'include',
            });

            if (!res.ok) {
                throw new Error('センサー情報の取得に失敗しました');
            }

            const json = await res.json();
            setSensor(json.data as GetSensorResponse);
        } catch (err) {
            setError(err instanceof Error ? err.message : 'センサー情報の取得に失敗しました');
        } finally {
            setIsLoading(false);
        }
    }, [sensorId]);

    useEffect(() => {
        queueMicrotask(() => {
            fetchSensor();
        });
    }, [fetchSensor]);

    return { sensor, isLoading, error, refetch: fetchSensor };
}
