import { useState } from "react";
import { FileText, Loader2, AlertCircle, MoreHorizontal } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
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
  logsFilterUserId: string | null;
  setLogsFilterUserId: (userId: string | null) => void;
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
  const [selectedLog, setSelectedLog] = useState<UserActionLog | null>(null);
  const [modalOpen, setModalOpen] = useState(false);

  const handleRowClick = (log: UserActionLog) => {
    setSelectedLog(log);
    setModalOpen(true);
  };

  const renderDetailValue = (value: any): string => {
    if (value === null || value === undefined) return "—";
    if (typeof value === "boolean") return value ? "Yes" : "No";
    if (typeof value === "object") return JSON.stringify(value, null, 2);
    return String(value);
  };

  return (
    <>
      <div className="flex items-center gap-4 mb-6">
        <Select
          value={logsFilterUserId || "__ALL__"}
          onValueChange={(value: string) => {
            setLogsFilterUserId(value === "__ALL__" ? null : value);
          }}
        >
          <SelectTrigger className="w-[250px] bg-white border-slate-200">
            <SelectValue placeholder="Filter by user" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="__ALL__">All users</SelectItem>
            {users.map((user) => (
              <SelectItem key={user.id} value={user.id}>
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
                  <TableHead className="w-[8%] font-semibold text-slate-700">
                    ID
                  </TableHead>
                  <TableHead className="w-[18%] font-semibold text-slate-700">
                    User
                  </TableHead>
                  <TableHead className="w-[15%] font-semibold text-slate-700">
                    Action
                  </TableHead>
                  <TableHead className="w-[32%] font-semibold text-slate-700">
                    Details
                  </TableHead>
                  <TableHead className="w-[17%] font-semibold text-slate-700">
                    Timestamp
                  </TableHead>
                  <TableHead className="w-[10%] text-right font-semibold text-slate-700">
                    Actions
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
                    <TableCell className="text-right">
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button
                            variant="ghost"
                            size="sm"
                            className="h-8 w-8 p-0"
                          >
                            <MoreHorizontal className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuLabel>Actions</DropdownMenuLabel>
                          <DropdownMenuItem onClick={() => handleRowClick(log)}>
                            <FileText className="mr-2 h-4 w-4" />
                            View Details
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
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

      {/* Log Details Modal */}
      <Dialog open={modalOpen} onOpenChange={setModalOpen}>
        <DialogContent className="max-w-3xl max-h-[80vh] flex flex-col mx-4 sm:mx-auto">
          <DialogHeader>
            <DialogTitle>Activity Log Details</DialogTitle>
            <DialogDescription>
              Complete information about this activity log
            </DialogDescription>
          </DialogHeader>
          {selectedLog && (
            <div className="space-y-4 overflow-y-auto pr-2 flex-1">
              <div className="flex flex-wrap gap-4">
                <div className="flex-1 min-w-[200px]">
                  <label className="text-sm font-semibold text-slate-700">
                    Log ID
                  </label>
                  <p className="text-sm text-slate-900 mt-1">
                    {selectedLog.id}
                  </p>
                </div>
                <div className="flex-1 min-w-[200px]">
                  <label className="text-sm font-semibold text-slate-700">
                    User
                  </label>
                  <p className="text-sm text-slate-900 mt-1 break-words">
                    {selectedLog.user_email || `User ${selectedLog.user_id}`}
                  </p>
                </div>
              </div>
              <div className="flex flex-wrap gap-4">
                <div className="flex-1 min-w-[200px]">
                  <label className="text-sm font-semibold text-slate-700">
                    Action Type
                  </label>
                  <div className="mt-1">
                    <Badge
                      className={`${getActionBadgeColor(
                        selectedLog.action_type
                      )} border-transparent`}
                    >
                      {selectedLog.action_type.replace(/_/g, " ")}
                    </Badge>
                  </div>
                </div>
                <div className="flex-1 min-w-[200px]">
                  <label className="text-sm font-semibold text-slate-700">
                    Timestamp
                  </label>
                  <p className="text-sm text-slate-900 mt-1">
                    {formatDateTime(selectedLog.created_at)}
                  </p>
                </div>
              </div>
              {selectedLog.details &&
                Object.keys(selectedLog.details).length > 0 && (
                  <div className="w-full">
                    <label className="text-sm font-semibold text-slate-700 mb-2 block">
                      Details
                    </label>
                    <div className="bg-slate-50 rounded-lg p-4 space-y-3">
                      {Object.entries(selectedLog.details).map(
                        ([key, value]) => (
                          <div key={key} className="flex flex-col gap-1">
                            <span className="text-xs font-medium text-slate-600 uppercase">
                              {key.replace(/_/g, " ")}
                            </span>
                            <span className="text-sm text-slate-900 break-words">
                              {renderDetailValue(value)}
                            </span>
                          </div>
                        )
                      )}
                    </div>
                  </div>
                )}
            </div>
          )}
        </DialogContent>
      </Dialog>
    </>
  );
}
