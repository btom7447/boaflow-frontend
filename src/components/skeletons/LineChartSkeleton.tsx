"use client";

import { Skeleton } from "../ui/Skeleton";

export function LineChartSkeleton({ height = 200 }: { height?: number }) {
  return (
    <div className="bg-gray-900 border border-gray-800 rounded-xl p-4">
      {/* Title */}
      <Skeleton className="w-40 h-5 mb-4" />

      {/* Chart Area */}
      <div className="relative w-full" style={{ height }}>
        {/* Y Axis ticks */}
        <div className="absolute left-0 top-0 h-full flex flex-col justify-between py-2">
          <Skeleton className="w-6 h-3" />
          <Skeleton className="w-6 h-3" />
          <Skeleton className="w-6 h-3" />
          <Skeleton className="w-6 h-3" />
        </div>

        {/* Line Shape */}
        <div className="absolute inset-0 flex items-center justify-center">
          <svg
            width="90%"
            height="70%"
            viewBox="0 0 100 50"
            preserveAspectRatio="none"
          >
            <path
              d="M0 40 L20 30 L40 35 L60 20 L80 25 L100 10"
              fill="none"
              stroke="#374151"
              strokeWidth="2"
              strokeLinecap="round"
            />
          </svg>
        </div>

        {/* Data Points */}
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="relative w-[90%] h-[70%]">
            <Skeleton className="absolute left-[0%] bottom-[20%] w-2 h-2 rounded-full" />
            <Skeleton className="absolute left-[20%] bottom-[40%] w-2 h-2 rounded-full" />
            <Skeleton className="absolute left-[40%] bottom-[30%] w-2 h-2 rounded-full" />
            <Skeleton className="absolute left-[60%] bottom-[60%] w-2 h-2 rounded-full" />
            <Skeleton className="absolute left-[80%] bottom-[50%] w-2 h-2 rounded-full" />
            <Skeleton className="absolute left-full bottom-[75%] w-2 h-2 rounded-full -translate-x-1/2" />
          </div>
        </div>

        {/* X Axis ticks */}
        <div className="absolute bottom-0 left-0 w-full flex justify-between px-8">
          <Skeleton className="w-10 h-3" />
          <Skeleton className="w-10 h-3" />
          <Skeleton className="w-10 h-3" />
          <Skeleton className="w-10 h-3" />
          <Skeleton className="w-10 h-3" />
        </div>
      </div>
    </div>
  );
}
