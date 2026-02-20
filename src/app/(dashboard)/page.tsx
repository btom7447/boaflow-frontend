"use client";

import { useQuery } from "@tanstack/react-query";
import { dashboardApi, organizationApi } from "@/lib/api";
import { useAuthStore } from "@/store/authStore";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
} from "recharts";
import {
  TrendingUp,
  Award,
  Zap,
  Crosshair,
  Building2,
  Users,
  Search,
  TrendingDown,
} from "lucide-react";
import Link from "next/link";
import { Badge } from "@/components/ui/Badge";
import { RUN_STATUS_COLORS } from "@/lib/constants";

import { DashboardSkeleton } from "@/components/skeletons/DashboardSkeleton";
import { StatCard } from "@/components/ui/Statcard";
import { StatItem } from "@/components/ui/StatItem";
import { ChartCard } from "@/components/ui/ChartCard";
import { PipelineTable } from "@/components/ui/PipelineTable";

export default function DashboardPage() {
  const { user, organization } = useAuthStore();
  const isAdmin = user?.role === "admin";

  const { data: stats, isLoading: statsLoading } = useQuery({
    queryKey: ["dashboard-stats"],
    queryFn: dashboardApi.getStats,
  });

  const { data: orgStats, isLoading: orgStatsLoading } = useQuery({
    queryKey: ["organization-stats"],
    queryFn: organizationApi.getStats,
    enabled: isAdmin,
  });

  const isLoading = statsLoading || (isAdmin && orgStatsLoading);

  if (isLoading) return <DashboardSkeleton />;

  if (!stats) {
    return (
      <div className="p-6">
        <p className="text-gray-500">Failed to load dashboard</p>
      </div>
    );
  }

  const fitData = [
    { name: "Match", value: stats.leads_match, color: "#10b981" },
    { name: "No Match", value: stats.leads_no_match, color: "#ef4444" },
  ];

  return (
    <div className="p-6 space-y-6">
      {/* Welcome */}
      <div>
        <h1 className="text-2xl font-semibold text-white mb-1">
          Welcome back,{" "}
          <span className="text-blue-400">{user?.full_name || user?.email?.split("@")[0]}</span>
        </h1>
        <p className="text-sm text-gray-400">
          Here's what's happening with your leads today
        </p>
      </div>
      {/* Organization Stats */}
      {isAdmin && orgStats && organization && (
        <Link href="/organization">
          <div className="bg-linear-to-br from-blue-600/10 to-purple-600/10 border border-blue-600/30 rounded-xl p-6 hover:border-blue-600/50 transition-all cursor-pointer group mb-5">
            <div className="flex items-start justify-between mb-4">
              <div>
                <div className="flex items-center gap-2 mb-1">
                  <Building2 size={18} className="text-blue-400" />
                  <h2 className="text-sm font-medium text-blue-400">
                    {organization.name} • {capitalize(organization.plan)} Plan
                  </h2>
                </div>
                <p className="text-xs text-gray-400">
                  Click to manage organization settings
                </p>
              </div>
              <div className="text-right">
                <p className="text-xs text-gray-500 mb-1">Monthly Usage</p>
                <p className="text-2xl font-semibold text-white">
                  {orgStats.usage_percentage.toFixed(0)}%
                </p>
              </div>
            </div>

            <div className="grid grid-cols-3 gap-4">
              <StatItem
                icon={Search}
                label="Searches"
                value={`${orgStats.searches_used} / ${orgStats.searches_limit}`}
              />
              <StatItem
                icon={Crosshair}
                label="Total Leads"
                value={(orgStats.total_leads ?? 0).toLocaleString()}
              />
              <StatItem
                icon={Users}
                label="Team"
                value={`${orgStats.team_members} members`}
              />
            </div>

            {orgStats.usage_percentage >= 80 && (
              <div className="mt-4 flex items-center gap-2 text-xs text-yellow-400 bg-yellow-950/30 border border-yellow-900/50 rounded-lg px-3 py-2">
                <TrendingDown size={14} />
                You're approaching your monthly limit. Consider upgrading.
              </div>
            )}
          </div>
        </Link>
      )}
      {/* Lead Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          icon={Crosshair}
          label="Total Leads"
          value={(stats.total_leads ?? 0).toLocaleString()}
          trend="+12% from last month"
          trendUp
        />
        <StatCard
          icon={TrendingUp}
          label="High Fit Leads"
          value={(stats.leads_match ?? 0).toLocaleString()}
          trend={
            stats.total_leads > 0
              ? `${((stats.leads_match / stats.total_leads) * 100).toFixed(1)}% of total`
              : "0% of total"
          }
        />
        <StatCard
          icon={Award}
          label="Conversion Rate"
          value={`${stats.conversion_rate}%`}
          trend="Contacted or better"
        />
        <StatCard
          icon={Zap}
          label="Avg Confidence"
          value={`${stats.avg_confidence}%`}
          trend="Across all leads"
        />
      </div>
      {/* Charts */}
      <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
        <ChartCard title="Leads Over Time">
          <ResponsiveContainer width="100%" height={200}>
            <LineChart data={stats.leads_over_time}>
              <XAxis
                dataKey="date"
                stroke="#6b7280"
                fontSize={12}
                tickFormatter={(date) =>
                  new Date(date).toLocaleDateString("en-US", {
                    month: "short",
                    day: "numeric",
                  })
                }
              />
              <YAxis stroke="#6b7280" fontSize={12} />
              <Tooltip
                contentStyle={{
                  backgroundColor: "#1f2937",
                  border: "1px solid #374151",
                  borderRadius: "8px",
                  color: "#f9fafb",
                }}
              />
              <Line
                type="monotone"
                dataKey="count"
                stroke="#10b981"
                strokeWidth={2}
                dot={{ fill: "#10b981", r: 4 }}
              />
            </LineChart>
          </ResponsiveContainer>
        </ChartCard>

        <ChartCard title="Match Distribution">
          <ResponsiveContainer width="100%" height={200}>
            <PieChart>
              <Pie
                data={fitData}
                cx="50%"
                cy="50%"
                innerRadius={60}
                outerRadius={80}
                paddingAngle={2}
                dataKey="value"
              >
                {fitData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip
                contentStyle={{
                  backgroundColor: "#1f2937",
                  border: "1px solid #374151",
                  borderRadius: "8px",
                  color: "#fff",
                }}
              />
            </PieChart>
          </ResponsiveContainer>
          <div className="flex items-center justify-center gap-4 mt-4">
            {fitData.map((item) => (
              <div key={item.name} className="flex items-center gap-2">
                <div
                  className="w-3 h-3 rounded-full"
                  style={{ backgroundColor: item.color }}
                />
                <span className="text-xs text-gray-400">
                  {item.name}: {item.value}
                </span>
              </div>
            ))}
          </div>
        </ChartCard>
      </div>
      {/* Recent Pipeline Runs */}
      <PipelineTable runs={stats.recent_runs} limit={5} filterToday />
    </div>
  );
}

// Utility function
function capitalize(str: string) {
  return str.charAt(0).toUpperCase() + str.slice(1);
}
