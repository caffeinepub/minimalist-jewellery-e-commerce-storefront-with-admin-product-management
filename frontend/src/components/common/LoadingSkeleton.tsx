export function ProductCardSkeleton() {
  return (
    <div className="group space-y-3">
      <div className="aspect-product overflow-hidden rounded-sm bg-muted animate-shimmer" />
      <div className="space-y-2">
        <div className="h-4 w-3/4 rounded bg-muted animate-shimmer" />
        <div className="h-4 w-1/2 rounded bg-muted animate-shimmer" />
      </div>
    </div>
  );
}

export function ProductGridSkeleton({ count = 8 }: { count?: number }) {
  return (
    <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
      {Array.from({ length: count }).map((_, i) => (
        <ProductCardSkeleton key={i} />
      ))}
    </div>
  );
}

export function ProductDetailSkeleton() {
  return (
    <div className="container mx-auto px-4 py-12">
      <div className="grid gap-8 lg:grid-cols-2">
        <div className="aspect-square rounded-sm bg-muted animate-shimmer" />
        <div className="space-y-6">
          <div className="h-8 w-3/4 rounded bg-muted animate-shimmer" />
          <div className="h-6 w-1/4 rounded bg-muted animate-shimmer" />
          <div className="space-y-2">
            <div className="h-4 w-full rounded bg-muted animate-shimmer" />
            <div className="h-4 w-full rounded bg-muted animate-shimmer" />
            <div className="h-4 w-2/3 rounded bg-muted animate-shimmer" />
          </div>
          <div className="h-12 w-full rounded bg-muted animate-shimmer" />
        </div>
      </div>
    </div>
  );
}
