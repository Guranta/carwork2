import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Check, X, FileText, Sparkles, Wrench, Camera, MapPin, CreditCard, Star } from 'lucide-react';
import { getClaimDetail } from '../api';
import { NavBar, StatusBadge, SkeletonBlock } from '../components/ui';

interface ClaimDetail {
  id: number;
  claimNo: string;
  status: string;
  description: string;
  createdAt: string;
  assessmentAmount: number | null;
  policy: { policyNo: string; type: string; vehicle: { plateNo: string; brand: string; model: string } };
  images: { id: number; url: string }[];
  damageReport: { parts: string; totalEstimate: number; aiRawResponse: string | null } | null;
  shop: { name: string; certification: string; rating: number } | null;
}

const STATUS_FLOW = [
  { key: 'SUBMITTED', label: '已报案', icon: FileText },
  { key: 'UNDER_REVIEW', label: '审核中', icon: Sparkles },
  { key: 'ASSESSED', label: '已定损', icon: Check },
  { key: 'REPAIRING', label: '维修中', icon: Wrench },
  { key: 'AWAITING_PAYMENT', label: '待付款', icon: CreditCard },
  { key: 'CLOSED', label: '已完成', icon: Check },
];

export default function ClaimDetail() {
  const { id } = useParams();
  const [claim, setClaim] = useState<ClaimDetail | null>(null);
  const navigate = useNavigate();

  useEffect(() => {
    if (id) getClaimDetail(Number(id)).then((res: any) => setClaim(res)).catch(() => {});
  }, [id]);

  if (!claim) {
    return (
      <div className="min-h-screen bg-[#F5F7FA]">
        <NavBar title="理赔详情" />
        <div className="p-4 space-y-3">
          <SkeletonBlock className="h-32" />
          <SkeletonBlock className="h-24" />
          <SkeletonBlock className="h-24" />
        </div>
      </div>
    );
  }

  const isRejected = claim.status === 'REJECTED';
  const isDraft = claim.status === 'DRAFT';
  const currentStep = STATUS_FLOW.findIndex((s) => s.key === claim.status);
  const amount = claim.assessmentAmount || claim.damageReport?.totalEstimate || 0;

  const showPayBtn = claim.status === 'AWAITING_PAYMENT';
  const showReviewBtn = claim.status === 'CLOSED';

  return (
    <div className="min-h-screen bg-[#F5F7FA] pb-20">
      <NavBar title="理赔详情" right={<StatusBadge status={claim.status} />} />

      <div className="px-4 pt-2 space-y-3">
        {/* Hero */}
        <motion.div
          initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }}
          className="bg-white rounded-2xl p-5 shadow-[0_1px_4px_rgba(0,0,0,0.06)]"
        >
          <span className="text-[#BFBFBF] text-xs font-mono">{claim.claimNo}</span>
          <h1 className="text-[#1A1A1A] text-3xl font-black mt-1">{claim.policy.vehicle.plateNo}</h1>
          <p className="text-[#8C8C8C] text-sm">{claim.policy.vehicle.brand} {claim.policy.vehicle.model}</p>
          <p className="text-[#BFBFBF] text-xs mt-2">{new Date(claim.createdAt).toLocaleString('zh-CN')}</p>
        </motion.div>

        {/* Progress timeline */}
        {!isDraft && !isRejected && (
          <motion.div
            initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.05 }}
            className="bg-white rounded-2xl p-5 shadow-[0_1px_4px_rgba(0,0,0,0.06)]"
          >
            <h3 className="text-[#1A1A1A] font-bold text-sm mb-4">处理进度</h3>
            <div className="flex items-center justify-between relative">
              {/* Background line */}
              <div className="absolute top-3.5 left-3 right-3 h-0.5 bg-[#F0F0F0]" />
              {/* Progress line */}
              <motion.div
                initial={{ width: 0 }}
                animate={{ width: `${(currentStep / (STATUS_FLOW.length - 1)) * 100}%` }}
                transition={{ duration: 0.6, delay: 0.2 }}
                className="absolute top-3.5 left-3 h-0.5 bg-[#00B96B]"
                style={{ maxWidth: 'calc(100% - 24px)' }}
              />
              {STATUS_FLOW.map((step, idx) => {
                const Icon = step.icon;
                const done = idx <= currentStep;
                const isCurrent = idx === currentStep;
                return (
                  <div key={step.key} className="flex flex-col items-center gap-1.5 z-10 flex-1">
                    <div
                      className={`w-7 h-7 rounded-full flex items-center justify-center transition-colors ${
                        done ? 'bg-[#00B96B]' : 'bg-[#F0F0F0]'
                      } ${isCurrent ? 'ring-4 ring-[#00B96B]/15' : ''}`}
                    >
                      <Icon size={13} className={done ? 'text-white' : 'text-[#BFBFBF]'} strokeWidth={2.5} />
                    </div>
                    <span className={`text-[10px] ${done ? 'text-[#1A1A1A] font-medium' : 'text-[#BFBFBF]'}`}>
                      {step.label}
                    </span>
                  </div>
                );
              })}
            </div>
          </motion.div>
        )}

        {isRejected && (
          <motion.div
            initial={{ opacity: 0 }} animate={{ opacity: 1 }}
            className="bg-[#FFF1F0] rounded-2xl p-5 text-center"
          >
            <div className="w-10 h-10 rounded-full bg-[#FF4D4F] mx-auto flex items-center justify-center mb-2">
              <X size={20} className="text-white" strokeWidth={3} />
            </div>
            <p className="text-[#FF4D4F] font-semibold">理赔已被拒绝</p>
          </motion.div>
        )}

        {/* Accident description */}
        <motion.div
          initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}
          className="bg-white rounded-2xl p-5 shadow-[0_1px_4px_rgba(0,0,0,0.06)]"
        >
          <h3 className="text-[#1A1A1A] font-bold text-sm mb-2">事故描述</h3>
          <p className="text-[#595959] text-sm leading-relaxed">{claim.description}</p>
        </motion.div>

        {/* AI Damage Report */}
        {claim.damageReport && (
          <motion.div
            initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.15 }}
            className="bg-gradient-to-br from-[#1677FF] to-[#0958d9] rounded-2xl p-5 text-white shadow-lg shadow-[#1677FF]/15"
          >
            <div className="flex items-center gap-2 mb-3">
              <div className="w-7 h-7 rounded-lg bg-white/20 flex items-center justify-center">
                <Sparkles size={15} />
              </div>
              <h3 className="font-bold text-sm">AI 智能定损报告</h3>
            </div>
            <div className="space-y-2.5">
              <div className="flex justify-between">
                <span className="text-white/70 text-sm">受损部位</span>
                <span className="text-white text-sm font-medium">{claim.damageReport.parts}</span>
              </div>
              <div className="flex justify-between items-end pt-2 border-t border-white/15">
                <span className="text-white/70 text-sm">预估维修费用</span>
                <span className="text-white text-2xl font-black">¥{claim.damageReport.totalEstimate.toLocaleString()}</span>
              </div>
            </div>
          </motion.div>
        )}

        {/* Assessment amount */}
        {claim.assessmentAmount && (
          <motion.div
            initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.15 }}
            className="bg-white rounded-2xl p-5 shadow-[0_1px_4px_rgba(0,0,0,0.06)] flex items-center justify-between"
          >
            <div>
              <p className="text-[#8C8C8C] text-xs">定损金额</p>
              <p className="text-[#00B96B] text-2xl font-black">¥{claim.assessmentAmount.toLocaleString()}</p>
            </div>
          </motion.div>
        )}

        {/* Repair shop */}
        {claim.shop && (
          <motion.div
            initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}
            className="bg-white rounded-2xl p-5 shadow-[0_1px_4px_rgba(0,0,0,0.06)]"
          >
            <h3 className="text-[#1A1A1A] font-bold text-sm mb-3">维修门店</h3>
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-[#E6F9F1] flex items-center justify-center">
                <MapPin size={18} className="text-[#00B96B]" />
              </div>
              <div className="flex-1">
                <p className="text-[#1A1A1A] font-medium">{claim.shop.name}</p>
                <p className="text-[#BFBFBF] text-xs">{claim.shop.certification} · ⭐ {claim.shop.rating}</p>
              </div>
            </div>
          </motion.div>
        )}

        {/* Photos */}
        {claim.images.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.25 }}
            className="bg-white rounded-2xl p-5 shadow-[0_1px_4px_rgba(0,0,0,0.06)]"
          >
            <div className="flex items-center gap-2 mb-3">
              <Camera size={16} className="text-[#8C8C8C]" />
              <h3 className="text-[#1A1A1A] font-bold text-sm">现场照片 ({claim.images.length})</h3>
            </div>
            <div className="grid grid-cols-3 gap-2">
              {claim.images.map((img) => (
                <div key={img.id} className="aspect-square rounded-lg overflow-hidden bg-[#F5F5F5]">
                  <img src={img.url} alt="" className="w-full h-full object-cover" />
                </div>
              ))}
            </div>
          </motion.div>
        )}
      </div>

      {/* Bottom action bar */}
      {(showPayBtn || showReviewBtn) && (
        <motion.div
          initial={{ y: 60 }} animate={{ y: 0 }}
          className="fixed bottom-0 left-0 right-0 bg-white/95 backdrop-blur-md border-t border-[#F0F0F0] p-4 safe-bottom"
        >
          {showPayBtn && (
            <motion.button
              whileTap={{ scale: 0.97 }}
              className="w-full bg-[#00B96B] text-white py-3.5 rounded-xl text-base font-semibold shadow-lg shadow-[#00B96B]/20 flex items-center justify-center gap-2"
              onClick={() => navigate(`/claims/${claim.id}/payment`)}
            >
              <CreditCard size={18} />
              立即支付 ¥{amount.toLocaleString()}
            </motion.button>
          )}
          {showReviewBtn && (
            <motion.button
              whileTap={{ scale: 0.97 }}
              className="w-full bg-[#00B96B] text-white py-3.5 rounded-xl text-base font-semibold shadow-lg shadow-[#00B96B]/20 flex items-center justify-center gap-2"
              onClick={() => navigate(`/claims/${claim.id}/review`)}
            >
              <Star size={18} />
              评价维修服务
            </motion.button>
          )}
        </motion.div>
      )}
    </div>
  );
}
