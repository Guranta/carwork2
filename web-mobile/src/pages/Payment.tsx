import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { getClaimDetail, createPayment, mockPay } from '../api';

export default function Payment() {
  const { id } = useParams();
  const [claim, setClaim] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [paid, setPaid] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    if (id) getClaimDetail(Number(id)).then((res: any) => setClaim(res));
  }, [id]);

  const handlePay = async () => {
    if (!claim) return;
    setLoading(true);
    try {
      const amount = claim.assessmentAmount || claim.damageReport?.totalEstimate || 0;
      const order: any = await createPayment(claim.id, amount, 'SELF');
      const result: any = await mockPay(order.id);
      if (result.status === 'SUCCESS') {
        setPaid(true);
        setTimeout(() => navigate(`/claims/${claim.id}`, { replace: true }), 2000);
      }
    } catch {} finally { setLoading(false); }
  };

  if (!claim) return <div className="min-h-screen bg-black text-neutral-600 p-6">加载中...</div>;
  if (paid) {
    return (
      <div className="min-h-screen bg-black flex flex-col items-center justify-center px-6">
        <div className="text-6xl mb-4">✓</div>
        <h1 className="text-white text-2xl font-black mb-2">支付成功</h1>
        <p className="text-neutral-500 text-sm">理赔已完成，即将跳转...</p>
      </div>
    );
  }

  const amount = claim.assessmentAmount || claim.damageReport?.totalEstimate || 0;

  return (
    <div className="min-h-screen bg-black">
      <header className="px-6 py-4 border-b-2 border-neutral-800 flex items-center gap-4">
        <button className="text-white text-lg" onClick={() => navigate(-1)}>←</button>
        <h1 className="text-white font-bold">支付</h1>
      </header>

      <div className="px-6 py-8 flex flex-col items-center">
        <p className="text-neutral-500 text-sm mb-2">支付金额</p>
        <p className="text-white text-5xl font-black mb-12">¥{amount.toFixed(2)}</p>

        <div className="w-full border-2 border-neutral-800 p-5 mb-6">
          <div className="flex justify-between mb-3">
            <span className="text-neutral-500 text-sm">理赔单号</span>
            <span className="text-white text-sm font-mono">{claim.claimNo}</span>
          </div>
          <div className="flex justify-between mb-3">
            <span className="text-neutral-500 text-sm">车辆</span>
            <span className="text-white text-sm">{claim.policy.vehicle.plateNo}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-neutral-500 text-sm">修理厂</span>
            <span className="text-white text-sm">{claim.shop?.name || '待分配'}</span>
          </div>
        </div>

        <button
          className="w-full bg-white text-black py-4 text-lg font-black disabled:opacity-50"
          onClick={handlePay}
          disabled={loading}
        >
          {loading ? '支付中...' : '确认支付（模拟）'}
        </button>

        <p className="text-neutral-600 text-xs mt-4 text-center">
          演示模式下支付将自动完成
        </p>
      </div>
    </div>
  );
}
