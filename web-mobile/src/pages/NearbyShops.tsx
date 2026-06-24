import { useEffect, useState } from 'react';
import { getNearbyShops } from '../api';

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
    <div className="min-h-screen bg-black">
      <header className="px-6 py-4 border-b-2 border-neutral-800 flex items-center gap-4">
        <h1 className="text-white font-bold">附近修理厂</h1>
      </header>

      <div className="px-6 py-3 flex gap-2 border-b border-neutral-800">
        {SORT_OPTIONS.map((opt) => (
          <button
            key={opt.key}
            className={`px-3 py-1 text-xs font-bold ${sort === opt.key ? 'bg-white text-black' : 'border border-neutral-700 text-neutral-400'}`}
            onClick={() => setSort(opt.key)}
          >
            {opt.label}
          </button>
        ))}
      </div>

      <div className="px-6 py-4">
        {loading ? (
          <p className="text-neutral-600 text-sm">定位中...</p>
        ) : shops.length === 0 ? (
          <p className="text-neutral-600 text-sm">附近暂无修理厂</p>
        ) : (
          <div className="space-y-3">
            {shops.map((shop) => (
              <div key={shop.id} className="border-2 border-neutral-800 p-4">
                <div className="flex justify-between items-start mb-2">
                  <div>
                    <p className="text-white font-bold">{shop.name}</p>
                    <span className="text-neutral-600 text-xs">{shop.certification}</span>
                  </div>
                  <span className="text-white text-sm font-bold">{shop.distanceText}</span>
                </div>
                <div className="flex justify-between items-center pt-3 border-t border-neutral-800">
                  <div className="flex items-center gap-3">
                    <span className="text-white text-sm">⭐ {shop.rating}</span>
                    <span className="text-neutral-600 text-xs">{shop.reviewCount}评价</span>
                  </div>
                  <span className="text-white font-bold">¥{shop.basePrice}起</span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
