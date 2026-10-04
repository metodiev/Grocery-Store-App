const SkeletonCard = () => {
  return (
    <div className="card overflow-hidden">
      <div className="h-44 animate-pulse bg-brand-secondary/20" />
      <div className="space-y-3 p-4">
        <div className="h-4 animate-pulse rounded bg-slate-200" />
        <div className="h-4 w-2/3 animate-pulse rounded bg-slate-200" />
        <div className="h-8 animate-pulse rounded bg-slate-200" />
      </div>
    </div>
  );
};

export default SkeletonCard;
