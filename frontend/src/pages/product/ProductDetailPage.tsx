import { useParams } from '@tanstack/react-router';
import { ShoppingCart } from 'lucide-react';
import { useGetProduct } from '@/hooks/useQueries';
import { useCart } from '@/hooks/useCart';
import { Button } from '@/components/ui/button';
import ImageZoom from '@/components/products/ImageZoom';
import RelatedProducts from '@/components/products/RelatedProducts';
import { ProductDetailSkeleton } from '@/components/common/LoadingSkeleton';
import ErrorState from '@/components/common/ErrorState';
import Seo from '@/components/seo/Seo';
import { toast } from 'sonner';

export default function ProductDetailPage() {
  const { productId } = useParams({ strict: false }) as { productId: string };
  const { data: product, isLoading, error, refetch } = useGetProduct(productId);
  const { addItem } = useCart();

  if (isLoading) {
    return <ProductDetailSkeleton />;
  }

  if (error || !product) {
    return (
      <ErrorState 
        message="Product not found or failed to load" 
        onRetry={() => refetch()} 
      />
    );
  }

  const priceInDollars = (Number(product.price) / 100).toFixed(2);

  const handleAddToCart = () => {
    addItem(product);
    toast.success('Added to cart');
  };

  return (
    <>
      <Seo 
        title={product.name} 
        description={product.description}
      />

      <div className="container mx-auto px-4 py-12">
        <div className="grid gap-8 lg:grid-cols-2 lg:gap-12">
          {/* Image */}
          <div>
            <ImageZoom image={product.image} alt={product.name} />
          </div>

          {/* Details */}
          <div className="space-y-6">
            <div>
              <h1 className="mb-2 font-serif text-4xl">{product.name}</h1>
              <p className="text-2xl font-medium">${priceInDollars}</p>
            </div>

            <div className="prose prose-sm max-w-none">
              <p className="text-muted-foreground">{product.description}</p>
            </div>

            <Button size="lg" className="w-full" onClick={handleAddToCart}>
              <ShoppingCart className="mr-2 h-5 w-5" />
              Add to Cart
            </Button>

            <div className="border-t border-border pt-6">
              <h3 className="mb-4 font-serif text-lg">Product Details</h3>
              <dl className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <dt className="text-muted-foreground">Material</dt>
                  <dd className="font-medium">Premium Quality</dd>
                </div>
                <div className="flex justify-between">
                  <dt className="text-muted-foreground">Shipping</dt>
                  <dd className="font-medium">Free Worldwide</dd>
                </div>
                <div className="flex justify-between">
                  <dt className="text-muted-foreground">Returns</dt>
                  <dd className="font-medium">30-Day Policy</dd>
                </div>
              </dl>
            </div>
          </div>
        </div>

        {/* Reviews Section (Placeholder) */}
        <section className="mt-16 border-t border-border pt-16">
          <h2 className="mb-8 font-serif text-3xl">Customer Reviews</h2>
          <div className="rounded-sm bg-muted/30 p-12 text-center">
            <p className="text-muted-foreground">No reviews yet. Be the first to review this product!</p>
          </div>
        </section>
      </div>

      {/* Related Products */}
      <RelatedProducts currentProductId={product.id} />
    </>
  );
}
