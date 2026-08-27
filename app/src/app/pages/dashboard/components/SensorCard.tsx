import type { Sensor, Tag as SensorTag } from '@/app/mocks/sensors';
import Button from '@/components/base/Button';
import Tag from '@/components/base/Tag';
import StatusBadge from '@/components/base/StatusBadge';
import { StatusIcon } from '../SensorCardParts';

interface Props {
    sensor: Sensor;
    tagMap: Record<string, SensorTag>;
    onToggle: (sensor: Sensor) => void;
    onOpen: (sensor: Sensor) => void;
}

export default function SensorCard({ sensor, tagMap, onToggle, onOpen }: Props) {
    const latest = sensor.history[0];
    const isDisabled = sensor.status === 'disabled';

    return (
        <div
            className={`flex flex-col lg:flex-row lg:items-center gap-4 bg-background-50 border rounded-xl p-4 md:p-5 transition-colors duration-150 ${
                isDisabled ? 'border-background-200 opacity-80' : 'border-background-200 hover:border-primary-200 cursor-pointer'
            }`}
            onClick={isDisabled ? undefined : () => onOpen(sensor)}
        >
            <div className="flex items-center gap-3 lg:w-[280px] shrink-0">
                <StatusIcon sensor={sensor} />
                <div className="min-w-0">
                    <p className="font-heading font-extrabold text-[15px] text-foreground-950 truncate">{sensor.name}</p>
                    <p className="mt-0.5 text-xs text-foreground-500 font-mono">{sensor.ip}</p>
                </div>
            </div>

            <div className="flex items-center gap-2 flex-wrap lg:w-[120px] shrink-0">
                <StatusBadge status={sensor.status} pulse={sensor.status === 'detecting' || sensor.status === 'unconfirmed'} />
            </div>

            <div className="flex items-center gap-1.5 flex-wrap flex-1 min-w-0">
                {sensor.tagIds.length === 0 ? (
                    <span className="text-xs text-foreground-400">タグなし</span>
                ) : (
                    sensor.tagIds.map((id) => {
                        const t = tagMap[id];
                        return t ? <Tag key={id} name={t.name} color={t.color} size="sm" /> : null;
                    })
                )}
            </div>

            <div className="flex items-center gap-2 text-xs text-foreground-600 lg:w-[150px] shrink-0 whitespace-nowrap">
                <i className="ri-time-line text-foreground-400" />
                <span className="truncate">{latest ? latest.time : '履歴なし'}</span>
            </div>

            <div className="lg:w-[120px] shrink-0 flex justify-end">
                {isDisabled ? (
                    <Button variant="primary" size="sm" onClick={() => onToggle(sensor)}>
                        <i className="ri-play-circle-line" />
                        有効化
                    </Button>
                ) : (
                    <Button
                        variant="outline"
                        size="sm"
                        onClick={(e) => {
                            e.stopPropagation();
                            onToggle(sensor);
                        }}
                    >
                        <i className="ri-pause-circle-line" />
                        無効化
                    </Button>
                )}
            </div>
        </div>
    );
}
