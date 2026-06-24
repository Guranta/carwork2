import { useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { getPolicies, createClaim, uploadClaimImages } from '../api';

export default function CreateClaim() {
  const navigate = useNavigate();
  const { id: presetPolicyId } = useParams();
  const [policyId, setPolicyId] = useState(presetPolicyId || '');
  const [policies, setPolicies] = useState<any[]>([]);
  const [description, setDescription] = useState('');
  const [images, setImages] = useState<File[]>([]);
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  useState(() => {
    getPolicies('ACTIVE').then((res: any) => {
      setPolicies(res);
      if (!presetPolicyId && res.length > 0) setPolicyId(String(res[0].id));
    });
  });

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) setImages(Array.from(e.target.files));
  };

  const handleSubmit = async () => {
    if (!policyId || !description) { setError('请填写完整信息'); return; }
    setError('');
    setLoading(true);
    try {
      const claim: any = await createClaim({
        policyId: Number(policyId),
        description,
        lat: 39.9671,
        lng: 116.3527,
      });

      if (images.length > 0) {
        const formData = new FormData();
        images.forEach((img) => formData.append('images', img));
        await uploadClaimImages(claim.id, formData);
      }

      navigate(`/claims/${claim.id}`, { replace: true });
    } catch { setError('报案失败'); } finally { setLoading(false); }
  };

  return (
    <div className="min-h-screen bg-black">
      <header className="px-6 py-4 border-b-2 border-neutral-800 flex items-center gap-4">
        <button className="text-white text-lg" onClick={() => navigate(-1)}>←</button>
        <h1 className="text-white font-bold">出险报案</h1>
      </header>

      <div className="px-6 py-6">
        <div className="flex items-center gap-2 mb-8">
          {[1, 2, 3].map((n) => (
            <div key={n} className="flex-1 flex items-center gap-2">
              <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-black border-2 ${step >= n ? 'bg-white text-black border-white' : 'bg-transparent text-neutral-600 border-neutral-700'}`}>
                {n}
              </div>
              {n < 3 && <div className={`flex-1 h-0.5 ${step > n ? 'bg-white' : 'bg-neutral-800'}`} />}
            </div>
          ))}
        </div>

        {step === 1 && (
          <div className="space-y-4">
            <h2 className="text-white text-lg font-bold">选择保单</h2>
            {policies.map((p) => (
              <div
                key={p.id}
                className={`border-2 p-4 cursor-pointer ${String(policyId) === String(p.id) ? 'border-white' : 'border-neutral-800'}`}
                onClick={() => setPolicyId(String(p.id))}
              >
                <p className="text-white font-bold">{p.vehicle.plateNo}</p>
                <p className="text-neutral-500 text-sm">{p.type} · {p.vehicle.brand} {p.vehicle.model}</p>
              </div>
            ))}
            <button
              className="w-full bg-white text-black py-4 text-lg font-black disabled:opacity-30"
              disabled={!policyId}
              onClick={() => setStep(2)}
            >
              下一步
            </button>
          </div>
        )}

        {step === 2 && (
          <div className="space-y-4">
            <h2 className="text-white text-lg font-bold">描述事故</h2>
            <textarea
              className="w-full border-2 border-neutral-800 bg-transparent text-white p-4 outline-none focus:border-white min-h-32 resize-none"
              placeholder="请描述事故发生的时间、地点和经过..."
              value={description}
              onChange={(e) => setDescription(e.target.value)}
            />
            <div className="flex gap-2">
              <button className="flex-1 border-2 border-neutral-700 text-neutral-400 py-4 font-bold" onClick={() => setStep(1)}>
                上一步
              </button>
              <button
                className="flex-1 bg-white text-black py-4 font-black disabled:opacity-30"
                disabled={!description}
                onClick={() => setStep(3)}
              >
                下一步
              </button>
            </div>
          </div>
        )}

        {step === 3 && (
          <div className="space-y-4">
            <h2 className="text-white text-lg font-bold">上传现场照片</h2>
            <p className="text-neutral-500 text-xs">拍摄车辆受损部位，AI将自动识别损伤</p>

            <div className="border-2 border-dashed border-neutral-700 p-8 text-center">
              <input type="file" accept="image/*" multiple onChange={handleFileChange} className="hidden" id="file-input" />
              <label htmlFor="file-input" className="cursor-pointer block">
                <div className="text-4xl mb-2">📷</div>
                <p className="text-neutral-400 text-sm">{images.length > 0 ? `已选 ${images.length} 张照片` : '点击上传照片'}</p>
              </label>
            </div>

            {images.length > 0 && (
              <div className="grid grid-cols-3 gap-2">
                {images.map((img, idx) => (
                  <div key={idx} className="aspect-square bg-neutral-900 border border-neutral-800 flex items-center justify-center text-neutral-600 text-xs">
                    {img.name.slice(0, 10)}
                  </div>
                ))}
              </div>
            )}

            {error && <p className="text-red-500 text-sm font-bold">{error}</p>}

            <div className="flex gap-2">
              <button className="flex-1 border-2 border-neutral-700 text-neutral-400 py-4 font-bold" onClick={() => setStep(2)}>
                上一步
              </button>
              <button
                className="flex-1 bg-white text-black py-4 font-black disabled:opacity-50"
                disabled={loading}
                onClick={handleSubmit}
              >
                {loading ? '提交中...' : '提交报案'}
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
