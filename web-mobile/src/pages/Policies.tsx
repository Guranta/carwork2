import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuthStore } from '../stores/auth';
import { getPolicies } from '../api';

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

const STATUS_MAP: Record<string, { label: string; cls: string }> = {
  ACTIVE: { label: '生效中', cls: 'bg-white text-black' },
  EXPIRED: { label: '已过期', cls: 'bg-neutral-700 text-neutral-400' },
  CANCELLED: { label: '已退保', cls: 'bg-neutral-800 text-neutral-500' },
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
    <div className="min-h-screen bg-black">
      <header className="px-6 pt-12 pb-6 border-b-2 border-neutral-800">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-white text-2xl font-black">{user?.name || '用户'}</h1>
            <p className="text-neutral-500 text-xs mt-1">{user?.phone}</p>
          </div>
          <button
            className="border border-neutral-600 text-neutral-400 px-3 py-1 text-xs"
            onClick={() => { logout(); navigate('/login', { replace: true }); }}
          >
            退出
          </button>
        </div>
      </header>

      <div className="px-6 py-4">
        <h2 className="text-white text-lg font-bold mb-4">我的保单</h2>

        {loading ? (
          <p className="text-neutral-600 text-sm">加载中...</p>
        ) : policies.length === 0 ? (
          <p className="text-neutral-600 text-sm">暂无保单</p>
        ) : (
          <div className="space-y-4">
            {policies.map((p) => {
              const s = STATUS_MAP[p.status] || STATUS_MAP.ACTIVE;
              return (
                <div
                  key={p.id}
                  className="border-2 border-neutral-800 p-4 cursor-pointer hover:border-neutral-600 transition-colors"
                  onClick={() => navigate(`/policies/${p.id}`)}
                >
                  <div className="flex justify-between items-start mb-3">
                    <span className="text-neutral-400 text-xs font-mono">{p.policyNo}</span>
                    <span className={`${s.cls} px-2 py-0.5 text-xs font-bold`}>{s.label}</span>
                  </div>
                  <p className="text-white font-bold text-lg">{p.vehicle.plateNo}</p>
                  <p className="text-neutral-500 text-sm">{p.vehicle.brand} {p.vehicle.model}</p>
                  <div className="flex justify-between mt-3 pt-3 border-t border-neutral-800">
                    <span className="text-neutral-500 text-xs">{p.type}</span>
                    <span className="text-white text-sm font-bold">
                      ¥{(p.coverageAmount / 10000).toFixed(0)}万
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
