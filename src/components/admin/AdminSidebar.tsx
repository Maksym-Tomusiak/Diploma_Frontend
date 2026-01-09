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

export function AdminSidebar() {
  const pathname = usePathname();

  const isActive = (href: string) => {
    if (href === "/admin") {
      return pathname === "/admin";
    }
    return pathname.startsWith(href);
  };

  return (
    <aside className="w-64 bg-slate-900 text-slate-300 flex flex-col">
      <div className="h-16 flex items-center px-6 border-b border-slate-800">
        <span className="text-lg font-bold text-white tracking-tight">
          FormatStand Admin
        </span>
      </div>
      <nav className="flex-1 p-4 space-y-2">
        {navItems.map((item) => {
          const Icon = item.icon;
          return (
            <Link key={item.href} href={item.href}>
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
        <Link href="/app">
          <Button
            variant="outline"
            className="w-full border-slate-700 text-slate-300 hover:bg-slate-800 hover:text-white"
          >
            Exit to App
          </Button>
        </Link>
      </div>
    </aside>
  );
}
