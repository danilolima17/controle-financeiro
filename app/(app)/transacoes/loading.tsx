import { Skeleton } from "@/components/ui/skeleton";

export default function TransactionsLoading() {
  return (
    <div className="flex flex-col gap-5">
      <div>
        <Skeleton className="h-8 w-40" />
        <Skeleton className="mt-2 h-4 w-32" />
      </div>
      <Skeleton className="h-9 w-56" />
      <Skeleton className="h-11 w-full rounded-md" />
      <Skeleton className="h-12 w-full rounded-md" />
      <Skeleton className="h-16 w-full rounded-lg" />

      {[0, 1].map((group) => (
        <div key={group}>
          <Skeleton className="mb-2 h-3 w-24" />
          <div className="bg-card flex flex-col gap-3 rounded-lg border p-3">
            {[0, 1, 2].map((row) => (
              <div key={row} className="flex items-center gap-3">
                <Skeleton className="size-9 shrink-0 rounded-full" />
                <div className="flex-1">
                  <Skeleton className="h-4 w-36" />
                  <Skeleton className="mt-1.5 h-3 w-24" />
                </div>
                <Skeleton className="h-4 w-20" />
              </div>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}
