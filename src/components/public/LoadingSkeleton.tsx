
import { Skeleton } from "@/components/ui/skeleton";
import { Wifi } from "lucide-react";

export const LoadingSkeleton = () => (
  <div className="min-h-screen bg-gradient-to-br from-purple-50 via-pink-50 to-orange-50">
    <div className="container mx-auto px-4 py-8 max-w-md">
      <div className="bg-white/90 backdrop-blur-sm shadow-xl rounded-2xl p-6 border mb-8">
        <div className="text-center">
          <Skeleton className="w-24 h-24 rounded-full mx-auto mb-4" />
          <Skeleton className="h-6 w-32 mx-auto mb-2" />
          <Skeleton className="h-4 w-24 mx-auto mb-2" />
          <Skeleton className="h-5 w-20 mx-auto" />
        </div>
      </div>
      
      <div className="space-y-4">
        {[1, 2, 3].map((i) => (
          <Skeleton key={i} className="h-16 w-full rounded-2xl" />
        ))}
      </div>
      
      <div className="text-center mt-6 text-sm text-gray-500">
        <div className="flex items-center justify-center gap-2">
          <Wifi className="w-4 h-4 animate-pulse" />
          <span>Carregando...</span>
        </div>
      </div>
    </div>
  </div>
);
