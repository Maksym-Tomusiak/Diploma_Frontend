/**
 * Utility functions for formatting dates, times, and strings
 */

/**
 * Get user initials from email
 */
export function getUserInitials(email: string): string {
  return email.substring(0, 2).toUpperCase();
}

/**
 * Format date to locale string
 */
export function formatDate(dateString: string): string {
  return new Date(dateString).toLocaleDateString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
  });
}

/**
 * Format date and time to locale string
 */
export function formatDateTime(dateString: string): string {
  return new Date(dateString).toLocaleString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}

/**
 * Get badge color class for action type
 */
export function getActionBadgeColor(actionType: string): string {
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
}
