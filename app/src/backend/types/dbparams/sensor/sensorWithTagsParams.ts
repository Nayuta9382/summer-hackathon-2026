// sensors と tags(sensor_tags経由)をJOINした結果の1行分
// 1センサーに紐づくタグが複数あるため、戻り値はタグの数だけ行が返る
export type SensorWithTagsParams = {
    sensorId: number;
    sensorName: string;
    url: string | null;
    isEnabled: boolean;
    createdAt: Date;

    // tags テーブル分（タグ未設定の場合は null）
    tagId: number | null;
    tagName: string | null;
};
