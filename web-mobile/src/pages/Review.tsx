import { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { createReview } from '../api';

export default function Review() {
  const { id } = useParams();
  const [rating, setRating] = useState(5);
  const [comment, setComment] = useState('');
  const [loading, setLoading] = useState(false);
  const [done, setDone] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async () => {
    setLoading(true);
    try {
      await createReview({ claimId: Number(id), rating, comment });
      setDone(true);
      setTimeout(() => navigate(`/claims/${id}`, { replace: true }), 1500);
    } catch {} finally { setLoading(false); }
  };

  if (done) {
    return (
      <div className="min-h-screen bg-black flex flex-col items-center justify-center px-6">
        <div className="text-6xl mb-4">✓</div>
        <h1 className="text-white text-2xl font-black mb-2">评价提交成功</h1>
        <p className="text-neutral-500 text-sm">感谢您的评价</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black">
      <header className="px-6 py-4 border-b-2 border-neutral-800 flex items-center gap-4">
        <button className="text-white text-lg" onClick={() => navigate(-1)}>←</button>
        <h1 className="text-white font-bold">评价修理厂</h1>
      </header>

      <div className="px-6 py-8">
        <div className="border-2 border-neutral-800 p-6 mb-6">
          <p className="text-neutral-500 text-sm mb-4">整体评分</p>
          <div className="flex gap-2">
            {[1, 2, 3, 4, 5].map((n) => (
              <button
                key={n}
                className={`text-4xl ${n <= rating ? 'text-white' : 'text-neutral-700'}`}
                onClick={() => setRating(n)}
              >
                ★
              </button>
            ))}
          </div>
        </div>

        <textarea
          className="w-full border-2 border-neutral-800 bg-transparent text-white p-4 outline-none focus:border-white min-h-32 resize-none"
          placeholder="分享您的维修体验..."
          value={comment}
          onChange={(e) => setComment(e.target.value)}
        />

        <button
          className="w-full bg-white text-black py-4 text-lg font-black mt-6 disabled:opacity-50"
          onClick={handleSubmit}
          disabled={loading}
        >
          {loading ? '提交中...' : '提交评价'}
        </button>
      </div>
    </div>
  );
}
