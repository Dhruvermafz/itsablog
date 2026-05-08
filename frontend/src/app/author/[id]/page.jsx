"use client";

import React from "react";

import Link from "next/link";

import { useParams } from "next/navigation";

import {
  ArrowLeft,
  Calendar,
  MapPin,
  Users,
  BookOpen,
  Star,
  Quote,
  Sparkles,
  Library,
  PenSquare,
} from "lucide-react";

import { useGetAuthorQuery } from "@/api/authorApi";

import { Button } from "@/components/ui/button";

import { Badge } from "@/components/ui/badge";

import { Card, CardContent } from "@/components/ui/card";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

export default function AuthorPage() {
  const params = useParams();

  const id = params?.id;

  const { data: author, isLoading, error } = useGetAuthorQuery(id);

  // Loading
  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="text-center space-y-4">
          <div className="w-16 h-16 rounded-full border-4 border-primary border-t-transparent animate-spin mx-auto" />

          <p className="text-lg text-muted-foreground">
            Loading author profile...
          </p>
        </div>
      </div>
    );
  }

  // Error / Not Found
  if (error || !author) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background px-4">
        <div className="text-center max-w-xl">
          <h1 className="text-5xl font-serif mb-4">Author not found</h1>

          <p className="text-muted-foreground leading-8 mb-8">
            The author profile you’re trying to access may not exist or was
            removed.
          </p>

          <Button asChild size="lg">
            <Link href="/explore">Return to Explore</Link>
          </Button>
        </div>
      </div>
    );
  }

  const initials = author.name
    ?.split(" ")
    ?.map((n) => n[0])
    ?.join("")
    ?.slice(0, 2)
    ?.toUpperCase();

  return (
    <div className="min-h-screen bg-background text-foreground">
      {/* HERO */}
      <section className="relative overflow-hidden border-b border-border">
        {/* Background */}
        <div className="absolute inset-0">
          <div className="absolute inset-0 bg-gradient-to-br from-primary/10 via-background to-background" />

          {author.avatar && (
            <img
              src={author.avatar}
              alt={author.name}
              className="w-full h-full object-cover opacity-10 blur-3xl scale-125"
            />
          )}
        </div>

        <div className="relative container mx-auto px-4 md:px-8 lg:px-12 py-12 md:py-20">
          {/* Back */}
          <Button variant="ghost" asChild className="mb-10 rounded-full">
            <Link href="/explore">
              <ArrowLeft className="mr-2" size={18} />
              Back to Explore
            </Link>
          </Button>

          <div className="grid lg:grid-cols-[320px_1fr] gap-14 items-start">
            {/* LEFT */}
            <div>
              <div className="relative">
                <div className="absolute inset-0 bg-primary/20 blur-3xl rounded-full scale-90 opacity-70" />

                <div className="relative">
                  <Avatar className="w-full aspect-square rounded-[2rem] border border-border shadow-2xl">
                    <AvatarImage
                      src={author.avatar}
                      alt={author.name}
                      className="object-cover"
                    />

                    <AvatarFallback className="text-6xl font-serif bg-card">
                      {initials}
                    </AvatarFallback>
                  </Avatar>
                </div>
              </div>

              {/* Quick Actions */}
              <div className="mt-8 space-y-4">
                <Button className="w-full rounded-2xl h-14 text-base" size="lg">
                  <Users className="mr-2" size={18} />
                  Follow Author
                </Button>

                <Button
                  variant="outline"
                  className="w-full rounded-2xl h-14 text-base"
                  size="lg"
                >
                  <BookOpen className="mr-2" size={18} />
                  View Books
                </Button>
              </div>
            </div>

            {/* RIGHT */}
            <div className="max-w-5xl">
              {/* Badge */}
              <div className="inline-flex items-center gap-2 px-5 py-2 rounded-full border border-border bg-card mb-6">
                <Sparkles size={16} className="text-primary" />

                <span className="text-sm text-muted-foreground">
                  Featured Author
                </span>
              </div>

              {/* Name */}
              <h1 className="text-5xl md:text-7xl font-serif tracking-tight leading-tight mb-6">
                {author.name}
              </h1>

              {/* Meta */}
              <div className="flex flex-wrap items-center gap-4 mb-8">
                {author.birthYear && (
                  <div className="flex items-center gap-2 px-5 py-3 rounded-full border border-border bg-card text-muted-foreground">
                    <Calendar size={16} />

                    <span>Born {author.birthYear}</span>
                  </div>
                )}

                {author.nationality && (
                  <div className="flex items-center gap-2 px-5 py-3 rounded-full border border-border bg-card text-muted-foreground">
                    <MapPin size={16} />

                    <span>{author.nationality}</span>
                  </div>
                )}

                <div className="flex items-center gap-2 px-5 py-3 rounded-full border border-border bg-card text-muted-foreground">
                  <Users size={16} />

                  <span>
                    {author.followersCount?.toLocaleString() || 0} followers
                  </span>
                </div>
              </div>

              {/* Bio */}
              <Card className="rounded-[2rem] border-border bg-card/70 backdrop-blur-sm mb-12">
                <CardContent className="p-8 md:p-10">
                  <div className="inline-flex items-center gap-2 text-primary mb-5">
                    <Quote size={18} />

                    <span className="uppercase tracking-[0.2em] text-sm">
                      Biography
                    </span>
                  </div>

                  <p className="text-lg leading-9 text-muted-foreground">
                    {author.bio || "This author hasn’t added a biography yet."}
                  </p>
                </CardContent>
              </Card>

              {/* Stats */}
              <div className="grid grid-cols-2 lg:grid-cols-4 gap-5 mb-14">
                <Card className="rounded-[2rem] border-border bg-card/80">
                  <CardContent className="p-8 text-center">
                    <BookOpen className="mx-auto mb-4 text-primary" size={28} />

                    <div className="text-4xl font-serif mb-2">
                      {author.booksCount || 0}
                    </div>

                    <p className="text-sm text-muted-foreground">
                      Books Published
                    </p>
                  </CardContent>
                </Card>

                <Card className="rounded-[2rem] border-border bg-card/80">
                  <CardContent className="p-8 text-center">
                    <Library className="mx-auto mb-4 text-primary" size={28} />

                    <div className="text-4xl font-serif mb-2">—</div>

                    <p className="text-sm text-muted-foreground">In Library</p>
                  </CardContent>
                </Card>

                <Card className="rounded-[2rem] border-border bg-card/80">
                  <CardContent className="p-8 text-center">
                    <Star className="mx-auto mb-4 text-primary" size={28} />

                    <div className="text-4xl font-serif mb-2">—</div>

                    <p className="text-sm text-muted-foreground">Avg Rating</p>
                  </CardContent>
                </Card>

                <Card className="rounded-[2rem] border-border bg-card/80">
                  <CardContent className="p-8 text-center">
                    <PenSquare
                      className="mx-auto mb-4 text-primary"
                      size={28}
                    />

                    <div className="text-4xl font-serif mb-2">—</div>

                    <p className="text-sm text-muted-foreground">Reviews</p>
                  </CardContent>
                </Card>
              </div>

              {/* Books Placeholder */}
              <div>
                <div className="inline-flex items-center gap-2 text-primary mb-4">
                  <BookOpen size={18} />

                  <span className="uppercase tracking-[0.2em] text-sm">
                    Bibliography
                  </span>
                </div>

                <h2 className="text-4xl md:text-5xl font-serif tracking-tight mb-6">
                  Published Works
                </h2>

                <Card className="rounded-[2rem] border-border bg-card">
                  <CardContent className="p-16 text-center">
                    <h3 className="text-3xl font-serif mb-4">
                      Books integration coming soon
                    </h3>

                    <p className="text-lg text-muted-foreground max-w-2xl mx-auto leading-8">
                      Soon you’ll be able to explore all books written by{" "}
                      {author.name}, including reviews, ratings, editions, and
                      reading lists.
                    </p>
                  </CardContent>
                </Card>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
