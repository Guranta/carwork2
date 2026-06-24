interface CellProps {
  label: string;
  value?: React.ReactNode;
  hint?: string;
  icon?: React.ReactNode;
  onClick?: () => void;
  chevron?: boolean;
}

export default function Cell({ label, value, hint, icon, onClick, chevron }: CellProps) {
  const Tag: any = onClick ? 'button' : 'div';
  return (
    <Tag
      onClick={onClick}
      className={`flex items-center justify-between w-full px-4 py-3.5 ${onClick ? 'active:bg-[#F5F7FA] transition-colors' : ''}`}
    >
      <div className="flex items-center gap-3 min-w-0">
        {icon && <span className="shrink-0 text-[#8C8C8C]">{icon}</span>}
        <span className="text-sm text-[#1A1A1A]">{label}</span>
      </div>
      <div className="flex items-center gap-1 min-w-0">
        {value && <span className="text-sm text-[#8C8C8C] truncate max-w-48">{value}</span>}
        {hint && <span className="text-xs text-[#BFBFBF]">{hint}</span>}
        {chevron && <span className="text-[#BFBFBB] text-lg leading-none">›</span>}
      </div>
    </Tag>
  );
}
