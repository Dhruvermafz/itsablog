"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import {
  ArrowLeft,
  BookmarkPlus,
  Star,
  Calendar,
  FileText,
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
  const { id } = useParams(); // ✅ FIXED
  const { user } = useAuth();
  const router = useRouter();

  const book = mockBooks.find((b) => b.id === id);

  const [reviewText, setReviewText] = useState("");
  const [rating, setRating] = useState(0);
  const [dialogOpen, setDialogOpen] = useState(false);

  if (!book) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-serif mb-4">Book not found</h1>
          <Button asChild>
            <Link href="/explore">Back to Explore</Link>
          </Button>
        </div>
      </div>
    );
  }

  const reviews = getStoredReviews().filter((r) => r.bookId === book.id);

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

  return (
    <div className="min-h-screen py-8" data-testid="book-detail-page">
      <div className="container mx-auto px-4 md:px-8 lg:px-12">
        {/* Back Button */}
        <Button variant="ghost" asChild className="mb-6">
          <Link href="/explore">
            <ArrowLeft className="mr-2" size={18} />
            Back to Explore
          </Link>
        </Button>

        <div className="grid md:grid-cols-3 gap-12">
          {/* Left Column */}
          <div className="md:col-span-1">
            <div className="sticky top-24">
              <div className="aspect-[2/3] rounded-2xl overflow-hidden shadow-2xl mb-6">
                <img
                  src={book.coverUrl}
                  alt={book.title}
                  className="w-full h-full object-cover"
                />
              </div>

              <div className="space-y-3">
                <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
                  <DialogTrigger asChild>
                    <Button className="w-full">
                      <Star className="mr-2" size={18} />
                      Write a Review
                    </Button>
                  </DialogTrigger>

                  <DialogContent>
                    <DialogHeader>
                      <DialogTitle className="text-2xl">
                        Write Your Review
                      </DialogTitle>
                    </DialogHeader>

                    <div className="space-y-4 mt-4">
                      <RatingStars
                        rating={rating}
                        interactive
                        onRate={setRating}
                        size={32}
                      />

                      <Textarea
                        value={reviewText}
                        onChange={(e) => setReviewText(e.target.value)}
                        placeholder="Share your thoughts..."
                        rows={6}
                      />

                      <Button onClick={handleSubmitReview}>
                        Submit Review
                      </Button>
                    </div>
                  </DialogContent>
                </Dialog>

                <Button variant="outline" onClick={handleAddToList}>
                  <BookmarkPlus className="mr-2" size={18} />
                  Add to List
                </Button>
              </div>
            </div>
          </div>

          {/* Right Column */}
          <div className="md:col-span-2">
            <h1 className="text-4xl font-serif mb-4">{book.title}</h1>

            <Link
              href={`/author/${book.author.toLowerCase().replace(/\s+/g, "-")}`}
              className="text-xl text-primary hover:underline mb-6 inline-block"
            >
              by {book.author}
            </Link>

            <div className="flex items-center gap-6 mb-6">
              <RatingStars rating={book.rating} size={20} />
              <span>{book.year}</span>
              <span>{book.pages} pages</span>
            </div>

            <div className="flex flex-wrap gap-2 mb-8">
              {book.genres.map((genre) => (
                <Badge key={genre}>{genre}</Badge>
              ))}
            </div>

            <p className="mb-12 text-slate-600 dark:text-slate-300">
              {book.synopsis}
            </p>

            {/* Reviews */}
            <h2 className="text-2xl font-serif mb-6">
              Reviews ({reviews.length})
            </h2>

            {reviews.length > 0 ? (
              reviews.map((review) => (
                <ReviewCard key={review.id} review={review} />
              ))
            ) : (
              <div className="text-center py-12">No reviews yet.</div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
