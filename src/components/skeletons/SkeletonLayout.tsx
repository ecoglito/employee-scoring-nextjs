import { Skeleton } from '@/components/ui/skeleton';

export function SkeletonAppLayout() {
  return (
    <div className="min-h-screen bg-background">
      {/* Header Skeleton */}
      <header className="border-b bg-card">
        <div className="container mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            {/* Left: Logo and Navigation */}
            <div className="flex items-center space-x-6">
              <Skeleton className="h-8 w-8" />
              <div className="flex items-center space-x-1">
                <Skeleton className="h-10 w-20 rounded-lg" />
                <Skeleton className="h-10 w-24 rounded-lg" />
              </div>
            </div>

            {/* Right: User Info and Sign Out */}
            <div className="flex items-center space-x-4">
              <div className="text-right hidden sm:block">
                <Skeleton className="h-4 w-24 mb-1" />
                <Skeleton className="h-3 w-32" />
              </div>
              <Skeleton className="h-8 w-20 rounded" />
            </div>
          </div>
        </div>
      </header>

      {/* Content Area */}
      <main className="container mx-auto px-4 py-6">
        <div className="space-y-6">
          {/* Page Title */}
          <div>
            <Skeleton className="h-8 w-48 mb-2" />
            <Skeleton className="h-4 w-64" />
          </div>

          {/* Main Content Skeleton */}
          <div className="grid gap-4">
            <Skeleton className="h-32 w-full" />
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {[...Array(6)].map((_, i) => (
                <Skeleton key={i} className="h-48 w-full" />
              ))}
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}