import { Minus, Plus, Trash2 } from 'lucide-react';
import type { CartItem } from '@/hooks/useCart';
import { Button } from '@/components/ui/button';
import { Link } from '@tanstack/react-router';

interface CartLineItemProps {
  item: CartItem;
  onUpdateQuantity: (productId: string, quantity: number) => void;
  onRemove: (productId: string) => void;
}

export default function CartLineItem({ item, onUpdateQuantity, onRemove }: CartLineItemProps) {
  const { product, quantity } = item;
  const imageUrl = product.image.getDirectURL();
  const priceInDollars = (Number(product.price) / 100).toFixed(2);
  const totalPrice = ((Number(product.price) * quantity) / 100).toFixed(2);

  return (
    <div className="flex gap-4 border-b border-border py-6">
      <Link
        to="/product/$productId"
        params={{ productId: product.id }}
        className="flex-shrink-0"
      >
        <img
          src={imageUrl}
          alt={product.name}
          className="h-24 w-24 rounded-sm object-cover"
        />
      </Link>

      <div className="flex flex-1 flex-col justify-between">
        <div>
          <Link
            to="/product/$productId"
            params={{ productId: product.id }}
            className="font-serif text-lg hover:text-foreground/80 transition-colors focus-visible-ring"
          >
            {product.name}
          </Link>
          <p className="mt-1 text-sm text-muted-foreground">${priceInDollars} each</p>
        </div>

        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="icon"
              className="h-8 w-8"
              onClick={() => onUpdateQuantity(product.id, quantity - 1)}
              aria-label="Decrease quantity"
            >
              <Minus className="h-4 w-4" />
            </Button>
            <span className="w-8 text-center text-sm font-medium" aria-label={`Quantity: ${quantity}`}>
              {quantity}
            </span>
            <Button
              variant="outline"
              size="icon"
              className="h-8 w-8"
              onClick={() => onUpdateQuantity(product.id, quantity + 1)}
              aria-label="Increase quantity"
            >
              <Plus className="h-4 w-4" />
            </Button>
          </div>

          <div className="flex items-center gap-4">
            <p className="font-medium">${totalPrice}</p>
            <Button
              variant="ghost"
              size="icon"
              className="h-8 w-8 text-destructive hover:text-destructive"
              onClick={() => onRemove(product.id)}
              aria-label="Remove item"
            >
              <Trash2 className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
