import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Plus, Wrench, ChevronRight } from 'lucide-react';
import { getClaims } from '../api';
import { StatusBadge, ListSkeleton, EmptyState } from '../components/ui';
import TabBar from '../components/TabBar';

interface Claim {
  id: number;
  claimNo: string;
  status: string;
  description: string;
  createdAt: string;
  policy: { vehicle: { plateNo: string; brand: string; model: string } };
}

export default function Claims() {
  const [claims, setClaims] = useState<Claim[]>([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    getClaims()
      .then((res: any) => setClaims(res))
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  return (
    <div className="min-h-screen bg-[#F5F7FA] pb-24">
      {/* Header */}
      <div className="bg-white px-5 pt-12 pb-4 sticky top-0 z-40 border-b border-[#F0F0F0]">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-[#1A1A1A] text-xl font-bold">我的理赔</h1>
            <p className="text-[#BFBFBF] text-xs mt-0.5">{claims.length > 0 ? `${claims.length} 条理赔记录` : '出险报案 · 进度跟踪'}</p>
          </div>
          <motion.button
            whileTap={{ scale: 0.95 }}
            className="flex items-center gap-1 bg-[#00B96B] text-white px-4 h-9 rounded-lg text-sm font-medium shadow-sm shadow-[#00B96B]/20"
            onClick={() => navigate('/claims/new')}
          >
            <Plus size={16} strokeWidth={2.5} />
            报案
          </motion.button>
        </div>
      </div>

      {/* List */}
      <div className="px-4 pt-4">
        {loading ? (
          <ListSkeleton count={3} />
        ) : claims.length === 0 ? (
          <EmptyState
            icon={<Wrench size={56} strokeWidth={1.5} />}
            title="暂无理赔记录"
            description="如遇事故可随时在线报案"
            action={
              <motion.button
                whileTap={{ scale: 0.95 }}
                className="flex items-center gap-1 bg-[#00B96B] text-white px-6 h-10 rounded-xl text-sm font-medium"
                onClick={() => navigate('/claims/new')}
              >
                <Plus size={16} strokeWidth={2.5} />
                立即报案
              </motion.button>
            }
          />
        ) : (
          <div className="space-y-3">
            {claims.map((c, idx) => (
              <motion.button
                key={c.id}
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, delay: idx * 0.06 }}
                className="w-full text-left bg-white rounded-xl shadow-[0_1px_4px_rgba(0,0,0,0.06)] p-4 active:scale-[0.98] transition-transform"
                onClick={() => navigate(`/claims/${c.id}`)}
              >
                <div className="flex items-start justify-between mb-2.5">
                  <span className="text-[#BFBFBF] text-xs font-mono">{c.claimNo}</span>
                  <StatusBadge status={c.status} />
                </div>
                <div className="flex items-center gap-2 mb-2">
                  <div className="w-8 h-8 rounded-lg bg-[#F0F5FF] flex items-center justify-center">
                    <Wrench size={15} className="text-[#1677FF]" />
                  </div>
                  <div>
                    <p className="text-[#1A1A1A] font-semibold text-base leading-tight">{c.policy?.vehicle?.plateNo || '未知'}</p>
                    <p className="text-[#BFBFBF] text-xs">{c.policy?.vehicle?.brand} {c.policy?.vehicle?.model}</p>
                  </div>
                </div>
                <p className="text-[#8C8C8C] text-sm line-clamp-1">{c.description}</p>
                <div className="flex items-center justify-between mt-3 pt-3 border-t border-[#F0F0F0]">
                  <span className="text-[#BFBFBF] text-xs">{new Date(c.createdAt).toLocaleDateString('zh-CN')}</span>
                  <ChevronRight size={16} className="text-[#BFBFBF]" />
                </div>
              </motion.button>
            ))}
          </div>
        )}
      </div>

      <TabBar />
    </div>
  );
}
