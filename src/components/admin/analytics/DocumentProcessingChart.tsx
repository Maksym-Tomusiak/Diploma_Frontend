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

interface DocumentProcessingStats {
  date: string;
  checks: number;
  formatting: number;
}

interface DocumentProcessingChartProps {
  data: DocumentProcessingStats[];
}

export function DocumentProcessingChart({
  data,
}: DocumentProcessingChartProps) {
  return (
    <Card className="border-0 shadow-lg rounded-2xl bg-white">
      <CardHeader className="pb-3">
        <CardTitle className="text-lg font-semibold text-slate-900">
          Documents Processed (Last 7 Days)
        </CardTitle>
      </CardHeader>
      <CardContent className="pt-2">
        {/* Changed: 
            1. Removed inline styles
            2. Added 'min-w-0' and 'w-full' class 
        */}
        <div className="w-full min-w-0">
          {/* Changed: 
              1. Passed explicit pixel height (300) instead of "100%"
              This mimics your working project's stability 
          */}
          <ResponsiveContainer width="100%" height={300}>
            <AreaChart data={data}>
              <defs>
                <linearGradient id="colorChecks" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.3} />
                  <stop offset="95%" stopColor="#3b82f6" stopOpacity={0} />
                </linearGradient>
                <linearGradient
                  id="colorFormatting"
                  x1="0"
                  y1="0"
                  x2="0"
                  y2="1"
                >
                  <stop offset="5%" stopColor="#10b981" stopOpacity={0.3} />
                  <stop offset="95%" stopColor="#10b981" stopOpacity={0} />
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
                dataKey="checks"
                stroke="#3b82f6"
                strokeWidth={2}
                fillOpacity={1}
                fill="url(#colorChecks)"
                name="Checks"
              />
              <Area
                type="monotone"
                dataKey="formatting"
                stroke="#10b981"
                strokeWidth={2}
                fillOpacity={1}
                fill="url(#colorFormatting)"
                name="Formatting"
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  );
}
