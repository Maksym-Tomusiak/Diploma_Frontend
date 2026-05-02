"use client";

import { Suspense, useEffect, useState } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { FileText } from "lucide-react";
import { authService } from "@/services/AuthService";
import { UserRole } from "@/types/auth";
import { useAuth } from "@/context/AuthContext";

function AuthCallbackHandler() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const { refreshUser } = useAuth();
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const handleCallback = async () => {
      const token = searchParams.get("token");
      const errorParam = searchParams.get("error");

      if (errorParam) {
        setError(decodeURIComponent(errorParam));
        return;
      }

      if (!token) {
        setError("No authorization token received");
        return;
      }

      // Store access token (refresh token is stored in HTTP-only cookie by backend)
      localStorage.setItem("token", token);

      try {
        // Refresh global auth state
        await refreshUser();

        // Fetch user data directly to determine role for immediate redirect
        const user = await authService.getCurrentUser();

        // Redirect based on role
        if (user.role === UserRole.ADMIN) {
          router.push("/admin");
        } else {
          router.push("/app");
        }
      } catch (err) {
        console.error("Failed to fetch user data:", err);
        setError("Failed to complete authentication");
      }
    };

    handleCallback();
  }, [searchParams, router]);

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50">
        <div className="text-center max-w-md p-6">
          <div className="mx-auto flex h-12 w-12 items-center justify-center rounded bg-red-100 text-red-600 mb-4">
            <FileText className="h-6 w-6" />
          </div>
          <h1 className="text-xl font-semibold text-slate-900 mb-2">
            Authentication Error
          </h1>
          <p className="text-slate-600 mb-4 text-sm break-words">{error}</p>
          <a href="/login" className="text-blue-600 hover:underline">
            Try again
          </a>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-50">
      <div className="text-center">
        <div className="mx-auto flex h-12 w-12 items-center justify-center rounded bg-slate-900 text-white mb-4 animate-pulse">
          <FileText className="h-6 w-6" />
        </div>
        <h1 className="text-xl font-semibold text-slate-900 mb-2">
          Completing sign in...
        </h1>
        <p className="text-slate-600">Please wait while we authenticate you.</p>
      </div>
    </div>
  );
}

export default function AuthCallbackPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen flex items-center justify-center bg-slate-50">
        <div className="text-center">
          <div className="mx-auto flex h-12 w-12 items-center justify-center rounded bg-slate-900 text-white mb-4 animate-pulse">
            <FileText className="h-6 w-6" />
          </div>
          <h1 className="text-xl font-semibold text-slate-900 mb-2">
            Loading...
          </h1>
        </div>
      </div>
    }>
      <AuthCallbackHandler />
    </Suspense>
  );
}
