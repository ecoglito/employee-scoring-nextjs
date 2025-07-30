import React from 'react';
import { Card, CardContent, CardHeader } from '@/components/ui/card';

export function SkeletonAdminPanel() {
  return (
    <div className="space-y-6">
      {/* Assignment Section Skeleton */}
      <Card>
        <CardHeader>
          <div className="flex items-center gap-2">
            <div className="h-5 w-5 rounded bg-muted animate-pulse" />
            <div className="h-6 w-48 rounded bg-muted animate-pulse" />
          </div>
          <div className="h-4 w-64 rounded bg-muted animate-pulse mt-1" />
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 sm:grid-cols-2">
            <div>
              <div className="h-4 w-24 rounded bg-muted animate-pulse mb-2" />
              <div className="h-10 w-full rounded bg-muted animate-pulse" />
            </div>
            <div>
              <div className="h-4 w-24 rounded bg-muted animate-pulse mb-2" />
              <div className="h-10 w-full rounded bg-muted animate-pulse" />
            </div>
          </div>
          <div className="mt-4 flex gap-2">
            <div className="h-10 w-32 rounded bg-muted animate-pulse" />
            <div className="h-10 w-32 rounded bg-muted animate-pulse" />
          </div>
        </CardContent>
      </Card>

      {/* Manager Hierarchy Skeleton */}
      <div>
        <div className="flex items-center gap-2 mb-4">
          <div className="h-6 w-6 rounded bg-muted animate-pulse" />
          <div className="h-7 w-48 rounded bg-muted animate-pulse" />
        </div>
        <div className="h-4 w-64 rounded bg-muted animate-pulse mb-4" />
        
        {/* Manager Cards */}
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {[1, 2, 3, 4, 5, 6].map((i) => (
            <Card key={i}>
              <CardHeader>
                <div className="flex items-center gap-3">
                  <div className="h-10 w-10 rounded-full bg-muted animate-pulse" />
                  <div className="flex-1">
                    <div className="h-5 w-32 rounded bg-muted animate-pulse" />
                    <div className="h-4 w-24 rounded bg-muted animate-pulse mt-1" />
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="h-4 w-20 rounded bg-muted animate-pulse mb-3" />
                <div className="space-y-2">
                  {[1, 2, 3].map((j) => (
                    <div key={j} className="flex items-center gap-2">
                      <div className="h-6 w-6 rounded-full bg-muted animate-pulse" />
                      <div className="flex-1">
                        <div className="h-4 w-28 rounded bg-muted animate-pulse" />
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
}

export function SkeletonAdminPage() {
  return (
    <div className="space-y-6">
      {/* Header Skeleton */}
      <div className="flex items-center justify-between">
        <div>
          <div className="flex items-center gap-2 mb-2">
            <div className="h-8 w-8 rounded bg-muted animate-pulse" />
            <div className="h-8 w-40 rounded bg-muted animate-pulse" />
          </div>
          <div className="h-5 w-80 rounded bg-muted animate-pulse" />
        </div>
        <div className="h-10 w-40 rounded bg-muted animate-pulse" />
      </div>

      {/* Admin Panel Skeleton */}
      <SkeletonAdminPanel />
    </div>
  );
}