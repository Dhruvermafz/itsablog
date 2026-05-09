"use client";

import React, { useState } from "react";
import Link from "next/link";

import { ArrowLeft, Mail, Sparkles, CheckCircle2 } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState("");
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!email.trim()) return;

    // Simulate email send
    setSubmitted(true);
  };

  return (
    <div className="min-h-screen bg-background flex items-center justify-center px-6 py-12 relative overflow-hidden">
      {/* Background */}
      <div className="absolute inset-0">
        <div className="absolute inset-0 bg-gradient-to-br from-primary/10 via-background to-background" />
        <div className="absolute top-0 left-0 w-[450px] h-[450px] bg-primary/10 rounded-full blur-3xl -translate-x-1/2 -translate-y-1/2" />
        <div className="absolute bottom-0 right-0 w-[350px] h-[350px] bg-accent/10 rounded-full blur-3xl" />
      </div>

      <div className="relative w-full max-w-lg">
        <Link
          href="/login"
          className="inline-flex items-center text-sm text-muted-foreground hover:text-foreground mb-8"
        >
          <ArrowLeft size={16} className="mr-2" />
          Back to Login
        </Link>

        <div className="rounded-[2rem] border border-border bg-card/80 backdrop-blur-2xl shadow-xl p-8 md:p-10">
          {!submitted ? (
            <>
              <div className="mb-8">
                <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-border bg-background mb-6">
                  <Sparkles size={16} className="text-primary" />
                  <span className="text-sm text-muted-foreground">
                    Secure Account Recovery
                  </span>
                </div>

                <h1 className="text-4xl font-serif tracking-tight mb-4">
                  Forgot Password?
                </h1>

                <p className="text-muted-foreground leading-relaxed">
                  Enter your email address and we'll send you a secure link to
                  reset your password.
                </p>
              </div>

              <form onSubmit={handleSubmit} className="space-y-6">
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
                      placeholder="reader@example.com"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="h-12 pl-12 rounded-2xl"
                      required
                    />
                  </div>
                </div>

                <Button
                  type="submit"
                  className="w-full h-12 rounded-2xl text-base"
                >
                  Send Reset Link
                </Button>
              </form>
            </>
          ) : (
            <div className="text-center py-6">
              <div className="w-20 h-20 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-6">
                <CheckCircle2 className="w-10 h-10 text-primary" />
              </div>

              <h2 className="text-4xl font-serif mb-4">Check Your Inbox</h2>

              <p className="text-muted-foreground leading-relaxed mb-8">
                A password reset link has been sent to:
              </p>

              <div className="rounded-2xl bg-background border border-border px-5 py-4 mb-8 font-medium">
                {email}
              </div>

              <Button asChild className="rounded-2xl h-12 px-8">
                <Link href="/login">Return to Login</Link>
              </Button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
