"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";

import {
  BookOpen,
  Mail,
  Lock,
  User,
  ArrowRight,
  Sparkles,
  Quote,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useAuth } from "@/contexts/AuthContext";

export default function RegisterPage() {
  const router = useRouter();
  const { register, isAuthenticated, loading: authLoading } = useAuth();

  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!authLoading && isAuthenticated) {
      router.replace("/");
    }
  }, [isAuthenticated, authLoading, router]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (loading) return;

    setError("");

    if (!username.trim() || !email.trim() || !password.trim()) {
      setError("All fields are required");
      return;
    }

    if (password !== confirmPassword) {
      setError("Passwords do not match");
      return;
    }

    if (password.length < 6) {
      setError("Password must be at least 6 characters");
      return;
    }

    try {
      setLoading(true);
      const result = await register(username, email, password);

      if (result.success) {
        router.replace("/");
      } else {
        setError(result.error || "Registration failed");
      }
    } catch (err) {
      console.error(err);
      setError("Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  if (authLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="w-12 h-12 rounded-full border-4 border-primary/30 border-t-primary animate-spin" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background text-foreground overflow-hidden">
      {/* Background Glows */}
      <div className="absolute inset-0">
        <div className="absolute inset-0 bg-gradient-to-br from-primary/10 via-background to-background" />
        <div className="absolute top-0 left-0 w-[500px] h-[500px] bg-primary/10 rounded-full blur-3xl -translate-x-1/2 -translate-y-1/2" />
        <div className="absolute bottom-0 right-0 w-[400px] h-[400px] bg-accent/10 rounded-full blur-3xl" />
      </div>

      <div className="relative grid lg:grid-cols-2 min-h-screen">
        {/* LEFT SIDE */}
        <div className="hidden lg:flex flex-col justify-between p-14 border-r border-border">
          {/* Logo */}
          <Link href="/" className="inline-flex items-center gap-3 group">
            <div className="w-14 h-14 rounded-2xl bg-primary flex items-center justify-center shadow-lg shadow-primary/30">
              <BookOpen className="w-7 h-7 text-primary-foreground" />
            </div>

            <div>
              <h1 className="text-3xl font-serif font-bold tracking-tight">
                ITSABLOG
              </h1>
              <p className="text-sm text-muted-foreground">
                Where readers become storytellers
              </p>
            </div>
          </Link>

          {/* Quote Section */}
          <div className="max-w-xl">
            <div className="mb-6 inline-flex items-center gap-2 px-4 py-2 rounded-full border border-border bg-card">
              <Sparkles size={16} className="text-primary" />
              <span className="text-sm text-muted-foreground">
                Join a world of readers
              </span>
            </div>

            <Quote className="w-12 h-12 text-primary/30 mb-6" />

            <h2 className="text-5xl leading-tight font-serif tracking-tight mb-6">
              A reader today becomes a storyteller tomorrow.
            </h2>

            <p className="text-lg leading-relaxed text-muted-foreground">
              Create your space, share reviews, build reading lists, and connect
              with a global community of book lovers who breathe stories.
            </p>

            {/* Mini Stats */}
            <div className="grid grid-cols-3 gap-4 mt-10">
              {[
                { num: "12K+", label: "Books Reviewed" },
                { num: "8K+", label: "Readers" },
                { num: "3K+", label: "Lists" },
              ].map((stat, i) => (
                <div
                  key={i}
                  className="rounded-[2rem] bg-card/70 border border-border p-5 backdrop-blur"
                >
                  <div className="text-3xl font-serif font-bold text-primary">
                    {stat.num}
                  </div>
                  <div className="text-sm text-muted-foreground">
                    {stat.label}
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="text-sm text-muted-foreground">
            “We are all stories in the end.”
          </div>
        </div>

        {/* RIGHT SIDE */}
        <div className="flex items-center justify-center px-6 py-12 lg:px-12">
          <div className="w-full max-w-md">
            {/* Mobile Logo */}
            <div className="lg:hidden text-center mb-10">
              <Link href="/" className="inline-flex items-center gap-3">
                <div className="w-14 h-14 rounded-2xl bg-primary flex items-center justify-center">
                  <BookOpen className="w-7 h-7 text-primary-foreground" />
                </div>
                <span className="text-3xl font-serif font-bold">ITSABLOG</span>
              </Link>
            </div>

            {/* Register Card */}
            <div className="rounded-[2rem] border border-border bg-card/80 backdrop-blur-2xl shadow-xl p-8 md:p-10">
              <div className="mb-8">
                <h1 className="text-4xl font-serif tracking-tight mb-3">
                  Create Account
                </h1>
                <p className="text-muted-foreground">
                  Start your reading journey and join the library of minds.
                </p>
              </div>

              {/* Error */}
              {error && (
                <div className="mb-6 rounded-2xl border border-red-200 dark:border-red-900/50 bg-red-50 dark:bg-red-950/30 px-4 py-3 text-sm text-red-600 dark:text-red-400">
                  {error}
                </div>
              )}

              <form onSubmit={handleSubmit} className="space-y-6">
                {/* Username */}
                <div className="space-y-2">
                  <Label htmlFor="username">Username</Label>
                  <div className="relative">
                    <User
                      size={18}
                      className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground"
                    />
                    <Input
                      id="username"
                      value={username}
                      onChange={(e) => setUsername(e.target.value)}
                      placeholder="booklover123"
                      className="h-12 pl-12 rounded-2xl bg-background border-border"
                    />
                  </div>
                </div>

                {/* Email */}
                <div className="space-y-2">
                  <Label htmlFor="email">Email Address</Label>
                  <div className="relative">
                    <Mail
                      size={18}
                      className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground"
                    />
                    <Input
                      id="email"
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="reader@example.com"
                      className="h-12 pl-12 rounded-2xl bg-background border-border"
                    />
                  </div>
                </div>

                {/* Password */}
                <div className="space-y-2">
                  <Label htmlFor="password">Password</Label>
                  <div className="relative">
                    <Lock
                      size={18}
                      className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground"
                    />
                    <Input
                      id="password"
                      type="password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      className="h-12 pl-12 rounded-2xl bg-background border-border"
                    />
                  </div>
                </div>

                {/* Confirm Password */}
                <div className="space-y-2">
                  <Label htmlFor="confirmPassword">Confirm Password</Label>
                  <div className="relative">
                    <Lock
                      size={18}
                      className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground"
                    />
                    <Input
                      id="confirmPassword"
                      type="password"
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      className="h-12 pl-12 rounded-2xl bg-background border-border"
                    />
                  </div>
                </div>

                <Button
                  type="submit"
                  disabled={loading}
                  className="w-full h-12 rounded-2xl text-base font-medium shadow-lg shadow-primary/20"
                >
                  {loading ? (
                    "Creating Account..."
                  ) : (
                    <>
                      Create Account
                      <ArrowRight className="ml-2" size={18} />
                    </>
                  )}
                </Button>
              </form>

              <div className="mt-8 text-center text-sm text-muted-foreground">
                Already have an account?{" "}
                <Link href="/login" className="text-primary hover:underline">
                  Sign in
                </Link>
              </div>
            </div>

            <div className="mt-6 text-center text-sm text-muted-foreground">
              Your reading world starts here.
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
