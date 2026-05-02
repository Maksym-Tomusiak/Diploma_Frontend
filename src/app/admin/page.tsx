"use client";

import { AnalyticsDashboard } from "@/components/admin/AnalyticsDashboard";

export default function AdminPage() {
  return (
    <>
      <h1 className="text-2xl font-semibold text-slate-900 mb-6">
        Analytics Dashboard
      </h1>
      <AnalyticsDashboard />
    </>
  );
}
