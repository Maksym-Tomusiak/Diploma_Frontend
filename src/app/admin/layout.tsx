"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Loader2, Menu } from "lucide-react";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/context/AuthContext";
import { UserRole } from "@/types/auth";
import { getUserInitials } from "@/lib/formatters";
import { AdminSidebar } from "@/components/admin/AdminSidebar";

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const router = useRouter();
  const { user: currentUser, isLoading: authLoading } = useAuth();
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  const isAdmin = currentUser?.role === UserRole.ADMIN;

  useEffect(() => {
    if (!authLoading && !isAdmin) {
      router.push("/");
    }
  }, [currentUser, authLoading, router, isAdmin]);

  if (authLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-slate-600" />
      </div>
    );
  }

  if (!isAdmin) {
    return null;
  }

  return (
    <div className="min-h-screen bg-slate-50 font-sans">
      <AdminSidebar
        isOpen={isSidebarOpen}
        onClose={() => setIsSidebarOpen(false)}
      />

      <main className="flex flex-col min-h-screen lg:ml-64">
        <header className="h-16 bg-white border-b border-slate-200 flex items-center justify-between px-4 lg:px-8">
          {/* Mobile menu button */}
          <Button
            variant="ghost"
            size="icon"
            className="lg:hidden"
            onClick={() => setIsSidebarOpen(true)}
          >
            <Menu className="h-6 w-6" />
          </Button>
          <div className="lg:hidden" />
          <div className="flex items-center gap-4">
            <Avatar>
              <AvatarFallback className="bg-blue-600 text-white">
                {currentUser?.email ? getUserInitials(currentUser.email) : "AD"}
              </AvatarFallback>
            </Avatar>
          </div>
        </header>

        <div className="flex-1 p-8 min-h-0 overflow-auto">{children}</div>
      </main>
    </div>
  );
}
