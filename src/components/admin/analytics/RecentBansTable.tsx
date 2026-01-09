import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { formatShortDateTime } from "@/lib/formatters";

interface UserAction {
  id: number;
  user_id: number;
  user_email: string;
  action_type: string;
  timestamp: string;
  details: Record<string, any>;
}

interface RecentBansTableProps {
  actions: UserAction[];
}

export function RecentBansTable({ actions }: RecentBansTableProps) {
  return (
    <Card className="border-0 shadow-lg rounded-2xl bg-white">
      <CardHeader className="pb-3">
        <CardTitle className="text-lg font-semibold text-slate-900">
          Recent Bans & Unbans
        </CardTitle>
      </CardHeader>
      <CardContent
        className="overflow-auto pt-2"
        style={{ maxHeight: "300px" }}
      >
        <Table>
          <TableHeader>
            <TableRow className="border-slate-200">
              <TableHead className="text-slate-600 font-semibold">
                User Email
              </TableHead>
              <TableHead className="text-slate-600 font-semibold">
                Action
              </TableHead>
              <TableHead className="text-slate-600 font-semibold">
                Date
              </TableHead>
              <TableHead className="text-slate-600 font-semibold">
                Reason
              </TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {actions.length === 0 ? (
              <TableRow>
                <TableCell
                  colSpan={4}
                  className="text-center text-slate-500 py-8"
                >
                  No recent bans or unbans
                </TableCell>
              </TableRow>
            ) : (
              actions.slice(0, 4).map((action) => (
                <TableRow
                  key={action.id}
                  className="border-slate-100 hover:bg-slate-50"
                >
                  <TableCell className="font-medium text-slate-900 max-w-[200px] truncate">
                    {action.user_email}
                  </TableCell>
                  <TableCell>
                    <span
                      className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold ${
                        action.action_type === "ADMIN_BAN_USER"
                          ? "bg-red-100 text-red-700"
                          : "bg-green-100 text-green-700"
                      }`}
                    >
                      {action.action_type === "ADMIN_BAN_USER"
                        ? "Banned"
                        : "Unbanned"}
                    </span>
                  </TableCell>
                  <TableCell className="text-sm text-slate-600 min-w-[90px]">
                    {formatShortDateTime(action.timestamp)}
                  </TableCell>
                  <TableCell className="text-sm text-slate-600 max-w-[150px] truncate">
                    {action.details?.reason || "No reason provided"}
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
}
