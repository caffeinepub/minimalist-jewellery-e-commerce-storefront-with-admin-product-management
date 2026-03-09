import { Link } from '@tanstack/react-router';
import { ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import FeaturedProducts from '@/components/products/FeaturedProducts';
import MotionFade from '@/components/common/MotionFade';
import Seo from '@/components/seo/Seo';

const categories = [
  { name: 'Rings', path: '/shop?category=Rings' },
  { name: 'Necklaces', path: '/shop?category=Necklaces' },
  { name: 'Earrings', path: '/shop?category=Earrings' },
  { name: 'Bracelets', path: '/shop?category=Bracelets' },
];

const testimonials = [
  {
    name: 'Sarah Johnson',
    text: 'Absolutely stunning pieces. The quality is exceptional and the designs are timeless.',
    rating: 5,
  },
  {
    name: 'Michael Chen',
    text: 'Perfect engagement ring. The craftsmanship is incredible and my fiancée loves it!',
    rating: 5,
  },
  {
    name: 'Emma Williams',
    text: 'Beautiful jewellery and excellent customer service. Highly recommend!',
    rating: 5,
  },
];

export default function HomePage() {
  return (
    <>
      <Seo 
        title="Home" 
        description="Discover timeless elegance with our curated collection of fine jewellery. Rings, necklaces, earrings, and bracelets crafted to perfection."
      />

      {/* Hero Section */}
      <section className="relative">
        <div className="aspect-hero w-full overflow-hidden bg-muted">
          <img
            src="/assets/generated/hero-banner.dim_2400x1200.png"
            alt="Luxury jewellery collection"
            className="h-full w-full object-cover"
          />
        </div>
        <div className="absolute inset-0 flex items-center justify-center bg-black/20">
          <MotionFade className="text-center text-white">
            <h1 className="mb-4 font-serif text-5xl md:text-7xl">Timeless Elegance</h1>
            <p className="mb-8 text-lg md:text-xl">Discover pieces that tell your story</p>
            <Button asChild size="lg" className="bg-white text-foreground hover:bg-white/90">
              <Link to="/shop">
                Shop Collection <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
            </Button>
          </MotionFade>
        </div>
      </section>

      {/* Featured Products */}
      <FeaturedProducts />

      {/* Categories */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <MotionFade>
            <h2 className="mb-12 text-center font-serif text-4xl">Shop by Category</h2>
          </MotionFade>
          <div className="grid grid-cols-2 gap-4 md:grid-cols-4 md:gap-6">
            {categories.map((category, index) => (
              <MotionFade key={category.name} delay={index * 100}>
                <Link
                  to="/shop"
                  search={{ category: category.name }}
                  className="group block overflow-hidden rounded-sm bg-muted transition-all hover-lift focus-visible-ring"
                >
                  <div className="aspect-square bg-gradient-to-br from-muted to-muted/50 p-8">
                    <div className="flex h-full items-center justify-center">
                      <h3 className="font-serif text-2xl text-foreground group-hover:text-foreground/80 transition-colors">
                        {category.name}
                      </h3>
                    </div>
                  </div>
                </Link>
              </MotionFade>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="bg-muted/30 py-16">
        <div className="container mx-auto px-4">
          <MotionFade>
            <h2 className="mb-12 text-center font-serif text-4xl">What Our Customers Say</h2>
          </MotionFade>
          <div className="grid gap-8 md:grid-cols-3">
            {testimonials.map((testimonial, index) => (
              <MotionFade key={testimonial.name} delay={index * 100}>
                <div className="rounded-sm bg-card p-6 shadow-subtle">
                  <div className="mb-4 flex gap-1">
                    {Array.from({ length: testimonial.rating }).map((_, i) => (
                      <span key={i} className="text-yellow-500">★</span>
                    ))}
                  </div>
                  <p className="mb-4 text-muted-foreground">{testimonial.text}</p>
                  <p className="font-medium">{testimonial.name}</p>
                </div>
              </MotionFade>
            ))}
          </div>
        </div>
      </section>

      {/* Instagram Gallery Preview */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <MotionFade>
            <h2 className="mb-4 text-center font-serif text-4xl">Follow Our Journey</h2>
            <p className="mb-12 text-center text-muted-foreground">@jewellerybrand</p>
          </MotionFade>
          <div className="grid grid-cols-2 gap-2 md:grid-cols-4 md:gap-4">
            {Array.from({ length: 4 }).map((_, i) => (
              <MotionFade key={i} delay={i * 50}>
                <div className="aspect-square overflow-hidden rounded-sm bg-muted">
                  <div className="h-full w-full bg-gradient-to-br from-muted to-muted/50" />
                </div>
              </MotionFade>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}
