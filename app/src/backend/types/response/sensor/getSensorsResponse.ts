import { SensorStatus } from '../../sensorStatus';

export type DetectionEntry = {
    detectionId: number;
    detectedAt: Date;
};

export type GetSensorResponse = {
    sensorId: number;
    sensorName: string;
    url: string | null;
    isEnabled: boolean;
    createdAt: Date;
    tags: {
        tagId: number;
        tagName: string;
    }[];
    readDetectedAts: Date[];
    unreadDetectedAts: Date[];
    // 追加: detectionId込みの詳細データ(一覧取得でのみ埋める)
    readDetections?: DetectionEntry[];
    unreadDetections?: DetectionEntry[];
    status: SensorStatus;
};
