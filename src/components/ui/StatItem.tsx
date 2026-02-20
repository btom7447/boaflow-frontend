"use client";
import React from "react";

export function StatItem({
  icon: Icon,
  label,
  value,
}: {
  icon: any;
  label: string;
  value: string;
}) {
  return (
    <div className="bg-gray-900/50 rounded-lg p-3">
      <div className="flex items-center gap-2 mb-1">
        <Icon size={14} className="text-gray-400" />
        <p className="text-xs text-gray-400">{label}</p>
      </div>
      <p className="text-lg font-semibold text-white">{value}</p>
    </div>
  );
}
