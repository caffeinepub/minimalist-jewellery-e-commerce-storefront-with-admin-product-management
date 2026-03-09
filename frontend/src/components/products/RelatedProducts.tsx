import { useGetAllProducts } from '@/hooks/useQueries';
import type { Product } from '@/backend';
import ProductCard from './ProductCard';
import { ProductGridSkeleton } from '../common/LoadingSkeleton';

interface RelatedProductsProps {
  currentProductId: string;
  category?: string;
}

export default function RelatedProducts({ currentProductId, category }: RelatedProductsProps) {
  const { data: products, isLoading } = useGetAllProducts();

  if (isLoading) {
    return (
      <section className="py-12">
        <div className="container mx-auto px-4">
          <h2 className="mb-8 text-center font-serif text-3xl">Related Products</h2>
          <ProductGridSkeleton count={4} />
        </div>
      </section>
    );
  }

  const relatedProducts = products
    ?.filter((p: Product) => p.id !== currentProductId)
    .slice(0, 4) || [];

  if (relatedProducts.length === 0) {
    return null;
  }

  return (
    <section className="border-t border-border py-12">
      <div className="container mx-auto px-4">
        <h2 className="mb-8 text-center font-serif text-3xl">You May Also Like</h2>
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {relatedProducts.map((product: Product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      </div>
    </section>
  );
}
