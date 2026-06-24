import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Check, Camera, X, ChevronRight, MapPin } from 'lucide-react';
import { getPolicies, createClaim, uploadClaimImages } from '../api';
import { NavBar, Button } from '../components/ui';

export default function CreateClaim() {
  const navigate = useNavigate();
  const { id: presetPolicyId } = useParams();
  const [policyId, setPolicyId] = useState(presetPolicyId || '');
  const [policies, setPolicies] = useState<any[]>([]);
  const [description, setDescription] = useState('');
  const [images, setImages] = useState<File[]>([]);
  const [previews, setPreviews] = useState<string[]>([]);
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    getPolicies('ACTIVE').then((res: any) => {
      setPolicies(res);
      if (!presetPolicyId && res.length > 0) setPolicyId(String(res[0].id));
    });
  }, []);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files) return;
    const files = Array.from(e.target.files);
    setImages(files);
    setPreviews(files.map((f) => URL.createObjectURL(f)));
  };

  const removeImage = (idx: number) => {
    URL.revokeObjectURL(previews[idx]);
    const newImgs = images.filter((_, i) => i !== idx);
    setImages(newImgs);
    setPreviews(newImgs.map((f) => URL.createObjectURL(f)));
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
    } catch { setError('提交失败，请重试'); } finally { setLoading(false); }
  };

  return (
    <div className="min-h-screen bg-[#F5F7FA]">
      <NavBar title="出险报案" right={<span className="text-[#BFBFBF] text-xs">第 {step}/3 步</span>} />

      {/* Steps indicator */}
      <div className="px-6 py-5 flex items-center gap-2">
        {[1, 2, 3].map((n, i) => (
          <div key={n} className="flex-1 flex items-center">
            <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-semibold transition-colors ${
              step >= n ? 'bg-[#00B96B] text-white' : 'bg-[#F0F0F0] text-[#BFBFBF]'
            }`}>
              {step > n ? <Check size={16} strokeWidth={3} /> : n}
            </div>
            {i < 2 && (
              <div className={`flex-1 h-0.5 mx-2 transition-colors ${step > n ? 'bg-[#00B96B]' : 'bg-[#F0F0F0]'}`} />
            )}
          </div>
        ))}
      </div>

      <AnimatePresence mode="wait">
        {/* Step 1: Select policy */}
        {step === 1 && (
          <motion.div
            key="step1"
            initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }}
            className="px-4 space-y-3"
          >
            <p className="text-[#1A1A1A] font-bold text-base px-1">选择出险保单</p>
            {policies.map((p) => {
              const selected = String(policyId) === String(p.id);
              return (
                <motion.button
                  key={p.id}
                  whileTap={{ scale: 0.98 }}
                  className={`w-full text-left bg-white rounded-xl p-4 border-2 transition-colors ${
                    selected ? 'border-[#00B96B]' : 'border-transparent shadow-[0_1px_4px_rgba(0,0,0,0.06)]'
                  }`}
                  onClick={() => setPolicyId(String(p.id))}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex-1">
                      <p className="text-[#1A1A1A] font-semibold">{p.vehicle.plateNo}</p>
                      <p className="text-[#8C8C8C] text-xs">{p.type} · {p.vehicle.brand} {p.vehicle.model}</p>
                    </div>
                    <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${
                      selected ? 'bg-[#00B96B] border-[#00B96B]' : 'border-[#D9D9D9]'
                    }`}>
                      {selected && <Check size={12} className="text-white" strokeWidth={3} />}
                    </div>
                  </div>
                </motion.button>
              );
            })}
            <div className="pt-4">
              <Button block size="lg" disabled={!policyId} onClick={() => setStep(2)}>
                下一步 <ChevronRight size={18} />
              </Button>
            </div>
          </motion.div>
        )}

        {/* Step 2: Description */}
        {step === 2 && (
          <motion.div
            key="step2"
            initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }}
            className="px-4 space-y-4"
          >
            <p className="text-[#1A1A1A] font-bold text-base px-1">描述事故经过</p>
            <div className="bg-white rounded-xl shadow-[0_1px_4px_rgba(0,0,0,0.06)] p-4">
              <textarea
                className="w-full bg-transparent text-[#1A1A1A] text-sm outline-none resize-none min-h-32 leading-relaxed placeholder:text-[#BFBFBF]"
                placeholder="请描述事故发生的时间、地点和经过..."
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                maxLength={500}
              />
              <p className="text-right text-[#BFBFBF] text-xs">{description.length}/500</p>
            </div>
            <div className="flex items-start gap-2 px-1">
              <MapPin size={14} className="text-[#BFBFBF] mt-0.5 shrink-0" />
              <p className="text-[#BFBFBF] text-xs">已自动获取定位：北京市海淀区</p>
            </div>
            <div className="flex gap-3 pt-2">
              <Button variant="secondary" className="flex-1" onClick={() => setStep(1)}>上一步</Button>
              <Button className="flex-1" disabled={!description} onClick={() => setStep(3)}>下一步</Button>
            </div>
          </motion.div>
        )}

        {/* Step 3: Upload photos */}
        {step === 3 && (
          <motion.div
            key="step3"
            initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }}
            className="px-4 space-y-4"
          >
            <div>
              <p className="text-[#1A1A1A] font-bold text-base px-1">上传现场照片</p>
              <p className="text-[#BFBFBF] text-xs px-1 mt-0.5">拍摄车辆受损部位，AI 将自动识别损伤</p>
            </div>

            {previews.length === 0 ? (
              <label className="block">
                <input type="file" accept="image/*" multiple onChange={handleFileChange} className="hidden" />
                <div className="bg-white rounded-xl border-2 border-dashed border-[#D9D9D9] py-12 flex flex-col items-center cursor-pointer active:bg-[#F5F7FA]">
                  <div className="w-14 h-14 rounded-full bg-[#E6F9F1] flex items-center justify-center mb-3">
                    <Camera size={24} className="text-[#00B96B]" />
                  </div>
                  <p className="text-[#1A1A1A] text-sm font-medium">点击上传照片</p>
                  <p className="text-[#BFBFBF] text-xs mt-1">最多 9 张</p>
                </div>
              </label>
            ) : (
              <div className="grid grid-cols-3 gap-2">
                {previews.map((src, idx) => (
                  <div key={idx} className="relative aspect-square rounded-lg overflow-hidden bg-[#F5F5F5] group">
                    <img src={src} alt="" className="w-full h-full object-cover" />
                    <button
                      className="absolute top-1 right-1 w-5 h-5 rounded-full bg-black/50 flex items-center justify-center"
                      onClick={() => removeImage(idx)}
                    >
                      <X size={12} className="text-white" />
                    </button>
                  </div>
                ))}
                {previews.length < 9 && (
                  <label className="aspect-square rounded-lg border-2 border-dashed border-[#D9D9D9] flex items-center justify-center cursor-pointer active:bg-[#F5F7FA]">
                    <input type="file" accept="image/*" multiple onChange={handleFileChange} className="hidden" />
                    <Camera size={20} className="text-[#BFBFBF]" />
                  </label>
                )}
              </div>
            )}

            {error && <p className="text-[#FF4D4F] text-sm font-medium px-1">{error}</p>}

            <div className="flex gap-3 pt-2">
              <Button variant="secondary" className="flex-1" onClick={() => setStep(2)}>上一步</Button>
              <Button className="flex-1" disabled={loading} onClick={handleSubmit}>
                {loading ? '提交中...' : '提交报案'}
              </Button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
