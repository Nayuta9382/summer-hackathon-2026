import { SensorStatus } from '../../sensorStatus';

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
    status: SensorStatus;
};
