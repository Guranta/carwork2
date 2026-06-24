import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { getPolicyDetail } from '../api';

interface PolicyDetail {
  id: number;
  policyNo: string;
  type: string;
  status: string;
  coverageAmount: number;
  startDate: string;
  endDate: string;
  vehicle: { plateNo: string; brand: string; model: string; vin: string };
  owner: { name: string; phone: string };
}

const STATUS_MAP: Record<string, string> = {
  ACTIVE: '生效中',
  EXPIRED: '已过期',
  CANCELLED: '已退保',
};

export default function PolicyDetail() {
  const { id } = useParams();
  const [policy, setPolicy] = useState<PolicyDetail | null>(null);
  const navigate = useNavigate();

  useEffect(() => {
    if (id) getPolicyDetail(Number(id)).then((res: any) => setPolicy(res)).catch(() => {});
  }, [id]);

  if (!policy) return <div className="min-h-screen bg-black text-neutral-600 p-6">加载中...</div>;

  return (
    <div className="min-h-screen bg-black">
      <header className="px-6 py-4 border-b-2 border-neutral-800 flex items-center gap-4">
        <button className="text-white text-lg" onClick={() => navigate(-1)}>←</button>
        <h1 className="text-white font-bold">保单详情</h1>
      </header>

      <div className="px-6 py-6 space-y-6">
        <div className="border-2 border-neutral-800 p-5">
          <div className="flex justify-between items-center mb-4">
            <span className="text-neutral-400 text-xs font-mono">{policy.policyNo}</span>
            <span className="bg-white text-black px-2 py-0.5 text-xs font-bold">
              {STATUS_MAP[policy.status] || policy.status}
            </span>
          </div>

          <h2 className="text-white text-3xl font-black">{policy.vehicle.plateNo}</h2>
          <p className="text-neutral-400 text-sm mt-1">{policy.vehicle.brand} {policy.vehicle.model}</p>

          <div className="mt-4 pt-4 border-t border-neutral-800 space-y-3">
            <Row label="险种" value={policy.type} />
            <Row label="保额" value={`¥${(policy.coverageAmount / 10000).toFixed(0)}万`} highlight />
            <Row label="保险期间" value={`${policy.startDate?.slice(0, 10)} ~ ${policy.endDate?.slice(0, 10)}`} />
            <Row label="车架号" value={policy.vehicle.vin} />
            <Row label="投保人" value={`${policy.owner.name} ${policy.owner.phone}`} />
          </div>
        </div>
      </div>
    </div>
  );
}

function Row({ label, value, highlight }: { label: string; value: string; highlight?: boolean }) {
  return (
    <div className="flex justify-between">
      <span className="text-neutral-500 text-sm">{label}</span>
      <span className={`${highlight ? 'text-white font-bold text-lg' : 'text-neutral-300 text-sm'}`}>{value}</span>
    </div>
  );
}
