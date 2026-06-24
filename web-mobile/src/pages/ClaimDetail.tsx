import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { getClaimDetail } from '../api';

interface ClaimDetail {
  id: number;
  claimNo: string;
  status: string;
  description: string;
  createdAt: string;
  assessmentAmount: number | null;
  finalAmount: number | null;
  policy: { policyNo: string; type: string; vehicle: { plateNo: string; brand: string; model: string } };
  images: { id: number; url: string }[];
  damageReport: { parts: string; totalEstimate: number; aiRawResponse: string | null } | null;
  shop: { name: string; certification: string; rating: number } | null;
}

const STATUS_FLOW = ['DRAFT', 'SUBMITTED', 'UNDER_REVIEW', 'ASSESSED', 'REPAIRING', 'AWAITING_PAYMENT', 'CLOSED'];
const STATUS_LABELS: Record<string, string> = {
  DRAFT: '草稿',
  SUBMITTED: '已提交',
  UNDER_REVIEW: '审核中',
  ASSESSED: '已定损',
  REPAIRING: '维修中',
  AWAITING_PAYMENT: '待支付',
  CLOSED: '已完成',
  REJECTED: '已拒绝',
};

export default function ClaimDetail() {
  const { id } = useParams();
  const [claim, setClaim] = useState<ClaimDetail | null>(null);
  const navigate = useNavigate();

  useEffect(() => {
    if (id) getClaimDetail(Number(id)).then((res: any) => setClaim(res)).catch(() => {});
  }, [id]);

  if (!claim) return <div className="min-h-screen bg-black text-neutral-600 p-6">加载中...</div>;

  const isRejected = claim.status === 'REJECTED';
  const currentStep = STATUS_FLOW.indexOf(claim.status);

  return (
    <div className="min-h-screen bg-black pb-8">
      <header className="px-6 py-4 border-b-2 border-neutral-800 flex items-center gap-4">
        <button className="text-white text-lg" onClick={() => navigate(-1)}>←</button>
        <h1 className="text-white font-bold">理赔详情</h1>
      </header>

      <div className="px-6 py-6 space-y-6">
        <div className="border-2 border-neutral-800 p-5">
          <span className="text-neutral-400 text-xs font-mono">{claim.claimNo}</span>
          <h2 className="text-white text-3xl font-black mt-1">{claim.policy.vehicle.plateNo}</h2>
          <p className="text-neutral-400 text-sm">{claim.policy.vehicle.brand} {claim.policy.vehicle.model}</p>
          <div className="mt-3 pt-3 border-t border-neutral-800">
            <span className="bg-white text-black px-2 py-0.5 text-xs font-bold">
              {STATUS_LABELS[claim.status] || claim.status}
            </span>
          </div>
        </div>

        <div className="border-2 border-neutral-800 p-5">
          <h3 className="text-white font-bold mb-4">处理进度</h3>
          <div className="space-y-3">
            {STATUS_FLOW.map((status, idx) => {
              const done = !isRejected && idx <= currentStep;
              const isCurrent = !isRejected && idx === currentStep;
              return (
                <div key={status} className="flex items-center gap-3">
                  <div className={`w-6 h-6 rounded-full flex items-center justify-center text-xs ${done ? 'bg-white text-black' : 'bg-neutral-800 text-neutral-600'} ${isCurrent ? 'ring-2 ring-white ring-offset-2 ring-offset-black' : ''}`}>
                    {done ? '✓' : idx + 1}
                  </div>
                  <span className={`${done ? 'text-white' : 'text-neutral-600'} text-sm`}>{STATUS_LABELS[status]}</span>
                </div>
              );
            })}
            {isRejected && (
              <div className="flex items-center gap-3 text-red-500">
                <div className="w-6 h-6 rounded-full bg-red-900 flex items-center justify-center text-xs">✗</div>
                <span className="text-sm font-bold">理赔被拒绝</span>
              </div>
            )}
          </div>
        </div>

        <div className="border-2 border-neutral-800 p-5">
          <h3 className="text-white font-bold mb-3">事故描述</h3>
          <p className="text-neutral-400 text-sm">{claim.description}</p>
        </div>

        {claim.damageReport && (
          <div className="border-2 border-neutral-800 p-5">
            <h3 className="text-white font-bold mb-3">AI定损报告</h3>
            <div className="space-y-2">
              <div className="flex justify-between">
                <span className="text-neutral-500 text-sm">受损部位</span>
                <span className="text-white text-sm">{claim.damageReport.parts}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-neutral-500 text-sm">预估费用</span>
                <span className="text-white font-bold text-lg">¥{claim.damageReport.totalEstimate.toFixed(0)}</span>
              </div>
            </div>
          </div>
        )}

        {claim.shop && (
          <div className="border-2 border-neutral-800 p-5">
            <h3 className="text-white font-bold mb-3">维修门店</h3>
            <p className="text-white">{claim.shop.name}</p>
            <p className="text-neutral-500 text-sm">{claim.shop.certification} · 评分 {claim.shop.rating}</p>
          </div>
        )}

        {claim.images.length > 0 && (
          <div className="border-2 border-neutral-800 p-5">
            <h3 className="text-white font-bold mb-3">现场照片 ({claim.images.length})</h3>
            <div className="grid grid-cols-3 gap-2">
              {claim.images.map((img) => (
                <div key={img.id} className="aspect-square bg-neutral-900 border border-neutral-800 flex items-center justify-center">
                  <img src={img.url} alt="" className="w-full h-full object-cover" />
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
