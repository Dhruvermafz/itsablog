"use client";

import React from "react";
import Link from "next/link";
import { useParams } from "next/navigation";

import { ArrowLeft, MessageSquare } from "lucide-react";

import { Button } from "@/components/ui/button";
import { ReviewCard } from "@/components/ReviewCard";

import { mockBooks, getStoredReviews } from "@/data/mockData";

export default function BookReviewsPage() {
  const { id } = useParams();

  const book = mockBooks.find((b) => b.id === id);

  const reviews = getStoredReviews().filter((review) => review.bookId === id);

  if (!book) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-4xl font-serif mb-4">Book not found</h1>

          <Button asChild>
            <Link href="/explore">Back to Explore</Link>
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 md:px-8 lg:px-12 py-10">
        {/* Header */}
        <div className="mb-12">
          <Button asChild variant="ghost" className="rounded-full mb-6">
            <Link href={`/book/${book.id}`}>
              <ArrowLeft size={18} className="mr-2" />
              Back to Book
            </Link>
          </Button>

          <div className="flex items-start gap-6">
            <img
              src={book.coverUrl}
              alt={book.title}
              className="w-28 md:w-36 rounded-2xl shadow-lg border border-border"
            />

            <div>
              <p className="text-sm uppercase tracking-[0.3em] text-muted-foreground mb-3">
                Community Reviews
              </p>

              <h1 className="text-4xl md:text-5xl font-serif leading-tight mb-3">
                {book.title}
              </h1>

              <p className="text-lg text-muted-foreground">by {book.author}</p>
            </div>
          </div>
        </div>

        {/* Reviews */}
        {reviews.length > 0 ? (
          <div className="space-y-8">
            {reviews.map((review) => (
              <ReviewCard key={review.id} review={review} />
            ))}
          </div>
        ) : (
          <div className="border border-border rounded-[2rem] p-20 text-center bg-card">
            <MessageSquare
              size={48}
              className="mx-auto mb-6 text-muted-foreground"
            />

            <h2 className="text-3xl font-serif mb-4">No Reviews Yet</h2>

            <p className="text-muted-foreground">
              This book has not received any reader impressions yet.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
