import { ProductSkeletonCard, CategorySkeletonCard } from '@/components/LoadingSkeleton';

export default function Loading() {
  return (
    <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8 space-y-12 animate-in fade-in duration-300">
      <div className="space-y-3">
        <div className="h-4 w-32 bg-neutral-200 rounded animate-pulse"></div>
        <div className="h-10 w-72 bg-neutral-200 rounded animate-pulse"></div>
        <div className="h-4 w-96 bg-neutral-100 rounded animate-pulse"></div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        <CategorySkeletonCard />
        <CategorySkeletonCard />
        <CategorySkeletonCard />
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 pt-6">
        <ProductSkeletonCard />
        <ProductSkeletonCard />
        <ProductSkeletonCard />
        <ProductSkeletonCard />
      </div>
    </div>
  );
}
