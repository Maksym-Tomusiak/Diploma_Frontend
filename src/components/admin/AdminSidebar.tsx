"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Users, FileText, Layout, Type, BarChart3 } from "lucide-react";
import { Button } from "@/components/ui/button";

const navItems = [
  { href: "/admin", label: "Analytics", icon: BarChart3 },
  { href: "/admin/users", label: "Users", icon: Users },
  { href: "/admin/logs", label: "Activity Logs", icon: FileText },
  { href: "/admin/templates", label: "Templates", icon: Layout },
  { href: "/admin/fonts", label: "Fonts", icon: Type },
];

interface AdminSidebarProps {
  isOpen: boolean;
  onClose: () => void;
}

export function AdminSidebar({ isOpen, onClose }: AdminSidebarProps) {
  const pathname = usePathname();

  const isActive = (href: string) => {
    if (href === "/admin") {
      return pathname === "/admin";
    }
    return pathname.startsWith(href);
  };

  return (
    <>
      {/* Overlay for mobile */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-40 lg:hidden transition-opacity duration-300"
          onClick={onClose}
        />
      )}

      {/* Sidebar */}
      <aside
        className={`
          w-full sm:w-64 bg-slate-900 text-slate-300 flex flex-col fixed left-0 top-0 h-screen z-50
          transition-transform duration-300 ease-in-out
          lg:translate-x-0
          ${isOpen ? "translate-x-0" : "-translate-x-full"}
        `}
      >
        <div className="h-16 flex items-center px-6 border-b border-slate-800">
          <span className="text-lg font-bold text-white tracking-tight">
            Norma Admin
          </span>
        </div>
        <nav className="flex-1 p-4 space-y-2 overflow-y-auto">
          {navItems.map((item) => {
            const Icon = item.icon;
            return (
              <Link key={item.href} href={item.href} onClick={() => onClose()}>
                <Button
                  variant="ghost"
                  className={`w-full justify-start ${
                    isActive(item.href)
                      ? "bg-slate-800 text-white"
                      : "text-slate-300 hover:text-white hover:bg-slate-800"
                  }`}
                >
                  <Icon className="mr-3 h-5 w-5" />
                  {item.label}
                </Button>
              </Link>
            );
          })}
        </nav>
        <div className="p-4 border-t border-slate-800">
          <Link href="/app" onClick={() => onClose()}>
            <Button
              variant="outline"
              className="w-full border-slate-700 text-slate-300 hover:bg-slate-800 hover:text-white"
            >
              Exit to App
            </Button>
          </Link>
        </div>
      </aside>
    </>
  );
}
