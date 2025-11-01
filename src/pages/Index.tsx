import { useAuth } from "@/contexts/AuthContext";
import { Navigate } from "react-router-dom";
import { Skeleton } from "@/components/ui/skeleton";

const Index = () => {
  const { isAuthenticated, user, isLoading } = useAuth();

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-background via-primary-light/20 to-secondary/30">
        <div className="space-y-4 w-full max-w-md p-6">
          <Skeleton className="h-16 w-full" />
          <Skeleton className="h-64 w-full" />
          <Skeleton className="h-12 w-full" />
        </div>
      </div>
    );
  }

  if (!isAuthenticated) {
    // Redirect to school selection for unauthenticated users
    return <Navigate to="/school-selection" replace />;
  }

  // Redirect authenticated users to their role dashboard
  const roleRoute = user?.role?.toLowerCase() === 'principal' ? 'leadership' : user?.role?.toLowerCase();
  return <Navigate to={`/${roleRoute}`} replace />;
};

export default Index;
