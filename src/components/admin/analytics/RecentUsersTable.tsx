import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { formatDateTime } from "@/lib/formatters";

interface RecentUser {
  id: number;
  email: string;
  created_at: string;
  role: string;
}

interface RecentUsersTableProps {
  users: RecentUser[];
}

export function RecentUsersTable({ users }: RecentUsersTableProps) {
  return (
    <Card className="border-0 shadow-lg rounded-2xl bg-white">
      <CardHeader className="pb-3">
        <CardTitle className="text-lg font-semibold text-slate-900">
          Recently Registered Users
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
                Email
              </TableHead>
              <TableHead className="text-slate-600 font-semibold">
                Role
              </TableHead>
              <TableHead className="text-slate-600 font-semibold">
                Registered
              </TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {users.map((user) => (
              <TableRow
                key={user.id}
                className="border-slate-100 hover:bg-slate-50"
              >
                <TableCell className="font-medium text-slate-900">
                  {user.email}
                </TableCell>
                <TableCell>
                  <span
                    className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold ${
                      user.role === "ADMIN"
                        ? "bg-purple-100 text-purple-700"
                        : "bg-blue-100 text-blue-700"
                    }`}
                  >
                    {user.role}
                  </span>
                </TableCell>
                <TableCell className="text-sm text-slate-600">
                  {formatDateTime(user.created_at)}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
}
