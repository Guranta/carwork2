export function SkeletonBlock({ className = '' }: { className?: string }) {
  return <div className={`skeleton ${className}`} />;
}

export function CardSkeleton() {
  return (
    <div className="bg-white rounded-xl p-4 shadow-[0_1px_4px_rgba(0,0,0,0.06)] space-y-3">
      <div className="flex justify-between">
        <SkeletonBlock className="h-3 w-24" />
        <SkeletonBlock className="h-5 w-12 rounded-full" />
      </div>
      <SkeletonBlock className="h-6 w-32" />
      <SkeletonBlock className="h-3 w-40" />
      <div className="pt-2 border-t border-[#F0F0F0] flex justify-between">
        <SkeletonBlock className="h-3 w-20" />
        <SkeletonBlock className="h-4 w-12" />
      </div>
    </div>
  );
}

export function ListSkeleton({ count = 3 }: { count?: number }) {
  return (
    <div className="space-y-3">
      {Array.from({ length: count }).map((_, i) => (
        <CardSkeleton key={i} />
      ))}
    </div>
  );
}
