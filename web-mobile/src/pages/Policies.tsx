import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Bell, ChevronRight, ShieldCheck, Car, FileText } from 'lucide-react';
import { useAuthStore } from '../stores/auth';
import { getPolicies } from '../api';
import { StatusBadge, ListSkeleton, EmptyState } from '../components/ui';
import TabBar from '../components/TabBar';

interface Policy {
  id: number;
  policyNo: string;
  type: string;
  status: string;
  coverageAmount: number;
  startDate: string;
  endDate: string;
  vehicle: { plateNo: string; brand: string; model: string };
}

const TYPE_ICON: Record<string, any> = {
  '交强险': ShieldCheck,
  '商业险': FileText,
  '第三者责任险': ShieldCheck,
};

export default function Policies() {
  const [policies, setPolicies] = useState<Policy[]>([]);
  const [loading, setLoading] = useState(true);
  const user = useAuthStore((s) => s.user);
  const logout = useAuthStore((s) => s.logout);
  const navigate = useNavigate();

  useEffect(() => {
    getPolicies()
      .then((res: any) => setPolicies(res))
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  return (
    <div className="min-h-screen bg-[#F5F7FA] pb-20">
      {/* Header */}
      <div className="bg-gradient-to-b from-[#00B96B] to-[#00A35E] px-5 pt-12 pb-8 rounded-b-3xl">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-11 h-11 rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center text-white font-bold text-lg">
              {user?.name?.[0] || '车'}
            </div>
            <div>
              <p className="text-white font-semibold text-base">{user?.name || '用户'}</p>
              <p className="text-white/70 text-xs">{user?.phone}</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <button
              className="w-9 h-9 rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center active:scale-90 transition-transform"
              onClick={() => navigate('/notifications')}
            >
              <Bell size={18} className="text-white" />
            </button>
            <button
              className="w-9 h-9 rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center active:scale-90 transition-transform text-white text-xs"
              onClick={() => { logout(); navigate('/login', { replace: true }); }}
            >
              退出
            </button>
          </div>
        </div>

        {/* Quick stats */}
        <div className="flex gap-4 mt-6">
          <div className="flex-1 bg-white/15 backdrop-blur-sm rounded-xl px-4 py-3">
            <p className="text-white/70 text-xs">有效保单</p>
            <p className="text-white text-xl font-bold mt-0.5">
              {policies.filter((p) => p.status === 'ACTIVE').length}
            </p>
          </div>
          <div className="flex-1 bg-white/15 backdrop-blur-sm rounded-xl px-4 py-3">
            <p className="text-white/70 text-xs">总保额</p>
            <p className="text-white text-xl font-bold mt-0.5">
              {policies.filter((p) => p.status === 'ACTIVE').reduce((s, p) => s + p.coverageAmount, 0) / 10000 > 0
                ? `${(policies.filter((p) => p.status === 'ACTIVE').reduce((s, p) => s + p.coverageAmount, 0) / 10000).toFixed(0)}万`
                : '—'}
            </p>
          </div>
        </div>
      </div>

      {/* Policy list */}
      <div className="px-4 mt-5">
        <div className="flex items-center justify-between mb-3">
          <h2 className="text-[#1A1A1A] text-lg font-bold">我的保单</h2>
          {policies.length > 0 && (
            <span className="text-[#BFBFBF] text-xs">共 {policies.length} 份</span>
          )}
        </div>

        {loading ? (
          <ListSkeleton count={3} />
        ) : policies.length === 0 ? (
          <EmptyState title="暂无保单" description="联系客服添加保单" />
        ) : (
          <div className="space-y-3">
            {policies.map((p, idx) => {
              const Icon = TYPE_ICON[p.type] || Car;
              return (
                <motion.button
                  key={p.id}
                  initial={{ opacity: 0, y: 12 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3, delay: idx * 0.06 }}
                  className="w-full text-left bg-white rounded-xl shadow-[0_1px_4px_rgba(0,0,0,0.06)] p-4 active:scale-[0.98] transition-transform"
                  onClick={() => navigate(`/policies/${p.id}`)}
                >
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex items-center gap-2.5">
                      <div className="w-9 h-9 rounded-lg bg-[#E6F9F1] flex items-center justify-center">
                        <Icon size={18} className="text-[#00B96B]" />
                      </div>
                      <div>
                        <p className="text-[#1A1A1A] font-semibold text-sm">{p.type}</p>
                        <p className="text-[#BFBFBF] text-xs font-mono">{p.policyNo}</p>
                      </div>
                    </div>
                    <StatusBadge status={p.status} type="policy" />
                  </div>
                  <div className="flex items-end justify-between pt-3 border-t border-[#F0F0F0]">
                    <div>
                      <p className="text-[#1A1A1A] font-bold text-lg leading-tight">{p.vehicle.plateNo}</p>
                      <p className="text-[#8C8C8C] text-xs">{p.vehicle.brand} {p.vehicle.model}</p>
                    </div>
                    <div className="flex items-center gap-1">
                      <span className="text-[#00B96B] font-bold text-base">
                        ¥{(p.coverageAmount / 10000).toFixed(0)}万
                      </span>
                      <ChevronRight size={16} className="text-[#BFBFBF]" />
                    </div>
                  </div>
                </motion.button>
              );
            })}
          </div>
        )}
      </div>

      <TabBar />
    </div>
  );
}
