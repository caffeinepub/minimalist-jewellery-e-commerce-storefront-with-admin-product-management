import { useState, useMemo } from 'react';
import { useNavigate, useSearch } from '@tanstack/react-router';
import { useGetAllProducts } from '@/hooks/useQueries';
import ProductCard from '@/components/products/ProductCard';
import { ProductGridSkeleton } from '@/components/common/LoadingSkeleton';
import ErrorState from '@/components/common/ErrorState';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Button } from '@/components/ui/button';
import Seo from '@/components/seo/Seo';

const categories = ['All', 'Rings', 'Necklaces', 'Earrings', 'Bracelets'];

export default function ShopPage() {
  const navigate = useNavigate();
  const search = useSearch({ strict: false }) as { category?: string };
  const { data: products, isLoading, error, refetch } = useGetAllProducts();
  
  const [selectedCategory, setSelectedCategory] = useState(search.category || 'All');
  const [sortBy, setSortBy] = useState<'name' | 'price-asc' | 'price-desc'>('name');

  const filteredAndSortedProducts = useMemo(() => {
    if (!products) return [];

    let filtered = [...products];

    // Filter by category
    if (selectedCategory !== 'All') {
      filtered = filtered.filter((p) => 
        p.name.toLowerCase().includes(selectedCategory.toLowerCase())
      );
    }

    // Sort
    filtered.sort((a, b) => {
      if (sortBy === 'price-asc') {
        return Number(a.price) - Number(b.price);
      } else if (sortBy === 'price-desc') {
        return Number(b.price) - Number(a.price);
      } else {
        return a.name.localeCompare(b.name);
      }
    });

    return filtered;
  }, [products, selectedCategory, sortBy]);

  const handleCategoryChange = (category: string) => {
    setSelectedCategory(category);
    if (category === 'All') {
      navigate({ to: '/shop' });
    } else {
      navigate({ to: '/shop', search: { category } });
    }
  };

  return (
    <>
      <Seo 
        title="Shop" 
        description="Browse our complete collection of fine jewellery. Filter by category and find your perfect piece."
      />

      <div className="container mx-auto px-4 py-12">
        <h1 className="mb-8 text-center font-serif text-4xl md:text-5xl">Shop Collection</h1>

        {/* Filters */}
        <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex flex-wrap gap-2">
            {categories.map((category) => (
              <Button
                key={category}
                variant={selectedCategory === category ? 'default' : 'outline'}
                onClick={() => handleCategoryChange(category)}
                className="transition-smooth"
              >
                {category}
              </Button>
            ))}
          </div>

          <div className="flex items-center gap-2">
            <label htmlFor="sort-select" className="text-sm text-muted-foreground">
              Sort by:
            </label>
            <Select value={sortBy} onValueChange={(value: any) => setSortBy(value)}>
              <SelectTrigger id="sort-select" className="w-40">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="name">Name</SelectItem>
                <SelectItem value="price-asc">Price: Low to High</SelectItem>
                <SelectItem value="price-desc">Price: High to Low</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        {/* Products Grid */}
        {isLoading ? (
          <ProductGridSkeleton />
        ) : error ? (
          <ErrorState message="Failed to load products" onRetry={() => refetch()} />
        ) : filteredAndSortedProducts.length === 0 ? (
          <div className="py-12 text-center">
            <p className="text-muted-foreground">No products found in this category.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {filteredAndSortedProducts.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        )}
      </div>
    </>
  );
}
