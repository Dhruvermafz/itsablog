"use client";

import React, { useMemo, useState } from "react";

import Link from "next/link";

import { useParams, useRouter } from "next/navigation";

import {
  ArrowLeft,
  Heart,
  Users,
  BookOpen,
  Share2,
  Quote,
  Sparkles,
  Bookmark,
  Clock3,
} from "lucide-react";

import { Button } from "@/components/ui/button";

import { Badge } from "@/components/ui/badge";

import { BookPoster } from "@/components/BookPoster";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

import { Card, CardContent } from "@/components/ui/card";

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
  const { id } = useParams();

  const router = useRouter();

  const { user } = useAuth();

  const list = getListById(id);

  const [liked, setLiked] = useState(user ? isListLiked(user.id, id) : false);

  const [followed, setFollowed] = useState(
    user ? isListFollowed(user.id, id) : false,
  );

  const [likeCount, setLikeCount] = useState(list?.likes || 0);

  const [followerCount, setFollowerCount] = useState(list?.followers || 0);

  const listBooks = useMemo(() => {
    if (!list) return [];

    return mockBooks.filter((book) => list.books.includes(book.id));
  }, [list]);

  if (!list) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background px-4">
        <div className="text-center max-w-lg">
          <h1 className="text-5xl font-serif mb-4">Collection not found</h1>

          <p className="text-muted-foreground mb-8 leading-8">
            The literary collection you’re searching for no longer exists or may
            have been moved.
          </p>

          <Button asChild size="lg">
            <Link href="/lists">Return to Collections</Link>
          </Button>
        </div>
      </div>
    );
  }

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

  const handleShare = async () => {
    try {
      if (navigator.share) {
        await navigator.share({
          title: list.name,
          text: list.description,
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
      <section className="relative overflow-hidden">
        {/* Background Image */}
        <div className="absolute inset-0">
          <img
            src={list.coverImage}
            alt={list.name}
            className="w-full h-full object-cover"
          />

          <div className="absolute inset-0 bg-black/70" />

          <div className="absolute inset-0 bg-gradient-to-b from-black/40 via-black/70 to-background" />
        </div>

        {/* Content */}
        <div className="relative container mx-auto px-4 md:px-8 lg:px-12 pt-10 pb-24">
          {/* Back */}
          <Button
            variant="ghost"
            asChild
            className="mb-12 text-white hover:bg-white/10 hover:text-white"
          >
            <Link href="/lists">
              <ArrowLeft className="mr-2" size={18} />
              Back to Collections
            </Link>
          </Button>

          <div className="max-w-4xl">
            {/* Top badge */}
            <div className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/10 backdrop-blur-md px-5 py-2 mb-6">
              <Sparkles size={16} className="text-primary" />

              <span className="text-sm text-white/90">
                Curated Literary Collection
              </span>
            </div>

            {/* Title */}
            <h1 className="text-5xl md:text-7xl font-serif text-white leading-tight mb-6">
              {list.name}
            </h1>

            {/* Description */}
            <p className="text-lg md:text-xl text-white/80 leading-9 max-w-3xl mb-10">
              {list.description}
            </p>

            {/* Meta */}
            <div className="flex flex-wrap items-center gap-6 mb-10">
              <Badge className="rounded-full px-5 py-2 bg-white/10 hover:bg-white/10 text-white border border-white/10">
                <BookOpen size={14} className="mr-2" />
                {list.books.length} books
              </Badge>

              <Badge className="rounded-full px-5 py-2 bg-white/10 hover:bg-white/10 text-white border border-white/10">
                <Heart size={14} className="mr-2" />
                {likeCount} likes
              </Badge>

              <Badge className="rounded-full px-5 py-2 bg-white/10 hover:bg-white/10 text-white border border-white/10">
                <Users size={14} className="mr-2" />
                {followerCount} followers
              </Badge>
            </div>

            {/* Creator */}
            <div className="flex flex-wrap items-center gap-5">
              <Avatar className="w-14 h-14 border-2 border-white/20">
                <AvatarImage src={list.userAvatar} alt={list.userName} />

                <AvatarFallback>{list.userName?.slice(0, 2)}</AvatarFallback>
              </Avatar>

              <div>
                <p className="text-white font-semibold text-lg">
                  {list.userName}
                </p>

                <div className="flex items-center gap-2 text-white/70 text-sm">
                  <Clock3 size={14} />

                  <span>
                    Updated{" "}
                    {new Date(list.updatedAt).toLocaleDateString("en-US", {
                      month: "long",
                      day: "numeric",
                      year: "numeric",
                    })}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ACTIONS */}
      <section className="-mt-10 relative z-20">
        <div className="container mx-auto px-4 md:px-8 lg:px-12">
          <Card className="border-border/50 bg-card/90 backdrop-blur-xl shadow-2xl rounded-[2rem]">
            <CardContent className="p-6 flex flex-wrap items-center justify-between gap-5">
              {/* Left */}
              <div>
                <p className="text-lg font-serif">Save this literary journey</p>

                <p className="text-sm text-muted-foreground mt-1">
                  Follow collections you love and discover your next
                  unforgettable read.
                </p>
              </div>

              {/* Right */}
              <div className="flex flex-wrap items-center gap-3">
                <Button
                  variant={liked ? "default" : "outline"}
                  size="lg"
                  disabled={liked}
                  onClick={handleLike}
                  className="rounded-full"
                >
                  <Heart
                    size={18}
                    className={`mr-2 ${liked ? "fill-current" : ""}`}
                  />

                  {liked ? "Liked" : "Like"}
                </Button>

                <Button
                  variant={followed ? "default" : "outline"}
                  size="lg"
                  disabled={followed}
                  onClick={handleFollow}
                  className="rounded-full"
                >
                  <Users size={18} className="mr-2" />

                  {followed ? "Following" : "Follow"}
                </Button>

                <Button
                  variant="outline"
                  size="lg"
                  onClick={handleShare}
                  className="rounded-full"
                >
                  <Share2 size={18} className="mr-2" />
                  Share
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* BOOKS */}
      <section className="py-24">
        <div className="container mx-auto px-4 md:px-8 lg:px-12">
          {/* Heading */}
          <div className="flex items-center justify-between gap-5 mb-14">
            <div>
              <div className="inline-flex items-center gap-2 text-primary mb-3">
                <Quote size={18} />

                <span className="uppercase tracking-[0.2em] text-sm">
                  Reading Collection
                </span>
              </div>

              <h2 className="text-4xl md:text-5xl font-serif tracking-tight">
                Books in this collection
              </h2>
            </div>

            <div className="hidden md:flex items-center gap-2 text-muted-foreground">
              <Bookmark size={18} />

              <span>{listBooks.length} curated titles</span>
            </div>
          </div>

          {/* Books Grid */}
          {listBooks.length > 0 ? (
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-8">
              {listBooks.map((book) => (
                <BookPoster key={book.id} book={book} />
              ))}
            </div>
          ) : (
            <div className="rounded-[2rem] border border-border bg-card p-20 text-center">
              <h3 className="text-4xl font-serif mb-4">No books yet</h3>

              <p className="text-lg text-muted-foreground">
                This collection is waiting for its first story.
              </p>
            </div>
          )}
        </div>
      </section>

      {/* CREATOR SECTION */}
      <section className="pb-24">
        <div className="container mx-auto px-4 md:px-8 lg:px-12">
          <Card className="rounded-[2.5rem] overflow-hidden border-border bg-card">
            <div className="grid lg:grid-cols-2">
              {/* Left */}
              <div className="p-10 md:p-14 flex flex-col justify-center">
                <div className="inline-flex items-center gap-2 text-primary mb-4">
                  <Users size={18} />

                  <span className="uppercase tracking-[0.2em] text-sm">
                    Curator Spotlight
                  </span>
                </div>

                <h2 className="text-4xl md:text-5xl font-serif mb-6 leading-tight">
                  More from {list.userName}
                </h2>

                <p className="text-lg text-muted-foreground leading-8 mb-8 max-w-2xl">
                  Explore more carefully curated reading journeys and thematic
                  literary collections created by this reader.
                </p>

                <div className="flex items-center gap-4">
                  <Avatar className="w-16 h-16">
                    <AvatarImage src={list.userAvatar} alt={list.userName} />

                    <AvatarFallback>
                      {list.userName?.slice(0, 2)}
                    </AvatarFallback>
                  </Avatar>

                  <div>
                    <p className="font-semibold text-lg">{list.userName}</p>

                    <p className="text-muted-foreground">
                      Literary curator & passionate reader
                    </p>
                  </div>
                </div>
              </div>

              {/* Right */}
              <div className="relative min-h-[320px]">
                <img
                  src={list.coverImage}
                  alt={list.name}
                  className="absolute inset-0 w-full h-full object-cover"
                />

                <div className="absolute inset-0 bg-black/50" />
              </div>
            </div>
          </Card>
        </div>
      </section>
    </div>
  );
}
