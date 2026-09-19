import { Skeleton } from "@/components/ui/skeleton";

export default function CategoriesLoading() {
  return (
    <div className="flex flex-col gap-6">
      <div className="flex items-start justify-between">
        <div>
          <Skeleton className="h-8 w-36" />
          <Skeleton className="mt-2 h-4 w-40" />
        </div>
        <Skeleton className="h-9 w-24 rounded-md" />
      </div>

      {[0, 1].map((group) => (
        <div key={group} className="flex flex-col gap-2.5">
          <Skeleton className="h-3 w-20" />
          <div className="bg-card flex flex-col gap-4 rounded-lg border p-4">
            {[0, 1, 2].map((row) => (
              <div key={row} className="flex items-center gap-3">
                <Skeleton className="size-9 shrink-0 rounded-full" />
                <div className="flex-1">
                  <Skeleton className="h-4 w-32" />
                  <Skeleton className="mt-1.5 h-3 w-28" />
                </div>
                <Skeleton className="h-4 w-16" />
              </div>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}
