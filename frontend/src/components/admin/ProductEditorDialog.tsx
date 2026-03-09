import { useState, useEffect } from 'react';
import { useAddProduct, useUpdateProduct } from '@/hooks/useQueries';
import type { Product, ProductInput } from '@/backend';
import { ExternalBlob } from '@/backend';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import ProductImageUploader from './ProductImageUploader';
import { toast } from 'sonner';

interface ProductEditorDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  product?: Product | null;
}

export default function ProductEditorDialog({ 
  open, 
  onOpenChange, 
  product 
}: ProductEditorDialogProps) {
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [price, setPrice] = useState('');
  const [image, setImage] = useState<ExternalBlob | null>(null);

  const addProduct = useAddProduct();
  const updateProduct = useUpdateProduct();

  const isEditing = !!product;
  const isSaving = addProduct.isPending || updateProduct.isPending;

  useEffect(() => {
    if (product) {
      setName(product.name);
      setDescription(product.description);
      setPrice((Number(product.price) / 100).toFixed(2));
      setImage(product.image);
    } else {
      setName('');
      setDescription('');
      setPrice('');
      setImage(null);
    }
  }, [product, open]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!name.trim()) {
      toast.error('Please enter a product name');
      return;
    }

    if (!description.trim()) {
      toast.error('Please enter a description');
      return;
    }

    const priceNum = parseFloat(price);
    if (isNaN(priceNum) || priceNum <= 0) {
      toast.error('Please enter a valid price');
      return;
    }

    if (!image) {
      toast.error('Please upload a product image');
      return;
    }

    const priceInCents = BigInt(Math.round(priceNum * 100));

    const input: ProductInput = {
      name: name.trim(),
      description: description.trim(),
      price: priceInCents,
    };

    try {
      if (isEditing && product) {
        await updateProduct.mutateAsync({ id: product.id, input, image });
        toast.success('Product updated successfully');
      } else {
        await addProduct.mutateAsync({ input, image });
        toast.success('Product created successfully');
      }
      onOpenChange(false);
    } catch (error: any) {
      console.error('Error saving product:', error);
      toast.error(error.message || 'Failed to save product');
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="font-serif text-2xl">
            {isEditing ? 'Edit Product' : 'Create Product'}
          </DialogTitle>
          <DialogDescription>
            {isEditing 
              ? 'Update the product details below.' 
              : 'Fill in the details to create a new product.'}
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-2">
            <Label htmlFor="name">Product Name *</Label>
            <Input
              id="name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="e.g., Diamond Solitaire Ring"
              disabled={isSaving}
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="description">Description *</Label>
            <Textarea
              id="description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Describe the product..."
              rows={4}
              disabled={isSaving}
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="price">Price (USD) *</Label>
            <Input
              id="price"
              type="number"
              step="0.01"
              min="0"
              value={price}
              onChange={(e) => setPrice(e.target.value)}
              placeholder="0.00"
              disabled={isSaving}
              required
            />
          </div>

          <ProductImageUploader
            onImageChange={setImage}
            currentImage={image || undefined}
            disabled={isSaving}
          />

          <div className="flex justify-end gap-3">
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
              disabled={isSaving}
            >
              Cancel
            </Button>
            <Button type="submit" disabled={isSaving}>
              {isSaving ? 'Saving...' : isEditing ? 'Update Product' : 'Create Product'}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
