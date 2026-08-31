import type { Tag as SensorTag } from '@/app/mocks/sensors';
import Tag from '@/components/base/Tag';
import { StatusIcon } from '@/app/pages/dashboard/SensorCardParts';
import type { NotificationItem } from '../notificationsData';
import type { Sensor } from '@/app/mocks/sensors';

interface Props {
    item: NotificationItem;
    tagMap: Record<string, SensorTag>;
    onOpen: (sensorId: string) => void;
}

export default function NotificationItem({ item, tagMap, onOpen }: Props) {
    const isUnconfirmed = !item.confirmed;
    const tone = isUnconfirmed ? 'border-amber-200 bg-amber-50/50 hover:border-amber-300' : 'border-background-200 bg-background-50 hover:border-background-300';

    return (
        <button
            type="button"
            onClick={() => onOpen(item.sensorId)}
            className={`group flex w-full flex-col sm:flex-row sm:items-center gap-3 sm:gap-4 border rounded-xl p-3.5 md:p-4 text-left transition-colors duration-150 cursor-pointer animate-slide-in ${tone}`}
        >
            <StatusIcon
                sensor={
                    {
                        id: item.sensorId,
                        name: item.sensorName,
                        ip: item.sensorIp,
                        tagIds: item.tagIds,
                        status: item.sensorStatus,
                        lastDetectedAt: item.time,
                        history: [],
                        addedAt: '',
                    } as Sensor
                }
            />

            <div className="min-w-0 flex-1">
                <div className="flex items-center gap-2 flex-wrap">
                    <p className="font-heading font-extrabold text-foreground-950 truncate">{item.sensorName}</p>
                    {isUnconfirmed ? (
                        <span className="inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-xs font-extrabold font-label bg-secondary-100 text-secondary-800 whitespace-nowrap">
                            <i className="ri-notification-badge-fill" />
                            未確認
                        </span>
                    ) : (
                        <span className="inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-xs font-extrabold font-label bg-emerald-100 text-emerald-700 whitespace-nowrap">
                            <i className="ri-check-double-line" />
                            確認済み
                        </span>
                    )}
                </div>
                <p className="mt-1 text-sm text-foreground-700">{item.detail}</p>
                <div className="mt-2 flex items-center gap-2 flex-wrap">
                    <span className="inline-flex items-center gap-1 text-xs text-foreground-600 font-medium whitespace-nowrap">
                        <i className="ri-time-line" />
                        {item.time}
                    </span>
                    {item.tagIds.map((id) => {
                        const t = tagMap[id];
                        return t ? <Tag key={id} name={t.name} color={t.color} size="sm" /> : null;
                    })}
                </div>
            </div>

            <span className="flex items-center gap-1 text-xs font-label font-bold text-foreground-400 shrink-0 transition-colors group-hover:text-primary-600 sm:ml-2">
                詳細を見る
                <i className="ri-arrow-right-s-line text-base" />
            </span>
        </button>
    );
}
