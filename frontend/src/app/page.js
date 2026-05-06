"use client";

import React from "react";
import Link from "next/link";
import { ArrowRight, BookOpen, TrendingUp, Users } from "lucide-react";
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
    <div className="min-h-screen" data-testid="home-page">
      {/* Hero Section */}
      <section className="relative overflow-hidden bg-gradient-to-b from-indigo-50/50 to-transparent dark:from-slate-900/50 dark:to-transparent py-20 md:py-32">
        <div className="container mx-auto px-4 md:px-8 lg:px-12">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div>
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-serif tracking-tight mb-6">
                A sanctuary for the{" "}
                <span className="text-primary">written word</span>
              </h1>
              <p className="text-base md:text-lg leading-relaxed text-slate-600 dark:text-slate-300 mb-8 max-w-xl">
                Discover, review, and share your love for books. Join a
                community of passionate readers exploring everything from
                literary classics to modern masterpieces.
              </p>
              <div className="flex gap-4">
                <Button
                  asChild
                  size="lg"
                  className="bg-primary hover:bg-primary/90 text-white"
                  data-testid="get-started-button"
                >
                  <Link href="/explore">
                    Get Started
                    <ArrowRight className="ml-2" size={20} />
                  </Link>
                </Button>
                {!user && (
                  <Button
                    asChild
                    variant="outline"
                    size="lg"
                    data-testid="join-button"
                  >
                    <Link href="/register">Join Now</Link>
                  </Button>
                )}
              </div>
            </div>
            <div className="hidden md:block">
              <img
                src="https://images.unsplash.com/photo-1767627616213-23c3f3c00520?crop=entropy&cs=srgb&fm=jpg&ixid=M3w3NTY2NjZ8MHwxfHNlYXJjaHw0fHxjb3p5JTIwcmVhZGluZyUyMG5vb2slMjBsaWJyYXJ5fGVufDB8fHx8MTc3Mzc2MTc0Mnww&ixlib=rb-4.1.0&q=85"
                alt="Cozy reading nook"
                className="rounded-2xl shadow-2xl"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="py-16 bg-slate-50 dark:bg-slate-900/50">
        <div className="container mx-auto px-4 md:px-8 lg:px-12">
          <div className="grid md:grid-cols-3 gap-8">
            <div className="text-center p-6">
              <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-primary/10 text-primary mb-4">
                <BookOpen size={32} />
              </div>
              <h3 className="font-serif text-2xl mb-3">Discover</h3>
              <p className="text-slate-600 dark:text-slate-300">
                Explore new releases, timeless classics, and hidden gems across
                all genres
              </p>
            </div>
            <div className="text-center p-6">
              <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-primary/10 text-primary mb-4">
                <TrendingUp size={32} />
              </div>
              <h3 className="font-serif text-2xl mb-3">Review</h3>
              <p className="text-slate-600 dark:text-slate-300">
                Share your thoughts and read reviews from fellow book lovers
              </p>
            </div>
            <div className="text-center p-6">
              <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-primary/10 text-primary mb-4">
                <Users size={32} />
              </div>
              <h3 className="font-serif text-2xl mb-3">Connect</h3>
              <p className="text-slate-600 dark:text-slate-300">
                Build your reading lists and connect with a community of readers
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Trending Books */}
      <section className="py-16">
        <div className="container mx-auto px-4 md:px-8 lg:px-12">
          <div className="flex items-center justify-between mb-8">
            <h2 className="text-3xl md:text-4xl font-serif tracking-tight">
              Trending Now
            </h2>
            <Button asChild variant="ghost" data-testid="view-all-books">
              <Link href="/explore">
                View All <ArrowRight className="ml-2" size={18} />
              </Link>
            </Button>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-6">
            {trendingBooks.map((book) => (
              <BookPoster key={book.id} book={book} />
            ))}
          </div>
        </div>
      </section>

      {/* Recent Reviews */}
      <section className="py-16 bg-slate-50 dark:bg-slate-900/50">
        <div className="container mx-auto px-4 md:px-8 lg:px-12">
          <div className="flex items-center justify-between mb-8">
            <h2 className="text-3xl md:text-4xl font-serif tracking-tight">
              Recent Reviews
            </h2>
          </div>
          <div className="max-w-3xl mx-auto space-y-8">
            {recentReviews.map((review) => (
              <ReviewCard key={review.id} review={review} />
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      {!user && (
        <section className="py-20 bg-gradient-to-br from-indigo-500 to-purple-600 text-white">
          <div className="container mx-auto px-4 md:px-8 lg:px-12 text-center">
            <h2 className="text-3xl md:text-4xl font-serif mb-4">
              Ready to start your reading journey?
            </h2>
            <p className="text-lg mb-8 opacity-90 max-w-2xl mx-auto">
              Join thousands of book lovers discovering their next favorite read
            </p>
            <Button
              asChild
              size="lg"
              variant="secondary"
              data-testid="cta-join-button"
            >
              <Link href="/register">Join ITSABLOG Today</Link>
            </Button>
          </div>
        </section>
      )}
    </div>
  );
}
