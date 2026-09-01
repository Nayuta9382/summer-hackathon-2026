// センサーAPIから取得するレスポンスの型
export type SensorApiResponse = {
    motion: boolean;
    lastUpdate: string; // ISO8601形式の日時文字列
    connected: boolean;
    portName: string;
};
