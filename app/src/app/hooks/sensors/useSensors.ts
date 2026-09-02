// hooks/useSensors.ts
import { useState, useEffect, useCallback } from 'react';
import { GetSensorResponse } from '@/backend/types/response/sensor/getSensorResponse';

type UseSensorsResult = {
    sensors: GetSensorResponse[];
    status: number | null;
    isLoading: boolean;
    error: string | null;
    refetch: () => void;
};

// センサー一覧を取得するフック
export function useSensors(): UseSensorsResult {
    const [sensors, setSensors] = useState<GetSensorResponse[]>([]);
    const [status, setStatus] = useState<number | null>(null);
    const [isLoading, setIsLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);

    const fetchSensors = useCallback(async () => {
        setIsLoading(true);
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

            setSensors(json.data as GetSensorResponse[]);
        } catch (err) {
            setError(err instanceof Error ? err.message : 'センサー一覧の取得に失敗しました');
        } finally {
            setIsLoading(false);
        }
    }, []);

    useEffect(() => {
        queueMicrotask(() => {
            fetchSensors();
        });
    }, [fetchSensors]);

    return { sensors, status, isLoading, error, refetch: fetchSensors };
}
