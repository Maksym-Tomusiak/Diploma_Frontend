import { useState, useEffect } from "react";
import { userService } from "@/services/UserService";
import type { User } from "@/types/auth";

export function useUsersManagement(isAdmin: boolean, authLoading: boolean) {
  const [users, setUsers] = useState<User[]>([]);
  const [total, setTotal] = useState(0);
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize] = useState(10);
  const [searchQuery, setSearchQuery] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const totalPages = Math.ceil(total / pageSize);

  // Fetch users
  useEffect(() => {
    const controller = new AbortController();

    const fetchUsers = async () => {
      try {
        setIsLoading(true);
        setError(null);
        const skip = (currentPage - 1) * pageSize;
        const data = await userService.getAllUsers(
          skip,
          pageSize,
          controller.signal
        );
        setUsers(data.users);
        setTotal(data.total);
      } catch (err: any) {
        if (err.name !== "CanceledError") {
          setError(err.response?.data?.detail || "Failed to load users");
        }
      } finally {
        setIsLoading(false);
      }
    };

    if (!authLoading && isAdmin) {
      fetchUsers();
    }

    return () => controller.abort();
  }, [authLoading, isAdmin, currentPage, pageSize]);

  // Search filtering is now done client-side on current page
  const filteredUsers =
    searchQuery.trim() === ""
      ? users
      : users.filter(
          (user) =>
            user.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
            user.id.toString().includes(searchQuery)
        );

  return {
    users: filteredUsers,
    setUsers,
    total,
    currentPage,
    totalPages,
    setCurrentPage,
    searchQuery,
    setSearchQuery,
    isLoading,
    error,
  };
}
