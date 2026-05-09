"use client";

import React, { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { useRouter, useParams } from "next/navigation";

import {
  ArrowLeft,
  BookmarkPlus,
  Star,
  Calendar,
  FileText,
  Quote,
  BookOpen,
  Clock3,
  Sparkles,
  Heart,
  PenSquare,
  Share2,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { RatingStars } from "@/components/RatingStars";
import { ReviewCard } from "@/components/ReviewCard";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

import { Textarea } from "@/components/ui/textarea";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Card, CardContent } from "@/components/ui/card";

import {
  mockBooks,
  getStoredReviews,
  saveReview,
  getStoredLists,
  saveList,
  addBookToList,
} from "@/data/mockData";

import { useAuth } from "@/contexts/AuthContext";

export default function BookDetailPage() {
  const { id } = useParams();
  const router = useRouter();
  const { user } = useAuth();

  const book = mockBooks.find((b) => b.id === id);

  const [reviewText, setReviewText] = useState("");
  const [rating, setRating] = useState(0);
  const [dialogOpen, setDialogOpen] = useState(false);

  if (!book) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background px-4">
        <div className="text-center max-w-lg">
          <h1 className="text-5xl font-serif mb-4">Book not found</h1>
          <p className="text-muted-foreground leading-8 mb-8">
            The book you’re looking for may no longer exist in the library.
          </p>
          <Button asChild size="lg" className="rounded-2xl">
            <Link href="/explore">Return to Explore</Link>
          </Button>
        </div>
      </div>
    );
  }

  const reviews = getStoredReviews().filter((r) => r.bookId === book.id);

  const averageRating = useMemo(() => {
    if (reviews.length === 0) return book.rating;
    const total = reviews.reduce((acc, review) => acc + review.rating, 0);
    return (total / reviews.length).toFixed(1);
  }, [reviews, book.rating]);

  const handleSubmitReview = () => {
    if (!user) {
      router.push("/login");
      return;
    }
    if (!reviewText.trim() || rating === 0) {
      alert("Please provide a rating and review text");
      return;
    }

    const newReview = {
      id: "rev" + Date.now(),
      userId: user.id,
      userName: user.name,
      userAvatar: user.avatar,
      bookId: book.id,
      bookTitle: book.title,
      content: reviewText,
      rating,
      date: new Date().toISOString(),
      likes: 0,
    };

    saveReview(newReview);
    setReviewText("");
    setRating(0);
    setDialogOpen(false);
    window.location.reload();
  };

  const handleAddToList = () => {
    if (!user) {
      router.push("/login");
      return;
    }

    const lists = getStoredLists();
    const userLists = lists.filter((l) => l.userId === user.id);

    if (userLists.length === 0) {
      const newList = {
        id: "list" + Date.now(),
        userId: user.id,
        name: "My Favorites",
        books: [book.id],
        createdAt: new Date().toISOString(),
      };
      saveList(newList);
      alert('Added to "My Favorites" list!');
    } else {
      addBookToList(userLists[0].id, book.id);
      alert(`Added to "${userLists[0].name}" list!`);
    }
  };

  const handleShare = async () => {
    try {
      if (navigator.share) {
        await navigator.share({
          title: book.title,
          text: book.synopsis?.slice(0, 100) + "...",
          url: window.location.href,
        });
      } else {
        await navigator.clipboard.writeText(window.location.href);
        alert("Link copied to clipboard!");
      }
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 md:px-8 lg:px-12 py-8">
        {/* Back Button */}
        <Button variant="ghost" asChild className="mb-8 rounded-full">
          <Link href="/explore">
            <ArrowLeft className="mr-2" size={18} />
            Back to Explore
          </Link>
        </Button>

        <div className="grid lg:grid-cols-12 gap-10">
          {/* Left Column - Book Cover & Actions */}
          <div className="lg:col-span-5 xl:col-span-4">
            <div className="sticky top-24">
              <div className="relative aspect-[2/3] overflow-hidden rounded-[2rem] shadow-2xl border border-border mb-8">
                <img
                  src={book.coverUrl}
                  alt={book.title}
                  className="w-full h-full object-cover"
                />
              </div>

              {/* Action Buttons */}
              <div className="space-y-4">
                <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
                  <DialogTrigger asChild>
                    <Button
                      size="lg"
                      className="w-full rounded-2xl h-14 text-base"
                    >
                      <PenSquare className="mr-2" size={20} />
                      Write a Review
                    </Button>
                  </DialogTrigger>

                  <DialogContent className="rounded-[2rem] max-w-xl">
                    <DialogHeader>
                      <DialogTitle className="text-3xl font-serif">
                        Share your thoughts
                      </DialogTitle>
                    </DialogHeader>

                    <div className="space-y-6 mt-6">
                      <div>
                        <p className="text-sm text-muted-foreground mb-3">
                          Your Rating
                        </p>
                        <RatingStars
                          rating={rating}
                          interactive
                          onRate={setRating}
                          size={36}
                        />
                      </div>

                      <Textarea
                        value={reviewText}
                        onChange={(e) => setReviewText(e.target.value)}
                        placeholder="What stayed with you after reading this book?"
                        rows={7}
                        className="rounded-2xl resize-none"
                      />

                      <Button
                        onClick={handleSubmitReview}
                        className="w-full rounded-2xl h-12"
                        size="lg"
                      >
                        Submit Review
                      </Button>
                    </div>
                  </DialogContent>
                </Dialog>

                <Button
                  variant="outline"
                  size="lg"
                  onClick={handleAddToList}
                  className="w-full rounded-2xl h-14 text-base"
                >
                  <BookmarkPlus className="mr-2" size={20} />
                  Add to Collection
                </Button>

                <Button
                  variant="outline"
                  size="lg"
                  onClick={handleShare}
                  className="w-full rounded-2xl h-14 text-base"
                >
                  <Share2 className="mr-2" size={20} />
                  Share Book
                </Button>
              </div>
            </div>
          </div>

          {/* Right Column - Book Info */}
          <div className="lg:col-span-7 xl:col-span-8">
            <div className="inline-flex items-center gap-2 px-5 py-2 rounded-full border border-border bg-card mb-6">
              <Sparkles size={16} className="text-primary" />
              <span className="text-sm text-muted-foreground">
                Featured Literary Work
              </span>
            </div>

            <h1 className="text-5xl md:text-6xl font-serif tracking-tight leading-tight mb-4">
              {book.title}
            </h1>

            <Link
              href={`/author/${book.author.toLowerCase().replace(/\s+/g, "-")}`}
              className="text-2xl text-primary hover:underline inline-block mb-8"
            >
              by {book.author}
            </Link>

            {/* Meta Info */}
            <div className="flex flex-wrap gap-4 mb-10">
              <div className="flex items-center gap-3 bg-card border border-border rounded-2xl px-6 py-3">
                <RatingStars rating={Number(averageRating)} size={20} />
                <span className="font-semibold text-lg">{averageRating}</span>
              </div>

              <div className="flex items-center gap-3 bg-card border border-border rounded-2xl px-6 py-3 text-muted-foreground">
                <Calendar size={18} />
                <span>{book.year}</span>
              </div>

              <div className="flex items-center gap-3 bg-card border border-border rounded-2xl px-6 py-3 text-muted-foreground">
                <FileText size={18} />
                <span>{book.pages} pages</span>
              </div>

              <div className="flex items-center gap-3 bg-card border border-border rounded-2xl px-6 py-3 text-muted-foreground">
                <Heart size={18} />
                <span>{reviews.length} reviews</span>
              </div>
            </div>

            {/* Genres */}
            <div className="flex flex-wrap gap-3 mb-12">
              {book.genres?.map((genre) => (
                <Badge
                  key={genre}
                  variant="secondary"
                  className="rounded-full px-5 py-2 text-sm"
                >
                  {genre}
                </Badge>
              ))}
            </div>

            {/* Synopsis */}
            <Card className="rounded-[2rem] border-border mb-12">
              <CardContent className="p-8 md:p-10">
                <div className="flex items-center gap-3 mb-6">
                  <Quote size={22} className="text-primary" />
                  <span className="uppercase tracking-widest text-sm text-muted-foreground">
                    Synopsis
                  </span>
                </div>
                <p className="text-lg leading-relaxed text-foreground">
                  {book.synopsis}
                </p>
              </CardContent>
            </Card>

            {/* Reviews Preview Section */}
            <div>
              <div className="flex items-center justify-between mb-8">
                <div>
                  <h2 className="text-4xl font-serif tracking-tight">
                    Reader Impressions
                  </h2>
                  <p className="text-muted-foreground mt-1">
                    {reviews.length} community reviews
                  </p>
                </div>

                {reviews.length > 0 && (
                  <Button asChild variant="outline" className="rounded-2xl">
                    <Link href={`/book/${book.id}/reviews`}>
                      View All Reviews
                    </Link>
                  </Button>
                )}
              </div>

              {reviews.length > 0 ? (
                <div className="space-y-8">
                  {reviews.slice(0, 3).map((review) => (
                    <ReviewCard key={review.id} review={review} />
                  ))}
                </div>
              ) : (
                <Card className="rounded-[2rem] border-border p-16 text-center">
                  <h3 className="text-3xl font-serif mb-4">No reviews yet</h3>
                  <p className="text-muted-foreground mb-8">
                    Be the first to share your thoughts.
                  </p>

                  <Button
                    onClick={() => setDialogOpen(true)}
                    className="rounded-2xl"
                  >
                    Write the First Review
                  </Button>
                </Card>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
