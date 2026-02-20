"use client";

import { useQuery } from "@tanstack/react-query";
import { organizationApi } from "@/lib/api";
import { useAuthStore } from "@/store/authStore";
import { OrganizationSkeleton } from "@/components/skeletons/OrganizationSkeleton";
import { Button } from "@/components/ui/Button";
import {
  Building2,
  Users,
  Search,
  Crosshair,
  TrendingUp,
  CreditCard,
  Crown,
  Calendar,
  Mail,
} from "lucide-react";
import { clsx } from "clsx";
import Link from "next/link";
import { PLAN_INFO } from "@/lib/plans";

export default function OrganizationPage() {
  const { organization } = useAuthStore();

  const { data: stats, isLoading: statsLoading } = useQuery({
    queryKey: ["organization-stats"],
    queryFn: organizationApi.getStats,
  });

  const { data: orgDetails, isLoading: orgLoading } = useQuery({
    queryKey: ["organization"],
    queryFn: organizationApi.getOrganization,
  });

  const isLoading = statsLoading || orgLoading;

  if (isLoading) {
    return <OrganizationSkeleton />;
  }

  if (!stats || !orgDetails) {
    return (
      <div className="p-6">
        <p className="text-gray-500">Failed to load organization details</p>
      </div>
    );
  }

  const planInfo =
    PLAN_INFO[orgDetails.plan as keyof typeof PLAN_INFO] || PLAN_INFO.free;

  const usagePercentage = stats.usage_percentage;
  const isNearLimit = usagePercentage >= 80;

  return (
    <div className="p-6 max-w-5xl mx-auto">
      {/* Header */}
      <div className="flex items-start justify-between mb-6">
        <div>
          <h1 className="text-2xl font-semibold text-white mb-1">
            {orgDetails.name}
          </h1>
          <p className="text-sm text-gray-400">
            Organization settings and usage
          </p>
        </div>
        <div
          className={clsx(
            "px-4 py-2 rounded-lg border font-medium",
            planInfo.bg,
            planInfo.color,
          )}
        >
          <Crown size={14} className="inline mr-1.5" />
          {planInfo.name} Plan
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        <StatCard
          icon={Search}
          label="Searches This Month"
          value={`${stats.searches_used.toLocaleString()} / ${stats.searches_limit.toLocaleString()}`}
          subtext={`${stats.searches_remaining.toLocaleString()} remaining`}
          color="blue"
        />
        <StatCard
          icon={Crosshair}
          label="Total Leads"
          value={stats.total_leads.toLocaleString()}
          subtext="Across all searches"
          color="green"
        />
        <StatCard
          icon={Users}
          label="Team Members"
          value={stats.team_members.toString()}
          subtext={`${stats.total_configurations} active searches`}
          color="purple"
        />
      </div>

      {/* Usage Progress */}
      <div className="bg-gray-900 border border-gray-800 rounded-xl p-6 mb-6">
        <div className="flex items-center justify-between mb-3">
          <h2 className="text-sm font-medium text-gray-300">Monthly Usage</h2>
          <span
            className={clsx(
              "text-sm font-medium",
              isNearLimit ? "text-red-400" : "text-gray-400",
            )}
          >
            {usagePercentage.toFixed(1)}%
          </span>
        </div>
        <div className="relative w-full h-3 bg-gray-800 rounded-full overflow-hidden">
          <div
            className={clsx(
              "absolute top-0 left-0 h-full rounded-full transition-all duration-500",
              isNearLimit ? "bg-red-500" : "bg-blue-500",
            )}
            style={{ width: `${Math.min(usagePercentage, 100)}%` }}
          />
        </div>
        {isNearLimit && (
          <p className="text-xs text-red-400 mt-2">
            ⚠️ You're approaching your monthly limit. Consider upgrading your
            plan.
          </p>
        )}
      </div>

      {/* Organization Details */}
      <div className="bg-gray-900 border border-gray-800 rounded-xl p-6 mb-6">
        <h2 className="text-sm font-medium text-gray-300 mb-4">
          Organization Details
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <DetailRow
            icon={Building2}
            label="Organization Name"
            value={orgDetails.name}
          />
          <DetailRow
            icon={Mail}
            label="Billing Email"
            value={orgDetails.billing_email || "Not set"}
          />
          <DetailRow
            icon={Calendar}
            label="Created"
            value={new Date(orgDetails.created_at).toLocaleDateString(
              undefined,
              {
                year: "numeric",
                month: "long",
                day: "numeric",
              },
            )}
          />
          <DetailRow
            icon={CreditCard}
            label="Status"
            value={orgDetails.is_active ? "Active" : "Inactive"}
            valueColor={
              orgDetails.is_active ? "text-green-400" : "text-red-400"
            }
          />
        </div>
      </div>

      {/* Plan Management */}
      <div className="bg-gray-900 border border-gray-800 rounded-xl p-6">
        <div className="flex items-start justify-between mb-4">
          <div>
            <h2 className="text-sm font-medium text-gray-300 mb-1">
              Current Plan: {planInfo.name}
            </h2>
            <p className="text-xs text-gray-500">
              {planInfo.price}/month •{" "}
              {planInfo.limit
                ? `${planInfo.limit.toLocaleString()} searches`
                : "Unlimited searches"}
            </p>
          </div>
          <Link href="/organization/plans">
            <Button variant="primary" size="sm">
              <TrendingUp size={13} className="mr-1.5" />
              Upgrade Plan
            </Button>
          </Link>
        </div>

        {/* Plan comparison */}
        <div className="grid grid-cols-2 md:grid-cols-5 gap-3 mt-6">
          {Object.entries(PLAN_INFO).map(([key, info]) => (
            <div
              key={key}
              className={clsx(
                "p-4 rounded-lg border text-center transition-all",
                orgDetails.plan === key
                  ? `${info.bg} border-current`
                  : "bg-gray-800/50 border-gray-700 hover:border-gray-600",
              )}
            >
              <p className={clsx("text-xs font-medium mb-1", info.color)}>
                {info.name}
              </p>
              <p className="text-lg font-semibold text-white mb-1">
                {info.price}
              </p>
              <p className="text-xs text-gray-500">
                {info.limit
                  ? `${info.limit.toLocaleString()} / mo`
                  : "Unlimited"}
              </p>
            </div>
          ))}
        </div>

        <p className="text-xs text-gray-500 mt-4 text-center">
          Need a custom plan?{" "}
          <a
            href="mailto:billing@boaflow.com"
            className="text-blue-400 hover:text-blue-300"
          >
            Contact sales
          </a>
        </p>
      </div>
    </div>
  );
}

function StatCard({
  icon: Icon,
  label,
  value,
  subtext,
  color,
}: {
  icon: any;
  label: string;
  value: string;
  subtext: string;
  color: "blue" | "green" | "purple";
}) {
  const colorClasses = {
    blue: "bg-blue-600/10 text-blue-400",
    green: "bg-green-600/10 text-green-400",
    purple: "bg-purple-600/10 text-purple-400",
  };

  return (
    <div className="bg-gray-900 border border-gray-800 rounded-xl p-5">
      <div
        className={clsx(
          "w-10 h-10 rounded-lg flex items-center justify-center mb-3",
          colorClasses[color],
        )}
      >
        <Icon size={18} />
      </div>
      <p className="text-2xl font-semibold text-white mb-1">{value}</p>
      <p className="text-xs text-gray-500">{label}</p>
      <p className="text-xs text-gray-600 mt-1">{subtext}</p>
    </div>
  );
}

function DetailRow({
  icon: Icon,
  label,
  value,
  valueColor = "text-gray-200",
}: {
  icon: any;
  label: string;
  value: string;
  valueColor?: string;
}) {
  return (
    <div className="flex items-center gap-3">
      <div className="w-8 h-8 rounded-lg bg-gray-800 flex items-center justify-center shrink-0">
        <Icon size={14} className="text-gray-500" />
      </div>
      <div>
        <p className="text-xs text-gray-500">{label}</p>
        <p className={clsx("text-sm font-medium", valueColor)}>{value}</p>
      </div>
    </div>
  );
}
