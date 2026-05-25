export function SkeletonBlock({ className = "" }) {
  return <div className={`animate-pulse rounded-2xl bg-white/10 ${className}`} aria-hidden />;
}

export function WeatherSkeleton() {
  return (
    <div className="space-y-4 animate-fade-in">
      {/* Hero */}
      <div className="rounded-3xl bg-white/5 p-8 space-y-4">
        <SkeletonBlock className="h-5 w-28" />
        <SkeletonBlock className="h-20 w-44" />
        <SkeletonBlock className="h-4 w-20" />
        <div className="grid grid-cols-3 gap-3 mt-4">
          {[1,2,3,4,5,6].map((i) => <SkeletonBlock key={i} className="h-16" />)}
        </div>
      </div>
      <SkeletonBlock className="h-24" />
      <SkeletonBlock className="h-52" />
      {/* Forecast */}      
      <div className="grid grid-cols-5 gap-3">
        {[1,2,3,4,5].map((i) => <SkeletonBlock key={i} className="h-28" />)}
      </div>
    </div>
  );
}
