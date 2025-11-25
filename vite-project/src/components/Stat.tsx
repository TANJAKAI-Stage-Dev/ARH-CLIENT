import { Skeleton } from "@/components/ui/skeleton"

export function CardStat({ title, icon, value, subtitle, loading, valueClass, bg }: any) {
  return (
    <div className={`${bg? bg : "bg-secondary"} dark:bg-gray-900 rounded-2xl shadow-md p-6 flex flex-col justify-between hover:shadow-lg transition`}>
      <div className="flex items-center justify-between">
        <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400">
          {loading ? <Skeleton className="h-4 w-24" /> : title}
        </h3>
        {loading ? <Skeleton className="h-6 w-6 rounded-full" /> : icon}
      </div>

      {loading ? (
        <Skeleton className="h-10 w-20 mt-2" />
      ) : (
        <p className={`text-4xl font-bold ${valueClass}`}>{value}</p>
      )}

      {loading ? (
        <Skeleton className="h-3 w-16 mt-1" />
      ) : (
        <span className="text-xs text-gray-500 dark:text-gray-400">{subtitle}</span>
      )}
    </div>
  )
}
