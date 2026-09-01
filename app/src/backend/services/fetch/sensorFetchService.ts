import { SENSOR_BATCH_TIMEOUT_MS } from '@/backend/config/batchConfig';
import { SensorApiResponse } from '@/backend/types/SensorApiResponse';

// 外部センサーAPIから最新データを取得する
export async function fetchSensorData() {
    const res = await fetch(process.env.SENSOR_API_URL!);
    if (!res.ok) {
        throw new Error(`センサーAPI取得失敗: ${res.status}`);
    }
    const data = await res.json();
}

export const sensorFetchService = {
    fetchSensorData,
};

// センサーのURLにリクエストを投げ、反応しているか確認する
export async function checkSensor(url: string): Promise<SensorApiResponse | null> {
    try {
        const res = await fetch(url, { signal: AbortSignal.timeout(SENSOR_BATCH_TIMEOUT_MS) });

        const json = (await res.json()) as SensorApiResponse;
        return json;
    } catch (error) {
        console.error(`センサーへのリクエストに失敗しました: url=${url}`, error);
        return null;
    }
}
