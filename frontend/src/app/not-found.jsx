"use client";
import Link from "next/link";
import { BookOpen, Home, ArrowLeft } from "lucide-react";

export default function NotFound() {
  return (
    <main className="min-h-screen flex items-center justify-center px-6 py-16 bg-background text-foreground">
      <div className="max-w-2xl text-center">
        {/* Icon */}
        <div className="flex justify-center mb-6">
          <div className="p-5 rounded-full border border-border bg-card shadow-sm">
            <BookOpen className="w-10 h-10 text-primary" />
          </div>
        </div>

        {/* 404 */}
        <h1 className="text-7xl md:text-8xl font-bold tracking-tight mb-4 text-primary">
          404
        </h1>

        {/* Heading */}
        <h2 className="text-3xl md:text-4xl font-bold mb-4">
          Lost Between The Pages
        </h2>

        {/* Description */}
        <p className="mx-auto text-muted-foreground text-lg leading-relaxed mb-10">
          The page you are looking for may have been removed, renamed, or never
          written at all.
        </p>

        {/* Actions */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
          <Link
            href="/"
            className="inline-flex items-center gap-2 rounded-lg bg-primary text-primary-foreground px-5 py-3 text-sm font-medium transition hover:opacity-90"
          >
            <Home className="w-4 h-4" />
            Return Home
          </Link>

          <button
            onClick={() => window.history.back()}
            className="inline-flex items-center gap-2 rounded-lg border border-border bg-card px-5 py-3 text-sm font-medium transition hover:bg-muted"
          >
            <ArrowLeft className="w-4 h-4" />
            Go Back
          </button>
        </div>

        {/* Bottom quote */}
        <div className="mt-16 border-t border-border pt-6">
          <p className="italic text-muted-foreground text-sm">
            “Every missing page still leaves behind a story.”
          </p>
        </div>
      </div>
    </main>
  );
}
