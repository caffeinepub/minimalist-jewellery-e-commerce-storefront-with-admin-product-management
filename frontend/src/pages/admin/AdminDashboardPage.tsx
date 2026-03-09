import { useState } from 'react';
import { Plus, AlertCircle } from 'lucide-react';
import { useInternetIdentity } from '@/hooks/useInternetIdentity';
import { useGetCallerUserProfile } from '@/hooks/useQueries';
import { useGetAllProducts, useRemoveProduct } from '@/hooks/useQueries';
import type { Product } from '@/backend';
import AdminRouteGuard from '@/components/auth/AdminRouteGuard';
import ProfileSetup from '@/components/auth/ProfileSetup';
import ProductsTable from '@/components/admin/ProductsTable';
import ProductEditorDialog from '@/components/admin/ProductEditorDialog';
import { Button } from '@/components/ui/button';
import { Alert, AlertDescription } from '@/components/ui/alert';
import Seo from '@/components/seo/Seo';
import { toast } from 'sonner';

function AdminDashboardContent() {
  const { identity } = useInternetIdentity();
  const { data: userProfile, isLoading: profileLoading, isFetched } = useGetCallerUserProfile();
  const { data: products, isLoading: productsLoading } = useGetAllProducts();
  const removeProduct = useRemoveProduct();

  const [editorOpen, setEditorOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);

  const showProfileSetup = !!identity && !profileLoading && isFetched && userProfile === null;

  const handleEdit = (product: Product) => {
    setEditingProduct(product);
    setEditorOpen(true);
  };

  const handleDelete = async (productId: string) => {
    try {
      await removeProduct.mutateAsync(productId);
      toast.success('Product deleted successfully');
    } catch (error: any) {
      console.error('Error deleting product:', error);
      toast.error(error.message || 'Failed to delete product');
    }
  };

  const handleCreateNew = () => {
    setEditingProduct(null);
    setEditorOpen(true);
  };

  return (
    <>
      <Seo title="Admin Dashboard" description="Manage your jewellery products" />
      
      <ProfileSetup open={showProfileSetup} />

      <div className="container mx-auto px-4 py-12">
        <div className="mb-8 flex items-center justify-between">
          <div>
            <h1 className="font-serif text-4xl">Admin Dashboard</h1>
            <p className="mt-2 text-muted-foreground">Manage your jewellery products</p>
          </div>
          <Button onClick={handleCreateNew} size="lg">
            <Plus className="mr-2 h-5 w-5" />
            Add Product
          </Button>
        </div>

        <Alert className="mb-6">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>
            For initial admin setup and troubleshooting, please refer to the README documentation.
            Admin access is controlled via Internet Identity principals.
          </AlertDescription>
        </Alert>

        {productsLoading ? (
          <div className="flex items-center justify-center py-12">
            <div className="text-center">
              <div className="mb-4 inline-block h-8 w-8 animate-spin rounded-full border-4 border-solid border-current border-r-transparent"></div>
              <p className="text-sm text-muted-foreground">Loading products...</p>
            </div>
          </div>
        ) : (
          <ProductsTable
            products={products || []}
            onEdit={handleEdit}
            onDelete={handleDelete}
            isDeleting={removeProduct.isPending}
          />
        )}

        <ProductEditorDialog
          open={editorOpen}
          onOpenChange={setEditorOpen}
          product={editingProduct}
        />
      </div>
    </>
  );
}

export default function AdminDashboardPage() {
  return (
    <AdminRouteGuard>
      <AdminDashboardContent />
    </AdminRouteGuard>
  );
}
