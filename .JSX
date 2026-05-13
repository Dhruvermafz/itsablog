"use client";
import React, { useMemo, useState } from "react";
import Link from "next/link";
import { useRouter, useParams } from "next/navigation";
import {
  ArrowLeft,
  BookmarkPlus,
  Calendar,
  FileText,
  Quote,
  Sparkles,
  Heart,
  PenSquare,
  Share2,
  Flame,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { RatingStars } from "@/components/RatingStars";
import { ReviewCard } from "@/components/ReviewCard";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent } from "@/components/ui/card";

import {
  useGetBookQuery,
  useGetBookReviewsQuery,
  useCreateReviewMutation,
} from "@/api/bookApi";

import {
  useGetMyListsQuery, // ← Added
  useAddItemMutation, // ← Added
} from "@/api/listApi";

import { useAuth } from "@/contexts/AuthContext";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

export default function BookDetailPage() {
  const { id } = useParams();
  const router = useRouter();
  const { user } = useAuth();

  const [reviewText, setReviewText] = useState("");
  const [rating, setRating] = useState(0);
  const [selectedListId, setSelectedListId] = useState < string > "";
  const [addDialogOpen, setAddDialogOpen] = useState(false);

  // RTK Queries
  const { data: bookResponse, isLoading, error } = useGetBookQuery(id);
  const { data: reviewsResponse, refetch: refetchReviews } =
    useGetBookReviewsQuery(id);

  const { data: myListsResponse, isLoading: listsLoading } = useGetMyListsQuery(
    undefined,
    {
      skip: !user,
    },
  );

  const [createReview] = useCreateReviewMutation();
  const [addItem, { isLoading: isAdding }] = useAddItemMutation();

  const book = bookResponse?.data || bookResponse;
  const reviews = reviewsResponse?.data || reviewsResponse || [];
  const myLists = myListsResponse?.data || [];

  const averageRating = useMemo(() => {
    if (reviews.length === 0) return book?.avgRating || book?.rating || 0;
    const total = reviews.reduce(
      (acc, review) => acc + (review.rating || 0),
      0,
    );
    return (total / reviews.length).toFixed(1);
  }, [reviews, book]);

  const topReviews = useMemo(() => {
    return [...reviews]
      .sort((a, b) => {
        const impressionsA = a.likes || a.impressions || a.rating || 0;
        const impressionsB = b.likes || b.impressions || b.rating || 0;
        return impressionsB - impressionsA;
      })
      .slice(0, 15);
  }, [reviews]);

  const authorName = book?.author?.name || book?.author || "Unknown Author";
  const authorId = book?.author?._id || null;

  // Add book to list
  const handleAddToList = async () => {
    if (!selectedListId) {
      alert("Please select a list");
      return;
    }

    try {
      await addItem({
        listId: selectedListId,
        bookId: id, // or book._id depending on your API
      }).unwrap();

      alert("Book added to your list successfully!");
      setAddDialogOpen(false);
      setSelectedListId("");
    } catch (err) {
      console.error(err);
      alert(err?.data?.message || "Failed to add book to list");
    }
  };

  const handleSubmitReview = async () => {
    if (!user) {
      router.push("/login");
      return;
    }
    if (!reviewText.trim() || rating === 0) {
      alert("Please provide both a rating and review text");
      return;
    }

    try {
      await createReview({
        bookId: id,
        content: reviewText,
        rating,
      }).unwrap();

      setReviewText("");
      setRating(0);
      alert("Thank you! Your review has been submitted.");
      refetchReviews();
    } catch (err) {
      console.error(err);
      alert("Failed to submit review. Please try again.");
    }
  };

  const handleShare = async () => {
    try {
      if (navigator.share) {
        await navigator.share({
          title: book?.title,
          text: book?.synopsis?.slice(0, 120) + "...",
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

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center px-4">
        <div className="text-center">
          <div className="animate-spin w-8 h-8 border-4 border-primary border-t-transparent rounded-full mx-auto mb-4" />
          <p className="text-sm">Loading book details...</p>
        </div>
      </div>
    );
  }

  if (error || !book) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background px-4">
        <div className="text-center max-w-lg">
          <h1 className="text-4xl font-serif mb-4">Book not found</h1>
          <p className="text-muted-foreground mb-8 leading-relaxed">
            The book you’re looking for may no longer exist in the library.
          </p>
          <Button asChild size="lg" className="rounded-2xl w-full">
            <Link href="/explore">Return to Explore</Link>
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background pb-12">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 xl:px-12 py-6 sm:py-8">
        {/* Back Button */}
        <Button
          variant="ghost"
          asChild
          className="mb-6 -ml-2 text-sm font-medium"
        >
          <Link href="/explore" className="flex items-center gap-2">
            <ArrowLeft size={20} />
            Back to Explore
          </Link>
        </Button>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12">
          {/* LEFT COLUMN - Cover & Actions */}
          <div className="lg:col-span-5 xl:col-span-4">
            <div className="lg:sticky lg:top-24 space-y-6">
              <div className="relative aspect-[2/3] overflow-hidden rounded-3xl shadow-2xl border border-border mx-auto max-w-[280px] sm:max-w-sm lg:max-w-none">
                <img
                  src={book.coverUrl || book.coverImage}
                  alt={book.title}
                  className="w-full h-full object-cover"
                />
              </div>

              <div className="space-y-3 px-1">
                <Dialog open={addDialogOpen} onOpenChange={setAddDialogOpen}>
                  <DialogTrigger asChild>
                    <Button
                      variant="outline"
                      size="lg"
                      className="w-full rounded-2xl h-14 text-base font-medium"
                      disabled={!user}
                    >
                      <BookmarkPlus className="mr-3" size={20} />
                      Add to Collection
                    </Button>
                  </DialogTrigger>

                  <DialogContent className="rounded-[2rem]">
                    <DialogHeader>
                      <DialogTitle className="font-serif text-2xl">
                        Add to List
                      </DialogTitle>
                    </DialogHeader>

                    <div className="space-y-6 py-4">
                      <div>
                        <Label>Select List</Label>
                        <Select
                          value={selectedListId}
                          onValueChange={setSelectedListId}
                        >
                          <SelectTrigger>
                            <SelectValue placeholder="Choose a list..." />
                          </SelectTrigger>
                          <SelectContent>
                            {myLists.length > 0 ? (
                              myLists.map((list) => (
                                <SelectItem
                                  key={list._id || list.id}
                                  value={list._id || list.id}
                                >
                                  {list.title || list.name}
                                </SelectItem>
                              ))
                            ) : (
                              <SelectItem value="" disabled>
                                You have no lists yet
                              </SelectItem>
                            )}
                          </SelectContent>
                        </Select>
                      </div>

                      <Button
                        onClick={handleAddToList}
                        className="w-full rounded-2xl"
                        disabled={isAdding || !selectedListId}
                      >
                        {isAdding ? "Adding..." : "Add Book to List"}
                      </Button>

                      {myLists.length === 0 && (
                        <p className="text-sm text-center text-muted-foreground">
                          Create a list from your profile first.
                        </p>
                      )}
                    </div>
                  </DialogContent>
                </Dialog>

                <Button
                  variant="outline"
                  size="lg"
                  onClick={handleShare}
                  className="w-full rounded-2xl h-14 text-base font-medium"
                >
                  <Share2 className="mr-3" size={20} />
                  Share Book
                </Button>
              </div>
            </div>
          </div>

          {/* RIGHT COLUMN - Content */}
          <div className="lg:col-span-7 xl:col-span-8">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-border bg-card mb-6">
              <Sparkles size={16} className="text-primary" />
              <span className="text-xs font-medium tracking-wider text-muted-foreground">
                FEATURED LITERARY WORK
              </span>
            </div>

            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-serif tracking-tighter leading-tight mb-3">
              {book.title}
            </h1>

            <Link
              href={authorId ? `/author/${authorId}` : "#"}
              className="text-xl sm:text-2xl text-primary hover:underline inline-block mb-8"
            >
              by {authorName}
            </Link>

            {/* Meta Information */}
            <div className="flex flex-wrap gap-3 mb-10">
              <div className="flex items-center gap-3 bg-card border border-border rounded-2xl px-5 py-3">
                <RatingStars rating={Number(averageRating)} size={20} />
                <span className="font-semibold text-lg">{averageRating}</span>
              </div>

              {book.year && (
                <div className="flex items-center gap-3 bg-card border border-border rounded-2xl px-5 py-3 text-muted-foreground">
                  <Calendar size={18} />
                  <span>{book.year}</span>
                </div>
              )}

              {book.pages && book.pages > 0 && (
                <div className="flex items-center gap-3 bg-card border border-border rounded-2xl px-5 py-3 text-muted-foreground">
                  <FileText size={18} />
                  <span>{book.pages} pages</span>
                </div>
              )}

              <div className="flex items-center gap-3 bg-card border border-border rounded-2xl px-5 py-3 text-muted-foreground">
                <Heart size={18} />
                <span>{reviews.length} reviews</span>
              </div>
            </div>

            {/* Genres */}
            <div className="flex flex-wrap gap-2 mb-10">
              {book.genres?.map((genre) => (
                <Badge
                  key={genre}
                  variant="secondary"
                  className="rounded-full px-5 py-1.5 text-sm"
                >
                  {genre}
                </Badge>
              ))}
            </div>

            {/* Synopsis */}
            <Card className="rounded-3xl border-border mb-12">
              <CardContent className="p-6 sm:p-8 md:p-10">
                <div className="flex items-center gap-3 mb-5">
                  <Quote size={22} className="text-primary" />
                  <span className="uppercase tracking-[2px] text-xs text-muted-foreground font-medium">
                    Synopsis
                  </span>
                </div>
                <p className="text-[17px] leading-relaxed text-foreground">
                  {book.synopsis}
                </p>
              </CardContent>
            </Card>

            {/* ==================== READER IMPRESSIONS SECTION ==================== */}
            <div>
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-8">
                <div>
                  <h2 className="text-3xl sm:text-4xl font-serif tracking-tight">
                    Reader Impressions
                  </h2>
                  <p className="text-muted-foreground mt-1">
                    {reviews.length} community reviews
                  </p>
                </div>

                {reviews.length > 0 && (
                  <Button asChild variant="outline" className="rounded-2xl">
                    <Link href={`/book/${book._id || book.id}/reviews`}>
                      View All Reviews
                    </Link>
                  </Button>
                )}
              </div>

              {/* Write Review Form - Directly Visible */}
              <Card className="rounded-3xl p-6 mb-10 border-border">
                <div className="flex items-center gap-3 mb-4">
                  <PenSquare className="text-primary" size={22} />
                  <h3 className="font-semibold text-lg">Share your thoughts</h3>
                </div>

                <div className="mb-4">
                  <p className="text-sm text-muted-foreground mb-2">
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
                  placeholder="What stayed with you after reading this book?..."
                  rows={5}
                  className="rounded-2xl resize-none mb-4"
                />

                <Button
                  onClick={handleSubmitReview}
                  className="rounded-2xl px-8"
                  disabled={!reviewText.trim() || rating === 0}
                >
                  Post Review
                </Button>
              </Card>

              {/* Top 15 Reviews */}
              {topReviews.length > 0 ? (
                <div className="space-y-8">
                  {topReviews.map((review) => {
                    const hasHighImpression =
                      (review.likes || review.impressions || 0) >= 5;
                    return (
                      <div key={review._id || review.id} className="relative">
                        {hasHighImpression && (
                          <div className="absolute -top-3 -right-2 bg-orange-500 text-white text-xs px-2.5 py-1 rounded-full flex items-center gap-1 font-medium z-10">
                            <Flame size={14} />
                            Popular
                          </div>
                        )}
                        <ReviewCard review={review} />
                      </div>
                    );
                  })}
                </div>
              ) : (
                <Card className="rounded-3xl p-12 text-center">
                  <p className="text-muted-foreground mb-6">
                    No reviews yet. Be the first to share your impression!
                  </p>
                </Card>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
