import type { Sensor, Tag } from '@/app/mocks/sensors';
import { sensors, tags } from '@/app/mocks/sensors';

export interface NotificationItem {
    id: string;
    sensorId: string;
    sensorName: string;
    sensorIp: string;
    sensorStatus: Sensor['status'];
    time: string;
    date: string;
    detail: string;
    confirmed: boolean;
    tagIds: string[];
}

/** 全センサーの検知履歴を1つの時系列リストに集約する */
export function buildNotifications(): NotificationItem[] {
    const list: NotificationItem[] = [];
    sensors.forEach((s) => {
        s.history.forEach((d) => {
            list.push({
                id: d.id,
                sensorId: s.id,
                sensorName: s.name,
                sensorIp: s.ip,
                sensorStatus: s.status,
                time: d.time,
                date: d.time.slice(0, 10),
                detail: d.detail,
                confirmed: d.confirmed,
                tagIds: s.tagIds,
            });
        });
    });
    return list.sort((a, b) => b.time.localeCompare(a.time));
}

export function buildTagMap(): Record<string, Tag> {
    return Object.fromEntries(tags.map((t) => [t.id, t]));
}
