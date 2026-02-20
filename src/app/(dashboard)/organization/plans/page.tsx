"use client";

import { useAuthStore } from "@/store/authStore";
import { Button } from "@/components/ui/Button";
import { clsx } from "clsx";
import { TrendingUp, Crown } from "lucide-react";
import { PLAN_INFO } from "@/lib/plans";

export default function PlanPage() {
  const { organization } = useAuthStore();
  const currentPlanKey = organization?.plan || "free";

  const currentPlan = PLAN_INFO[currentPlanKey as keyof typeof PLAN_INFO];

  return (
    <div className="p-6 max-w-5xl mx-auto">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-semibold text-white">Upgrade Plan</h1>
        <div
          className={clsx(
            "px-4 py-2 rounded-lg border font-medium flex items-center gap-1",
            currentPlan.bg,
            currentPlan.color,
          )}
        >
          <Crown size={14} />
          {currentPlan.name} Plan
        </div>
      </div>

      {/* Plan Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {Object.entries(PLAN_INFO).map(([key, plan]) => {
          const isCurrent = key === currentPlanKey;
          return (
            <div
              key={key}
              className={clsx(
                "bg-gray-900 border border-gray-800 rounded-xl p-6 flex flex-col justify-between",
                isCurrent ? "border-blue-600" : "hover:border-gray-600",
              )}
            >
              <div>
                <p className={clsx("text-lg font-semibold mb-1 text-white")}>
                  {plan.name} Plan
                </p>
                <p className={clsx("text-xs mb-3", plan.color)}>
                  {plan.price}/month
                </p>
                <p className="text-gray-400 text-sm mb-4">
                  {plan.limit
                    ? `${plan.limit.toLocaleString()} searches per month`
                    : "Unlimited searches"}
                </p>
                <p className="text-gray-500 text-sm mb-4">
                  {/* Placeholder for plan benefits */}
                  Placeholder for plan benefits
                </p>
              </div>

              <Button
                variant={isCurrent ? "secondary" : "primary"}
                disabled={isCurrent}
              >
                {isCurrent ? "Current Plan" : "Upgrade"}
              </Button>
            </div>
          );
        })}
      </div>

      <p className="text-xs text-gray-500 mt-6 text-center">
        Need a custom plan?{" "}
        <a
          href="mailto:billing@boaflow.com"
          className="text-blue-400 hover:text-blue-300"
        >
          Contact sales
        </a>
      </p>
    </div>
  );
}
