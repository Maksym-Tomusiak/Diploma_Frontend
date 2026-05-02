import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { CustomTooltip } from "./CustomTooltip";

interface UserRegistrationStats {
  date: string;
  count: number;
}

interface UserRegistrationChartProps {
  data: UserRegistrationStats[];
}

export function UserRegistrationChart({ data }: UserRegistrationChartProps) {
  return (
    <Card className="border-0 shadow-lg rounded-2xl bg-white">
      <CardHeader className="pb-3">
        <CardTitle className="text-lg font-semibold text-slate-900">
          New User Registrations (Last 7 Days)
        </CardTitle>
      </CardHeader>
      <CardContent className="pt-2">
        {/* Changed: Added 'w-full' and 'min-w-0' */}
        <div className="w-full min-w-0">
          {/* Changed: Passed explicit numeric height (300) */}
          <ResponsiveContainer width="100%" height={300}>
            <AreaChart data={data}>
              <defs>
                <linearGradient id="colorUsers" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#8b5cf6" stopOpacity={0.3} />
                  <stop offset="95%" stopColor="#8b5cf6" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
              <XAxis
                dataKey="date"
                tickFormatter={(value) => {
                  const date = new Date(value);
                  return `${date.getMonth() + 1}/${date.getDate()}`;
                }}
                tick={{ fontSize: 12, fill: "#64748b" }}
                stroke="#cbd5e1"
              />
              <YAxis
                allowDecimals={false}
                tick={{ fontSize: 12, fill: "#64748b" }}
                stroke="#cbd5e1"
              />
              <Tooltip content={<CustomTooltip />} />
              <Legend wrapperStyle={{ fontSize: "14px", paddingTop: "10px" }} />
              <Area
                type="monotone"
                dataKey="count"
                stroke="#8b5cf6"
                strokeWidth={3}
                fillOpacity={1}
                fill="url(#colorUsers)"
                name="New Users"
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  );
}
