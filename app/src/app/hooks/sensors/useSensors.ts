// hooks/useSensors.ts
import { useState, useEffect, useCallback } from 'react';
import { GetSensorResponse } from '@/backend/types/response/sensor/getSensorResponse';

type UseSensorsResult = {
    sensors: GetSensorResponse[];
    isLoading: boolean;
    error: string | null;
    refetch: () => void;
};

// センサー一覧を取得するフック
export function useSensors(): UseSensorsResult {
    const [sensors, setSensors] = useState<GetSensorResponse[]>([]);
    const [isLoading, setIsLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);

    const fetchSensors = useCallback(async () => {
        setIsLoading(true);
        setError(null);

        try {
            const res = await fetch('/api/sensors');

            if (!res.ok) {
                throw new Error('センサー一覧の取得に失敗しました');
            }

            const json = await res.json();
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

    return { sensors, isLoading, error, refetch: fetchSensors };
}
