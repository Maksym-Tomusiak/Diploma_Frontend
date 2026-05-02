"use client";

import { useAuth } from "@/context/AuthContext";
import { UserRole } from "@/types/auth";
import { FontsTable } from "@/components/admin/FontsTable";
import { useFontsManagement } from "@/hooks/useFontsManagement";

export default function FontsPage() {
  const { user: currentUser, isLoading: authLoading } = useAuth();

  const isAdmin = currentUser?.role === UserRole.ADMIN;
  const fontsData = useFontsManagement(isAdmin, authLoading, "fonts");

  return (
    <>
      <h1 className="text-2xl font-semibold text-slate-900 mb-6">
        Fonts Management
      </h1>
      <FontsTable
        fonts={fontsData.fonts}
        searchQuery={fontsData.searchQuery}
        setSearchQuery={fontsData.setSearchQuery}
        currentPage={fontsData.currentPage}
        totalPages={fontsData.totalPages}
        onPageChange={fontsData.setCurrentPage}
        fontsLoading={fontsData.fontsLoading}
        fontsError={fontsData.fontsError}
        onSeedFonts={fontsData.handleSeedFonts}
        onRefresh={fontsData.handleRefresh}
        onCreateFont={fontsData.handleCreateFont}
        onDeleteFont={fontsData.handleDeleteFont}
      />
    </>
  );
}
