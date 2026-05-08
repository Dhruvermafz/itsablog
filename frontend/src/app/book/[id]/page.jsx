"use client";

import React, { useMemo, useState } from "react";

import Link from "next/link";

import { useParams, useRouter } from "next/navigation";

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

          <Button asChild size="lg">
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
          text: book.synopsis,
          url: window.location.href,
        });
      } else {
        await navigator.clipboard.writeText(window.location.href);

        alert("Link copied to clipboard!");
      }
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <div className="min-h-screen bg-background text-foreground">
      {/* HERO */}
      <section className="relative overflow-hidden border-b border-border">
        {/* Background */}
        <div className="absolute inset-0">
          <img
            src={book.coverUrl}
            alt={book.title}
            className="w-full h-full object-cover blur-3xl scale-125 opacity-20"
          />

          <div className="absolute inset-0 bg-gradient-to-b from-background/40 via-background/90 to-background" />
        </div>

        {/* Content */}
        <div className="relative container mx-auto px-4 md:px-8 lg:px-12 py-12 md:py-20">
          {/* Back */}
          <Button variant="ghost" asChild className="mb-10 rounded-full">
            <Link href="/explore">
              <ArrowLeft className="mr-2" size={18} />
              Back to Explore
            </Link>
          </Button>

          <div className="grid lg:grid-cols-[420px_1fr] gap-16 items-start">
            {/* LEFT */}
            <div>
              {/* Cover */}
              <div className="relative group">
                <div className="absolute inset-0 bg-primary/20 blur-3xl scale-95 opacity-70" />

                <div className="relative aspect-[2/3] overflow-hidden rounded-[2rem] shadow-2xl border border-border">
                  <img
                    src={book.coverUrl}
                    alt={book.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                  />
                </div>
              </div>

              {/* Actions */}
              <div className="mt-8 space-y-4">
                {/* Review Dialog */}
                <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
                  <DialogTrigger asChild>
                    <Button
                      size="lg"
                      className="w-full rounded-2xl h-14 text-base"
                    >
                      <PenSquare className="mr-2" size={18} />
                      Write a Review
                    </Button>
                  </DialogTrigger>

                  <DialogContent className="sm:max-w-2xl rounded-[2rem] border-border">
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
                          size={34}
                        />
                      </div>

                      <Textarea
                        value={reviewText}
                        onChange={(e) => setReviewText(e.target.value)}
                        placeholder="What stayed with you after reading this book?"
                        rows={8}
                        className="rounded-2xl resize-none"
                      />

                      <Button
                        onClick={handleSubmitReview}
                        className="rounded-2xl"
                      >
                        Submit Review
                      </Button>
                    </div>
                  </DialogContent>
                </Dialog>

                {/* Add to List */}
                <Button
                  variant="outline"
                  size="lg"
                  onClick={handleAddToList}
                  className="w-full rounded-2xl h-14 text-base"
                >
                  <BookmarkPlus className="mr-2" size={18} />
                  Add to Collection
                </Button>

                {/* Share */}
                <Button
                  variant="ghost"
                  size="lg"
                  onClick={handleShare}
                  className="w-full rounded-2xl h-14 text-base"
                >
                  <Share2 className="mr-2" size={18} />
                  Share Book
                </Button>
              </div>
            </div>

            {/* RIGHT */}
            <div className="max-w-4xl">
              {/* Badge */}
              <div className="inline-flex items-center gap-2 px-5 py-2 rounded-full border border-border bg-card mb-6">
                <Sparkles size={16} className="text-primary" />

                <span className="text-sm text-muted-foreground">
                  Featured Literary Work
                </span>
              </div>

              {/* Title */}
              <h1 className="text-5xl md:text-7xl font-serif leading-tight tracking-tight mb-5">
                {book.title}
              </h1>

              {/* Author */}
              <Link
                href={`/author/${book.author
                  .toLowerCase()
                  .replace(/\s+/g, "-")}`}
                className="inline-flex items-center text-xl md:text-2xl text-primary hover:opacity-80 transition-opacity mb-8"
              >
                by {book.author}
              </Link>

              {/* Meta */}
              <div className="flex flex-wrap items-center gap-5 mb-8">
                <div className="flex items-center gap-3 px-5 py-3 rounded-full bg-card border border-border">
                  <RatingStars rating={Number(averageRating)} size={18} />

                  <span className="font-semibold">{averageRating}</span>
                </div>

                <div className="flex items-center gap-2 px-5 py-3 rounded-full bg-card border border-border text-muted-foreground">
                  <Calendar size={16} />

                  <span>{book.year}</span>
                </div>

                <div className="flex items-center gap-2 px-5 py-3 rounded-full bg-card border border-border text-muted-foreground">
                  <FileText size={16} />

                  <span>{book.pages} pages</span>
                </div>

                <div className="flex items-center gap-2 px-5 py-3 rounded-full bg-card border border-border text-muted-foreground">
                  <Heart size={16} />

                  <span>{reviews.length} reviews</span>
                </div>
              </div>

              {/* Genres */}
              <div className="flex flex-wrap gap-3 mb-10">
                {book.genres.map((genre) => (
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
              <Card className="rounded-[2rem] border-border bg-card/60 backdrop-blur-sm mb-12">
                <CardContent className="p-8 md:p-10">
                  <div className="inline-flex items-center gap-2 text-primary mb-5">
                    <Quote size={18} />

                    <span className="uppercase tracking-[0.2em] text-sm">
                      Synopsis
                    </span>
                  </div>

                  <p className="text-lg leading-9 text-muted-foreground">
                    {book.synopsis}
                  </p>
                </CardContent>
              </Card>

              {/* Reviews */}
              <div>
                <div className="flex items-center justify-between gap-5 mb-10">
                  <div>
                    <div className="inline-flex items-center gap-2 text-primary mb-3">
                      <BookOpen size={18} />

                      <span className="uppercase tracking-[0.2em] text-sm">
                        Community Reviews
                      </span>
                    </div>

                    <h2 className="text-4xl md:text-5xl font-serif tracking-tight">
                      Reader impressions
                    </h2>
                  </div>

                  <div className="hidden md:flex items-center gap-2 text-muted-foreground">
                    <Clock3 size={18} />

                    <span>{reviews.length} published thoughts</span>
                  </div>
                </div>

                {/* Reviews List */}
                {reviews.length > 0 ? (
                  <div className="space-y-8">
                    {reviews.map((review) => (
                      <ReviewCard key={review.id} review={review} />
                    ))}
                  </div>
                ) : (
                  <Card className="rounded-[2rem] border-border bg-card">
                    <CardContent className="p-16 text-center">
                      <h3 className="text-3xl font-serif mb-4">
                        No reviews yet
                      </h3>

                      <p className="text-lg text-muted-foreground mb-8">
                        Be the first reader to share your thoughts about this
                        book.
                      </p>

                      <Button
                        onClick={() => setDialogOpen(true)}
                        className="rounded-2xl"
                      >
                        Write First Review
                      </Button>
                    </CardContent>
                  </Card>
                )}
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
