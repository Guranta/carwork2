import { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Star, Check } from 'lucide-react';
import { createReview } from '../api';
import { NavBar, Button } from '../components/ui';

const TAGS = ['服务态度好', '维修速度快', '价格合理', '环境整洁', '专业靠谱'];

export default function Review() {
  const { id } = useParams();
  const [rating, setRating] = useState(0);
  const [hoverRating, setHoverRating] = useState(0);
  const [comment, setComment] = useState('');
  const [selectedTags, setSelectedTags] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);
  const [done, setDone] = useState(false);
  const navigate = useNavigate();

  const toggleTag = (tag: string) => {
    setSelectedTags((prev) =>
      prev.includes(tag) ? prev.filter((t) => t !== tag) : [...prev, tag],
    );
  };

  const handleSubmit = async () => {
    if (rating === 0) return;
    setLoading(true);
    try {
      const fullComment = [...selectedTags, comment].filter(Boolean).join('；');
      await createReview({ claimId: Number(id), rating, comment: fullComment });
      setDone(true);
      setTimeout(() => navigate(`/claims/${id}`, { replace: true }), 1800);
    } catch {} finally { setLoading(false); }
  };

  if (done) {
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
          评价提交成功
        </motion.h1>
        <motion.p
          initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.4 }}
          className="text-[#8C8C8C] text-sm mt-2"
        >
          感谢您的评价
        </motion.p>
      </div>
    );
  }

  const displayRating = hoverRating || rating;

  return (
    <div className="min-h-screen bg-[#F5F7FA]">
      <NavBar title="评价维修服务" />

      <div className="px-4 pt-2 space-y-3">
        {/* Rating */}
        <motion.div
          initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }}
          className="bg-white rounded-2xl p-6 shadow-[0_1px_4px_rgba(0,0,0,0.06)] text-center"
        >
          <p className="text-[#8C8C8C] text-sm mb-4">为本次服务打分</p>
          <div className="flex justify-center gap-3">
            {[1, 2, 3, 4, 5].map((n) => (
              <motion.button
                key={n}
                whileTap={{ scale: 0.8 }}
                onClick={() => setRating(n)}
                onMouseEnter={() => setHoverRating(n)}
                onMouseLeave={() => setHoverRating(0)}
              >
                <motion.div
                  animate={{ scale: n === displayRating && rating === n ? [1, 1.3, 1] : 1 }}
                  transition={{ duration: 0.3 }}
                >
                  <Star
                    size={36}
                    className={n <= displayRating ? 'text-[#FAAD14] fill-[#FAAD14]' : 'text-[#E8E8E8]'}
                  />
                </motion.div>
              </motion.button>
            ))}
          </div>
          <p className="text-[#1A1A1A] text-sm font-medium mt-3 h-5">
            {['', '很不满意', '不太满意', '一般', '比较满意', '非常满意'][displayRating]}
          </p>
        </motion.div>

        {/* Tags */}
        <motion.div
          initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.05 }}
          className="bg-white rounded-2xl p-5 shadow-[0_1px_4px_rgba(0,0,0,0.06)]"
        >
          <p className="text-[#1A1A1A] font-bold text-sm mb-3">亮点评价</p>
          <div className="flex flex-wrap gap-2">
            {TAGS.map((tag) => {
              const active = selectedTags.includes(tag);
              return (
                <motion.button
                  key={tag}
                  whileTap={{ scale: 0.95 }}
                  className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-colors ${
                    active ? 'bg-[#E6F9F1] text-[#00B96B] border border-[#00B96B]' : 'bg-[#F5F5F5] text-[#8C8C8C]'
                  }`}
                  onClick={() => toggleTag(tag)}
                >
                  {active && '✓ '}{tag}
                </motion.button>
              );
            })}
          </div>
        </motion.div>

        {/* Comment */}
        <motion.div
          initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}
          className="bg-white rounded-2xl p-4 shadow-[0_1px_4px_rgba(0,0,0,0.06)]"
        >
          <textarea
            className="w-full bg-transparent text-[#1A1A1A] text-sm outline-none resize-none min-h-24 leading-relaxed placeholder:text-[#BFBFBF]"
            placeholder="分享您的维修体验..."
            value={comment}
            onChange={(e) => setComment(e.target.value)}
            maxLength={200}
          />
          <p className="text-right text-[#BFBFBF] text-xs">{comment.length}/200</p>
        </motion.div>
      </div>

      {/* Submit button */}
      <div className="fixed bottom-0 left-0 right-0 bg-white/95 backdrop-blur-md border-t border-[#F0F0F0] p-4 safe-bottom">
        <Button block size="lg" disabled={rating === 0 || loading} onClick={handleSubmit}>
          {loading ? '提交中...' : '提交评价'}
        </Button>
      </div>
    </div>
  );
}
