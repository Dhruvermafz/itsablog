"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";

import {
  BookOpen,
  Mail,
  Lock,
  ArrowRight,
  Quote,
  Sparkles,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useAuth } from "@/contexts/AuthContext";

export default function LoginPage() {
  const router = useRouter();

  const { login, isAuthenticated, loading: authLoading } = useAuth();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  // Redirect if already logged in
  useEffect(() => {
    if (!authLoading && isAuthenticated) {
      router.replace("/");
    }
  }, [isAuthenticated, authLoading, router]);

  // Submit
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (loading) return;

    setError("");

    if (!email.trim() || !password.trim()) {
      setError("Please enter both email and password");
      return;
    }

    try {
      setLoading(true);

      const result = await login(email.trim(), password);

      if (result.success) {
        router.replace("/");
      } else {
        setError(result.error || "Invalid credentials");
      }
    } catch (err) {
      console.error(err);
      setError("Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  // Loading
  if (authLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#f8f5ef] dark:bg-[#0f172a]">
        <div className="flex flex-col items-center gap-4">
          <div className="w-12 h-12 rounded-full border-4 border-primary/30 border-t-primary animate-spin" />
          <p className="text-slate-600 dark:text-slate-400">
            Preparing your library...
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#f8f5ef] dark:bg-[#0b1120] overflow-hidden">
      {/* Background Glow */}
      <div className="absolute top-0 left-0 w-[500px] h-[500px] bg-amber-300/20 blur-3xl rounded-full -translate-x-1/2 -translate-y-1/2" />

      <div className="relative grid lg:grid-cols-2 min-h-screen">
        {/* LEFT SIDE */}
        <div className="hidden lg:flex flex-col justify-between p-14 border-r border-black/5 dark:border-white/5">
          {/* Logo */}
          <div>
            <Link href="/" className="inline-flex items-center gap-3 group">
              <div className="w-14 h-14 rounded-2xl bg-primary flex items-center justify-center shadow-lg shadow-primary/30">
                <BookOpen className="w-7 h-7 text-white" />
              </div>

              <div>
                <h1 className="text-3xl font-serif font-bold tracking-tight">
                  ITSABLOG
                </h1>

                <p className="text-sm text-slate-500 dark:text-slate-400">
                  For readers who live inside stories
                </p>
              </div>
            </Link>
          </div>

          {/* Quote */}
          <div className="max-w-xl">
            <div className="mb-6 inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/60 dark:bg-slate-900/60 border border-black/5 dark:border-white/5 backdrop-blur">
              <Sparkles size={16} className="text-primary" />
              <span className="text-sm">Curated for passionate readers</span>
            </div>

            <Quote className="w-12 h-12 text-primary/30 mb-6" />

            <h2 className="text-5xl leading-tight font-serif tracking-tight mb-6">
              Every book leaves a mark on the soul.
            </h2>

            <p className="text-lg leading-relaxed text-slate-600 dark:text-slate-300">
              Discover hidden literary gems, write meaningful reviews, build
              beautiful reading lists, and connect with readers who feel stories
              as deeply as you do.
            </p>

            {/* Mini Stats */}
            <div className="grid grid-cols-3 gap-4 mt-10">
              <div className="rounded-2xl bg-white/70 dark:bg-slate-900/60 backdrop-blur p-5 border border-black/5 dark:border-white/5">
                <div className="text-3xl font-serif font-bold text-primary">
                  12K+
                </div>
                <div className="text-sm text-slate-500">Books Reviewed</div>
              </div>

              <div className="rounded-2xl bg-white/70 dark:bg-slate-900/60 backdrop-blur p-5 border border-black/5 dark:border-white/5">
                <div className="text-3xl font-serif font-bold text-primary">
                  8K+
                </div>
                <div className="text-sm text-slate-500">Active Readers</div>
              </div>

              <div className="rounded-2xl bg-white/70 dark:bg-slate-900/60 backdrop-blur p-5 border border-black/5 dark:border-white/5">
                <div className="text-3xl font-serif font-bold text-primary">
                  3K+
                </div>
                <div className="text-sm text-slate-500">Reading Lists</div>
              </div>
            </div>
          </div>

          {/* Footer */}
          <div className="text-sm text-slate-500 dark:text-slate-400">
            “A reader lives a thousand lives before he dies.”
          </div>
        </div>

        {/* RIGHT SIDE */}
        <div className="flex items-center justify-center px-6 py-12 lg:px-12">
          <div className="w-full max-w-md">
            {/* Mobile Logo */}
            <div className="lg:hidden text-center mb-10">
              <Link href="/" className="inline-flex items-center gap-3 mb-4">
                <div className="w-14 h-14 rounded-2xl bg-primary flex items-center justify-center shadow-lg">
                  <BookOpen className="w-7 h-7 text-white" />
                </div>

                <span className="text-3xl font-serif font-bold">ITSABLOG</span>
              </Link>
            </div>

            {/* Card */}
            <div className="rounded-3xl border border-black/5 dark:border-white/5 bg-white/80 dark:bg-slate-900/70 backdrop-blur-2xl shadow-2xl p-8 md:p-10">
              {/* Heading */}
              <div className="mb-8">
                <h1 className="text-4xl font-serif tracking-tight mb-3">
                  Welcome Back
                </h1>

                <p className="text-slate-600 dark:text-slate-400 leading-relaxed">
                  Continue your reading journey and reconnect with your favorite
                  stories.
                </p>
              </div>

              {/* Error */}
              {error && (
                <div className="mb-6 rounded-2xl border border-red-200 dark:border-red-900/40 bg-red-50 dark:bg-red-950/20 px-4 py-3 text-sm text-red-600 dark:text-red-400">
                  {error}
                </div>
              )}

              {/* Form */}
              <form onSubmit={handleSubmit} className="space-y-6">
                {/* Email */}
                <div className="space-y-2">
                  <Label htmlFor="email">Email Address</Label>

                  <div className="relative">
                    <Mail
                      size={18}
                      className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400"
                    />

                    <Input
                      id="email"
                      type="email"
                      placeholder="reader@example.com"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      autoComplete="email"
                      required
                      className="h-12 pl-12 rounded-xl border-slate-200 dark:border-slate-700 bg-white/80 dark:bg-slate-950/40"
                    />
                  </div>
                </div>

                {/* Password */}
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <Label htmlFor="password">Password</Label>

                    <button
                      type="button"
                      className="text-sm text-primary hover:underline"
                    >
                      Forgot password?
                    </button>
                  </div>

                  <div className="relative">
                    <Lock
                      size={18}
                      className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400"
                    />

                    <Input
                      id="password"
                      type="password"
                      placeholder="••••••••"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      autoComplete="current-password"
                      required
                      className="h-12 pl-12 rounded-xl border-slate-200 dark:border-slate-700 bg-white/80 dark:bg-slate-950/40"
                    />
                  </div>
                </div>

                {/* Submit */}
                <Button
                  type="submit"
                  disabled={loading}
                  className="w-full h-12 rounded-xl text-base font-medium bg-primary hover:bg-primary/90 shadow-lg shadow-primary/20"
                >
                  {loading ? (
                    "Signing In..."
                  ) : (
                    <>
                      Enter Your Library
                      <ArrowRight className="ml-2" size={18} />
                    </>
                  )}
                </Button>
              </form>

              {/* Divider */}
              <div className="relative my-8">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-slate-200 dark:border-slate-800" />
                </div>

                <div className="relative flex justify-center text-xs uppercase">
                  <span className="bg-white dark:bg-slate-900 px-3 text-slate-500">
                    New to ITSABLOG?
                  </span>
                </div>
              </div>

              {/* Signup */}
              <Button
                variant="outline"
                className="w-full h-12 rounded-xl border-slate-200 dark:border-slate-700"
                onClick={() => router.push("/register")}
              >
                Create an Account
              </Button>
            </div>

            {/* Bottom */}
            <div className="mt-6 text-center text-sm text-slate-500 dark:text-slate-400">
              Your reading sanctuary awaits.
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
