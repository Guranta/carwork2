import { Inbox } from 'lucide-react';

interface EmptyStateProps {
  icon?: React.ReactNode;
  title?: string;
  description?: string;
  action?: React.ReactNode;
}

export default function EmptyState({
  icon,
  title = '暂无数据',
  description,
  action,
}: EmptyStateProps) {
  return (
    <div className="flex flex-col items-center justify-center py-20 px-6">
      <div className="text-[#BFBFBF] mb-4">
        {icon || <Inbox size={56} strokeWidth={1.5} />}
      </div>
      <p className="text-[#8C8C8C] text-sm font-medium">{title}</p>
      {description && <p className="text-[#BFBFBF] text-xs mt-1">{description}</p>}
      {action && <div className="mt-6">{action}</div>}
    </div>
  );
}
