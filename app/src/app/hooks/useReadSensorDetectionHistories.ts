// hooks/useReadSensorDetectionHistories.ts
import { useState, useCallback } from 'react';
import { SensorDetectionHistory } from '@/backend/types/db/sensorDetectionHistory';

type UseReadSensorDetectionHistoriesResult = {
    readSensorDetectionHistories: (sensorId: number) => Promise<{ histories: SensorDetectionHistory[] | null; status: number }>;
    isReading: boolean;
    error: string | null;
};

// センサーの未読検知履歴を既読にするフック
export function useReadSensorDetectionHistories(): UseReadSensorDetectionHistoriesResult {
    const [isReading, setIsReading] = useState<boolean>(false);
    const [error, setError] = useState<string | null>(null);

    const readSensorDetectionHistories = useCallback(async (sensorId: number): Promise<{ histories: SensorDetectionHistory[] | null; status: number }> => {
        setIsReading(true);
        setError(null);

        try {
            const res = await fetch(`/api/sensors/${sensorId}/read`, {
                method: 'PUT',
                credentials: 'include',
            });

            const json = await res.json();

            if (!res.ok) {
                setError('既読処理に失敗しました');
                return { histories: null, status: res.status };
            }

            return { histories: json.data as SensorDetectionHistory[], status: res.status };
        } catch (err) {
            setError(err instanceof Error ? err.message : '既読処理に失敗しました');
            return { histories: null, status: 500 };
        } finally {
            setIsReading(false);
        }
    }, []);

    return { readSensorDetectionHistories, isReading, error };
}
