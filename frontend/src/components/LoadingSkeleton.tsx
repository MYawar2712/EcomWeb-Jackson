export function CategorySkeletonCard() {
  return (
    <div className="animate-pulse rounded-2xl border border-neutral-200 bg-white p-6 shadow-sm">
      <div className="h-6 w-1/2 bg-neutral-200 rounded"></div>
      <div className="mt-3 space-y-2">
        <div className="h-4 w-full bg-neutral-100 rounded"></div>
        <div className="h-4 w-2/3 bg-neutral-100 rounded"></div>
      </div>
      <div className="mt-6 flex items-center justify-between">
        <div className="h-4 w-20 bg-neutral-200 rounded-full"></div>
        <div className="h-4 w-16 bg-neutral-100 rounded"></div>
      </div>
    </div>
  );
}

export function ProductSkeletonCard() {
  return (
    <div className="animate-pulse rounded-2xl border border-neutral-200 bg-white p-5 shadow-sm">
      <div className="aspect-square w-full rounded-xl bg-neutral-100"></div>
      <div className="mt-4 space-y-2">
        <div className="h-3 w-16 bg-neutral-200 rounded"></div>
        <div className="h-5 w-3/4 bg-neutral-200 rounded"></div>
        <div className="h-4 w-1/3 bg-neutral-200 rounded"></div>
      </div>
      <div className="mt-5 flex items-center justify-between pt-3 border-t border-neutral-100">
        <div className="h-4 w-16 bg-neutral-200 rounded-full"></div>
        <div className="h-8 w-24 bg-neutral-200 rounded-lg"></div>
      </div>
    </div>
  );
}

export function ProductDetailSkeleton() {
  return (
    <div className="animate-pulse grid grid-cols-1 md:grid-cols-2 gap-10 py-6">
      <div className="aspect-square w-full rounded-2xl bg-neutral-100"></div>
      <div className="space-y-4">
        <div className="h-4 w-24 bg-neutral-200 rounded"></div>
        <div className="h-8 w-3/4 bg-neutral-200 rounded"></div>
        <div className="h-6 w-32 bg-neutral-200 rounded"></div>
        <div className="space-y-2 pt-4">
          <div className="h-4 w-full bg-neutral-100 rounded"></div>
          <div className="h-4 w-5/6 bg-neutral-100 rounded"></div>
          <div className="h-4 w-2/3 bg-neutral-100 rounded"></div>
        </div>
        <div className="pt-6 space-y-3">
          <div className="h-10 w-full bg-neutral-100 rounded-xl"></div>
          <div className="h-12 w-full bg-neutral-200 rounded-xl"></div>
        </div>
      </div>
    </div>
  );
}
