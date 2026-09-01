// 未読の検知から何ms以内なら「検知中」とみなすかの閾値
export const SENSOR_DETECTION_ACTIVE_THRESHOLD_MS = Number(process.env.SENSOR_DETECTION_ACTIVE_THRESHOLD_MS ?? 300000);
