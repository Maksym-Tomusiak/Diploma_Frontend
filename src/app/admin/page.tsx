"use client";

import { useEffect, useState } from "react";
import {
  Users,
  BarChart3,
  Settings,
  Search,
  MoreHorizontal,
  Filter,
  Loader2,
  AlertCircle,
  FileText,
} from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
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
import { Badge } from "@/components/ui/badge";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { userService } from "@/services/UserService";
import {
  userActionLogService,
  UserActionLog,
} from "@/services/UserActionLogService";
import { User, UserRole } from "@/types/auth";
import { useAuth } from "@/context/AuthContext";
import { useToast } from "@/hooks/use-toast";

type ActiveTab = "users" | "logs";

export default function AdminPage() {
  const router = useRouter();
  const { user: currentUser, isLoading: authLoading } = useAuth();
  const { toast } = useToast();
  const [activeTab, setActiveTab] = useState<ActiveTab>("users");
  const [users, setUsers] = useState<User[]>([]);
  const [filteredUsers, setFilteredUsers] = useState<User[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Logs state
  const [logs, setLogs] = useState<UserActionLog[]>([]);
  const [logsTotal, setLogsTotal] = useState(0);
  const [logsPage, setLogsPage] = useState(0);
  const [logsLimit] = useState(50);
  const [logsLoading, setLogsLoading] = useState(false);
  const [logsError, setLogsError] = useState<string | null>(null);
  const [logsFilterUserId, setLogsFilterUserId] = useState<number | null>(null);
  const [logsFilterActionType, setLogsFilterActionType] = useState<string>("");

  // User logs modal state
  const [userLogsModal, setUserLogsModal] = useState<{
    open: boolean;
    user: User | null;
    logs: UserActionLog[];
  }>({
    open: false,
    user: null,
    logs: [],
  });
  const [userLogsLoading, setUserLogsLoading] = useState(false);

  // Check if user is admin
  useEffect(() => {
    if (!authLoading && currentUser?.role !== UserRole.ADMIN) {
      router.push("/");
    }
  }, [currentUser, authLoading, router]);

  // Fetch users
  useEffect(() => {
    const controller = new AbortController();

    const fetchUsers = async () => {
      try {
        setIsLoading(true);
        setError(null);
        const data = await userService.getAllUsers(controller.signal);
        setUsers(data);
        setFilteredUsers(data);
      } catch (err: any) {
        if (err.name !== "CanceledError") {
          setError(err.response?.data?.detail || "Failed to load users");
        }
      } finally {
        setIsLoading(false);
      }
    };

    if (!authLoading && currentUser?.role === UserRole.ADMIN) {
      fetchUsers();
    }

    return () => controller.abort();
  }, [authLoading, currentUser]);

  // Filter users based on search
  useEffect(() => {
    if (searchQuery.trim() === "") {
      setFilteredUsers(users);
    } else {
      const query = searchQuery.toLowerCase();
      setFilteredUsers(
        users.filter(
          (user) =>
            user.email.toLowerCase().includes(query) ||
            user.id.toString().includes(query)
        )
      );
    }
  }, [searchQuery, users]);

  // Fetch logs
  useEffect(() => {
    const controller = new AbortController();

    const fetchLogs = async () => {
      try {
        setLogsLoading(true);
        setLogsError(null);
        const data = await userActionLogService.getAllLogs({
          limit: logsLimit,
          offset: logsPage * logsLimit,
          user_id: logsFilterUserId || undefined,
          action_type: logsFilterActionType || undefined,
        });
        setLogs(data.logs);
        setLogsTotal(data.total);
      } catch (err: any) {
        if (err.name !== "CanceledError") {
          setLogsError(err.response?.data?.detail || "Failed to load logs");
        }
      } finally {
        setLogsLoading(false);
      }
    };

    if (
      !authLoading &&
      currentUser?.role === UserRole.ADMIN &&
      activeTab === "logs"
    ) {
      fetchLogs();
    }

    return () => controller.abort();
  }, [
    authLoading,
    currentUser,
    activeTab,
    logsPage,
    logsLimit,
    logsFilterUserId,
    logsFilterActionType,
  ]);

  const handleDeleteUser = async (userId: number) => {
    if (!confirm("Are you sure you want to delete this user?")) {
      return;
    }

    try {
      await userService.deleteUser(userId);
      setUsers(users.filter((u) => u.id !== userId));
    } catch (err: any) {
      alert(err.response?.data?.detail || "Failed to delete user");
    }
  };

  const handleViewUserLogs = async (user: User) => {
    setUserLogsLoading(true);
    setUserLogsModal({ open: true, user, logs: [] });

    try {
      const data = await userActionLogService.getAllLogs({
        user_id: user.id,
        limit: 5,
      });
      setUserLogsModal({ open: true, user, logs: data.logs });
    } catch (err: any) {
      console.error("Failed to load user logs:", err);
    } finally {
      setUserLogsLoading(false);
    }
  };

  const handleViewAllUserLogs = (userId: number) => {
    setUserLogsModal({ open: false, user: null, logs: [] });
    setActiveTab("logs");
    setLogsFilterUserId(userId);
    setLogsPage(0);
  };

  const handleClearLogsFilter = () => {
    setLogsFilterUserId(null);
    setLogsFilterActionType("");
    setLogsPage(0);
  };

  const getUserInitials = (email: string) => {
    return email.substring(0, 2).toUpperCase();
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  const formatDateTime = (dateString: string) => {
    return new Date(dateString).toLocaleString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const getActionBadgeColor = (actionType: string) => {
    switch (actionType) {
      case "LOGIN":
        return "bg-green-100 text-green-700 hover:bg-green-100";
      case "LOGOUT":
        return "bg-slate-100 text-slate-700 hover:bg-slate-100";
      case "DOCUMENT_CREATE":
        return "bg-blue-100 text-blue-700 hover:bg-blue-100";
      case "DOCUMENT_DELETE":
        return "bg-red-100 text-red-700 hover:bg-red-100";
      case "CHECK_RESULT_VIEW":
        return "bg-purple-100 text-purple-700 hover:bg-purple-100";
      default:
        return "bg-slate-100 text-slate-700 hover:bg-slate-100";
    }
  };

  const renderDetails = (details: any) => {
    if (!details) return <span className="text-slate-400">—</span>;
    if (typeof details === "string") {
      return <span className="text-slate-700 text-sm">{details}</span>;
    }
    // If it's an object, render key/value pairs (first 4 keys) prettily
    try {
      const entries = Object.entries(details);
      if (entries.length === 0)
        return <span className="text-slate-400">—</span>;
      return (
        <div className="text-sm text-slate-700 space-y-1">
          {entries.slice(0, 4).map(([k, v]) => (
            <div key={k} className="flex items-start gap-2">
              <span className="font-mono text-xs text-slate-500 w-[120px]">
                {k}:
              </span>
              <span className="break-words">
                {typeof v === "object" ? JSON.stringify(v) : String(v)}
              </span>
            </div>
          ))}
          {entries.length > 4 && (
            <div className="text-xs text-slate-500">
              and {entries.length - 4} more...
            </div>
          )}
        </div>
      );
    } catch (e) {
      return (
        <pre className="text-xs bg-slate-50 px-2 py-1 rounded">
          {String(details)}
        </pre>
      );
    }
  };

  if (authLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-slate-600" />
      </div>
    );
  }

  if (currentUser?.role !== UserRole.ADMIN) {
    return null;
  }

  return (
    <div className="min-h-screen bg-slate-50 flex font-sans">
      {/* Sidebar */}
      <aside className="w-64 bg-slate-900 text-slate-300 flex flex-col">
        <div className="h-16 flex items-center px-6 border-b border-slate-800">
          <span className="text-lg font-bold text-white tracking-tight">
            FormatStand Admin
          </span>
        </div>
        <nav className="flex-1 p-4 space-y-2">
          <Button
            variant="ghost"
            className={`w-full justify-start ${
              activeTab === "users"
                ? "bg-slate-800 text-white"
                : "text-slate-300 hover:text-white hover:bg-slate-800"
            }`}
            onClick={() => setActiveTab("users")}
          >
            <Users className="mr-3 h-5 w-5" />
            Users
          </Button>
          <Button
            variant="ghost"
            className={`w-full justify-start ${
              activeTab === "logs"
                ? "bg-slate-800 text-white"
                : "text-slate-300 hover:text-white hover:bg-slate-800"
            }`}
            onClick={() => setActiveTab("logs")}
          >
            <FileText className="mr-3 h-5 w-5" />
            Activity Logs
          </Button>
          <Button
            variant="ghost"
            className="w-full justify-start text-slate-300 hover:text-white hover:bg-slate-800"
          >
            <BarChart3 className="mr-3 h-5 w-5" />
            Analytics
          </Button>
          <Button
            variant="ghost"
            className="w-full justify-start text-slate-300 hover:text-white hover:bg-slate-800"
          >
            <Settings className="mr-3 h-5 w-5" />
            Settings
          </Button>
        </nav>
        <div className="p-4 border-t border-slate-800">
          <Link href="/">
            <Button
              variant="outline"
              className="w-full border-slate-700 text-slate-300 hover:bg-slate-800 hover:text-white"
            >
              Exit to App
            </Button>
          </Link>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 flex flex-col min-w-0">
        <header className="h-16 bg-white border-b border-slate-200 flex items-center justify-between px-8">
          <h1 className="text-xl font-semibold text-slate-900">
            {activeTab === "users" ? "User Management" : "Activity Logs"}
          </h1>
          <div className="flex items-center gap-4">
            <Avatar>
              <AvatarFallback className="bg-blue-600 text-white">
                {currentUser?.email ? getUserInitials(currentUser.email) : "AD"}
              </AvatarFallback>
            </Avatar>
          </div>
        </header>

        <div className="flex-1 p-8">
          {activeTab === "users" ? (
            <>
              {/* Controls */}
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
                    {filteredUsers.length} user
                    {filteredUsers.length !== 1 ? "s" : ""}
                  </span>
                </div>
              </div>

              {/* Table */}
              <div className="bg-white rounded-md border border-slate-200 shadow-sm overflow-hidden">
                {isLoading ? (
                  <div className="flex items-center justify-center py-12">
                    <Loader2 className="h-8 w-8 animate-spin text-slate-600" />
                  </div>
                ) : error ? (
                  <div className="flex flex-col items-center justify-center py-12 gap-3">
                    <AlertCircle className="h-10 w-10 text-red-500" />
                    <p className="text-slate-600">{error}</p>
                    <Button
                      variant="outline"
                      onClick={() => window.location.reload()}
                    >
                      Retry
                    </Button>
                  </div>
                ) : filteredUsers.length === 0 ? (
                  <div className="flex flex-col items-center justify-center py-12 gap-2">
                    <Users className="h-10 w-10 text-slate-300" />
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
                      {filteredUsers.map((user) => (
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
                              <div className="flex flex-col">
                                <span className="font-medium text-slate-900">
                                  {user.email}
                                </span>
                              </div>
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
                                {user.role === UserRole.ADMIN
                                  ? "Admin"
                                  : "User"}
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
                                  onClick={() => handleViewUserLogs(user)}
                                >
                                  View logs
                                </DropdownMenuItem>
                                {!user.is_banned ? (
                                  <DropdownMenuItem
                                    className="text-amber-600 focus:bg-amber-50 focus:text-amber-700"
                                    onClick={async () => {
                                      if (!confirm(`Ban user ${user.email}?`))
                                        return;
                                      try {
                                        await userService.banUser(user.id);
                                        setUsers(
                                          users.map((u) =>
                                            u.id === user.id
                                              ? { ...u, is_banned: true }
                                              : u
                                          )
                                        );
                                        toast({
                                          title: "User banned",
                                          description: `${user.email} has been banned successfully.`,
                                        });
                                      } catch (err: any) {
                                        toast({
                                          variant: "destructive",
                                          title: "Failed to ban user",
                                          description:
                                            err.response?.data?.detail ||
                                            "An error occurred while banning the user.",
                                        });
                                      }
                                    }}
                                  >
                                    Ban user
                                  </DropdownMenuItem>
                                ) : (
                                  <DropdownMenuItem
                                    className="text-emerald-600 focus:bg-emerald-50 focus:text-emerald-700"
                                    onClick={async () => {
                                      if (!confirm(`Unban user ${user.email}?`))
                                        return;
                                      try {
                                        await userService.unbanUser(user.id);
                                        setUsers(
                                          users.map((u) =>
                                            u.id === user.id
                                              ? { ...u, is_banned: false }
                                              : u
                                          )
                                        );
                                        toast({
                                          title: "User unbanned",
                                          description: `${user.email} has been unbanned successfully.`,
                                        });
                                      } catch (err: any) {
                                        toast({
                                          variant: "destructive",
                                          title: "Failed to unban user",
                                          description:
                                            err.response?.data?.detail ||
                                            "An error occurred while unbanning the user.",
                                        });
                                      }
                                    }}
                                  >
                                    Unban user
                                  </DropdownMenuItem>
                                )}
                                <DropdownMenuItem
                                  className="text-red-600 focus:bg-red-50 focus:text-red-700"
                                  onClick={() => handleDeleteUser(user.id)}
                                  disabled={user.id === currentUser?.id}
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
            </>
          ) : (
            <>
              {/* Logs Tab Content */}
              <div className="flex items-center gap-4 mb-6">
                <Select
                  value={logsFilterUserId?.toString() || ""}
                  onValueChange={(value: string) => {
                    setLogsFilterUserId(
                      value === "__ALL__" ? null : parseInt(value)
                    );
                    setLogsPage(0);
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
                    setLogsPage(0);
                  }}
                >
                  <SelectTrigger className="w-[200px] bg-white border-slate-200">
                    <SelectValue placeholder="Filter by action" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="__ALL__">All actions</SelectItem>
                    <SelectItem value="LOGIN">Login</SelectItem>
                    <SelectItem value="LOGOUT">Logout</SelectItem>
                    <SelectItem value="DOCUMENT_CREATE">
                      Document Create
                    </SelectItem>
                    <SelectItem value="DOCUMENT_DELETE">
                      Document Delete
                    </SelectItem>
                    <SelectItem value="CHECK_RESULT_VIEW">
                      Check Result View
                    </SelectItem>
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
                    <Button
                      variant="outline"
                      onClick={() => window.location.reload()}
                    >
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
                              {renderDetails(log.details)}
                            </TableCell>
                            <TableCell className="text-slate-500 text-sm">
                              {formatDateTime(log.created_at)}
                            </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>

                    {/* Pagination */}
                    <div className="flex items-center justify-between px-6 py-4 border-t border-slate-200">
                      <div className="text-sm text-slate-600">
                        Showing {logsPage * logsLimit + 1} to{" "}
                        {Math.min((logsPage + 1) * logsLimit, logsTotal)} of{" "}
                        {logsTotal} logs
                      </div>
                      <div className="flex gap-2">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => setLogsPage(Math.max(0, logsPage - 1))}
                          disabled={logsPage === 0}
                        >
                          Previous
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => setLogsPage(logsPage + 1)}
                          disabled={(logsPage + 1) * logsLimit >= logsTotal}
                        >
                          Next
                        </Button>
                      </div>
                    </div>
                  </>
                )}
              </div>
            </>
          )}
        </div>
      </main>

      {/* User Logs Modal */}
      <Dialog
        open={userLogsModal.open}
        onOpenChange={(open: boolean) =>
          setUserLogsModal({ open, user: null, logs: [] })
        }
      >
        <DialogContent className="max-w-3xl max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>
              Activity Logs - {userLogsModal.user?.email}
            </DialogTitle>
            <DialogDescription>
              Recent activity for this user. Click "View All Logs" to see the
              complete history.
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-3">
            {userLogsLoading ? (
              <div className="flex items-center justify-center py-8">
                <Loader2 className="h-6 w-6 animate-spin text-slate-600" />
              </div>
            ) : userLogsModal.logs.length === 0 ? (
              <div className="text-center py-8 text-slate-500">
                No logs found for this user
              </div>
            ) : (
              userLogsModal.logs.map((log) => (
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
            <Button
              variant="outline"
              onClick={() =>
                setUserLogsModal({ open: false, user: null, logs: [] })
              }
            >
              Close
            </Button>
            {userLogsModal.user && (
              <Button
                onClick={() => handleViewAllUserLogs(userLogsModal.user!.id)}
                className="bg-blue-600 hover:bg-blue-700"
              >
                View All Logs
              </Button>
            )}
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
