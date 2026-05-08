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
      setError("Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  if (authLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#f8f5ef] dark:bg-[#0b1120]">
        <div className="w-12 h-12 rounded-full border-4 border-primary/30 border-t-primary animate-spin" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#f8f5ef] dark:bg-[#0b1120] overflow-hidden">
      {/* Glow */}
      <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-purple-300/20 blur-3xl rounded-full translate-x-1/2 -translate-y-1/2" />

      <div className="relative grid lg:grid-cols-2 min-h-screen">
        {/* LEFT SIDE */}
        <div className="hidden lg:flex flex-col justify-between p-14 border-r border-black/5 dark:border-white/5">
          {/* Logo */}
          <Link href="/" className="inline-flex items-center gap-3 group">
            <div className="w-14 h-14 rounded-2xl bg-primary flex items-center justify-center shadow-lg shadow-primary/30">
              <BookOpen className="w-7 h-7 text-white" />
            </div>

            <div>
              <h1 className="text-3xl font-serif font-bold tracking-tight">
                ITSABLOG
              </h1>
              <p className="text-sm text-slate-500 dark:text-slate-400">
                Where readers become storytellers
              </p>
            </div>
          </Link>

          {/* Quote Section */}
          <div className="max-w-xl">
            <div className="mb-6 inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/60 dark:bg-slate-900/60 border border-black/5 dark:border-white/5 backdrop-blur">
              <Sparkles size={16} className="text-primary" />
              <span className="text-sm">Join a world of readers</span>
            </div>

            <Quote className="w-12 h-12 text-primary/30 mb-6" />

            <h2 className="text-5xl leading-tight font-serif tracking-tight mb-6">
              A reader today becomes a storyteller tomorrow.
            </h2>

            <p className="text-lg leading-relaxed text-slate-600 dark:text-slate-300">
              Create your space, share reviews, build reading lists, and connect
              with a global community of book lovers who breathe stories.
            </p>

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
                <div className="text-sm text-slate-500">Readers</div>
              </div>

              <div className="rounded-2xl bg-white/70 dark:bg-slate-900/60 backdrop-blur p-5 border border-black/5 dark:border-white/5">
                <div className="text-3xl font-serif font-bold text-primary">
                  3K+
                </div>
                <div className="text-sm text-slate-500">Lists</div>
              </div>
            </div>
          </div>

          <div className="text-sm text-slate-500 dark:text-slate-400">
            “We are all stories in the end.”
          </div>
        </div>

        {/* RIGHT SIDE */}
        <div className="flex items-center justify-center px-6 py-12 lg:px-12">
          <div className="w-full max-w-md">
            {/* Mobile Logo */}
            <div className="lg:hidden text-center mb-10">
              <Link href="/" className="inline-flex items-center gap-3">
                <div className="w-14 h-14 rounded-2xl bg-primary flex items-center justify-center shadow-lg">
                  <BookOpen className="w-7 h-7 text-white" />
                </div>
                <span className="text-3xl font-serif font-bold">ITSABLOG</span>
              </Link>
            </div>

            {/* Card */}
            <div className="rounded-3xl border border-black/5 dark:border-white/5 bg-white/80 dark:bg-slate-900/70 backdrop-blur-2xl shadow-2xl p-8 md:p-10">
              {/* Header */}
              <div className="mb-8">
                <h1 className="text-4xl font-serif mb-3">Create Account</h1>
                <p className="text-slate-600 dark:text-slate-400">
                  Start your reading journey and join the library of minds.
                </p>
              </div>

              {/* Error */}
              {error && (
                <div className="mb-6 text-sm text-red-500 bg-red-50 dark:bg-red-950/20 p-3 rounded-xl">
                  {error}
                </div>
              )}

              {/* Form */}
              <form onSubmit={handleSubmit} className="space-y-5">
                {/* Username */}
                <div className="space-y-2">
                  <Label>Username</Label>
                  <div className="relative">
                    <User
                      className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400"
                      size={18}
                    />
                    <Input
                      value={username}
                      onChange={(e) => setUsername(e.target.value)}
                      placeholder="booklover123"
                      className="h-12 pl-12 rounded-xl"
                    />
                  </div>
                </div>

                {/* Email */}
                <div className="space-y-2">
                  <Label>Email</Label>
                  <div className="relative">
                    <Mail
                      className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400"
                      size={18}
                    />
                    <Input
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="reader@example.com"
                      type="email"
                      className="h-12 pl-12 rounded-xl"
                    />
                  </div>
                </div>

                {/* Password */}
                <div className="space-y-2">
                  <Label>Password</Label>
                  <div className="relative">
                    <Lock
                      className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400"
                      size={18}
                    />
                    <Input
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      type="password"
                      className="h-12 pl-12 rounded-xl"
                    />
                  </div>
                </div>

                {/* Confirm */}
                <div className="space-y-2">
                  <Label>Confirm Password</Label>
                  <div className="relative">
                    <Lock
                      className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400"
                      size={18}
                    />
                    <Input
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      type="password"
                      className="h-12 pl-12 rounded-xl"
                    />
                  </div>
                </div>

                {/* Submit */}
                <Button
                  type="submit"
                  disabled={loading}
                  className="w-full h-12 rounded-xl bg-primary hover:bg-primary/90"
                >
                  {loading ? (
                    "Creating..."
                  ) : (
                    <>
                      Create Account
                      <ArrowRight className="ml-2" size={18} />
                    </>
                  )}
                </Button>
              </form>

              {/* Footer */}
              <div className="mt-8 text-center text-sm text-slate-500">
                Already have an account?{" "}
                <Link href="/login" className="text-primary hover:underline">
                  Sign in
                </Link>
              </div>
            </div>

            <div className="mt-6 text-center text-sm text-slate-500">
              Your reading world starts here.
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
