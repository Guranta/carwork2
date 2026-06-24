import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Calendar, Car, User, Hash, ShieldCheck } from 'lucide-react';
import { getPolicyDetail } from '../api';
import { NavBar, StatusBadge } from '../components/ui';

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

function InfoRow({ icon, label, value, highlight }: { icon: React.ReactNode; label: string; value: string; highlight?: boolean }) {
  return (
    <div className="flex items-center justify-between py-3">
      <div className="flex items-center gap-2.5">
        <span className="text-[#BFBFBF]">{icon}</span>
        <span className="text-sm text-[#8C8C8C]">{label}</span>
      </div>
      <span className={`text-sm ${highlight ? 'text-[#00B96B] font-bold text-lg' : 'text-[#1A1A1A]'}`}>{value}</span>
    </div>
  );
}

export default function PolicyDetail() {
  const { id } = useParams();
  const [policy, setPolicy] = useState<PolicyDetail | null>(null);

  useEffect(() => {
    if (id) getPolicyDetail(Number(id)).then((res: any) => setPolicy(res)).catch(() => {});
  }, [id]);

  if (!policy) {
    return (
      <div className="min-h-screen bg-[#F5F7FA]">
        <NavBar title="保单详情" />
        <div className="p-4"><div className="skeleton h-64" /></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#F5F7FA]">
      <NavBar title="保单详情" right={<StatusBadge status={policy.status} type="policy" />} />

      <div className="px-4 pt-2 pb-6 space-y-3">
        {/* Hero card */}
        <motion.div
          initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }}
          className="bg-gradient-to-br from-[#00B96B] to-[#009456] rounded-2xl p-5 text-white shadow-lg shadow-[#00B96B]/20"
        >
          <div className="flex items-center gap-2 mb-2">
            <ShieldCheck size={16} />
            <span className="text-white/80 text-sm">{policy.type}</span>
          </div>
          <h1 className="text-white text-3xl font-black tracking-wide">{policy.vehicle.plateNo}</h1>
          <p className="text-white/70 text-sm mt-1">{policy.vehicle.brand} {policy.vehicle.model}</p>
          <div className="mt-4 pt-4 border-t border-white/20">
            <p className="text-white/70 text-xs">保障额度</p>
            <p className="text-white text-2xl font-bold">¥{(policy.coverageAmount / 10000).toFixed(0)}万</p>
          </div>
        </motion.div>

        {/* Insurance period */}
        <motion.div
          initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.05 }}
          className="bg-white rounded-xl shadow-[0_1px_4px_rgba(0,0,0,0.06)] divide-y divide-[#F0F0F0]"
        >
          <InfoRow icon={<Calendar size={18} />} label="保险期间"
            value={`${policy.startDate?.slice(0, 10)} 至 ${policy.endDate?.slice(0, 10)}`} />
          <InfoRow icon={<Hash size={18} />} label="保单号" value={policy.policyNo} />
        </motion.div>

        {/* Vehicle info */}
        <motion.div
          initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}
          className="bg-white rounded-xl shadow-[0_1px_4px_rgba(0,0,0,0.06)] divide-y divide-[#F0F0F0]"
        >
          <div className="px-4 py-3 text-xs font-semibold text-[#8C8C8C]">车辆信息</div>
          <InfoRow icon={<Car size={18} />} label="品牌车型" value={`${policy.vehicle.brand} ${policy.vehicle.model}`} />
          <InfoRow icon={<Hash size={18} />} label="车架号" value={policy.vehicle.vin || '—'} />
        </motion.div>

        {/* Owner info */}
        <motion.div
          initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.15 }}
          className="bg-white rounded-xl shadow-[0_1px_4px_rgba(0,0,0,0.06)] divide-y divide-[#F0F0F0]"
        >
          <div className="px-4 py-3 text-xs font-semibold text-[#8C8C8C]">投保人信息</div>
          <InfoRow icon={<User size={18} />} label="姓名" value={policy.owner.name} />
          <InfoRow icon={<User size={18} />} label="手机号" value={policy.owner.phone} />
        </motion.div>
      </div>
    </div>
  );
}
