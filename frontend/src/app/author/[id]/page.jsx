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

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="text-center space-y-4">
          <div className="w-16 h-16 rounded-full border-4 border-primary border-t-transparent animate-spin mx-auto" />
          <p className="text-muted-foreground">Loading author profile...</p>
        </div>
      </div>
    );
  }

  if (error || !author) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background px-4">
        <div className="text-center max-w-xl">
          <h1 className="text-5xl font-serif mb-4">Author not found</h1>
          <p className="text-muted-foreground leading-8 mb-8">
            The author profile you’re trying to access may not exist or was
            removed.
          </p>
          <Button asChild size="lg" className="rounded-2xl">
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
          {/* ==================== LEFT SIDEBAR ==================== */}
          <div className="lg:col-span-5 xl:col-span-4">
            <div className="sticky top-24 space-y-8">
              {/* Avatar */}
              <div className="relative">
                <div className="absolute inset-0 bg-primary/10 blur-3xl rounded-[3rem] scale-95" />
                <Avatar className="w-full aspect-square rounded-[2rem] border-4 border-background shadow-2xl">
                  <AvatarImage
                    src={author.avatar}
                    alt={author.name}
                    className="object-cover"
                  />
                  <AvatarFallback className="text-7xl font-serif bg-card">
                    {initials}
                  </AvatarFallback>
                </Avatar>
              </div>

              {/* Quick Actions */}
              <div className="space-y-4">
                <Button size="lg" className="w-full rounded-2xl h-14 text-base">
                  <Users className="mr-2" size={20} />
                  Follow Author
                </Button>

                <Button
                  variant="outline"
                  size="lg"
                  className="w-full rounded-2xl h-14 text-base"
                >
                  <BookOpen className="mr-2" size={20} />
                  View All Books
                </Button>
              </div>
            </div>
          </div>

          {/* ==================== MAIN CONTENT ==================== */}
          <div className="lg:col-span-7 xl:col-span-8">
            {/* Badge */}
            <div className="inline-flex items-center gap-2 px-5 py-2 rounded-full border border-border bg-card mb-6">
              <Sparkles size={16} className="text-primary" />
              <span className="text-sm text-muted-foreground">
                Featured Author
              </span>
            </div>

            {/* Name */}
            <h1 className="text-5xl md:text-6xl font-serif tracking-tight leading-tight mb-6">
              {author.name}
            </h1>

            {/* Meta Info */}
            <div className="flex flex-wrap gap-4 mb-10">
              {author.birthYear && (
                <div className="flex items-center gap-3 bg-card border border-border rounded-2xl px-6 py-3 text-muted-foreground">
                  <Calendar size={18} />
                  <span>Born {author.birthYear}</span>
                </div>
              )}

              {author.nationality && (
                <div className="flex items-center gap-3 bg-card border border-border rounded-2xl px-6 py-3 text-muted-foreground">
                  <MapPin size={18} />
                  <span>{author.nationality}</span>
                </div>
              )}

              <div className="flex items-center gap-3 bg-card border border-border rounded-2xl px-6 py-3 text-muted-foreground">
                <Users size={18} />
                <span>
                  {author.followersCount?.toLocaleString() || 0} followers
                </span>
              </div>
            </div>

            {/* Biography */}
            <Card className="rounded-[2rem] border-border mb-12">
              <CardContent className="p-8 md:p-10">
                <div className="flex items-center gap-3 mb-6">
                  <Quote size={22} className="text-primary" />
                  <span className="uppercase tracking-widest text-sm text-muted-foreground">
                    Biography
                  </span>
                </div>
                <p className="text-lg leading-relaxed text-foreground">
                  {author.bio || "No biography available yet."}
                </p>
              </CardContent>
            </Card>

            {/* Stats Cards */}
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
                  <PenSquare className="mx-auto mb-4 text-primary" size={28} />
                  <div className="text-4xl font-serif mb-2">—</div>
                  <p className="text-sm text-muted-foreground">Reviews</p>
                </CardContent>
              </Card>
            </div>

            {/* Bibliography Section */}
            <div>
              <div className="inline-flex items-center gap-2 text-primary mb-4">
                <BookOpen size={18} />
                <span className="uppercase tracking-[0.2em] text-sm">
                  Bibliography
                </span>
              </div>

              <h2 className="text-4xl md:text-5xl font-serif tracking-tight mb-8">
                Published Works
              </h2>

              <Card className="rounded-[2rem] border-border bg-card">
                <CardContent className="p-16 text-center">
                  <h3 className="text-3xl font-serif mb-4">
                    Books integration coming soon
                  </h3>
                  <p className="text-lg text-muted-foreground max-w-2xl mx-auto leading-8">
                    Soon you’ll be able to explore all books written by{" "}
                    <span className="font-medium text-foreground">
                      {author.name}
                    </span>
                    , including reviews, ratings, and reading lists.
                  </p>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
