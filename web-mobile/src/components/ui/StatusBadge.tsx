interface StatusBadgeProps {
  status: string;
  type?: 'policy' | 'claim';
}

const POLICY_MAP: Record<string, { label: string; cls: string }> = {
  ACTIVE: { label: '生效中', cls: 'bg-[#E6F9F1] text-[#00B96B]' },
  EXPIRED: { label: '已过期', cls: 'bg-[#F5F5F5] text-[#8C8C8C]' },
  CANCELLED: { label: '已退保', cls: 'bg-[#FFF1F0] text-[#FF4D4F]' },
};

const CLAIM_MAP: Record<string, { label: string; cls: string }> = {
  DRAFT: { label: '草稿', cls: 'bg-[#F5F5F5] text-[#8C8C8C]' },
  SUBMITTED: { label: '已提交', cls: 'bg-[#E6F4FF] text-[#1677FF]' },
  UNDER_REVIEW: { label: '审核中', cls: 'bg-[#E6F4FF] text-[#1677FF]' },
  ASSESSED: { label: '已定损', cls: 'bg-[#FFF7E6] text-[#FAAD14]' },
  REPAIRING: { label: '维修中', cls: 'bg-[#E6F4FF] text-[#1677FF]' },
  AWAITING_PAYMENT: { label: '待支付', cls: 'bg-[#FFF7E6] text-[#FAAD14]' },
  CLOSED: { label: '已完成', cls: 'bg-[#E6F9F1] text-[#00B96B]' },
  REJECTED: { label: '已拒绝', cls: 'bg-[#FFF1F0] text-[#FF4D4F]' },
};

export default function StatusBadge({ status, type = 'claim' }: StatusBadgeProps) {
  const map = type === 'policy' ? POLICY_MAP : CLAIM_MAP;
  const config = map[status] || CLAIM_MAP.DRAFT;
  return (
    <span className={`inline-flex items-center px-2 py-0.5 rounded text-xs font-medium ${config.cls}`}>
      {config.label}
    </span>
  );
}
