export type Sensor = {
    sensorId: number;
    userId: number;
    sensorName: string;
    ipAddress: string | null;
    isEnabled: boolean;
    delFlag: boolean;
    createdAt: Date;
    updatedAt: Date;
};
