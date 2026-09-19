import { Skeleton } from "@/components/ui/skeleton";

export default function DashboardLoading() {
  return (
    <div className="flex flex-col gap-6">
      <Skeleton className="h-8 w-28" />

      <div className="bg-card rounded-lg border">
        <div className="px-4 pt-4 md:px-5 md:pt-5">
          <Skeleton className="h-3 w-24" />
          <Skeleton className="mt-3 h-10 w-52" />
        </div>
        <div className="mt-4 grid grid-cols-2 divide-x border-t">
          {[0, 1].map((i) => (
            <div key={i} className="px-4 py-3.5 md:px-5">
              <Skeleton className="h-3.5 w-20" />
              <Skeleton className="mt-2 h-5 w-28" />
            </div>
          ))}
        </div>
      </div>

      {[0, 1].map((i) => (
        <div key={i} className="bg-card rounded-lg border p-4 md:p-5">
          <Skeleton className="h-4 w-40" />
          <Skeleton className="mt-5 h-44 w-full" />
        </div>
      ))}
    </div>
  );
}
