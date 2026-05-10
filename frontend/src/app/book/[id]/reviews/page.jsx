"use client";

import React from "react";
import Link from "next/link";
import { useParams } from "next/navigation";

import { ArrowLeft, MessageSquare } from "lucide-react";

import { Button } from "@/components/ui/button";
import { ReviewCard } from "@/components/ReviewCard";

import { useGetBookQuery, useGetBookReviewsQuery } from "@/api/bookApi";

export default function BookReviewsPage() {
  const { id } = useParams();

  // Fetch book details and all reviews
  const { data: bookResponse, isLoading: bookLoading } = useGetBookQuery(id);
  const { data: reviewsResponse, isLoading: reviewsLoading } =
    useGetBookReviewsQuery(id);

  const book = bookResponse?.data || bookResponse;
  const reviews = reviewsResponse?.data || reviewsResponse || [];

  const isLoading = bookLoading || reviewsLoading;

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin w-10 h-10 border-4 border-primary border-t-transparent rounded-full mx-auto mb-4" />
          <p className="text-lg">Loading reviews...</p>
        </div>
      </div>
    );
  }

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
    <div className="min-h-screen bg-background pb-12">
      <div className="container mx-auto px-4 md:px-8 lg:px-12 py-10">
        {/* Header */}
        <div className="mb-12">
          <Button asChild variant="ghost" className="rounded-full mb-8">
            <Link href={`/book/${book._id || book.id}`}>
              <ArrowLeft size={18} className="mr-2" />
              Back to Book
            </Link>
          </Button>

          <div className="flex items-start gap-6">
            <img
              src={book.coverUrl || book.coverImage}
              alt={book.title}
              className="w-28 md:w-36 rounded-2xl shadow-lg border border-border object-cover"
            />

            <div className="pt-2">
              <p className="text-sm uppercase tracking-[0.3em] text-muted-foreground mb-3">
                ALL COMMUNITY REVIEWS
              </p>

              <h1 className="text-4xl md:text-5xl font-serif leading-tight mb-3">
                {book.title}
              </h1>

              <p className="text-lg text-muted-foreground">
                by {book.author?.name || book.author}
              </p>

              <div className="mt-4 flex items-center gap-2 text-sm text-muted-foreground">
                <span>{reviews.length} Reviews</span>
              </div>
            </div>
          </div>
        </div>

        {/* All Reviews */}
        {reviews.length > 0 ? (
          <div className="space-y-8 max-w-3xl">
            {reviews.map((review) => (
              <ReviewCard key={review._id || review.id} review={review} />
            ))}
          </div>
        ) : (
          <div className="border border-border rounded-[2rem] p-20 text-center bg-card">
            <MessageSquare
              size={48}
              className="mx-auto mb-6 text-muted-foreground"
            />
            <h2 className="text-3xl font-serif mb-4">No Reviews Yet</h2>
            <p className="text-muted-foreground max-w-md mx-auto">
              This book hasn’t received any reader impressions yet. Be the first
              to share your thoughts on the book page.
            </p>

            <Button asChild className="mt-8 rounded-2xl" size="lg">
              <Link href={`/book/${book._id || book.id}`}>
                Write the First Review
              </Link>
            </Button>
          </div>
        )}
      </div>
    </div>
  );
}
