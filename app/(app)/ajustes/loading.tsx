import { Skeleton } from "@/components/ui/skeleton";

export default function SettingsLoading() {
  return (
    <div className="flex flex-col gap-6">
      <Skeleton className="h-8 w-28" />

      <div className="bg-card rounded-lg border">
        <div className="flex items-center gap-3.5 px-4 py-4">
          <Skeleton className="size-12 rounded-full" />
          <div>
            <Skeleton className="h-4 w-32" />
            <Skeleton className="mt-2 h-3.5 w-44" />
          </div>
        </div>
        <div className="grid grid-cols-2 divide-x border-t">
          {[0, 1].map((i) => (
            <div key={i} className="px-4 py-3">
              <Skeleton className="h-6 w-10" />
              <Skeleton className="mt-1.5 h-3.5 w-20" />
            </div>
          ))}
        </div>
      </div>

      <Skeleton className="h-3 w-24" />
      <Skeleton className="h-12 w-full rounded-lg" />
    </div>
  );
}
