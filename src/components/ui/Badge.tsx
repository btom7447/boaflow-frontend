import { clsx } from "clsx";

interface BadgeProps {
  label: string;
  colorClass: string;
  className?: string;
}

export function Badge({ label, colorClass, className }: BadgeProps) {
  return (
    <span
      className={clsx(
        "inline-flex items-center px-2 py-0.5 rounded text-xs font-medium",
        colorClass,
        className,
      )}
    >
      {label}
    </span>
  );
}
