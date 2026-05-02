import { Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { UserActionLog } from "@/services/UserActionLogService";
import { User } from "@/types/auth";
import { formatDateTime, getActionBadgeColor } from "@/lib/formatters";

interface UserLogsModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  user: User | null;
  logs: UserActionLog[];
  isLoading: boolean;
  onViewAllLogs: (userId: string) => void;
}

export function UserLogsModal({
  open,
  onOpenChange,
  user,
  logs,
  isLoading,
  onViewAllLogs,
}: UserLogsModalProps) {
  const renderDetailValue = (value: any): string => {
    if (value === null || value === undefined) return "—";
    if (typeof value === "boolean") return value ? "Yes" : "No";
    if (typeof value === "object") return JSON.stringify(value, null, 2);
    return String(value);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-sm:w-[90%] max-w-3xl max-h-[80vh] flex flex-col sm:mx-auto">
        <DialogHeader>
          <DialogTitle>Activity Logs - {user?.email}</DialogTitle>
          <DialogDescription>
            Recent activity for this user. Click "View All Logs" to see the
            complete history.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-3 overflow-y-auto flex-1 pr-2 pb-1">
          {isLoading ? (
            <div className="flex items-center justify-center py-8">
              <Loader2 className="h-6 w-6 animate-spin text-slate-600" />
            </div>
          ) : logs.length === 0 ? (
            <div className="text-center py-8 text-slate-500">
              No logs found for this user
            </div>
          ) : (
            logs.map((log) => (
              <div
                key={log.id}
                className="border border-slate-200 rounded-lg p-4 hover:bg-slate-50 transition-colors"
              >
                <div className="flex items-start justify-between gap-4">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-2">
                      <Badge
                        variant="secondary"
                        className={`${getActionBadgeColor(
                          log.action_type
                        )} border-transparent shadow-none`}
                      >
                        {log.action_type.replace(/_/g, " ")}
                      </Badge>
                      <span className="text-xs text-slate-500">
                        {formatDateTime(log.created_at)}
                      </span>
                    </div>
                    {log.details && Object.keys(log.details).length > 0 && (
                      <div className="bg-slate-50 rounded-lg p-3 space-y-2">
                        {Object.entries(log.details).map(([key, value]) => (
                          <div key={key} className="flex flex-col gap-1">
                            <span className="text-xs font-medium text-slate-600 uppercase">
                              {key.replace(/_/g, " ")}
                            </span>
                            <span className="text-sm text-slate-900 break-words">
                              {renderDetailValue(value)}
                            </span>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              </div>
            ))
          )}
        </div>

        <div className="flex justify-end gap-2 pt-4 border-t border-slate-200">
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Close
          </Button>
          {user && (
            <Button
              onClick={() => onViewAllLogs(user.id)}
              className="bg-blue-600 hover:bg-blue-700"
            >
              View All Logs
            </Button>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}
