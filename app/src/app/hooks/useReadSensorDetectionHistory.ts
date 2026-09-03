// hooks/useReadSensorDetectionHistory.ts
import { useState, useCallback } from 'react';
import { SensorDetectionHistory } from '@/backend/types/db/sensorDetectionHistory';

type UseReadSensorDetectionHistoryResult = {
    readSensorDetectionHistory: (detectionId: number) => Promise<{ history: SensorDetectionHistory | null; status: number }>;
    isReading: boolean;
    error: string | null;
};

// 検知履歴を1件だけ既読にするフック
export function useReadSensorDetectionHistory(): UseReadSensorDetectionHistoryResult {
    const [isReading, setIsReading] = useState<boolean>(false);
    const [error, setError] = useState<string | null>(null);

    const readSensorDetectionHistory = useCallback(async (detectionId: number): Promise<{ history: SensorDetectionHistory | null; status: number }> => {
        setIsReading(true);
        setError(null);

        try {
            const res = await fetch(`/api/detections/${detectionId}/read`, {
                method: 'PUT',
                credentials: 'include',
            });

            const json = await res.json();

            if (!res.ok) {
                setError('既読処理に失敗しました');
                return { history: null, status: res.status };
            }

            return { history: json.data as SensorDetectionHistory | null, status: res.status };
        } catch (err) {
            setError(err instanceof Error ? err.message : '既読処理に失敗しました');
            return { history: null, status: 500 };
        } finally {
            setIsReading(false);
        }
    }, []);

    return { readSensorDetectionHistory, isReading, error };
}
