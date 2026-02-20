"use client";
import React from "react";

export function StatCard({
  icon: Icon,
  label,
  value,
  trend,
  trendUp,
}: {
  icon: any;
  label: string;
  value: string;
  trend?: string;
  trendUp?: boolean;
}) {
  return (
    <div className="bg-gray-900 border border-gray-800 rounded-xl p-5">
      <div className="flex items-center justify-between mb-3">
        <div className="w-10 h-10 rounded-lg bg-blue-600/10 flex items-center justify-center">
          <Icon size={18} className="text-blue-400" />
        </div>
      </div>
      <p className="text-2xl font-semibold text-white mb-1">{value}</p>
      <p className="text-xs text-gray-500">{label}</p>
      {trend && (
        <p
          className={`text-xs mt-2 ${trendUp ? "text-blue-400" : "text-gray-600"}`}
        >
          {trend}
        </p>
      )}
    </div>
  );
}