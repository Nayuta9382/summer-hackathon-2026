export type UpdateSensorResponse = {
    sensorId: number;
    sensorName: string;
    url: string | null;
    isEnabled: boolean;
    createdAt: Date;
    tags: {
        tagId: number;
        tagName: string;
    }[];
};
