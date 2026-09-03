// hooks/useSensors.ts
import { useState, useEffect, useCallback, useRef } from 'react';
import { GetSensorResponse } from '@/backend/types/response/sensor/getSensorsResponse';

type UseSensorsResult = {
    sensors: GetSensorResponse[];
    status: number | null;
    isLoading: boolean;
    error: string | null;
    refetch: () => void;
};

const POLLING_INTERVAL_MS = 1000; // 1秒ごとに再取得

// センサー一覧を取得するフック
export function useSensors(): UseSensorsResult {
    const [sensors, setSensors] = useState<GetSensorResponse[]>([]);
    const [status, setStatus] = useState<number | null>(null);
    const [isLoading, setIsLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);
    const isFirstFetch = useRef(true);

    const fetchSensors = useCallback(async () => {
        // 初回のみローディング表示(ポーリング時のチラつき防止)
        if (isFirstFetch.current) {
            setIsLoading(true);
        }
        setError(null);

        try {
            const res = await fetch('/api/sensors', {
                credentials: 'include',
            });

            const json = await res.json();
            setStatus(res.status);

            if (!res.ok) {
                setError('センサー一覧の取得に失敗しました');
                setSensors([]);
                return;
            }
            console.log(json);

            setSensors(json.data as GetSensorResponse[]);
        } catch (err) {
            setError(err instanceof Error ? err.message : 'センサー一覧の取得に失敗しました');
        } finally {
            setIsLoading(false);
            isFirstFetch.current = false;
        }
    }, []);

    useEffect(() => {
        queueMicrotask(() => {
            fetchSensors();
        });

        const timer = setInterval(() => {
            fetchSensors();
        }, POLLING_INTERVAL_MS);

        return () => clearInterval(timer);
    }, [fetchSensors]);

    return { sensors, status, isLoading, error, refetch: fetchSensors };
}
