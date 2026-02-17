import { clsx } from "clsx";
import { InputHTMLAttributes, forwardRef } from "react";

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
}

export const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ label, error, className, ...props }, ref) => {
    return (
      <div className="flex flex-col gap-1.5">
        {label && (
          <label className="text-sm font-medium text-gray-300">{label}</label>
        )}
        <input
          ref={ref}
          className={clsx(
            "w-full px-3 py-2 rounded-lg bg-gray-900 border text-gray-100 placeholder-gray-500 text-sm transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent",
            error ? "border-red-500" : "border-gray-700 hover:border-gray-600",
            className,
          )}
          {...props}
        />
        {error && <p className="text-xs text-red-400">{error}</p>}
      </div>
    );
  },
);
Input.displayName = "Input";
