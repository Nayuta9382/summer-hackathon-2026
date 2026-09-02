// hooks/useSensor.ts
import { useState, useEffect, useCallback } from 'react';
import { GetSensorResponse } from '@/backend/types/response/sensor/getSensorResponse';

type UseSensorResult = {
    sensor: GetSensorResponse | null;
    status: number | null;
    isLoading: boolean;
    error: string | null;
    refetch: () => void;
};

// センサーIDを指定して単一のセンサー情報を取得するフック
export function useSensor(sensorId: number): UseSensorResult {
    const [sensor, setSensor] = useState<GetSensorResponse | null>(null);
    const [status, setStatus] = useState<number | null>(null);
    const [isLoading, setIsLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);

    const fetchSensor = useCallback(async () => {
        setIsLoading(true);
        setError(null);

        try {
            const res = await fetch(`/api/sensors/${sensorId}`, {
                credentials: 'include',
            });

            const json = await res.json();
            setStatus(res.status);

            if (!res.ok) {
                setError('センサー情報の取得に失敗しました');
                setSensor(null);
                return;
            }

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

    return { sensor, status, isLoading, error, refetch: fetchSensor };
}
