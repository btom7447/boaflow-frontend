export type PlanKey = "free" | "starter" | "pro" | "agency" | "enterprise";

export interface PlanInfo {
  name: string;
  color: string; 
  bg: string; 
  limit: number | null;
  price: string;
}

export const PLAN_INFO: Record<PlanKey, PlanInfo> = {
  free: {
    name: "Free",
    color: "text-gray-400",
    bg: "bg-gray-700",
    limit: 100,
    price: "$0",
  },
  starter: {
    name: "Starter",
    color: "text-blue-400",
    bg: "bg-blue-600/20 border-blue-600/30",
    limit: 500,
    price: "$199",
  },
  pro: {
    name: "Pro",
    color: "text-purple-400",
    bg: "bg-purple-600/20 border-purple-600/30",
    limit: 2000,
    price: "$499",
  },
  agency: {
    name: "Agency",
    color: "text-green-400",
    bg: "bg-green-600/20 border-green-600/30",
    limit: 5000,
    price: "$999",
  },
  enterprise: {
    name: "Enterprise",
    color: "text-yellow-400",
    bg: "bg-yellow-600/20 border-yellow-600/30",
    limit: null,
    price: "Custom",
  },
};

// Optional: a derived object for plan badge colors
export const PLAN_COLORS: Record<PlanKey, string> = Object.fromEntries(
  Object.entries(PLAN_INFO).map(([key, info]) => [
    key,
    `${info.bg} ${info.color}`,
  ]),
) as Record<PlanKey, string>;
