import { useGetAllProducts } from '@/hooks/useQueries';
import ProductCard from './ProductCard';
import { ProductGridSkeleton } from '../common/LoadingSkeleton';
import ErrorState from '../common/ErrorState';

export default function FeaturedProducts() {
  const { data: products, isLoading, error, refetch } = useGetAllProducts();

  if (isLoading) {
    return (
      <section className="py-16">
        <div className="container mx-auto px-4">
          <h2 className="mb-12 text-center font-serif text-4xl">Featured Collection</h2>
          <ProductGridSkeleton count={4} />
        </div>
      </section>
    );
  }

  if (error) {
    return (
      <section className="py-16">
        <div className="container mx-auto px-4">
          <ErrorState message="Failed to load featured products" onRetry={() => refetch()} />
        </div>
      </section>
    );
  }

  const featuredProducts = products?.slice(0, 4) || [];

  if (featuredProducts.length === 0) {
    return null;
  }

  return (
    <section className="py-16 bg-muted/30">
      <div className="container mx-auto px-4">
        <h2 className="mb-12 text-center font-serif text-4xl">Featured Collection</h2>
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {featuredProducts.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      </div>
    </section>
  );
}
