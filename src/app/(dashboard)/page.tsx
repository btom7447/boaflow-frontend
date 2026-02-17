"use client"

import { useQuery } from "@tanstack/react-query"
import { dashboardApi } from "@/lib/api"
import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from "recharts"
import { TrendingUp, Target, Award, Zap, Crosshair } from "lucide-react"
import { Badge } from "@/components/ui/Badge"
import { RUN_STATUS_COLORS } from "@/lib/constants"
import Link from "next/link"

export default function DashboardPage() {
  const { data: stats, isLoading } = useQuery({
    queryKey: ["dashboard-stats"],
    queryFn: dashboardApi.getStats,
  })

  if (isLoading) {
    return <DashboardSkeleton />
  }

  if (!stats) {
    return (
      <div className="p-6">
        <p className="text-gray-500">Failed to load dashboard</p>
      </div>
    )
  }

  const fitData = [
    { name: "Yes", value: stats.leads_yes, color: "#10b981" },
    { name: "Maybe", value: stats.leads_maybe, color: "#f59e0b" },
    { name: "No", value: stats.leads_no, color: "#ef4444" },
  ]

  return (
    <div className="p-6 space-y-6">
      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          icon={Crosshair}
          label="Total Leads"
          value={stats.total_leads.toLocaleString()}
          trend="+12% from last month"
          trendUp
        />
        <StatCard
          icon={TrendingUp}
          label="High Fit Leads"
          value={stats.leads_yes.toLocaleString()}
          trend={
            stats.total_leads > 0
              ? `${((stats.leads_yes / stats.total_leads) * 100).toFixed(1)}% of total`
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
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Leads Over Time */}
        <div className="bg-gray-900 border border-gray-800 rounded-xl p-6">
          <h2 className="text-sm font-medium text-gray-300 mb-4">
            Leads Over Time
          </h2>
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
        </div>

        {/* Fit Distribution */}
        <div className="bg-gray-900 border border-gray-800 rounded-xl p-6">
          <h2 className="text-sm font-medium text-gray-300 mb-4">
            Fit Distribution
          </h2>
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
                  color: "#f9fafb",
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
        </div>
      </div>

      {/* Recent Pipeline Runs */}
      <div className="bg-gray-900 border border-gray-800 rounded-xl overflow-hidden">
        <div className="px-6 py-4 border-b border-gray-800 flex items-center justify-between">
          <h2 className="text-sm font-medium text-gray-300">
            Recent Pipeline Runs
          </h2>
          <Link
            href="/pipeline"
            className="text-xs text-emerald-400 hover:text-emerald-300 transition-colors"
          >
            View all →
          </Link>
        </div>
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-gray-800">
              {["Run", "Status", "Jobs Found", "Leads", "Date"].map((h) => (
                <th
                  key={h}
                  className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                >
                  {h}
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-800">
            {stats.recent_runs.length === 0 ? (
              <tr>
                <td
                  colSpan={5}
                  className="px-6 py-8 text-center text-gray-500 text-sm"
                >
                  No pipeline runs yet
                </td>
              </tr>
            ) : (
              stats.recent_runs.map((run) => (
                <tr
                  key={run.id}
                  className="hover:bg-gray-800/50 transition-colors"
                >
                  <td className="px-6 py-3 font-medium text-gray-200">
                    Run #{run.id}
                  </td>
                  <td className="px-6 py-3">
                    <Badge
                      label={
                        run.status.charAt(0).toUpperCase() + run.status.slice(1)
                      }
                      colorClass={
                        RUN_STATUS_COLORS[run.status] ||
                        "bg-gray-800 text-gray-400"
                      }
                    />
                  </td>
                  <td className="px-6 py-3 text-gray-400">{run.jobs_found}</td>
                  <td className="px-6 py-3">
                    <span className="text-emerald-400">
                      {run.leads_yes} yes
                    </span>
                  </td>
                  <td className="px-6 py-3 text-gray-500 text-xs">
                    {new Date(run.created_at).toLocaleDateString()}
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}

function StatCard({
  icon: Icon,
  label,
  value,
  trend,
  trendUp,
}: {
  icon: any
  label: string
  value: string
  trend?: string
  trendUp?: boolean
}) {
  return (
    <div className="bg-gray-900 border border-gray-800 rounded-xl p-5">
      <div className="flex items-center justify-between mb-3">
        <div className="w-10 h-10 rounded-lg bg-emerald-600/10 flex items-center justify-center">
          <Icon size={18} className="text-emerald-400" />
        </div>
      </div>
      <p className="text-2xl font-semibold text-white mb-1">{value}</p>
      <p className="text-xs text-gray-500">{label}</p>
      {trend && (
        <p
          className={`text-xs mt-2 ${
            trendUp ? "text-emerald-400" : "text-gray-600"
          }`}
        >
          {trend}
        </p>
      )}
    </div>
  )
}

function DashboardSkeleton() {
  return (
    <div className="p-6 space-y-6">
      <div>
        <div className="h-7 w-32 bg-gray-800 rounded animate-pulse" />
        <div className="h-4 w-48 bg-gray-800 rounded animate-pulse mt-2" />
      </div>

      {/* Stats Cards Skeleton */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {Array.from({ length: 4 }).map((_, i) => (
          <div key={i} className="bg-gray-900 border border-gray-800 rounded-xl p-5">
            <div className="w-10 h-10 rounded-lg bg-gray-800 animate-pulse mb-3" />
            <div className="h-8 w-20 bg-gray-800 rounded animate-pulse mb-2" />
            <div className="h-3 w-24 bg-gray-800 rounded animate-pulse" />
          </div>
        ))}
      </div>

      {/* Charts Skeleton */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {Array.from({ length: 2 }).map((_, i) => (
          <div key={i} className="bg-gray-900 border border-gray-800 rounded-xl p-6">
            <div className="h-4 w-32 bg-gray-800 rounded animate-pulse mb-4" />
            <div className="h-48 bg-gray-800 rounded animate-pulse" />
          </div>
        ))}
      </div>

      {/* Table Skeleton */}
      <div className="bg-gray-900 border border-gray-800 rounded-xl overflow-hidden">
        <div className="px-6 py-4 border-b border-gray-800">
          <div className="h-4 w-40 bg-gray-800 rounded animate-pulse" />
        </div>
        <div className="p-6 space-y-3">
          {Array.from({ length: 5 }).map((_, i) => (
            <div key={i} className="h-12 bg-gray-800 rounded animate-pulse" />
          ))}
        </div>
      </div>
    </div>
  )
}