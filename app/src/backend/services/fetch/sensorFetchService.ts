// 外部センサーAPIから最新データを取得する
export async function fetchSensorData() {
    const res = await fetch(process.env.SENSOR_API_URL!);
    if (!res.ok) {
        throw new Error(`センサーAPI取得失敗: ${res.status}`);
    }
    const data = await res.json();
    console.log('取得データ:', data);
}

export const sensorFetchService = {
    fetchSensorData,
};
