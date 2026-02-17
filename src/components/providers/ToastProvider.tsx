"use client";

import { Toaster } from "sonner";

export function ToastProvider() {
  return (
    <Toaster
      position="top-right"
      expand={false}
      richColors
      toastOptions={{
        style: {
          background: "#111827", // gray-900
          border: "1px solid #1f2937", // gray-800
          color: "#f9fafb", // gray-50
        },
        classNames: {
          toast:
            "group toast group-[.toaster]:bg-gray-900 group-[.toaster]:text-gray-50 group-[.toaster]:border-gray-800 group-[.toaster]:shadow-lg",
          description: "group-[.toast]:text-gray-500",
          actionButton:
            "group-[.toast]:bg-emerald-600 group-[.toast]:text-white",
          cancelButton:
            "group-[.toast]:bg-gray-800 group-[.toast]:text-gray-300",
          closeButton:
            "group-[.toast]:bg-gray-800 group-[.toast]:border-gray-700 group-[.toast]:text-gray-400 group-[.toast]:hover:text-gray-200",
          error:
            "group-[.toast]:border-red-900/50 group-[.toast]:bg-red-950/30",
          success:
            "group-[.toast]:border-emerald-900/50 group-[.toast]:bg-emerald-950/30",
          warning:
            "group-[.toast]:border-yellow-900/50 group-[.toast]:bg-yellow-950/30",
          info: "group-[.toast]:border-blue-900/50 group-[.toast]:bg-blue-950/30",
        },
      }}
    />
  );
}
