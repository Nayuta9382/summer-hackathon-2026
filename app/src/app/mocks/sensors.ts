export type SensorStatus = 'normal' | 'detecting' | 'unconfirmed' | 'disabled' | 'offline';

export interface Tag {
    id: string;
    name: string;
    color: string;
}

export interface Detection {
    id: string;
    time: string;
    detail: string;
    confirmed: boolean;
}

export interface Sensor {
    id: string;
    name: string;
    ip: string;
    tagIds: string[];
    status: SensorStatus;
    lastDetectedAt: string;
    history: Detection[];
    addedAt: string;
}

export const tags: Tag[] = [
    { id: 'tag-package', name: '置き配', color: '#10B981' },
    { id: 'tag-entrance', name: '玄関', color: '#F97316' },
    { id: 'tag-hallway', name: '廊下', color: '#F59E0B' },
    { id: 'tag-warehouse', name: '倉庫', color: '#14B8A6' },
    { id: 'tag-study', name: '書斎', color: '#F43F5E' },
];

export const sensors: Sensor[] = [
    {
        id: 's1',
        name: '玄関・置き配センサー',
        ip: '192.168.1.10',
        tagIds: ['tag-package', 'tag-entrance'],
        status: 'normal',
        lastDetectedAt: '2026-08-25 14:32',
        history: [
            { id: 'd1', time: '2026-08-25 14:32', detail: '荷物を検知しました（置き配）', confirmed: true },
            { id: 'd2', time: '2026-08-25 09:10', detail: '荷物を検知しました（置き配）', confirmed: true },
        ],
        addedAt: '2026-08-01',
    },
    {
        id: 's2',
        name: 'リビング通過センサー',
        ip: '192.168.1.11',
        tagIds: ['tag-hallway'],
        status: 'detecting',
        lastDetectedAt: '2026-08-25 15:04',
        history: [
            { id: 'd3', time: '2026-08-25 15:04', detail: '人が通過しました', confirmed: false },
            { id: 'd4', time: '2026-08-25 13:47', detail: '人が通過しました', confirmed: true },
        ],
        addedAt: '2026-08-03',
    },
    {
        id: 's3',
        name: '書斎ドアセンサー',
        ip: '192.168.1.12',
        tagIds: ['tag-study'],
        status: 'normal',
        lastDetectedAt: '2026-08-24 22:18',
        history: [
            { id: 'd5', time: '2026-08-24 22:18', detail: 'ドアの開閉を検知', confirmed: true },
            { id: 'd6', time: '2026-08-24 08:40', detail: 'ドアの開閉を検知', confirmed: true },
        ],
        addedAt: '2026-08-02',
    },
    {
        id: 's4',
        name: '倉庫・在庫センサー',
        ip: '192.168.1.13',
        tagIds: ['tag-warehouse'],
        status: 'unconfirmed',
        lastDetectedAt: '2026-08-25 14:55',
        history: [
            { id: 'd7', time: '2026-08-25 14:55', detail: '物体の移動を検知しました', confirmed: false },
            { id: 'd8', time: '2026-08-25 11:20', detail: '物体の移動を検知しました', confirmed: false },
        ],
        addedAt: '2026-08-01',
    },
    {
        id: 's5',
        name: '玄関・人感センサー',
        ip: '192.168.1.14',
        tagIds: ['tag-entrance'],
        status: 'normal',
        lastDetectedAt: '2026-08-25 07:50',
        history: [{ id: 'd9', time: '2026-08-25 07:50', detail: '人の侵入を検知しました', confirmed: true }],
        addedAt: '2026-08-05',
    },
    {
        id: 's6',
        name: 'ベランダセンサー',
        ip: '192.168.1.15',
        tagIds: [],
        status: 'disabled',
        lastDetectedAt: '2026-08-18 20:02',
        history: [
            { id: 'd10', time: '2026-08-18 20:02', detail: '物体の移動を検知しました', confirmed: true },
            { id: 'd11', time: '2026-08-17 06:30', detail: '物体の移動を検知しました', confirmed: true },
        ],
        addedAt: '2026-08-01',
    },
    {
        id: 's7',
        name: 'ガレージセンサー',
        ip: '192.168.1.16',
        tagIds: ['tag-warehouse'],
        status: 'offline',
        lastDetectedAt: '2026-08-24 16:12',
        history: [{ id: 'd12', time: '2026-08-24 16:12', detail: '人が通過しました', confirmed: true }],
        addedAt: '2026-08-04',
    },
    {
        id: 's8',
        name: '郵便受けセンサー',
        ip: '192.168.1.17',
        tagIds: ['tag-package'],
        status: 'normal',
        lastDetectedAt: '2026-08-25 10:05',
        history: [{ id: 'd13', time: '2026-08-25 10:05', detail: '郵便物の投入を検知', confirmed: true }],
        addedAt: '2026-08-06',
    },
    {
        id: 's9',
        name: '階段通過センサー',
        ip: '192.168.1.18',
        tagIds: ['tag-hallway'],
        status: 'disabled',
        lastDetectedAt: '2026-08-15 19:22',
        history: [
            { id: 'd14', time: '2026-08-15 19:22', detail: '人が通過しました', confirmed: true },
            { id: 'd15', time: '2026-08-14 08:11', detail: '人が通過しました', confirmed: true },
        ],
        addedAt: '2026-08-02',
    },
    {
        id: 's10',
        name: '台所ドアセンサー',
        ip: '192.168.1.19',
        tagIds: [],
        status: 'normal',
        lastDetectedAt: '2026-08-24 18:45',
        history: [{ id: 'd16', time: '2026-08-24 18:45', detail: 'ドアの開閉を検知', confirmed: true }],
        addedAt: '2026-08-07',
    },
];

export const sensorStatusMeta: Record<SensorStatus, { label: string; dot: string; text: string; bg: string; ring: string }> = {
    normal: {
        label: '待機中',
        dot: 'bg-emerald-500',
        text: 'text-emerald-700',
        bg: 'bg-emerald-50',
        ring: 'ring-emerald-200',
    },
    detecting: {
        label: '検知中',
        dot: 'bg-orange-500',
        text: 'text-orange-700',
        bg: 'bg-orange-50',
        ring: 'ring-orange-200',
    },
    unconfirmed: {
        label: '未確認',
        dot: 'bg-amber-500',
        text: 'text-amber-700',
        bg: 'bg-amber-50',
        ring: 'ring-amber-200',
    },
    disabled: {
        label: '無効',
        dot: 'bg-slate-400',
        text: 'text-slate-500',
        bg: 'bg-slate-100',
        ring: 'ring-slate-200',
    },
    offline: {
        label: 'オフライン',
        dot: 'bg-rose-400',
        text: 'text-rose-600',
        bg: 'bg-rose-50',
        ring: 'ring-rose-200',
    },
};
