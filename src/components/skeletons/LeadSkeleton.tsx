import { Skeleton } from "../ui/Skeleton";

export function LeadSkeleton({ rows = 8 }: { rows?: number }) {
  return (
    <div className="bg-gray-900 border border-gray-800 rounded-xl overflow-hidden">
      <table className="w-full text-sm">
        <thead>
          <tr className="border-b border-gray-800">
            {["", "Title", "Location", "Fit", "Confidence", "Status", ""].map(
              (h) => (
                <th
                  key={h}
                  className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                >
                  {h}
                </th>
              ),
            )}
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-800">
          {Array.from({ length: rows }).map((_, i) => (
            <tr key={i}>
              <td>
                <Skeleton className="mx-5 h-5 w-5 rounded-sm" />
              </td>
              <td className="px-4 py-3">
                <Skeleton className="h-4 w-48 mb-1.5" />
                <Skeleton className="h-3 w-24" />
              </td>
              <td className="px-4 py-3">
                <Skeleton className="h-4 w-32 mb-1.5" />
                <Skeleton className="h-3 w-16" />
              </td>
              <td className="px-4 py-3">
                <Skeleton className="h-5 w-12 rounded-full" />
              </td>
              <td className="px-4 py-3">
                <Skeleton className="h-4 w-10" />
              </td>
              <td className="px-4 py-3">
                <Skeleton className="h-5 w-16 rounded-full" />
              </td>
              <td className="px-4 py-3">
                <Skeleton className="h-4 w-4" />
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}