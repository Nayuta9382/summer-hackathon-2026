import type { Tag as SensorTag } from '@/app/mocks/sensors';
import type { GetSensorResponse } from '@/backend/types/response/sensor/getSensorResponse';
import Button from '@/components/base/Button';
import Tag from '@/components/base/Tag';
import { StatusIcon } from './SensorCardParts';
import StatusBadge from './StatusBadge';

interface Props {
    sensor: GetSensorResponse;
    tagMap: Record<string, SensorTag>;
    onToggle: (sensor: GetSensorResponse) => void;
    onOpen: (sensor: GetSensorResponse) => void;
}

function getLatestDetectedAt(sensor: GetSensorResponse): Date | null {
    const all = [...sensor.readDetectedAts, ...sensor.unreadDetectedAts].map((d) => new Date(d));
    if (all.length === 0) return null;
    return all.reduce((latest, d) => (d > latest ? d : latest));
}

function formatDetectedAt(date: Date): string {
    const y = date.getFullYear();
    const m = String(date.getMonth() + 1).padStart(2, '0');
    const d = String(date.getDate()).padStart(2, '0');
    const hh = String(date.getHours()).padStart(2, '0');
    const mm = String(date.getMinutes()).padStart(2, '0');
    return `${y}-${m}-${d} ${hh}:${mm}`;
}

// tagMapに色情報が無いタグ用のフォールバック色
const FALLBACK_COLORS = ['#10B981', '#F97316', '#F59E0B', '#14B8A6', '#F43F5E', '#6366F1', '#0EA5E9'];

function getTagColor(tagId: number, tagMap: Record<string, SensorTag>): string {
    const id = String(tagId);
    if (tagMap[id]) return tagMap[id].color;
    return FALLBACK_COLORS[tagId % FALLBACK_COLORS.length];
}

export default function SensorCard({ sensor, tagMap, onToggle, onOpen }: Props) {
    const latest = getLatestDetectedAt(sensor);
    const isDisabled = !sensor.isEnabled;

    return (
        <div
            className={`flex flex-col lg:flex-row lg:items-center gap-4 bg-background-50 border rounded-xl p-4 md:p-5 transition-colors duration-150 ${
                isDisabled ? 'border-background-200 opacity-80' : 'border-background-200 hover:border-primary-200 cursor-pointer'
            }`}
            onClick={isDisabled ? undefined : () => onOpen(sensor)}
        >
            <div className="flex items-start gap-3 lg:w-[320px] shrink-0">
                <StatusIcon sensor={sensor} />
                <div className="min-w-0">
                    <p className="font-heading font-extrabold text-[15px] text-foreground-950 truncate">{sensor.sensorName}</p>
                    <p className="mt-0.5 text-xs text-foreground-500 font-mono">{sensor.url ?? '—'}</p>
                    <div className="mt-1.5 flex items-center gap-1.5 flex-wrap">
                        {sensor.tags.length === 0 ? (
                            <span className="text-xs text-foreground-400">タグなし</span>
                        ) : (
                            sensor.tags.map((tag) => <Tag key={tag.tagId} name={tag.tagName} color={getTagColor(tag.tagId, tagMap)} size="sm" />)
                        )}
                    </div>
                </div>
            </div>

            <div className="flex items-center gap-2 flex-wrap lg:w-[120px] shrink-0">
                <StatusBadge status={sensor.status} pulse={sensor.status === 'DETECTING' || sensor.status === 'UNCONFIRMED'} />
            </div>

            <div className="flex items-center gap-2 text-xs text-foreground-600 lg:w-[150px] shrink-0 whitespace-nowrap ml-auto">
                <i className="ri-time-line text-foreground-400" />
                <span className="truncate">{latest ? formatDetectedAt(latest) : '履歴なし'}</span>
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
