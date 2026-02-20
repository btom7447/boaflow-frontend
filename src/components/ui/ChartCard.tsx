"use client";
import React from "react";

export function ChartCard({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) {
  return (
    <div className="bg-gray-900 border border-gray-800 rounded-xl p-6">
      {children && (
        <h2 className="text-sm font-medium text-gray-300 mb-4">{title}</h2>
      )}
      {children}
    </div>
  );
}
