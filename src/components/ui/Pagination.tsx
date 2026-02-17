import { ChevronLeft, ChevronRight } from "lucide-react";
import { clsx } from "clsx";

interface PaginationProps {
  total: number;
  limit: number;
  offset: number;
  onChange: (offset: number) => void;
}

export function Pagination({
  total,
  limit,
  offset,
  onChange,
}: PaginationProps) {
  const currentPage = Math.floor(offset / limit) + 1;
  const totalPages = Math.ceil(total / limit);

  if (totalPages <= 1) return null;

  const pages = Array.from({ length: totalPages }, (_, i) => i + 1).filter(
    (p) => p === 1 || p === totalPages || Math.abs(p - currentPage) <= 1,
  );

  // Insert ellipsis markers
  const withEllipsis: (number | "...")[] = [];
  let prev = 0;
  for (const p of pages) {
    if (p - prev > 1) withEllipsis.push("...");
    withEllipsis.push(p);
    prev = p;
  }

  return (
    <div className="flex items-center justify-between mt-4">
      <p className="text-xs text-gray-500">
        Showing {offset + 1}–{Math.min(offset + limit, total)} of {total}
      </p>

      <div className="flex items-center gap-1">
        <button
          onClick={() => onChange(Math.max(0, offset - limit))}
          disabled={offset === 0}
          className="p-1.5 rounded-lg text-gray-400 hover:text-gray-200 hover:bg-gray-800 disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
        >
          <ChevronLeft size={15} />
        </button>

        {withEllipsis.map((item, i) =>
          item === "..." ? (
            <span key={`ellipsis-${i}`} className="px-2 text-gray-600 text-sm">
              …
            </span>
          ) : (
            <button
              key={item}
              onClick={() => onChange((item - 1) * limit)}
              className={clsx(
                "w-8 h-8 rounded-lg text-xs font-medium transition-colors",
                item === currentPage
                  ? "bg-blue-600 text-white"
                  : "text-gray-400 hover:text-gray-200 hover:bg-gray-800",
              )}
            >
              {item}
            </button>
          ),
        )}

        <button
          onClick={() => onChange(offset + limit)}
          disabled={offset + limit >= total}
          className="p-1.5 rounded-lg text-gray-400 hover:text-gray-200 hover:bg-gray-800 disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
        >
          <ChevronRight size={15} />
        </button>
      </div>
    </div>
  );
}
