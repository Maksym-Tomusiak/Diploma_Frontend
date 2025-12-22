import React, { useState } from "react";
import {
  Search,
  MoreHorizontal,
  Users as UsersIcon,
  Loader2,
  AlertCircle,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Textarea } from "@/components/ui/textarea";
import { Pagination } from "@/components/ui/Pagination";
import { userService } from "@/services/UserService";
import { User, UserRole } from "@/types/auth";
import { formatDate, getUserInitials } from "@/lib/formatters";
import { useToast } from "@/hooks/use-toast";

interface UsersTableProps {
  users: User[];
  setUsers: (users: User[]) => void;
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
  isLoading: boolean;
  error: string | null;
  currentUser: User | null;
  onViewUserLogs: (user: User) => void;
}

export function UsersTable({
  users,
  setUsers,
  searchQuery,
  setSearchQuery,
  currentPage,
  totalPages,
  onPageChange,
  isLoading,
  error,
  currentUser,
  onViewUserLogs,
}: UsersTableProps) {
  const { toast } = useToast();
  const [banDialogOpen, setBanDialogOpen] = useState(false);
  const [unbanDialogOpen, setUnbanDialogOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [reason, setReason] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleDeleteUser = async (userId: number) => {
    if (!confirm("Are you sure you want to delete this user?")) {
      return;
    }

    try {
      await userService.deleteUser(userId);
      setUsers(users.filter((u) => u.id !== userId));
      toast({
        title: "User deleted",
        description: "User has been deleted successfully.",
      });
    } catch (err: any) {
      toast({
        variant: "destructive",
        title: "Failed to delete user",
        description: err.response?.data?.detail || "Failed to delete user",
      });
    }
  };

  const handleBanUser = async (user: User) => {
    setSelectedUser(user);
    setReason("");
    setBanDialogOpen(true);
  };

  const confirmBanUser = async () => {
    if (!selectedUser) return;

    setIsSubmitting(true);
    try {
      await userService.banUser(selectedUser.id, reason || undefined);
      setUsers(
        users.map((u) =>
          u.id === selectedUser.id ? { ...u, is_banned: true } : u
        )
      );
      toast({
        title: "User banned",
        description: `${selectedUser.email} has been banned successfully.`,
      });
      setBanDialogOpen(false);
      setSelectedUser(null);
      setReason("");
    } catch (err: any) {
      toast({
        variant: "destructive",
        title: "Failed to ban user",
        description:
          err.response?.data?.detail ||
          "An error occurred while banning the user.",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleUnbanUser = async (user: User) => {
    setSelectedUser(user);
    setReason("");
    setUnbanDialogOpen(true);
  };

  const confirmUnbanUser = async () => {
    if (!selectedUser) return;

    setIsSubmitting(true);
    try {
      await userService.unbanUser(selectedUser.id, reason || undefined);
      setUsers(
        users.map((u) =>
          u.id === selectedUser.id ? { ...u, is_banned: false } : u
        )
      );
      toast({
        title: "User unbanned",
        description: `${selectedUser.email} has been unbanned successfully.`,
      });
      setUnbanDialogOpen(false);
      setSelectedUser(null);
      setReason("");
    } catch (err: any) {
      toast({
        variant: "destructive",
        title: "Failed to unban user",
        description:
          err.response?.data?.detail ||
          "An error occurred while unbanning the user.",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <>
      <div className="flex items-center justify-between mb-6 gap-4">
        <div className="relative flex-1 max-w-sm">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
          <Input
            placeholder="Search users by email..."
            className="pl-10 bg-white border-slate-200 focus-visible:ring-blue-500"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
        <div className="flex items-center gap-2">
          <span className="text-sm text-slate-600">
            {users.length} user{users.length !== 1 ? "s" : ""}
          </span>
        </div>
      </div>

      <div className="bg-white rounded-md border border-slate-200 shadow-sm overflow-hidden">
        {isLoading ? (
          <div className="flex items-center justify-center py-12">
            <Loader2 className="h-8 w-8 animate-spin text-slate-600" />
          </div>
        ) : error ? (
          <div className="flex flex-col items-center justify-center py-12 gap-3">
            <AlertCircle className="h-10 w-10 text-red-500" />
            <p className="text-slate-600">{error}</p>
            <Button variant="outline" onClick={() => window.location.reload()}>
              Retry
            </Button>
          </div>
        ) : users.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-12 gap-2">
            <UsersIcon className="h-10 w-10 text-slate-300" />
            <p className="text-slate-600">
              {searchQuery ? "No users found" : "No users yet"}
            </p>
          </div>
        ) : (
          <Table>
            <TableHeader className="bg-slate-50">
              <TableRow className="border-b border-slate-200 hover:bg-slate-50">
                <TableHead className="w-[50px] font-semibold text-slate-700">
                  ID
                </TableHead>
                <TableHead className="w-[300px] font-semibold text-slate-700">
                  Email
                </TableHead>
                <TableHead className="font-semibold text-slate-700">
                  Role
                </TableHead>
                <TableHead className="font-semibold text-slate-700">
                  Joined
                </TableHead>
                <TableHead className="text-right font-semibold text-slate-700">
                  Actions
                </TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {users.map((user) => (
                <TableRow
                  key={user.id}
                  className="hover:bg-slate-50 border-b border-slate-100 last:border-0 transition-colors"
                >
                  <TableCell className="text-slate-500 text-sm">
                    {user.id}
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-3">
                      <Avatar className="h-9 w-9 border border-slate-100">
                        <AvatarFallback className="text-xs bg-slate-100 text-slate-600">
                          {getUserInitials(user.email)}
                        </AvatarFallback>
                      </Avatar>
                      <span className="font-medium text-slate-900">
                        {user.email}
                      </span>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <Badge
                        variant="secondary"
                        className={
                          user.role === UserRole.ADMIN
                            ? "bg-purple-100 text-purple-700 hover:bg-purple-100 border-transparent shadow-none"
                            : "bg-slate-100 text-slate-700 hover:bg-slate-100 border-transparent shadow-none"
                        }
                      >
                        {user.role === UserRole.ADMIN ? "Admin" : "User"}
                      </Badge>
                      {user.is_banned && (
                        <Badge className="bg-red-100 text-red-700 border-transparent shadow-none">
                          Banned
                        </Badge>
                      )}
                    </div>
                  </TableCell>
                  <TableCell className="text-slate-500 text-sm">
                    {formatDate(user.created_at)}
                  </TableCell>
                  <TableCell className="text-right">
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button
                          variant="ghost"
                          className="h-8 w-8 p-0 text-slate-400 hover:text-slate-900"
                        >
                          <span className="sr-only">Open menu</span>
                          <MoreHorizontal className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent
                        align="end"
                        className="w-[160px] border-slate-200 shadow-md"
                      >
                        <DropdownMenuLabel>Actions</DropdownMenuLabel>
                        <DropdownMenuItem
                          className="text-slate-700 focus:bg-slate-50 focus:text-slate-900"
                          onClick={() => onViewUserLogs(user)}
                        >
                          View logs
                        </DropdownMenuItem>
                        {!user.is_banned ? (
                          <DropdownMenuItem
                            className="text-amber-600 focus:bg-amber-50 focus:text-amber-700"
                            onClick={() => handleBanUser(user)}
                            disabled={
                              user.id === currentUser?.id ||
                              user.role === UserRole.ADMIN
                            }
                          >
                            Ban user
                          </DropdownMenuItem>
                        ) : (
                          <DropdownMenuItem
                            className="text-emerald-600 focus:bg-emerald-50 focus:text-emerald-700"
                            onClick={() => handleUnbanUser(user)}
                            disabled={
                              user.id === currentUser?.id ||
                              user.role === UserRole.ADMIN
                            }
                          >
                            Unban user
                          </DropdownMenuItem>
                        )}
                        <DropdownMenuItem
                          className="text-red-600 focus:bg-red-50 focus:text-red-700"
                          onClick={() => handleDeleteUser(user.id)}
                          disabled={
                            user.id === currentUser?.id ||
                            user.role === UserRole.ADMIN
                          }
                        >
                          Delete user
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        )}
      </div>

      <Pagination
        currentPage={currentPage}
        totalPages={totalPages}
        onPageChange={onPageChange}
        className="mt-4"
      />

      {/* Ban User Dialog */}
      <Dialog open={banDialogOpen} onOpenChange={setBanDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Ban User</DialogTitle>
            <DialogDescription>
              Are you sure you want to ban {selectedUser?.email}? You can
              optionally provide a reason.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-2">
            <label htmlFor="ban-reason" className="text-sm font-medium">
              Reason (optional)
            </label>
            <Textarea
              id="ban-reason"
              placeholder="Enter reason for banning this user..."
              value={reason}
              onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) =>
                setReason(e.target.value)
              }
              rows={4}
            />
          </div>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setBanDialogOpen(false)}
              disabled={isSubmitting}
            >
              Cancel
            </Button>
            <Button
              variant="destructive"
              onClick={confirmBanUser}
              disabled={isSubmitting}
            >
              {isSubmitting ? "Banning..." : "Ban User"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Unban User Dialog */}
      <Dialog open={unbanDialogOpen} onOpenChange={setUnbanDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Unban User</DialogTitle>
            <DialogDescription>
              Are you sure you want to unban {selectedUser?.email}? You can
              optionally provide a reason.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-2">
            <label htmlFor="unban-reason" className="text-sm font-medium">
              Reason (optional)
            </label>
            <Textarea
              id="unban-reason"
              placeholder="Enter reason for unbanning this user..."
              value={reason}
              onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) =>
                setReason(e.target.value)
              }
              rows={4}
            />
          </div>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setUnbanDialogOpen(false)}
              disabled={isSubmitting}
            >
              Cancel
            </Button>
            <Button onClick={confirmUnbanUser} disabled={isSubmitting}>
              {isSubmitting ? "Unbanning..." : "Unban User"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}
