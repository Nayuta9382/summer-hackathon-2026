interface TagProps {
    name: string;
    color: string;
    size?: 'sm' | 'md';
    onRemove?: () => void;
    clickable?: boolean;
    onClick?: () => void;
    active?: boolean;
}

export default function Tag({ name, color, size = 'md', onRemove, clickable, onClick, active }: TagProps) {
    const base = 'inline-flex items-center gap-1.5 font-label font-bold whitespace-nowrap transition-colors duration-150';
    const sizing = size === 'sm' ? 'px-2 py-0.5 text-xs rounded' : 'px-2.5 py-1 text-[13px] rounded-md';
    const interactive = clickable || onClick ? `cursor-pointer border ${active ? 'ring-2' : ''} hover:brightness-95` : '';

    return (
        <span
            onClick={onClick}
            className={`${base} ${sizing} ${interactive}`}
            style={{
                backgroundColor: `${color}1A`,
                color,
                borderColor: `${color}66`,
                ...(active ? { boxShadow: `0 0 0 2px ${color}40` } : {}),
            }}
        >
            <span className="flex items-center justify-center w-2 h-2 rounded-full shrink-0" style={{ backgroundColor: color }} />
            {name}
            {onRemove && (
                <button
                    type="button"
                    aria-label={`${name}を削除`}
                    onClick={(e) => {
                        e.stopPropagation();
                        onRemove();
                    }}
                    className="flex items-center justify-center w-3.5 h-3.5 rounded-full hover:bg-black/10 cursor-pointer"
                >
                    <i className="ri-close-line text-[11px]" />
                </button>
            )}
        </span>
    );
}
