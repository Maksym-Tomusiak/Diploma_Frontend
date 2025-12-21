import { FileText, Loader2, AlertCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Pagination } from "@/components/ui/Pagination";
import { UserActionLog } from "@/services/UserActionLogService";
import { User } from "@/types/auth";
import {
  formatDateTime,
  getUserInitials,
  getActionBadgeColor,
} from "@/lib/formatters";
import { LogDetails } from "@/components/LogDetails";

interface LogsTableProps {
  logs: UserActionLog[];
  logsTotal: number;
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
  pageSize: number;
  logsLoading: boolean;
  logsError: string | null;
  logsFilterUserId: number | null;
  setLogsFilterUserId: (userId: number | null) => void;
  logsFilterActionType: string;
  setLogsFilterActionType: (actionType: string) => void;
  handleClearLogsFilter: () => void;
  users: User[];
}

export function LogsTable({
  logs,
  logsTotal,
  currentPage,
  totalPages,
  onPageChange,
  pageSize,
  logsLoading,
  logsError,
  logsFilterUserId,
  setLogsFilterUserId,
  logsFilterActionType,
  setLogsFilterActionType,
  handleClearLogsFilter,
  users,
}: LogsTableProps) {
  return (
    <>
      <div className="flex items-center gap-4 mb-6">
        <Select
          value={logsFilterUserId?.toString() || ""}
          onValueChange={(value: string) => {
            setLogsFilterUserId(value === "__ALL__" ? null : parseInt(value));
          }}
        >
          <SelectTrigger className="w-[250px] bg-white border-slate-200">
            <SelectValue placeholder="Filter by user" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="__ALL__">All users</SelectItem>
            {users.map((user) => (
              <SelectItem key={user.id} value={user.id.toString()}>
                {user.email}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        <Select
          value={logsFilterActionType}
          onValueChange={(value: string) => {
            setLogsFilterActionType(value === "__ALL__" ? "" : value);
          }}
        >
          <SelectTrigger className="w-[200px] bg-white border-slate-200">
            <SelectValue placeholder="Filter by action" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="__ALL__">All actions</SelectItem>
            <SelectItem value="LOGIN">Login</SelectItem>
            <SelectItem value="LOGOUT">Logout</SelectItem>
            <SelectItem value="DOCUMENT_CREATE">Document Create</SelectItem>
            <SelectItem value="DOCUMENT_DELETE">Document Delete</SelectItem>
            <SelectItem value="CHECK_RESULT_VIEW">Check Result View</SelectItem>
          </SelectContent>
        </Select>

        {(logsFilterUserId || logsFilterActionType) && (
          <Button
            variant="outline"
            onClick={handleClearLogsFilter}
            className="border-slate-200"
          >
            Clear filters
          </Button>
        )}

        <div className="ml-auto text-sm text-slate-600">
          {logsTotal} log{logsTotal !== 1 ? "s" : ""}
        </div>
      </div>

      <div className="bg-white rounded-md border border-slate-200 shadow-sm overflow-hidden">
        {logsLoading ? (
          <div className="flex items-center justify-center py-12">
            <Loader2 className="h-8 w-8 animate-spin text-slate-600" />
          </div>
        ) : logsError ? (
          <div className="flex flex-col items-center justify-center py-12 gap-3">
            <AlertCircle className="h-10 w-10 text-red-500" />
            <p className="text-slate-600">{logsError}</p>
            <Button variant="outline" onClick={() => window.location.reload()}>
              Retry
            </Button>
          </div>
        ) : logs.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-12 gap-2">
            <FileText className="h-10 w-10 text-slate-300" />
            <p className="text-slate-600">No activity logs yet</p>
          </div>
        ) : (
          <>
            <Table>
              <TableHeader className="bg-slate-50">
                <TableRow className="border-b border-slate-200 hover:bg-slate-50">
                  <TableHead className="w-[80px] font-semibold text-slate-700">
                    ID
                  </TableHead>
                  <TableHead className="w-[200px] font-semibold text-slate-700">
                    User
                  </TableHead>
                  <TableHead className="w-[150px] font-semibold text-slate-700">
                    Action
                  </TableHead>
                  <TableHead className="font-semibold text-slate-700">
                    Details
                  </TableHead>
                  <TableHead className="w-[180px] font-semibold text-slate-700">
                    Timestamp
                  </TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {logs.map((log) => (
                  <TableRow
                    key={log.id}
                    className="hover:bg-slate-50 border-b border-slate-100 last:border-0 transition-colors"
                  >
                    <TableCell className="text-slate-500 text-sm">
                      {log.id}
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <Avatar className="h-8 w-8 border border-slate-100">
                          <AvatarFallback className="text-xs bg-slate-100 text-slate-600">
                            {log.user_email
                              ? getUserInitials(log.user_email)
                              : "??"}
                          </AvatarFallback>
                        </Avatar>
                        <span className="text-sm text-slate-700">
                          {log.user_email || `User ${log.user_id}`}
                        </span>
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge
                        variant="secondary"
                        className={`${getActionBadgeColor(
                          log.action_type
                        )} border-transparent shadow-none`}
                      >
                        {log.action_type.replace(/_/g, " ")}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-slate-600 text-sm">
                      <LogDetails details={log.details} />
                    </TableCell>
                    <TableCell className="text-slate-500 text-sm">
                      {formatDateTime(log.created_at)}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </>
        )}
      </div>

      <Pagination
        currentPage={currentPage}
        totalPages={totalPages}
        onPageChange={onPageChange}
        className="mt-4"
      />
    </>
  );
}
