"use client";

import React, { useState, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { CheckCircle, AlertCircle } from "lucide-react";
import Link from "next/link";

const ResetPassword = () => {
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [isSuccess, setIsSuccess] = useState(false);
  const [token, setToken] = useState("");
  const [isTokenLoading, setIsTokenLoading] = useState(true);

  const router = useRouter();
  const searchParams = useSearchParams();

  const [tokenStatus, setTokenStatus] = useState<
    "loading" | "valid" | "invalid" | "expired"
  >("loading");

  useEffect(() => {
    const checkToken = async () => {
      const tokenParam = searchParams.get("token");

      if (!tokenParam) {
        setTokenStatus("invalid");
        setMessage("Invalid reset link. Please request a new password reset.");
        setIsTokenLoading(false);
        return;
      }

      setToken(tokenParam);

      try {
        // Validate the token with the API
        const response = await fetch("/api/auth/validate-reset-token", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ token: tokenParam }),
        });

        if (response.ok) {
          setTokenStatus("valid");
        } else {
          setTokenStatus("expired");
        }
      } catch (error) {
        setTokenStatus("invalid");
      } finally {
        setIsTokenLoading(false);
      }
    };

    checkToken();
  }, [searchParams]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setMessage("");

    if (password !== confirmPassword) {
      setMessage("Passwords do not match");
      setIsLoading(false);
      return;
    }

    if (password.length < 6) {
      setMessage("Password must be at least 6 characters long");
      setIsLoading(false);
      return;
    }

    try {
      const response = await fetch("/api/auth/reset-password", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ token, password }),
      });

      const data = await response.json();

      if (response.ok) {
        setIsSuccess(true);
        setMessage(data.message);
        // Redirect to login after 3 seconds
        setTimeout(() => {
          router.push(
            "/login?message=Password reset successful. Please log in with your new password."
          );
        }, 3000);
      } else {
        setMessage(data.message || "An error occurred. Please try again.");
        // If token is invalid/expired, update status
        if (response.status === 400) {
          setTokenStatus("expired");
        }
      }
    } catch (error) {
      setMessage("An error occurred. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  // Show loading state while checking for token
  if (isTokenLoading) {
    return (
      <div className="min-h-screen w-screen flex items-center justify-center bg-background p-4">
        <Card className="w-full max-w-md">
          <CardHeader className="text-center">
            <CardTitle className="text-2xl">Reset your password</CardTitle>
            <CardDescription>Verifying your reset link...</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-4 animate-pulse">
              <div className="space-y-2">
                <div className="h-4 bg-muted rounded w-24"></div>
                <div className="h-10 bg-muted rounded"></div>
              </div>
              <div className="space-y-2">
                <div className="h-4 bg-muted rounded w-32"></div>
                <div className="h-10 bg-muted rounded"></div>
              </div>
              <div className="h-10 bg-muted rounded"></div>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  if ((tokenStatus === "invalid" || tokenStatus === "expired") && !isSuccess) {
    return (
      <div className="min-h-screen w-screen flex items-center justify-center bg-background p-4">
        <Card className="w-full max-w-md">
          <CardHeader className="text-center">
            <div className="w-16 h-16 bg-orange-100 dark:bg-orange-900/30 rounded-full flex items-center justify-center mx-auto mb-6">
              <AlertCircle className="h-8 w-8 text-orange-600 dark:text-orange-400" />
            </div>
            <CardTitle className="text-2xl mb-3">
              {tokenStatus === "expired" ? "Link Expired" : "Invalid Link"}
            </CardTitle>
            <CardDescription className="text-base leading-relaxed">
              {tokenStatus === "expired"
                ? "This password reset link has expired or has already been used. For security reasons, reset links can only be used once and expire after 1 hour."
                : "This password reset link is invalid. It may have been corrupted or is no longer valid."}
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="bg-muted/50 rounded-lg p-4 text-center">
              <p className="text-sm text-muted-foreground mb-3">
                Need to reset your password?
              </p>
              <Button asChild className="w-full">
                <Link href="/forgot-password">Get a new reset link</Link>
              </Button>
            </div>

            <div className="text-center">
              <Link
                href="/login"
                className="text-sm text-muted-foreground hover:text-foreground transition-colors inline-flex items-center gap-1"
              >
                ← Back to login
              </Link>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (isSuccess) {
    return (
      <div className="min-h-screen w-screen flex items-center justify-center bg-background p-4">
        <Card className="w-full max-w-md">
          <CardHeader className="text-center">
            <div className="w-12 h-12 bg-green-100 dark:bg-green-900 rounded-full flex items-center justify-center mx-auto mb-4">
              <CheckCircle className="h-6 w-6 text-green-600 dark:text-green-400" />
            </div>
            <CardTitle className="text-2xl">
              Password Reset Successful
            </CardTitle>
            <CardDescription>
              Your password has been successfully reset.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="text-center space-y-4">
              <p className="text-sm text-muted-foreground">
                Redirecting you to login page...
              </p>
              <Button asChild className="w-full">
                <Link href="/login">Go to login</Link>
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  // Only show the form if token is valid
  if (tokenStatus !== "valid") {
    return null;
  }

  return (
    <div className="min-h-screen w-screen flex items-center justify-center bg-background p-4">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <CardTitle className="text-2xl">Reset your password</CardTitle>
          <CardDescription>Enter your new password below.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <form onSubmit={handleSubmit} className="space-y-4">
            {message && !isSuccess && (
              <div className="text-sm text-red-600 text-center">{message}</div>
            )}
            <div className="space-y-2">
              <Label htmlFor="password">New Password</Label>
              <Input
                id="password"
                type="password"
                placeholder="Enter new password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="confirmPassword">Confirm Password</Label>
              <Input
                id="confirmPassword"
                type="password"
                placeholder="Confirm new password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                required
              />
            </div>
            <Button className="w-full" type="submit" disabled={isLoading}>
              {isLoading ? "Resetting..." : "Reset password"}
            </Button>
          </form>
          <div className="text-center">
            <Link
              href="/login"
              className="text-sm text-primary hover:underline"
            >
              Back to login
            </Link>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default ResetPassword;
