import { Card, CardContent, CardHeader } from "@/components/ui/card";

interface SkeletonLoaderProps {
  type?: 'dashboard' | 'table' | 'card' | 'list';
  count?: number;
}

export function SkeletonLoader({ type = 'card', count = 1 }: SkeletonLoaderProps) {
  if (type === 'dashboard') {
    return (
      <div className="space-y-6 animate-in fade-in duration-500">
        {/* Header skeleton */}
        <div className="space-y-2">
          <div className="skeleton h-8 w-64"></div>
          <div className="skeleton h-4 w-96"></div>
        </div>

        {/* Stats cards skeleton */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-6">
          {[1, 2, 3].map((i) => (
            <Card key={i} className="animate-in fade-in duration-500" style={{ animationDelay: `${i * 100}ms` }}>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <div className="skeleton h-4 w-24"></div>
                <div className="skeleton h-10 w-10 rounded-xl"></div>
              </CardHeader>
              <CardContent>
                <div className="skeleton h-8 w-16 mb-2"></div>
                <div className="skeleton h-3 w-32"></div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Main content skeleton */}
        <Card className="animate-in fade-in duration-500" style={{ animationDelay: '400ms' }}>
          <CardHeader>
            <div className="skeleton h-6 w-48"></div>
            <div className="skeleton h-4 w-64 mt-2"></div>
          </CardHeader>
          <CardContent className="space-y-3">
            {[1, 2, 3].map((i) => (
              <div key={i} className="skeleton h-24 w-full"></div>
            ))}
          </CardContent>
        </Card>
      </div>
    );
  }

  if (type === 'table') {
    return (
      <div className="space-y-4 animate-in fade-in duration-500">
        <div className="skeleton h-10 w-full"></div>
        {Array.from({ length: count }).map((_, i) => (
          <div key={i} className="skeleton h-16 w-full" style={{ animationDelay: `${i * 50}ms` }}></div>
        ))}
      </div>
    );
  }

  if (type === 'list') {
    return (
      <div className="space-y-3 animate-in fade-in duration-500">
        {Array.from({ length: count }).map((_, i) => (
          <div key={i} className="flex items-center gap-4 p-4 border border-border rounded-lg" style={{ animationDelay: `${i * 50}ms` }}>
            <div className="skeleton h-12 w-12 rounded-full"></div>
            <div className="flex-1 space-y-2">
              <div className="skeleton h-4 w-3/4"></div>
              <div className="skeleton h-3 w-1/2"></div>
            </div>
          </div>
        ))}
      </div>
    );
  }

  // Default card skeleton
  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3 animate-in fade-in duration-500">
      {Array.from({ length: count }).map((_, i) => (
        <Card key={i} className="animate-in fade-in duration-500" style={{ animationDelay: `${i * 100}ms` }}>
          <CardHeader>
            <div className="skeleton h-5 w-3/4 mb-2"></div>
            <div className="skeleton h-4 w-full"></div>
          </CardHeader>
          <CardContent className="space-y-2">
            <div className="skeleton h-4 w-full"></div>
            <div className="skeleton h-4 w-5/6"></div>
            <div className="skeleton h-8 w-24 mt-4"></div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
