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
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-3xl max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Activity Logs - {user?.email}</DialogTitle>
          <DialogDescription>
            Recent activity for this user. Click "View All Logs" to see the
            complete history.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-3">
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
                    {log.details && (
                      <div className="text-sm text-slate-600">
                        {typeof log.details === "string" ? (
                          <span>{log.details}</span>
                        ) : (
                          <pre className="text-xs bg-slate-100 px-2 py-2 rounded block overflow-auto whitespace-pre-wrap">
                            {JSON.stringify(log.details, null, 2)}
                          </pre>
                        )}
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
