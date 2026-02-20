import { Skeleton } from "../ui/Skeleton";

export function UsersSkeleton({ rows = 5 }: { rows?: number }) {
  return (
    <div className="bg-gray-900 border border-gray-800 rounded-xl overflow-hidden">
      <table className="w-full text-sm">
        <thead>
          <tr className="border-b border-gray-800">
            {["User", "Role", "Status", ""].map((h) => (
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
              {/* Avatar + Name */}
              <td className="px-4 py-3">
                <div className="flex items-center gap-3">
                  <Skeleton className="w-7 h-7 rounded-full" />
                  <div className="space-y-2">
                    <Skeleton className="h-3 w-24" />
                    <Skeleton className="h-3 w-32" />
                  </div>
                </div>
              </td>

              {/* Role */}
              <td className="px-4 py-3">
                <Skeleton className="h-5 w-16 rounded-full" />
              </td>

              {/* Status */}
              <td className="px-4 py-3">
                <Skeleton className="h-5 w-20 rounded-full" />
              </td>

              {/* Action */}
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
