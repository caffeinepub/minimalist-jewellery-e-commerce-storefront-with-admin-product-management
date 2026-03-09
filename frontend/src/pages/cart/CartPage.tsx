import { Link } from '@tanstack/react-router';
import { ShoppingBag } from 'lucide-react';
import { useCart } from '@/hooks/useCart';
import { Button } from '@/components/ui/button';
import CartLineItem from '@/components/cart/CartLineItem';
import Seo from '@/components/seo/Seo';

export default function CartPage() {
  const { items, updateQuantity, removeItem, getTotalPrice } = useCart();

  const totalPrice = (getTotalPrice() / 100).toFixed(2);

  if (items.length === 0) {
    return (
      <>
        <Seo title="Shopping Cart" description="Your shopping cart" />
        <div className="container mx-auto px-4 py-12">
          <div className="flex min-h-[60vh] flex-col items-center justify-center text-center">
            <ShoppingBag className="mb-4 h-16 w-16 text-muted-foreground" />
            <h1 className="mb-2 font-serif text-3xl">Your Cart is Empty</h1>
            <p className="mb-8 text-muted-foreground">
              Add some beautiful pieces to your collection
            </p>
            <Button asChild size="lg">
              <Link to="/shop">Continue Shopping</Link>
            </Button>
          </div>
        </div>
      </>
    );
  }

  return (
    <>
      <Seo title="Shopping Cart" description="Review your cart and proceed to checkout" />
      <div className="container mx-auto px-4 py-12">
        <h1 className="mb-8 font-serif text-4xl">Shopping Cart</h1>

        <div className="grid gap-8 lg:grid-cols-3">
          {/* Cart Items */}
          <div className="lg:col-span-2">
            <div className="rounded-sm border border-border bg-card p-6">
              {items.map((item) => (
                <CartLineItem
                  key={item.product.id}
                  item={item}
                  onUpdateQuantity={updateQuantity}
                  onRemove={removeItem}
                />
              ))}
            </div>
          </div>

          {/* Order Summary */}
          <div>
            <div className="sticky top-20 rounded-sm border border-border bg-card p-6">
              <h2 className="mb-4 font-serif text-2xl">Order Summary</h2>
              
              <div className="space-y-3 border-b border-border pb-4">
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Subtotal</span>
                  <span>${totalPrice}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Shipping</span>
                  <span className="text-green-600">Free</span>
                </div>
              </div>

              <div className="mt-4 flex justify-between text-lg font-medium">
                <span>Total</span>
                <span>${totalPrice}</span>
              </div>

              <Button asChild size="lg" className="mt-6 w-full">
                <Link to="/checkout">Proceed to Checkout</Link>
              </Button>

              <Button asChild variant="outline" className="mt-3 w-full">
                <Link to="/shop">Continue Shopping</Link>
              </Button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
