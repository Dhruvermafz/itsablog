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
import { useGetBooksByAuthorQuery } from "@/api/bookApi";

import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

export default function AuthorPage() {
  const params = useParams();
  const id = params?.id;

  const { data: author, isLoading, error } = useGetAuthorQuery(id);

  const { data: authorBooksData, isLoading: booksLoading } =
    useGetBooksByAuthorQuery({ authorId: id, limit: 20 }, { skip: !id });

  const books = authorBooksData?.books || [];

  const initials = author?.name
    ?.split(" ")
    ?.map((n) => n[0])
    ?.join("")
    ?.slice(0, 2)
    ?.toUpperCase();

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
          <h1 className="text-4xl md:text-5xl font-serif mb-4">
            Author not found
          </h1>
          <p className="text-muted-foreground leading-relaxed mb-8">
            The author profile you’re trying to access may not exist or was
            removed.
          </p>
          <Button asChild size="lg" className="rounded-2xl w-full sm:w-auto">
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
          className="mb-8 -ml-2 text-sm font-medium"
        >
          <Link href="/explore" className="flex items-center gap-2">
            <ArrowLeft size={20} />
            Back to Explore
          </Link>
        </Button>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12">
          {/* LEFT SIDEBAR */}
          <div className="lg:col-span-5 xl:col-span-4">
            <div className="lg:sticky lg:top-24 space-y-8">
              {/* Avatar */}
              <div className="relative mx-auto max-w-[280px] lg:max-w-none">
                <div className="absolute inset-0 bg-primary/10 blur-3xl rounded-[3rem] scale-95" />
                <Avatar className="w-full aspect-square rounded-3xl border-4 border-background shadow-2xl">
                  <AvatarImage
                    src={author.avatar}
                    alt={author.name}
                    className="object-cover"
                  />
                  <AvatarFallback className="text-6xl md:text-7xl font-serif bg-card">
                    {initials}
                  </AvatarFallback>
                </Avatar>
              </div>

              {/* Quick Actions */}
              <div className="space-y-3 px-1">
                <Button
                  size="lg"
                  className="w-full rounded-2xl h-14 text-base font-medium"
                >
                  <Users className="mr-3" size={20} />
                  Follow Author
                </Button>

                <Button
                  variant="outline"
                  size="lg"
                  className="w-full rounded-2xl h-14 text-base font-medium"
                >
                  <BookOpen className="mr-3" size={20} />
                  View All Books
                </Button>
              </div>
            </div>
          </div>

          {/* MAIN CONTENT */}
          <div className="lg:col-span-7 xl:col-span-8">
            {/* Featured Badge */}
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-border bg-card mb-6">
              <Sparkles size={16} className="text-primary" />
              <span className="text-xs font-medium tracking-wider text-muted-foreground">
                FEATURED AUTHOR
              </span>
            </div>

            {/* Author Name */}
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-serif tracking-tighter leading-tight mb-6">
              {author.name}
            </h1>

            {/* Meta Info */}
            <div className="flex flex-wrap gap-3 sm:gap-4 mb-10">
              {author.birthYear && (
                <div className="flex items-center gap-3 bg-card border border-border rounded-2xl px-5 py-3 text-muted-foreground">
                  <Calendar size={18} />
                  <span>Born {author.birthYear}</span>
                </div>
              )}

              {author.nationality && (
                <div className="flex items-center gap-3 bg-card border border-border rounded-2xl px-5 py-3 text-muted-foreground">
                  <MapPin size={18} />
                  <span>{author.nationality}</span>
                </div>
              )}

              <div className="flex items-center gap-3 bg-card border border-border rounded-2xl px-5 py-3 text-muted-foreground">
                <Users size={18} />
                <span>
                  {author.followersCount?.toLocaleString() || 0} followers
                </span>
              </div>
            </div>

            {/* Biography */}
            <Card className="rounded-3xl border-border mb-12">
              <CardContent className="p-6 sm:p-8 md:p-10">
                <div className="flex items-center gap-3 mb-6">
                  <Quote size={22} className="text-primary" />
                  <span className="uppercase tracking-widest text-xs text-muted-foreground font-medium">
                    Biography
                  </span>
                </div>
                <p className="text-[17px] leading-relaxed text-foreground">
                  {author.bio || "No biography available yet."}
                </p>
              </CardContent>
            </Card>

            {/* Stats */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-14">
              <Card className="rounded-3xl border-border">
                <CardContent className="p-6 text-center">
                  <BookOpen className="mx-auto mb-4 text-primary" size={28} />
                  <div className="text-3xl font-serif mb-1">
                    {author.booksCount || books.length || 0}
                  </div>
                  <p className="text-sm text-muted-foreground">
                    Books Published
                  </p>
                </CardContent>
              </Card>

              <Card className="rounded-3xl border-border">
                <CardContent className="p-6 text-center">
                  <Library className="mx-auto mb-4 text-primary" size={28} />
                  <div className="text-3xl font-serif mb-1">{books.length}</div>
                  <p className="text-sm text-muted-foreground">In Library</p>
                </CardContent>
              </Card>

              <Card className="rounded-3xl border-border">
                <CardContent className="p-6 text-center">
                  <Star className="mx-auto mb-4 text-primary" size={28} />
                  <div className="text-3xl font-serif mb-1">
                    {books.length > 0
                      ? (
                          books.reduce(
                            (acc, book) => acc + (book.avgRating || 0),
                            0,
                          ) / books.length
                        ).toFixed(1)
                      : "—"}
                  </div>
                  <p className="text-sm text-muted-foreground">Avg Rating</p>
                </CardContent>
              </Card>

              <Card className="rounded-3xl border-border">
                <CardContent className="p-6 text-center">
                  <PenSquare className="mx-auto mb-4 text-primary" size={28} />
                  <div className="text-3xl font-serif mb-1">
                    {books.reduce(
                      (acc, book) => acc + (book.reviewsCount || 0),
                      0,
                    )}
                  </div>
                  <p className="text-sm text-muted-foreground">Total Reviews</p>
                </CardContent>
              </Card>
            </div>

            {/* Bibliography */}
            <div>
              <div className="inline-flex items-center gap-2 text-primary mb-4">
                <BookOpen size={18} />
                <span className="uppercase tracking-[0.2em] text-sm font-medium">
                  BIBLIOGRAPHY
                </span>
              </div>

              <h2 className="text-3xl sm:text-4xl font-serif tracking-tight mb-8">
                Published Works
              </h2>

              <Card className="rounded-3xl border-border">
                <CardContent className="p-4 sm:p-6">
                  {booksLoading ? (
                    <div className="text-center py-12 text-muted-foreground">
                      Loading books...
                    </div>
                  ) : books.length > 0 ? (
                    <div className="space-y-3">
                      {books.map((book) => (
                        <Link
                          key={book._id}
                          href={`/book/${book._id}`}
                          className="flex gap-4 p-4 sm:p-5 rounded-2xl hover:bg-muted/50 transition-colors border border-transparent hover:border-border group"
                        >
                          <img
                            src={book.coverUrl || "/placeholder-book.jpg"}
                            alt={book.title}
                            className="w-16 h-24 sm:w-20 sm:h-28 object-cover rounded-xl shadow-sm flex-shrink-0"
                          />

                          <div className="flex-1 min-w-0 pt-1">
                            <h3 className="font-semibold text-lg sm:text-xl group-hover:text-primary transition-colors line-clamp-1">
                              {book.title}
                            </h3>

                            <p className="text-sm sm:text-base text-muted-foreground mt-1.5 line-clamp-2">
                              {book.description || "No description available."}
                            </p>

                            <div className="flex flex-wrap items-center gap-3 mt-4">
                              {book.year && (
                                <Badge variant="outline" className="text-xs">
                                  {book.year}
                                </Badge>
                              )}

                              {book.avgRating > 0 && (
                                <div className="flex items-center gap-1 text-amber-500 text-sm font-medium">
                                  <Star className="w-4 h-4 fill-current" />
                                  {book.avgRating.toFixed(1)}
                                </div>
                              )}

                              {book.reviewsCount > 0 && (
                                <Badge variant="secondary" className="text-xs">
                                  {book.reviewsCount} reviews
                                </Badge>
                              )}
                            </div>
                          </div>
                        </Link>
                      ))}
                    </div>
                  ) : (
                    <div className="text-center py-16">
                      <h3 className="text-2xl font-serif mb-4">No books yet</h3>
                      <p className="text-muted-foreground max-w-md mx-auto">
                        This author currently has no published works in our
                        library.
                      </p>
                    </div>
                  )}
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
