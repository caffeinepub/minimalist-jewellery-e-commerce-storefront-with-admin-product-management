import { Link } from '@tanstack/react-router';
import { ShoppingCart } from 'lucide-react';
import type { Product } from '@/backend';
import { Button } from '@/components/ui/button';
import { useCart } from '@/hooks/useCart';
import { toast } from 'sonner';

interface ProductCardProps {
  product: Product;
}

export default function ProductCard({ product }: ProductCardProps) {
  const { addItem } = useCart();
  const imageUrl = product.image.getDirectURL();
  const priceInDollars = (Number(product.price) / 100).toFixed(2);

  const handleAddToCart = (e: React.MouseEvent) => {
    e.preventDefault();
    addItem(product);
    toast.success('Added to cart');
  };

  return (
    <Link
      to="/product/$productId"
      params={{ productId: product.id }}
      className="group block space-y-3 focus-visible-ring rounded-sm"
    >
      <div className="aspect-product overflow-hidden rounded-sm bg-muted">
        <img
          src={imageUrl}
          alt={product.name}
          loading="lazy"
          className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
        />
      </div>
      <div className="space-y-2">
        <h3 className="font-serif text-lg leading-tight text-foreground group-hover:text-foreground/80 transition-colors">
          {product.name}
        </h3>
        <div className="flex items-center justify-between">
          <p className="text-sm font-medium">${priceInDollars}</p>
          <Button
            size="sm"
            variant="outline"
            onClick={handleAddToCart}
            className="opacity-0 group-hover:opacity-100 transition-opacity"
          >
            <ShoppingCart className="h-4 w-4" />
          </Button>
        </div>
      </div>
    </Link>
  );
}
