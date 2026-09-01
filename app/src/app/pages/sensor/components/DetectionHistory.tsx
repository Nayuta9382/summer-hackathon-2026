import type { Detection } from '@/app/mocks/sensors';

interface Props {
    history: Detection[];
    color: string;
}

export default function DetectionHistory({ history, color }: Props) {
    if (history.length === 0) {
        return (
            <div className="flex flex-col items-center justify-center py-12 text-center">
                <span className="flex items-center justify-center w-14 h-14 rounded-full bg-background-100 text-foreground-300">
                    <i className="ri-history-line text-2xl" />
                </span>
                <p className="mt-3 font-heading font-bold text-foreground-700">検知履歴がありません</p>
                <p className="mt-1 text-sm text-foreground-500">センサーが検知すると、ここに記録されます</p>
            </div>
        );
    }

    return (
        <ol className="relative">
            {/* 縦線 */}
            <span className="absolute left-[15px] top-2 bottom-2 w-0.5 rounded-full" style={{ backgroundColor: `${color}33` }} />
            {history.map((d, i) => (
                <li key={d.id} className="relative flex items-start gap-4 pb-5 last:pb-0">
                    <span
                        className={`relative z-10 mt-1 flex items-center justify-center w-[30px] h-[30px] rounded-full shrink-0 ${!d.confirmed ? 'animate-pulse-soft' : ''}`}
                        style={{ backgroundColor: i === 0 ? color : `${color}1F`, color: i === 0 ? '#fff' : color }}
                    >
                        <i className={`${d.confirmed ? 'ri-flag-2-line' : 'ri-alert-line'} text-sm`} />
                    </span>
                    <div className="min-w-0 pt-1 flex-1">
                        <div className="flex items-center gap-2 flex-wrap">
                            <p className="text-sm font-bold text-foreground-900">{d.detail}</p>
                            {!d.confirmed && <span className="px-2 py-0.5 rounded-full text-[11px] font-label font-bold bg-secondary-100 text-secondary-800 whitespace-nowrap">未確認</span>}
                        </div>
                        <p className="mt-0.5 text-xs text-foreground-500 flex items-center gap-1.5">
                            <i className="ri-time-line" />
                            {d.time}
                        </p>
                    </div>
                </li>
            ))}
        </ol>
    );
}
