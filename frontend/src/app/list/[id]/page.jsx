"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import { ArrowLeft, Heart, Users, BookOpen, Share2 } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { BookPoster } from "@/components/BookPoster";

import {
  getListById,
  likeList,
  followList,
  isListLiked,
  isListFollowed,
} from "@/data/publicListsData";

import { mockBooks } from "@/data/mockData";
import { useAuth } from "@/contexts/AuthContext";

export default function ListDetailPage() {
  const { id } = useParams(); // ✅ FIXED
  const { user } = useAuth();
  const router = useRouter();

  const list = getListById(id);

  const [liked, setLiked] = useState(user ? isListLiked(user.id, id) : false);
  const [followed, setFollowed] = useState(
    user ? isListFollowed(user.id, id) : false,
  );
  const [likeCount, setLikeCount] = useState(list?.likes || 0);
  const [followerCount, setFollowerCount] = useState(list?.followers || 0);

  if (!list) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-serif mb-4">List not found</h1>
          <Button asChild>
            <Link href="/lists">Back to Lists</Link>
          </Button>
        </div>
      </div>
    );
  }

  const listBooks = mockBooks.filter((book) => list.books.includes(book.id));

  const handleLike = () => {
    if (!user) {
      router.push("/login");
      return;
    }

    if (!liked) {
      const success = likeList(user.id, list.id);
      if (success) {
        setLiked(true);
        setLikeCount((prev) => prev + 1);
      }
    }
  };

  const handleFollow = () => {
    if (!user) {
      router.push("/login");
      return;
    }

    if (!followed) {
      const success = followList(user.id, list.id);
      if (success) {
        setFollowed(true);
        setFollowerCount((prev) => prev + 1);
      }
    }
  };

  const handleShare = () => {
    if (navigator.share) {
      navigator.share({
        title: list.name,
        text: list.description,
        url: window.location.href,
      });
    } else {
      navigator.clipboard.writeText(window.location.href);
      alert("Link copied to clipboard!");
    }
  };

  return (
    <div className="min-h-screen py-8" data-testid="list-detail-page">
      <div className="container mx-auto px-4 md:px-8 lg:px-12">
        {/* Back Button */}
        <Button variant="ghost" asChild className="mb-6">
          <Link href="/lists">
            <ArrowLeft className="mr-2" size={18} />
            Back to Lists
          </Link>
        </Button>

        {/* Header */}
        <div className="relative h-64 md:h-80 rounded-2xl overflow-hidden mb-8 shadow-2xl">
          <img
            src={list.coverImage}
            alt={list.name}
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/50 to-transparent" />

          <div className="absolute bottom-0 left-0 right-0 p-8">
            <Badge className="mb-3 bg-white/90 dark:bg-slate-900/90">
              <BookOpen size={14} className="mr-1" />
              {list.books.length} books
            </Badge>

            <h1 className="text-4xl md:text-5xl font-serif text-white mb-3">
              {list.name}
            </h1>

            <p className="text-lg text-white/90 mb-4 max-w-3xl">
              {list.description}
            </p>

            {/* Creator */}
            <div className="flex items-center gap-3 text-white/80">
              <img
                src={list.userAvatar}
                alt={list.userName}
                className="w-10 h-10 rounded-full"
              />
              <div>
                <p className="font-semibold">{list.userName}</p>
                <p className="text-sm">
                  Updated{" "}
                  {new Date(list.updatedAt).toLocaleDateString("en-US", {
                    month: "long",
                    day: "numeric",
                    year: "numeric",
                  })}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Actions */}
        <div className="flex flex-wrap items-center gap-4 mb-12">
          <Button
            variant={liked ? "default" : "outline"}
            onClick={handleLike}
            disabled={liked}
          >
            <Heart
              size={18}
              className={`mr-2 ${liked ? "fill-current" : ""}`}
            />
            {liked ? "Liked" : "Like"} ({likeCount})
          </Button>

          <Button
            variant={followed ? "default" : "outline"}
            onClick={handleFollow}
            disabled={followed}
          >
            <Users size={18} className="mr-2" />
            {followed ? "Following" : "Follow"} ({followerCount})
          </Button>

          <Button variant="outline" onClick={handleShare}>
            <Share2 size={18} className="mr-2" />
            Share
          </Button>
        </div>

        {/* Books */}
        <div>
          <h2 className="text-3xl font-serif mb-6">Books in this list</h2>

          {listBooks.length > 0 ? (
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-6">
              {listBooks.map((book) => (
                <BookPoster key={book.id} book={book} />
              ))}
            </div>
          ) : (
            <div className="text-center py-12 bg-slate-50 dark:bg-slate-900/50 rounded-xl">
              No books in this list yet.
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="mt-16">
          <h2 className="text-3xl font-serif mb-6">
            More from {list.userName}
          </h2>
          <p className="text-slate-600 dark:text-slate-400">
            Check out other curated lists from this creator
          </p>
        </div>
      </div>
    </div>
  );
}
