import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { getClaims } from '../api';
import TabBar from '../components/TabBar';

interface Claim {
  id: number;
  claimNo: string;
  status: string;
  description: string;
  createdAt: string;
  policy: { vehicle: { plateNo: string; brand: string; model: string } };
}

const STATUS_MAP: Record<string, { label: string; cls: string }> = {
  DRAFT: { label: '草稿', cls: 'bg-neutral-700 text-neutral-300' },
  SUBMITTED: { label: '已提交', cls: 'bg-white text-black' },
  UNDER_REVIEW: { label: '审核中', cls: 'bg-white text-black' },
  ASSESSED: { label: '已定损', cls: 'bg-white text-black' },
  REPAIRING: { label: '维修中', cls: 'bg-white text-black' },
  AWAITING_PAYMENT: { label: '待支付', cls: 'bg-white text-black' },
  CLOSED: { label: '已完成', cls: 'bg-neutral-700 text-neutral-300' },
  REJECTED: { label: '已拒绝', cls: 'bg-red-900 text-red-300' },
};

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
    <div className="min-h-screen bg-black pb-20">
      <header className="px-6 pt-12 pb-6 border-b-2 border-neutral-800 flex justify-between items-center">
        <h1 className="text-white text-2xl font-black">我的理赔</h1>
        <button
          className="bg-white text-black px-4 py-2 text-sm font-bold"
          onClick={() => navigate('/claims/new')}
        >
          + 报案
        </button>
      </header>

      <div className="px-6 py-4">
        {loading ? (
          <p className="text-neutral-600 text-sm">加载中...</p>
        ) : claims.length === 0 ? (
          <div className="text-center py-20">
            <p className="text-neutral-600 text-sm mb-4">暂无理赔记录</p>
            <button
              className="border-2 border-white text-white px-6 py-2 text-sm font-bold"
              onClick={() => navigate('/claims/new')}
            >
              立即报案
            </button>
          </div>
        ) : (
          <div className="space-y-4">
            {claims.map((c) => {
              const s = STATUS_MAP[c.status] || STATUS_MAP.DRAFT;
              return (
                <div
                  key={c.id}
                  className="border-2 border-neutral-800 p-4 cursor-pointer hover:border-neutral-600 transition-colors"
                  onClick={() => navigate(`/claims/${c.id}`)}
                >
                  <div className="flex justify-between items-start mb-3">
                    <span className="text-neutral-400 text-xs font-mono">{c.claimNo}</span>
                    <span className={`${s.cls} px-2 py-0.5 text-xs font-bold`}>{s.label}</span>
                  </div>
                  <p className="text-white font-bold text-lg">{c.policy?.vehicle?.plateNo || '未知'}</p>
                  <p className="text-neutral-500 text-sm line-clamp-1 mt-1">{c.description}</p>
                  <div className="mt-2 pt-2 border-t border-neutral-800">
                    <span className="text-neutral-600 text-xs">{new Date(c.createdAt).toLocaleString('zh-CN')}</span>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      <TabBar />
    </div>
  );
}
