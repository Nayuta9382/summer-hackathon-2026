import type { GetSensorResponse } from '@/backend/types/response/sensor/getSensorResponse';
import type { TagResponse } from '@/backend/types/response/tag/tagResponse';
import type { SensorStatus } from '@/backend/types/sensorStatus';
import type { Tag as SensorTag } from '@/app/mocks/sensors';

export interface NotificationEntry {
    id: string;
    sensorId: number;
    sensorName: string;
    sensorUrl: string | null;
    sensorStatus: SensorStatus;
    isEnabled: boolean;
    time: string;
    date: string;
    confirmed: boolean;
    tagIds: number[];
}

function formatDetectedAt(date: Date): { time: string; date: string } {
    const y = date.getFullYear();
    const m = String(date.getMonth() + 1).padStart(2, '0');
    const d = String(date.getDate()).padStart(2, '0');
    const hh = String(date.getHours()).padStart(2, '0');
    const mm = String(date.getMinutes()).padStart(2, '0');
    return { time: `${y}-${m}-${d} ${hh}:${mm}`, date: `${y}-${m}-${d}` };
}

// 全センサーの検知履歴(read/unread)を1つの時系列リストに集約する
export function buildNotifications(sensors: GetSensorResponse[]): NotificationEntry[] {
    const list: NotificationEntry[] = [];

    sensors.forEach((s) => {
        const tagIds = s.tags.map((t) => t.tagId);

        const pushEntry = (rawDate: Date, confirmed: boolean) => {
            const date = new Date(rawDate);
            const { time, date: dateStr } = formatDetectedAt(date);
            list.push({
                id: `${s.sensorId}-${date.getTime()}-${confirmed ? 'read' : 'unread'}`,
                sensorId: s.sensorId,
                sensorName: s.sensorName,
                sensorUrl: s.url,
                sensorStatus: s.status,
                isEnabled: s.isEnabled,
                time,
                date: dateStr,
                confirmed,
                tagIds,
            });
        };

        s.readDetectedAts.forEach((d) => pushEntry(d, true));
        s.unreadDetectedAts.forEach((d) => pushEntry(d, false));
    });

    return list.sort((a, b) => b.time.localeCompare(a.time));
}

export function buildTagMap(tags: TagResponse[]): Record<string, SensorTag> {
    return Object.fromEntries(tags.map((t) => [String(t.tagId), { id: String(t.tagId), name: t.tagName, color: t.colorCode }]));
}
