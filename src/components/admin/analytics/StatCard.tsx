import { LucideIcon } from "lucide-react";

interface StatCardProps {
  title: string;
  value: number;
  icon: LucideIcon;
  gradientFrom: string;
  gradientTo: string;
}

export function StatCard({
  title,
  value,
  icon: Icon,
  gradientFrom,
  gradientTo,
}: StatCardProps) {
  return (
    <div
      className={`bg-gradient-to-br ${gradientFrom} ${gradientTo} rounded-2xl p-6 text-white relative overflow-hidden`}
    >
      <div className="relative z-10">
        <div className="flex items-center gap-2 mb-2">
          <Icon className="w-5 h-5 opacity-80" />
          <p className="text-sm opacity-90">{title}</p>
        </div>
        <p className="text-4xl font-bold">{value}</p>
      </div>
      <div className="absolute -right-4 -bottom-4 opacity-10">
        <Icon className="w-32 h-32" />
      </div>
    </div>
  );
}
