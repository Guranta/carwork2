import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Check, Wallet, Receipt } from 'lucide-react';
import { getClaimDetail, createPayment, mockPay } from '../api';
import { NavBar, SkeletonBlock } from '../components/ui';

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

  if (!claim) {
    return (
      <div className="min-h-screen bg-[#F5F7FA]">
        <NavBar title="支付" />
        <div className="p-4"><SkeletonBlock className="h-48" /></div>
      </div>
    );
  }

  if (paid) {
    return (
      <div className="min-h-screen bg-[#F5F7FA] flex flex-col items-center justify-center">
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ type: 'spring', stiffness: 260, damping: 20 }}
          className="w-20 h-20 rounded-full bg-[#00B96B] flex items-center justify-center mb-6 shadow-lg shadow-[#00B96B]/30"
        >
          <Check size={40} className="text-white" strokeWidth={3} />
        </motion.div>
        <motion.h1
          initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}
          className="text-[#1A1A1A] text-xl font-bold"
        >
          支付成功
        </motion.h1>
        <motion.p
          initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.4 }}
          className="text-[#8C8C8C] text-sm mt-2"
        >
          理赔已完成，感谢您的使用
        </motion.p>
      </div>
    );
  }

  const amount = claim.assessmentAmount || claim.damageReport?.totalEstimate || 0;

  return (
    <div className="min-h-screen bg-[#F5F7FA]">
      <NavBar title="支付" />

      {/* Amount */}
      <motion.div
        initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }}
        className="bg-white rounded-2xl mx-4 mt-2 p-6 text-center shadow-[0_1px_4px_rgba(0,0,0,0.06)]"
      >
        <p className="text-[#8C8C8C] text-sm mb-2">应付金额</p>
        <p className="text-[#00B96B] text-4xl font-black">¥{amount.toLocaleString()}</p>
      </motion.div>

      {/* Order summary */}
      <motion.div
        initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.05 }}
        className="bg-white rounded-2xl mx-4 mt-3 p-5 shadow-[0_1px_4px_rgba(0,0,0,0.06)] divide-y divide-[#F0F0F0]"
      >
        <div className="flex items-center gap-2 pb-3 text-[#8C8C8C] text-xs font-semibold">
          <Receipt size={14} /> 订单详情
        </div>
        <div className="flex justify-between py-2.5">
          <span className="text-sm text-[#8C8C8C]">理赔单号</span>
          <span className="text-sm text-[#1A1A1A] font-mono">{claim.claimNo}</span>
        </div>
        <div className="flex justify-between py-2.5">
          <span className="text-sm text-[#8C8C8C]">车牌号</span>
          <span className="text-sm text-[#1A1A1A]">{claim.policy.vehicle.plateNo}</span>
        </div>
        {claim.shop && (
          <div className="flex justify-between py-2.5">
            <span className="text-sm text-[#8C8C8C]">修理厂</span>
            <span className="text-sm text-[#1A1A1A]">{claim.shop.name}</span>
          </div>
        )}
      </motion.div>

      {/* Payment method */}
      <motion.div
        initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}
        className="bg-white rounded-2xl mx-4 mt-3 p-5 shadow-[0_1px_4px_rgba(0,0,0,0.06)]"
      >
        <p className="text-[#8C8C8C] text-xs font-semibold mb-3">支付方式</p>
        <div className="flex items-center gap-3 py-2">
          <div className="w-10 h-10 rounded-lg bg-[#E6F9F1] flex items-center justify-center">
            <Wallet size={18} className="text-[#00B96B]" />
          </div>
          <span className="flex-1 text-sm text-[#1A1A1A] font-medium">模拟支付（演示）</span>
          <div className="w-5 h-5 rounded-full bg-[#00B96B] flex items-center justify-center">
            <Check size={12} className="text-white" strokeWidth={3} />
          </div>
        </div>
      </motion.div>

      {/* Pay button */}
      <div className="fixed bottom-0 left-0 right-0 bg-white/95 backdrop-blur-md border-t border-[#F0F0F0] p-4 safe-bottom">
        <motion.button
          whileTap={{ scale: 0.97 }}
          className="w-full bg-[#00B96B] text-white py-3.5 rounded-xl text-base font-semibold shadow-lg shadow-[#00B96B]/20"
          onClick={handlePay}
          disabled={loading}
        >
          {loading ? '支付中...' : `确认支付 ¥${amount.toLocaleString()}`}
        </motion.button>
      </div>

      <AnimatePresence>
        {loading && (
          <motion.div
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/40 flex items-center justify-center z-50"
          >
            <div className="bg-white rounded-2xl px-8 py-6 flex flex-col items-center">
              <div className="w-8 h-8 border-3 border-[#00B96B] border-t-transparent rounded-full animate-spin" />
              <p className="text-[#1A1A1A] text-sm mt-3">正在支付...</p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
