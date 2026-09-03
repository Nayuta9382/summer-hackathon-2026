import type { Tag as SensorTag } from '@/app/mocks/sensors';
import NotificationItem from './NotificationItem';
import type { NotificationEntry } from '../notificationsData';

interface Props {
    items: NotificationEntry[];
    tagMap: Record<string, SensorTag>;
    onOpen: (sensorId: number) => void;
    onConfirm: (detectionId: number) => void;
    confirmingDetectionId: number | null;
}

/** 日付ラベルに整形する */
function formatDate(dateStr: string): string {
    const d = new Date(`${dateStr}T00:00:00`);
    const today = new Date();
    const yesterday = new Date();
    yesterday.setDate(today.getDate() - 1);

    const sameDay = (a: Date, b: Date) => a.getFullYear() === b.getFullYear() && a.getMonth() === b.getMonth() && a.getDate() === b.getDate();

    if (sameDay(d, today)) return '今日';
    if (sameDay(d, yesterday)) return '昨日';

    const y = d.getFullYear();
    const m = d.getMonth() + 1;
    const day = d.getDate();
    return `${y}年${m}月${day}日`;
}

export default function NotificationTimeline({ items, tagMap, onOpen, onConfirm, confirmingDetectionId }: Props) {
    if (items.length === 0) {
        return (
            <div className="flex flex-col items-center justify-center py-16 text-center px-4">
                <span className="flex items-center justify-center w-16 h-16 rounded-full bg-background-100 text-foreground-300">
                    <i className="ri-notification-off-line text-3xl" />
                </span>
                <p className="mt-4 font-heading font-bold text-foreground-700">該当する通知がありません</p>
                <p className="mt-1 text-sm text-foreground-500">絞り込み条件を変更するか、センサーが検知するとここに表示されます</p>
            </div>
        );
    }

    // 日付ごとにグループ化(items は時系列降順で渡される)
    const groups: { date: string; items: NotificationEntry[] }[] = [];
    items.forEach((item) => {
        const last = groups[groups.length - 1];
        if (last && last.date === item.date) {
            last.items.push(item);
        } else {
            groups.push({ date: item.date, items: [item] });
        }
    });

    return (
        <div className="space-y-6">
            {groups.map((group) => (
                <section key={group.date}>
                    <div className="flex items-center gap-2.5 mb-3">
                        <span className="flex items-center justify-center w-7 h-7 rounded-lg bg-primary-100 text-primary-700 shrink-0">
                            <i className="ri-calendar-line text-sm" />
                        </span>
                        <h3 className="font-heading font-extrabold text-[15px] text-foreground-900">{formatDate(group.date)}</h3>
                        <span className="text-xs font-label font-bold text-foreground-400">{group.items.length}件</span>
                        <span className="flex-1 h-px bg-background-200" />
                    </div>

                    <div className="space-y-2.5">
                        {group.items.map((item) => (
                            <NotificationItem key={item.id} item={item} tagMap={tagMap} onOpen={onOpen} onConfirm={onConfirm} isConfirming={confirmingDetectionId === item.detectionId} />
                        ))}
                    </div>
                </section>
            ))}
        </div>
    );
}
