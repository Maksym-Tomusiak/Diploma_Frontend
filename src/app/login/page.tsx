"use client";

import Link from "next/link";
import { FileText, AlertCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { useAuth } from "@/context/AuthContext";
import { useState, useEffect } from "react";
import { useSearchParams } from "next/navigation";

export default function LoginPage() {
  const { loginWithGoogle } = useAuth();
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const searchParams = useSearchParams();

  useEffect(() => {
    const error = searchParams.get("error");
    if (error) {
      setErrorMessage(decodeURIComponent(error));
    }
  }, [searchParams]);

  const handleGoogleAuth = async () => {
    setIsLoading(true);
    setErrorMessage(null); // Clear any previous errors
    try {
      await loginWithGoogle();
    } catch (error) {
      console.error("Login failed:", error);
      setErrorMessage("Failed to initiate login. Please try again.");
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-50 p-4">
      <Card className="w-full max-w-md shadow-md border-slate-200 bg-white">
        <CardHeader className="text-center space-y-2 pb-6">
          <div className="mx-auto flex h-10 w-10 items-center justify-center rounded bg-slate-900 text-white mb-2">
            <FileText className="h-6 w-6" />
          </div>
          <CardTitle className="text-2xl font-bold text-slate-900">
            Welcome back
          </CardTitle>
          <CardDescription className="text-slate-500">
            Enter your details to sign in to your workspace
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {errorMessage && (
            <div className="flex items-start gap-3 p-4 bg-red-50 border border-red-200 rounded-md">
              <AlertCircle className="h-5 w-5 text-red-600 flex-shrink-0 mt-0.5" />
              <div className="flex-1">
                <p className="text-sm font-medium text-red-900">
                  Authentication Error
                </p>
                <p className="text-sm text-red-700 mt-1">{errorMessage}</p>
              </div>
            </div>
          )}
          <Button
            variant="outline"
            className="w-full h-12 border-slate-200 text-slate-700 hover:bg-slate-50 hover:text-slate-900 relative font-medium"
            onClick={handleGoogleAuth}
            disabled={isLoading}
          >
            <svg className="mr-2 h-5 w-5" viewBox="0 0 24 24">
              <path
                d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                fill="#4285F4"
              />
              <path
                d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                fill="#34A853"
              />
              <path
                d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                fill="#FBBC05"
              />
              <path
                d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                fill="#EA4335"
              />
            </svg>
            {isLoading ? "Redirecting..." : "Continue with Google"}
          </Button>

          <div className="relative">
            <div className="absolute inset-0 flex items-center">
              <span className="w-full border-t border-slate-200" />
            </div>
            <div className="relative flex justify-center text-xs uppercase">
              <span className="bg-white px-2 text-slate-500">
                Secure authentication
              </span>
            </div>
          </div>

          <div className="text-center text-sm text-slate-500">
            Sign in securely with your Google account
          </div>
        </CardContent>
        <CardFooter className="flex flex-col space-y-4 border-t border-slate-100 pt-6">
          <div className="text-center text-sm text-slate-500">
            Don&apos;t have an account?{" "}
            <Link
              href="/register"
              className="font-medium text-blue-600 hover:text-blue-500 hover:underline"
            >
              Sign up
            </Link>
          </div>
          <p className="text-center text-xs text-slate-400 px-4">
            By clicking continue, you agree to our Terms of Service and Privacy
            Policy.
          </p>
        </CardFooter>
      </Card>
    </div>
  );
}
