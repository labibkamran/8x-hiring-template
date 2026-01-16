/**
 * Home Page Loading State
 * 
 * Displays skeleton UI while home page content is loading.
 */

import { Skeleton } from "@/components/ui/skeleton"

export default function HomeLoading() {
  return (
    <div className="min-h-screen bg-background">
      <div className="border-b border-border/50 bg-background sticky top-0 z-50 w-full">
        <div className="container mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <Skeleton className="h-7 w-28" />
            <div className="hidden md:flex items-center gap-6">
              <Skeleton className="h-4 w-24" />
              <Skeleton className="h-4 w-16" />
              <Skeleton className="h-4 w-24" />
            </div>
            <div className="hidden md:flex items-center gap-3">
              <Skeleton className="h-9 w-9 rounded-lg" />
              <Skeleton className="h-9 w-20" />
              <Skeleton className="h-9 w-20" />
            </div>
          </div>
        </div>
      </div>

      <section className="min-h-[90vh] flex flex-col items-center justify-center px-6">
        <div className="max-w-5xl mx-auto text-center space-y-8">
          <Skeleton className="h-8 w-56 mx-auto rounded-full" />
          <div className="space-y-4">
            <Skeleton className="h-16 w-full max-w-2xl mx-auto" />
            <Skeleton className="h-16 w-full max-w-xl mx-auto" />
          </div>
          <Skeleton className="h-6 w-full max-w-lg mx-auto" />
          <div className="flex gap-4 justify-center pt-4">
            <Skeleton className="h-14 w-40 rounded-md" />
            <Skeleton className="h-14 w-40 rounded-md" />
          </div>
        </div>
      </section>

      <section className="py-24 px-6">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <Skeleton className="h-10 w-48 mx-auto mb-4" />
            <Skeleton className="h-6 w-80 mx-auto" />
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[1, 2, 3].map((i) => (
              <div key={i} className="flex flex-col items-center">
                <Skeleton className="w-16 h-16 rounded-2xl mb-6" />
                <Skeleton className="h-6 w-40 mb-3" />
                <Skeleton className="h-4 w-full" />
                <Skeleton className="h-4 w-3/4 mt-2" />
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="py-24 px-6">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-12">
            <Skeleton className="h-10 w-56 mx-auto mb-4" />
            <Skeleton className="h-6 w-72 mx-auto" />
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 auto-rows-[200px]">
            <Skeleton className="rounded-2xl row-span-2" />
            <Skeleton className="rounded-2xl" />
            <Skeleton className="rounded-2xl" />
            <Skeleton className="rounded-2xl row-span-2" />
            <Skeleton className="rounded-2xl row-span-2" />
            <Skeleton className="rounded-2xl row-span-2" />
            <Skeleton className="rounded-2xl" />
            <Skeleton className="rounded-2xl" />
          </div>
        </div>
      </section>
    </div>
  )
}
