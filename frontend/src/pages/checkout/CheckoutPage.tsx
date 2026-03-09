import { useState } from 'react';
import { useNavigate } from '@tanstack/react-router';
import { CreditCard } from 'lucide-react';
import { useCart } from '@/hooks/useCart';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import Seo from '@/components/seo/Seo';
import { toast } from 'sonner';

export default function CheckoutPage() {
  const navigate = useNavigate();
  const { items, getTotalPrice, clearCart } = useCart();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    address: '',
    city: '',
    postalCode: '',
    country: '',
  });

  const [errors, setErrors] = useState<Record<string, string>>({});

  const totalPrice = (getTotalPrice() / 100).toFixed(2);

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (!formData.name.trim()) newErrors.name = 'Name is required';
    if (!formData.email.trim()) {
      newErrors.email = 'Email is required';
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'Email is invalid';
    }
    if (!formData.address.trim()) newErrors.address = 'Address is required';
    if (!formData.city.trim()) newErrors.city = 'City is required';
    if (!formData.postalCode.trim()) newErrors.postalCode = 'Postal code is required';
    if (!formData.country.trim()) newErrors.country = 'Country is required';

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) {
      toast.error('Please fill in all required fields');
      return;
    }

    setIsSubmitting(true);

    // Simulate order processing
    await new Promise((resolve) => setTimeout(resolve, 2000));

    toast.success('Order placed successfully!');
    clearCart();
    navigate({ to: '/' });
  };

  const handleChange = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors((prev) => ({ ...prev, [field]: '' }));
    }
  };

  if (items.length === 0) {
    navigate({ to: '/cart' });
    return null;
  }

  return (
    <>
      <Seo title="Checkout" description="Complete your order" />
      <div className="container mx-auto px-4 py-12">
        <h1 className="mb-8 font-serif text-4xl">Checkout</h1>

        <div className="grid gap-8 lg:grid-cols-3">
          {/* Checkout Form */}
          <div className="lg:col-span-2">
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Shipping Information */}
              <div className="rounded-sm border border-border bg-card p-6">
                <h2 className="mb-6 font-serif text-2xl">Shipping Information</h2>
                
                <div className="space-y-4">
                  <div>
                    <Label htmlFor="name">Full Name *</Label>
                    <Input
                      id="name"
                      value={formData.name}
                      onChange={(e) => handleChange('name', e.target.value)}
                      disabled={isSubmitting}
                      aria-invalid={!!errors.name}
                      aria-describedby={errors.name ? 'name-error' : undefined}
                    />
                    {errors.name && (
                      <p id="name-error" className="mt-1 text-sm text-destructive">
                        {errors.name}
                      </p>
                    )}
                  </div>

                  <div>
                    <Label htmlFor="email">Email *</Label>
                    <Input
                      id="email"
                      type="email"
                      value={formData.email}
                      onChange={(e) => handleChange('email', e.target.value)}
                      disabled={isSubmitting}
                      aria-invalid={!!errors.email}
                      aria-describedby={errors.email ? 'email-error' : undefined}
                    />
                    {errors.email && (
                      <p id="email-error" className="mt-1 text-sm text-destructive">
                        {errors.email}
                      </p>
                    )}
                  </div>

                  <div>
                    <Label htmlFor="address">Address *</Label>
                    <Input
                      id="address"
                      value={formData.address}
                      onChange={(e) => handleChange('address', e.target.value)}
                      disabled={isSubmitting}
                      aria-invalid={!!errors.address}
                      aria-describedby={errors.address ? 'address-error' : undefined}
                    />
                    {errors.address && (
                      <p id="address-error" className="mt-1 text-sm text-destructive">
                        {errors.address}
                      </p>
                    )}
                  </div>

                  <div className="grid gap-4 sm:grid-cols-2">
                    <div>
                      <Label htmlFor="city">City *</Label>
                      <Input
                        id="city"
                        value={formData.city}
                        onChange={(e) => handleChange('city', e.target.value)}
                        disabled={isSubmitting}
                        aria-invalid={!!errors.city}
                        aria-describedby={errors.city ? 'city-error' : undefined}
                      />
                      {errors.city && (
                        <p id="city-error" className="mt-1 text-sm text-destructive">
                          {errors.city}
                        </p>
                      )}
                    </div>

                    <div>
                      <Label htmlFor="postalCode">Postal Code *</Label>
                      <Input
                        id="postalCode"
                        value={formData.postalCode}
                        onChange={(e) => handleChange('postalCode', e.target.value)}
                        disabled={isSubmitting}
                        aria-invalid={!!errors.postalCode}
                        aria-describedby={errors.postalCode ? 'postalCode-error' : undefined}
                      />
                      {errors.postalCode && (
                        <p id="postalCode-error" className="mt-1 text-sm text-destructive">
                          {errors.postalCode}
                        </p>
                      )}
                    </div>
                  </div>

                  <div>
                    <Label htmlFor="country">Country *</Label>
                    <Input
                      id="country"
                      value={formData.country}
                      onChange={(e) => handleChange('country', e.target.value)}
                      disabled={isSubmitting}
                      aria-invalid={!!errors.country}
                      aria-describedby={errors.country ? 'country-error' : undefined}
                    />
                    {errors.country && (
                      <p id="country-error" className="mt-1 text-sm text-destructive">
                        {errors.country}
                      </p>
                    )}
                  </div>
                </div>
              </div>

              {/* Payment (Stripe Ready Placeholder) */}
              <div className="rounded-sm border border-border bg-card p-6">
                <h2 className="mb-4 font-serif text-2xl">Payment</h2>
                <div className="flex items-center gap-3 rounded-sm bg-muted/50 p-6 text-center">
                  <CreditCard className="h-8 w-8 text-muted-foreground" />
                  <div className="text-left">
                    <p className="font-medium">Stripe Payment Integration</p>
                    <p className="text-sm text-muted-foreground">
                      Payment processing ready for Stripe integration
                    </p>
                  </div>
                </div>
              </div>

              <Button type="submit" size="lg" className="w-full" disabled={isSubmitting}>
                {isSubmitting ? 'Processing...' : `Place Order - $${totalPrice}`}
              </Button>
            </form>
          </div>

          {/* Order Summary */}
          <div>
            <div className="sticky top-20 rounded-sm border border-border bg-card p-6">
              <h2 className="mb-4 font-serif text-2xl">Order Summary</h2>
              
              <div className="mb-4 space-y-3 border-b border-border pb-4">
                {items.map((item) => {
                  const itemTotal = ((Number(item.product.price) * item.quantity) / 100).toFixed(2);
                  return (
                    <div key={item.product.id} className="flex justify-between text-sm">
                      <span className="text-muted-foreground">
                        {item.product.name} × {item.quantity}
                      </span>
                      <span>${itemTotal}</span>
                    </div>
                  );
                })}
              </div>

              <div className="space-y-2 border-b border-border pb-4">
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
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
