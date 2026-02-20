import { Skeleton } from "../ui/Skeleton";

export function PipelineSkeleton({ rows = 5 }: { rows?: number }) {
  return (
    <div className="bg-gray-900 border border-gray-800 rounded-xl overflow-hidden">
      <table className="w-full text-sm">
        <thead>
          <tr className="border-b border-gray-800">
            {[
              "Run",
              "Status",
              "Jobs Found",
              "Leads",
              "Duration",
              "Triggered By",
            ].map((h) => (
              <th
                key={h}
                className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
              >
                {h}
              </th>
            ))}
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-800">
          {Array.from({ length: rows }).map((_, i) => (
            <tr key={i}>
              <td className="px-4 py-3">
                <Skeleton className="h-4 w-16 mb-1.5" />
                <Skeleton className="h-3 w-28" />
              </td>
              <td className="px-4 py-3">
                <Skeleton className="h-5 w-20 rounded-full" />
              </td>
              <td className="px-4 py-3">
                <Skeleton className="h-4 w-8" />
              </td>
              <td className="px-4 py-3">
                <Skeleton className="h-4 w-24" />
              </td>
              <td className="px-4 py-3">
                <Skeleton className="h-4 w-10" />
              </td>
              <td className="px-4 py-3">
                <Skeleton className="h-4 w-32" />
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
