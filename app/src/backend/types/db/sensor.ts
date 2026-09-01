export type Sensor = {
    sensorId: number;
    userId: number;
    sensorName: string;
    url: string | null;
    isEnabled: boolean;
    delFlag: boolean;
    createdAt: Date;
    updatedAt: Date;
};
