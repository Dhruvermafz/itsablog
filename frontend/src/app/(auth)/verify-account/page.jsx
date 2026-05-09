"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";

import { MailCheck, Sparkles, Loader2, CheckCircle2 } from "lucide-react";

import { Button } from "@/components/ui/button";

export default function VerifyAccountPage() {
  const [verifying, setVerifying] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setVerifying(false);
    }, 2500);

    return () => clearTimeout(timer);
  }, []);

  return (
    <div className="min-h-screen bg-background flex items-center justify-center px-6 py-12 relative overflow-hidden">
      {/* Background */}
      <div className="absolute inset-0">
        <div className="absolute inset-0 bg-gradient-to-br from-primary/10 via-background to-background" />
        <div className="absolute top-0 left-0 w-[500px] h-[500px] bg-primary/10 rounded-full blur-3xl -translate-x-1/2 -translate-y-1/2" />
        <div className="absolute bottom-0 right-0 w-[400px] h-[400px] bg-accent/10 rounded-full blur-3xl" />
      </div>

      <div className="relative w-full max-w-xl">
        <div className="rounded-[2rem] border border-border bg-card/80 backdrop-blur-2xl shadow-xl p-10 md:p-14 text-center">
          {verifying ? (
            <>
              <div className="w-24 h-24 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-8">
                <Loader2 className="w-12 h-12 text-primary animate-spin" />
              </div>

              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-border bg-background mb-6">
                <Sparkles size={16} className="text-primary" />
                <span className="text-sm text-muted-foreground">
                  Verifying Your Account
                </span>
              </div>

              <h1 className="text-5xl font-serif tracking-tight mb-6">
                One Moment...
              </h1>

              <p className="text-lg leading-relaxed text-muted-foreground max-w-lg mx-auto">
                We're securely confirming your account details and preparing
                your reading sanctuary.
              </p>
            </>
          ) : (
            <>
              <div className="w-24 h-24 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-8">
                <CheckCircle2 className="w-12 h-12 text-primary" />
              </div>

              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-border bg-background mb-6">
                <MailCheck size={16} className="text-primary" />
                <span className="text-sm text-muted-foreground">
                  Account Successfully Verified
                </span>
              </div>

              <h1 className="text-5xl font-serif tracking-tight mb-6">
                Welcome to ITSABLOG
              </h1>

              <p className="text-lg leading-relaxed text-muted-foreground max-w-lg mx-auto mb-10">
                Your account is now active. Discover unforgettable stories,
                thoughtful reviews, and a passionate reading community.
              </p>

              <Button asChild size="lg" className="rounded-2xl h-12 px-8">
                <Link href="/login">Continue to Login</Link>
              </Button>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
