import type { Tag as SensorTag } from '@/app/mocks/sensors';
import Tag from '@/components/base/Tag';
import StatusIcon from './StatusIcon';
import type { NotificationEntry } from '../notificationsData';

interface Props {
    item: NotificationEntry;
    tagMap: Record<string, SensorTag>;
    onOpen: (sensorId: number) => void;
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
            <StatusIcon status={item.sensorStatus} isEnabled={item.isEnabled} />

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
                <p className="mt-1 text-sm text-foreground-700">検知しました</p>
                <div className="mt-2 flex items-center gap-2 flex-wrap">
                    <span className="inline-flex items-center gap-1 text-xs text-foreground-600 font-medium whitespace-nowrap">
                        <i className="ri-time-line" />
                        {item.time}
                    </span>
                    {item.tagIds.map((id) => {
                        const t = tagMap[String(id)];
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
