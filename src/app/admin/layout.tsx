"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { Loader2 } from "lucide-react";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
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
    <div className="min-h-screen bg-slate-50 flex font-sans">
      <AdminSidebar />

      <main className="flex-1 flex flex-col min-w-0">
        <header className="h-16 bg-white border-b border-slate-200 flex items-center justify-end px-8">
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
