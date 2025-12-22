import Link from "next/link";
import {
  Users,
  FileText,
  Layout,
  Type,
  BarChart3,
  Settings,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import type { ActiveTab } from "@/types/admin";

interface AdminSidebarProps {
  activeTab: ActiveTab;
  onTabChange: (tab: ActiveTab) => void;
}

export function AdminSidebar({ activeTab, onTabChange }: AdminSidebarProps) {
  return (
    <aside className="w-64 bg-slate-900 text-slate-300 flex flex-col">
      <div className="h-16 flex items-center px-6 border-b border-slate-800">
        <span className="text-lg font-bold text-white tracking-tight">
          FormatStand Admin
        </span>
      </div>
      <nav className="flex-1 p-4 space-y-2">
        <Button
          variant="ghost"
          className={`w-full justify-start ${
            activeTab === "users"
              ? "bg-slate-800 text-white"
              : "text-slate-300 hover:text-white hover:bg-slate-800"
          }`}
          onClick={() => onTabChange("users")}
        >
          <Users className="mr-3 h-5 w-5" />
          Users
        </Button>
        <Button
          variant="ghost"
          className={`w-full justify-start ${
            activeTab === "logs"
              ? "bg-slate-800 text-white"
              : "text-slate-300 hover:text-white hover:bg-slate-800"
          }`}
          onClick={() => onTabChange("logs")}
        >
          <FileText className="mr-3 h-5 w-5" />
          Activity Logs
        </Button>
        <Button
          variant="ghost"
          className={`w-full justify-start ${
            activeTab === "templates"
              ? "bg-slate-800 text-white"
              : "text-slate-300 hover:text-white hover:bg-slate-800"
          }`}
          onClick={() => onTabChange("templates")}
        >
          <Layout className="mr-3 h-5 w-5" />
          Templates
        </Button>
        <Button
          variant="ghost"
          className={`w-full justify-start ${
            activeTab === "fonts"
              ? "bg-slate-800 text-white"
              : "text-slate-300 hover:text-white hover:bg-slate-800"
          }`}
          onClick={() => onTabChange("fonts")}
        >
          <Type className="mr-3 h-5 w-5" />
          Fonts
        </Button>
        <Button
          variant="ghost"
          className="w-full justify-start text-slate-300 hover:text-white hover:bg-slate-800"
        >
          <BarChart3 className="mr-3 h-5 w-5" />
          Analytics
        </Button>
        <Button
          variant="ghost"
          className="w-full justify-start text-slate-300 hover:text-white hover:bg-slate-800"
        >
          <Settings className="mr-3 h-5 w-5" />
          Settings
        </Button>
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
