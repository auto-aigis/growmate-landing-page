"use client";
export const dynamic = "force-dynamic";

import { useState, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { authApi } from "@/app/_lib/api";
import { Loader2 } from "lucide-react";

function VerifyEmailContent() {
  const [status, setStatus] = useState<"loading" | "success" | "error" | "sent">("loading");
  const [errorMsg, setErrorMsg] = useState("");
  const router = useRouter();
  const searchParams = useSearchParams();

  const token = searchParams.get("token");
  const email = searchParams.get("email");

  const handleResend = async () => {
    if (!email) return;
    try {
      await authApi.resendVerification(email);
      setStatus("sent");
    } catch {
      setErrorMsg("Failed to resend email.");
    }
  };

  if (token) {
    authApi.verifyEmail(token)
      .then(() => {
        setStatus("success");
        setTimeout(() => router.push("/login"), 2000);
      })
      .catch((err: any) => {
        setStatus("error");
        setErrorMsg(err.message || "Verification failed.");
      });
  }

  if (status === "loading") {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 p-4">
        <Card className="w-full max-w-md">
          <CardContent className="pt-6 text-center">
            <Loader2 className="w-8 h-8 animate-spin mx-auto text-green-600" />
            <p className="mt-4 text-gray-600">Verifying your email...</p>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (status === "success") {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 p-4">
        <Card className="w-full max-w-md">
          <CardHeader className="text-center">
            <CardTitle className="text-green-600">Email Verified!</CardTitle>
            <CardDescription>Redirecting you to sign in...</CardDescription>
          </CardHeader>
        </Card>
      </div>
    );
  }

  if (status === "error") {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 p-4">
        <Card className="w-full max-w-md">
          <CardHeader className="text-center">
            <CardTitle className="text-red-600">Verification Failed</CardTitle>
            <CardDescription>{errorMsg}</CardDescription>
          </CardHeader>
          <CardContent className="text-center">
            <Link href="/login">
              <Button>Go to Login</Button>
            </Link>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 p-4">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <CardTitle>Check Your Email</CardTitle>
          <CardDescription>
            We sent a verification link to <span className="font-medium text-gray-900">{email}</span>
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {status === "sent" && (
            <div className="p-3 text-sm text-green-600 bg-green-50 rounded-lg">
              Verification email sent!
            </div>
          )}
          {errorMsg && (
            <div className="p-3 text-sm text-red-600 bg-red-50 rounded-lg">{errorMsg}</div>
          )}
          <div className="flex flex-col gap-2">
            <Button onClick={handleResend} variant="outline">
              Resend Verification Email
            </Button>
            <Link href="/login" className="text-center">
              <Button variant="ghost" size="sm">
                Already verified? Sign in
              </Button>
            </Link>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

export default function VerifyEmailPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <Loader2 className="w-8 h-8 animate-spin text-green-600" />
      </div>
    }>
      <VerifyEmailContent />
    </Suspense>
  );
}