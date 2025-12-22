import { useEffect, useState } from "react";
import {
  analyticsService,
  type AnalyticsDashboard,
} from "@/services/AnalyticsService";
import { Loader2, FileText, Users, ShieldAlert } from "lucide-react";
import { StatCard } from "./analytics/StatCard";
import { DocumentProcessingChart } from "./analytics/DocumentProcessingChart";
import { UserRegistrationChart } from "./analytics/UserRegistrationChart";
import { RecentUsersTable } from "./analytics/RecentUsersTable";
import { RecentBansTable } from "./analytics/RecentBansTable";

export function AnalyticsDashboard() {
  const [data, setData] = useState<AnalyticsDashboard | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    loadDashboardData();
  }, []);

  const loadDashboardData = async () => {
    try {
      setLoading(true);
      const dashboardData = await analyticsService.getDashboardData();
      setData(dashboardData);
      setError(null);
    } catch (err) {
      console.error("Failed to load dashboard data:", err);
      setError("Failed to load analytics data");
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center p-8">
        <div className="text-center">
          <Loader2 className="h-12 w-12 animate-spin text-blue-600 mx-auto mb-4" />
          <p className="text-slate-600 font-medium">Loading analytics...</p>
        </div>
      </div>
    );
  }

  if (error || !data) {
    return (
      <div className="flex items-center justify-center p-8">
        <div className="text-center bg-red-50 p-8 rounded-2xl">
          <p className="text-red-600 mb-4 font-semibold">
            {error || "No data available"}
          </p>
          <button
            onClick={loadDashboardData}
            className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 font-medium transition-colors"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  // Calculate totals
  const totalChecks = data.document_processing.reduce(
    (sum, item) => sum + item.checks,
    0
  );
  const totalFormatting = data.document_processing.reduce(
    (sum, item) => sum + item.formatting,
    0
  );
  const totalNewUsers = data.user_registrations.reduce(
    (sum, item) => sum + item.count,
    0
  );
  const totalBans = data.recent_bans_unbans.filter(
    (a) => a.action_type === "ADMIN_BAN_USER"
  ).length;

  return (
    <div className="flex flex-col gap-6">
      {/* Stats Cards */}
      <div className="grid grid-cols-4 gap-4">
        <StatCard
          title="Document Checks"
          value={totalChecks}
          icon={FileText}
          gradientFrom="from-blue-500"
          gradientTo="to-blue-600"
        />
        <StatCard
          title="Formatting Jobs"
          value={totalFormatting}
          icon={FileText}
          gradientFrom="from-green-500"
          gradientTo="to-green-600"
        />
        <StatCard
          title="New Users"
          value={totalNewUsers}
          icon={Users}
          gradientFrom="from-purple-500"
          gradientTo="to-purple-600"
        />
        <StatCard
          title="Recent Bans"
          value={totalBans}
          icon={ShieldAlert}
          gradientFrom="from-red-500"
          gradientTo="to-red-600"
        />
      </div>

      {/* Charts Grid */}
      <div className="grid grid-cols-2 gap-6">
        <DocumentProcessingChart data={data.document_processing} />
        <UserRegistrationChart data={data.user_registrations} />
        <RecentUsersTable users={data.recent_users} />
        <RecentBansTable actions={data.recent_bans_unbans} />
      </div>
    </div>
  );
}
