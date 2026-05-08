"use client";

import React from "react";
import Link from "next/link";

import {
  ArrowRight,
  BookOpen,
  Feather,
  Library,
  Quote,
  Sparkles,
  Users,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import { BookPoster } from "@/components/BookPoster";
import { ReviewCard } from "@/components/ReviewCard";

import { mockBooks, mockReviews } from "@/data/mockData";
import { useAuth } from "@/contexts/AuthContext";

export default function HomePage() {
  const { user } = useAuth();

  const trendingBooks = mockBooks.slice(0, 5);
  const recentReviews = mockReviews.slice(0, 3);

  return (
    <div className="min-h-screen bg-background text-foreground overflow-hidden">
      {/* HERO */}
      <section className="relative border-b border-border">
        {/* Background */}
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,rgba(120,90,60,0.12),transparent_45%)] dark:bg-[radial-gradient(circle_at_top,rgba(255,220,180,0.08),transparent_40%)]" />

        <div className="container relative mx-auto px-4 md:px-8 lg:px-12 py-24 md:py-32">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            {/* Left */}
            <div>
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-border bg-card mb-6">
                <Sparkles size={16} className="text-primary" />

                <span className="text-sm text-muted-foreground">
                  Built for readers, reviewers & collectors
                </span>
              </div>

              <h1 className="font-serif text-5xl md:text-6xl lg:text-7xl leading-tight tracking-tight mb-8">
                A home for people who{" "}
                <span className="text-primary italic">live through books</span>
              </h1>

              <p className="text-lg md:text-xl text-muted-foreground leading-8 max-w-2xl mb-10">
                Track your reads, write thoughtful reviews, discover hidden
                literary gems, and build a reading life surrounded by people who
                love stories as much as you do.
              </p>

              <div className="flex flex-wrap gap-4">
                <Button asChild size="lg" className="h-12 px-8 text-base">
                  <Link href="/explore">
                    Explore Library
                    <ArrowRight className="ml-2" size={18} />
                  </Link>
                </Button>

                {!user && (
                  <Button
                    asChild
                    variant="outline"
                    size="lg"
                    className="h-12 px-8 text-base"
                  >
                    <Link href="/register">Join Community</Link>
                  </Button>
                )}
              </div>

              {/* Reading Stats */}
              <div className="flex flex-wrap gap-8 mt-14">
                <div>
                  <p className="text-3xl font-serif font-bold">20K+</p>
                  <p className="text-sm text-muted-foreground">Book Reviews</p>
                </div>

                <div>
                  <p className="text-3xl font-serif font-bold">8K+</p>
                  <p className="text-sm text-muted-foreground">
                    Active Readers
                  </p>
                </div>

                <div>
                  <p className="text-3xl font-serif font-bold">1.5K+</p>
                  <p className="text-sm text-muted-foreground">Curated Lists</p>
                </div>
              </div>
            </div>

            {/* Right */}
            <div className="relative hidden lg:flex justify-center">
              <div className="absolute inset-0 blur-3xl opacity-20 bg-primary rounded-full" />

              <div className="relative grid grid-cols-2 gap-6 rotate-[-6deg]">
                {trendingBooks.slice(0, 4).map((book) => (
                  <div
                    key={book.id}
                    className="transition-transform hover:scale-105 hover:-translate-y-2 duration-300"
                  >
                    <BookPoster book={book} />
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* FEATURES */}
      <section className="py-24">
        <div className="container mx-auto px-4 md:px-8 lg:px-12">
          <div className="text-center mb-16">
            <p className="uppercase tracking-[0.2em] text-sm text-primary mb-3">
              WHY READERS LOVE ITSABLOG
            </p>

            <h2 className="text-4xl md:text-5xl font-serif tracking-tight">
              More than a book platform
            </h2>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {/* Card */}
            <div className="rounded-3xl border border-border bg-card p-8 shadow-sm hover:shadow-xl transition-all duration-300">
              <div className="w-14 h-14 rounded-2xl bg-primary/10 flex items-center justify-center text-primary mb-6">
                <Library size={28} />
              </div>

              <h3 className="text-2xl font-serif mb-4">Curated Discovery</h3>

              <p className="text-muted-foreground leading-7">
                Find books through thoughtful recommendations, niche lists, and
                reviews from real readers instead of algorithms.
              </p>
            </div>

            {/* Card */}
            <div className="rounded-3xl border border-border bg-card p-8 shadow-sm hover:shadow-xl transition-all duration-300">
              <div className="w-14 h-14 rounded-2xl bg-primary/10 flex items-center justify-center text-primary mb-6">
                <Feather size={28} />
              </div>

              <h3 className="text-2xl font-serif mb-4">Meaningful Reviews</h3>

              <p className="text-muted-foreground leading-7">
                Write deep reflections, annotate memorable quotes, and create a
                personal archive of your reading journey.
              </p>
            </div>

            {/* Card */}
            <div className="rounded-3xl border border-border bg-card p-8 shadow-sm hover:shadow-xl transition-all duration-300">
              <div className="w-14 h-14 rounded-2xl bg-primary/10 flex items-center justify-center text-primary mb-6">
                <Users size={28} />
              </div>

              <h3 className="text-2xl font-serif mb-4">Reader Community</h3>

              <p className="text-muted-foreground leading-7">
                Connect with passionate readers, join clubs, exchange thoughts,
                and build your literary circle.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* TRENDING */}
      <section className="py-24 border-y border-border bg-card/30">
        <div className="container mx-auto px-4 md:px-8 lg:px-12">
          <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-6 mb-12">
            <div>
              <p className="uppercase tracking-[0.2em] text-sm text-primary mb-3">
                TRENDING SHELF
              </p>

              <h2 className="text-4xl md:text-5xl font-serif tracking-tight">
                Books readers can’t stop talking about
              </h2>
            </div>

            <Button asChild variant="ghost">
              <Link href="/explore">
                Browse Library
                <ArrowRight className="ml-2" size={18} />
              </Link>
            </Button>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-8">
            {trendingBooks.map((book) => (
              <BookPoster key={book.id} book={book} />
            ))}
          </div>
        </div>
      </section>

      {/* REVIEWS */}
      <section className="py-24">
        <div className="container mx-auto px-4 md:px-8 lg:px-12">
          <div className="text-center mb-16">
            <div className="inline-flex items-center gap-2 text-primary mb-4">
              <Quote size={18} />
              <span className="uppercase tracking-[0.2em] text-sm">
                READER VOICES
              </span>
            </div>

            <h2 className="text-4xl md:text-5xl font-serif tracking-tight">
              Recent reflections & reviews
            </h2>
          </div>

          <div className="max-w-4xl mx-auto space-y-10">
            {recentReviews.map((review) => (
              <ReviewCard key={review.id} review={review} />
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      {!user && (
        <section className="py-28">
          <div className="container mx-auto px-4 md:px-8 lg:px-12">
            <div className="relative overflow-hidden rounded-[2.5rem] border border-border bg-card px-8 py-20 md:px-16 text-center">
              <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,rgba(120,90,60,0.12),transparent_50%)]" />

              <div className="relative max-w-3xl mx-auto">
                <BookOpen size={42} className="mx-auto text-primary mb-6" />

                <h2 className="text-4xl md:text-5xl font-serif tracking-tight mb-6">
                  Your next favorite book is waiting
                </h2>

                <p className="text-lg text-muted-foreground leading-8 mb-10">
                  Create shelves, track your reading habits, share reviews, and
                  become part of a growing literary community.
                </p>

                <Button asChild size="lg" className="h-12 px-10 text-base">
                  <Link href="/register">
                    Join ITSABLOG
                    <ArrowRight className="ml-2" size={18} />
                  </Link>
                </Button>
              </div>
            </div>
          </div>
        </section>
      )}
    </div>
  );
}
