// hooks/useSensor.ts
import { useState, useEffect, useCallback, useRef } from 'react';
import { GetSensorResponse } from '@/backend/types/response/sensor/getSensorResponse';

type UseSensorResult = {
    sensor: GetSensorResponse | null;
    status: number | null;
    isLoading: boolean;
    error: string | null;
    refetch: () => void;
};

const POLLING_INTERVAL_MS = 1000; // 1秒ごとに再取得

// センサーIDを指定して単一のセンサー情報を取得するフック
export function useSensor(sensorId: number): UseSensorResult {
    const [sensor, setSensor] = useState<GetSensorResponse | null>(null);
    const [status, setStatus] = useState<number | null>(null);
    const [isLoading, setIsLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);
    const isFirstFetch = useRef(true);

    const fetchSensor = useCallback(async () => {
        // 初回のみローディング表示(ポーリング時のチラつき防止)
        if (isFirstFetch.current) {
            setIsLoading(true);
        }
        setError(null);

        try {
            const res = await fetch(`/api/sensors/${sensorId}`, {
                credentials: 'include',
                cache: 'no-store',
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
            isFirstFetch.current = false;
        }
    }, [sensorId]);

    useEffect(() => {
        isFirstFetch.current = true;

        queueMicrotask(() => {
            fetchSensor();
        });

        const timer = setInterval(() => {
            fetchSensor();
        }, POLLING_INTERVAL_MS);

        return () => clearInterval(timer);
    }, [fetchSensor]);

    return { sensor, status, isLoading, error, refetch: fetchSensor };
}
