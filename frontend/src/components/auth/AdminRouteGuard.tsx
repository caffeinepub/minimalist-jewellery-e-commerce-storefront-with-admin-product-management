import { ReactNode } from 'react';
import { useInternetIdentity } from '@/hooks/useInternetIdentity';
import { useIsCallerAdmin } from '@/hooks/useQueries';
import { Button } from '@/components/ui/button';
import { ShieldAlert, LogIn } from 'lucide-react';

interface AdminRouteGuardProps {
  children: ReactNode;
}

export default function AdminRouteGuard({ children }: AdminRouteGuardProps) {
  const { identity, login, isInitializing } = useInternetIdentity();
  const { data: isAdmin, isLoading: isCheckingAdmin } = useIsCallerAdmin();

  // Show loading state while checking authentication
  if (isInitializing || isCheckingAdmin) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center">
        <div className="text-center">
          <div className="mb-4 inline-block h-8 w-8 animate-spin rounded-full border-4 border-solid border-current border-r-transparent"></div>
          <p className="text-sm text-muted-foreground">Loading...</p>
        </div>
      </div>
    );
  }

  // Not authenticated - show login prompt
  if (!identity) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center px-4">
        <div className="max-w-md text-center">
          <LogIn className="mx-auto mb-4 h-12 w-12 text-muted-foreground" />
          <h2 className="mb-2 text-2xl font-serif">Authentication Required</h2>
          <p className="mb-6 text-muted-foreground">
            Please log in to access the admin dashboard.
          </p>
          <Button onClick={login} size="lg">
            <LogIn className="mr-2 h-4 w-4" />
            Login
          </Button>
        </div>
      </div>
    );
  }

  // Authenticated but not admin - show access denied
  if (!isAdmin) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center px-4">
        <div className="max-w-md text-center">
          <ShieldAlert className="mx-auto mb-4 h-12 w-12 text-destructive" />
          <h2 className="mb-2 text-2xl font-serif">Access Denied</h2>
          <p className="mb-6 text-muted-foreground">
            You do not have permission to access the admin dashboard. Only authorized administrators can manage products.
          </p>
          <Button variant="outline" onClick={() => window.history.back()}>
            Go Back
          </Button>
        </div>
      </div>
    );
  }

  // Authenticated and admin - render children
  return <>{children}</>;
}
