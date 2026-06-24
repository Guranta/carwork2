import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { MapPin, Star, ChevronRight, Navigation } from 'lucide-react';
import { getNearbyShops } from '../api';
import { ListSkeleton, EmptyState } from '../components/ui';
import TabBar from '../components/TabBar';

interface Shop {
  id: number;
  name: string;
  certification: string;
  rating: number;
  reviewCount: number;
  basePrice: number;
  distance: number;
  distanceText: string;
}

const SORT_OPTIONS = [
  { key: 'distance', label: '距离最近' },
  { key: 'rating', label: '评分最高' },
  { key: 'price', label: '价格最低' },
];

const CERT_COLORS: Record<string, string> = {
  '4S店': 'bg-[#FFF1F0] text-[#FF4D4F]',
  '认证维修': 'bg-[#E6F9F1] text-[#00B96B]',
  '快修连锁': 'bg-[#E6F4FF] text-[#1677FF]',
};

export default function NearbyShops() {
  const [shops, setShops] = useState<Shop[]>([]);
  const [loading, setLoading] = useState(true);
  const [sort, setSort] = useState('distance');

  useEffect(() => {
    setLoading(true);
    getNearbyShops(39.9671, 116.3527, sort)
      .then((res: any) => setShops(res))
      .catch(() => {})
      .finally(() => setLoading(false));
  }, [sort]);

  return (
    <div className="min-h-screen bg-[#F5F7FA] pb-20">
      {/* Location bar */}
      <div className="bg-white px-5 pt-12 pb-3 sticky top-0 z-40 border-b border-[#F0F0F0]">
        <div className="flex items-center gap-1.5 mb-3">
          <Navigation size={14} className="text-[#00B96B]" />
          <span className="text-[#8C8C8C] text-xs">当前位置：北京市海淀区中关村</span>
        </div>
        <div className="flex gap-2">
          {SORT_OPTIONS.map((opt) => (
            <button
              key={opt.key}
              className={`px-3 py-1 rounded-full text-xs font-medium transition-colors ${
                sort === opt.key ? 'bg-[#00B96B] text-white' : 'bg-[#F5F5F5] text-[#8C8C8C]'
              }`}
              onClick={() => setSort(opt.key)}
            >
              {opt.label}
            </button>
          ))}
        </div>
      </div>

      <div className="px-4 pt-4">
        {loading ? (
          <ListSkeleton count={4} />
        ) : shops.length === 0 ? (
          <EmptyState icon={<MapPin size={56} strokeWidth={1.5} />} title="附近暂无修理厂" />
        ) : (
          <div className="space-y-3">
            {shops.map((shop, idx) => (
              <motion.button
                key={shop.id}
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, delay: idx * 0.05 }}
                className="w-full text-left bg-white rounded-xl shadow-[0_1px_4px_rgba(0,0,0,0.06)] p-4 active:scale-[0.98] transition-transform"
              >
                <div className="flex items-start justify-between mb-3">
                  <div className="flex-1 min-w-0">
                    <p className="text-[#1A1A1A] font-semibold text-base truncate">{shop.name}</p>
                    <span className={`inline-block mt-1 px-2 py-0.5 rounded text-xs font-medium ${CERT_COLORS[shop.certification] || 'bg-[#F5F5F5] text-[#8C8C8C]'}`}>
                      {shop.certification}
                    </span>
                  </div>
                  <span className="bg-[#F5F5F5] text-[#595959] px-2.5 py-1 rounded-lg text-xs font-medium whitespace-nowrap">
                    {shop.distanceText}
                  </span>
                </div>
                <div className="flex items-center justify-between pt-3 border-t border-[#F0F0F0]">
                  <div className="flex items-center gap-3">
                    <div className="flex items-center gap-1">
                      <Star size={13} className="text-[#FAAD14] fill-[#FAAD14]" />
                      <span className="text-[#1A1A1A] text-sm font-medium">{shop.rating}</span>
                    </div>
                    <span className="text-[#BFBFBF] text-xs">{shop.reviewCount} 条评价</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <span className="text-[#8C8C8C] text-xs">起</span>
                    <span className="text-[#FF4D4F] font-bold">¥{shop.basePrice}</span>
                    <ChevronRight size={14} className="text-[#BFBFBF]" />
                  </div>
                </div>
              </motion.button>
            ))}
          </div>
        )}
      </div>

      <TabBar />
    </div>
  );
}
