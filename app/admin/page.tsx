import { validateSession } from "@/lib/auth";
import { redirect } from "next/navigation";
import {
  getTotalStats,
  getTodayStats,
  getTopPages,
  getRecentSubmissions,
  getSubmissionCount,
  getViewsPerDay,
  getReferrerStats,
} from "@/lib/db/analytics";
import StatsCard from "@/components/admin/StatsCard";
import SimpleBarChart from "@/components/admin/SimpleBarChart";
import SubmissionsTable from "@/components/admin/SubmissionsTable";
import AdminHeader from "@/components/admin/AdminHeader";

export const dynamic = "force-dynamic";

export default async function AdminDashboard() {
  const isAuth = await validateSession();
  if (!isAuth) redirect("/admin/login");

  const [totalStats, todayStats, topPages, submissions, subCount, viewsPerDay, referrers] =
    await Promise.all([
      getTotalStats(30),
      getTodayStats(),
      getTopPages(30),
      getRecentSubmissions(50),
      getSubmissionCount(),
      getViewsPerDay(14),
      getReferrerStats(30),
    ]);

  const chartData = viewsPerDay.map((row: Record<string, unknown>) => ({
    label: new Date(row.date as string).toLocaleDateString("en-US", { month: "short", day: "numeric" }),
    value: Number(row.views),
  }));

  const pageData = topPages.map((row: Record<string, unknown>) => ({
    label: row.path as string,
    value: Number(row.views),
  }));

  const referrerData = referrers.map((row: Record<string, unknown>) => ({
    label: (row.referrer as string).replace(/https?:\/\//, "").slice(0, 25),
    value: Number(row.views),
  }));

  return (
    <div className="min-h-screen bg-charcoal-900">
      <AdminHeader />

      <div className="px-6 md:px-8 py-8 max-w-7xl mx-auto space-y-8">
        {/* Stats Row */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <StatsCard label="Total Views (30d)" value={Number(totalStats.total_views).toLocaleString()} />
          <StatsCard label="Unique Visitors (30d)" value={Number(totalStats.total_visitors).toLocaleString()} />
          <StatsCard label="Today's Views" value={Number(todayStats.views).toLocaleString()} sub={`${todayStats.visitors} visitors`} />
          <StatsCard label="Form Submissions" value={Number(subCount.total).toLocaleString()} sub={`${subCount.unread} unread`} />
        </div>

        {/* Charts Row */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="bg-charcoal-800/50 rounded-2xl p-6 border border-charcoal-700">
            <h3 className="text-sm font-semibold text-white mb-4">Views (Last 14 Days)</h3>
            {chartData.length > 0 ? <SimpleBarChart data={chartData} /> : <p className="text-charcoal-500 text-sm">No data yet</p>}
          </div>
          <div className="bg-charcoal-800/50 rounded-2xl p-6 border border-charcoal-700">
            <h3 className="text-sm font-semibold text-white mb-4">Top Pages (30 Days)</h3>
            {pageData.length > 0 ? <SimpleBarChart data={pageData} /> : <p className="text-charcoal-500 text-sm">No data yet</p>}
          </div>
        </div>

        {/* Referrers */}
        {referrerData.length > 0 && (
          <div className="bg-charcoal-800/50 rounded-2xl p-6 border border-charcoal-700">
            <h3 className="text-sm font-semibold text-white mb-4">Traffic Sources (30 Days)</h3>
            <SimpleBarChart data={referrerData} />
          </div>
        )}

        {/* Submissions */}
        <div>
          <h3 className="text-sm font-semibold text-white mb-4">
            Recent Submissions
            {Number(subCount.unread) > 0 && (
              <span className="ml-2 px-2 py-0.5 bg-warm-600 text-white text-xs rounded-full">{subCount.unread} new</span>
            )}
          </h3>
          <SubmissionsTable submissions={submissions} />
        </div>
      </div>
    </div>
  );
}
