import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { formatShortDateTime, formatDateTime } from "@/lib/formatters";
import { Badge } from "@/components/ui/badge";

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
  const [selectedAction, setSelectedAction] = useState<UserAction | null>(null);
  const [modalOpen, setModalOpen] = useState(false);

  const handleRowClick = (action: UserAction) => {
    setSelectedAction(action);
    setModalOpen(true);
  };

  return (
    <>
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
          <TooltipProvider>
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
                      className="border-slate-100 hover:bg-slate-50 cursor-pointer"
                      onClick={() => handleRowClick(action)}
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
                      <TableCell className="text-sm text-slate-600 max-w-[150px]">
                        <Tooltip delayDuration={300}>
                          <TooltipTrigger asChild>
                            <div className="truncate hidden md:block">
                              {action.details?.reason || "No reason provided"}
                            </div>
                          </TooltipTrigger>
                          <TooltipContent>
                            <p className="max-w-xs">
                              {action.details?.reason || "No reason provided"}
                            </p>
                          </TooltipContent>
                        </Tooltip>
                        <div className="truncate md:hidden">
                          {action.details?.reason || "No reason provided"}
                        </div>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </TooltipProvider>
        </CardContent>
      </Card>

      <Dialog open={modalOpen} onOpenChange={setModalOpen}>
        <DialogContent className="max-sm:w-[90%] max-w-2xl">
          <DialogHeader>
            <DialogTitle>Ban/Unban Details</DialogTitle>
            <DialogDescription>
              Detailed information about this action
            </DialogDescription>
          </DialogHeader>
          {selectedAction && (
            <div className="flex flex-wrap gap-4">
              <div className="w-full">
                <label className="text-sm font-semibold text-slate-700">
                  User Email
                </label>
                <p className="text-sm text-slate-900 mt-1 break-words">
                  {selectedAction.user_email}
                </p>
              </div>
              <div className="flex-1 min-w-[200px]">
                <label className="text-sm font-semibold text-slate-700">
                  Date & Time
                </label>
                <p className="text-sm text-slate-900 mt-1">
                  {formatDateTime(selectedAction.timestamp)}
                </p>
              </div>
              <div className="flex-1 min-w-[200px]">
                <label className="text-sm font-semibold text-slate-700">
                  Action
                </label>
                <div className="mt-1">
                  <Badge
                    className={
                      selectedAction.action_type === "ADMIN_BAN_USER"
                        ? "bg-red-100 text-red-700 hover:bg-red-100"
                        : "bg-green-100 text-green-700 hover:bg-green-100"
                    }
                  >
                    {selectedAction.action_type === "ADMIN_BAN_USER"
                      ? "Banned"
                      : "Unbanned"}
                  </Badge>
                </div>
              </div>
              <div className="w-full">
                <label className="text-sm font-semibold text-slate-700">
                  Reason
                </label>
                <p className="text-sm text-slate-900 mt-1 whitespace-pre-wrap">
                  {selectedAction.details?.reason || "No reason provided"}
                </p>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </>
  );
}
