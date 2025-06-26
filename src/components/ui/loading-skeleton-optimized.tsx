
import { Skeleton } from '@/components/ui/skeleton';

interface LoadingSkeletonProps {
  type: 'profile' | 'links' | 'dashboard' | 'minimal';
  count?: number;
}

export function LoadingSkeletonOptimized({ type, count = 3 }: LoadingSkeletonProps) {
  if (type === 'minimal') {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-50 via-pink-50 to-orange-50 flex items-center justify-center p-4">
        <div className="text-center space-y-4 max-w-sm w-full">
          <div className="w-12 h-12 bg-gradient-to-r from-purple-500 to-pink-500 rounded-lg flex items-center justify-center mx-auto">
            <span className="text-white font-bold text-sm">L</span>
          </div>
          <div className="w-4 h-4 border-2 border-purple-500 border-t-transparent rounded-full animate-spin mx-auto" />
        </div>
      </div>
    );
  }

  if (type === 'profile') {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-50 via-pink-50 to-orange-50 py-4 sm:py-8">
        <div className="container mx-auto px-4 max-w-md">
          <div className="bg-white/90 backdrop-blur-sm border-0 shadow-lg rounded-2xl">
            <div className="p-6 sm:p-8 text-center space-y-4 sm:space-y-6">
              <Skeleton className="w-20 h-20 sm:w-24 sm:h-24 rounded-full mx-auto" />
              <div className="space-y-2">
                <Skeleton className="h-5 sm:h-6 w-32 mx-auto" />
                <Skeleton className="h-4 w-48 mx-auto" />
                <Skeleton className="h-4 w-20 mx-auto" />
              </div>
              <div className="space-y-3">
                {Array.from({ length: count }).map((_, i) => (
                  <Skeleton key={i} className="h-12 sm:h-14 w-full rounded-xl" />
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (type === 'links') {
    return (
      <div className="space-y-3">
        {Array.from({ length: count }).map((_, i) => (
          <Skeleton key={i} className="h-12 sm:h-14 w-full rounded-xl" />
        ))}
      </div>
    );
  }

  if (type === 'dashboard') {
    return (
      <div className="min-h-screen bg-gray-50 p-4">
        <div className="max-w-4xl mx-auto space-y-6">
          <div className="flex justify-between items-center">
            <Skeleton className="h-8 w-48" />
            <Skeleton className="h-10 w-32" />
          </div>
          <div className="grid md:grid-cols-2 gap-6">
            <div className="space-y-4">
              <Skeleton className="h-6 w-32" />
              <div className="space-y-3">
                {Array.from({ length: 4 }).map((_, i) => (
                  <Skeleton key={i} className="h-16 w-full rounded-lg" />
                ))}
              </div>
            </div>
            <div className="space-y-4">
              <Skeleton className="h-6 w-32" />
              <Skeleton className="h-96 w-full rounded-lg" />
            </div>
          </div>
        </div>
      </div>
    );
  }

  return null;
}
