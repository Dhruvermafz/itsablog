"use client";

import React, { useMemo, useState } from "react";
import Link from "next/link";

import { Flame, Sparkles, BookOpen, ArrowRight, Quote } from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

import { BookPoster } from "@/components/BookPoster";

import { useGetBooksQuery } from "@/api/bookApi";
import { useGetAuthorsQuery } from "@/api/authorApi";

export default function ExplorePage() {
  const [searchQuery, setSearchQuery] = useState("");

  // ========================
  // API CALLS
  // ========================
  const {
    data: booksResponse,
    isLoading: booksLoading,
    error: booksError,
  } = useGetBooksQuery();

  const { data: authorsResponse } = useGetAuthorsQuery({ limit: 20 });

  const books = booksResponse?.books || [];
  const authors = authorsResponse?.authors || [];

  // ========================
  // FILTERED BOOKS (Search only)
  // ========================
  const filteredBooks = useMemo(() => {
    return books.filter((book) => {
      const matchesSearch =
        book.title?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        book.author?.name?.toLowerCase().includes(searchQuery.toLowerCase());

      return matchesSearch;
    });
  }, [books, searchQuery]);

  const featuredBook = books[0];
  const trendingBooks = books.slice(0, 5);
  const newReleases = books.filter((b) => b.year && b.year >= 2020).slice(0, 4);

  if (booksLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin w-8 h-8 border-4 border-primary border-t-transparent rounded-full mx-auto mb-4" />
          <p>Loading books...</p>
        </div>
      </div>
    );
  }

  if (booksError) {
    return (
      <div className="min-h-screen flex items-center justify-center text-red-500">
        Failed to load books. Please try again later.
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background text-foreground">
      <div className="container mx-auto px-4 md:px-8 lg:px-12 py-10">
        <div className="grid lg:grid-cols-12 gap-10">
          {/* ==================== MAIN CONTENT (2/3) ==================== */}
          <div className="lg:col-span-8 space-y-20">
            {/* TRENDING */}
            <section>
              <div className="flex items-end justify-between mb-10">
                <div>
                  <div className="inline-flex items-center gap-2 text-primary mb-3">
                    <BookOpen size={20} />
                    <span className="uppercase tracking-[0.2em] text-sm">
                      Trending Now
                    </span>
                  </div>
                  <h2 className="text-4xl md:text-5xl font-serif tracking-tight">
                    Books readers adore right now
                  </h2>
                </div>

                <Button asChild variant="outline" className="rounded-full px-6">
                  <Link href="/explore/books">
                    View All <ArrowRight className="ml-2" size={16} />
                  </Link>
                </Button>
              </div>

              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                {trendingBooks.map((book) => (
                  <BookPoster key={book._id} book={book} />
                ))}
              </div>
            </section>

            {/* NEW RELEASES */}
            {newReleases.length > 0 && (
              <section>
                <div className="flex items-end justify-between mb-10">
                  <div>
                    <div className="inline-flex items-center gap-2 text-primary mb-3">
                      <Sparkles size={20} />
                      <span className="uppercase tracking-[0.2em] text-sm">
                        Fresh Arrivals
                      </span>
                    </div>
                    <h2 className="text-4xl md:text-5xl font-serif tracking-tight">
                      Recently released stories
                    </h2>
                  </div>

                  <Button
                    asChild
                    variant="outline"
                    className="rounded-full px-6"
                  >
                    <Link href="/explore/books">
                      View All <ArrowRight className="ml-2" size={16} />
                    </Link>
                  </Button>
                </div>

                <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                  {newReleases.map((book) => (
                    <BookPoster key={book._id} book={book} />
                  ))}
                </div>
              </section>
            )}

            {/* ALL BOOKS */}
            <section>
              <div className="flex items-end justify-between mb-10">
                <div>
                  <div className="inline-flex items-center gap-2 text-primary mb-3">
                    <Quote size={20} />
                    <span className="uppercase tracking-[0.2em] text-sm">
                      Complete Collection
                    </span>
                  </div>
                  <h2 className="text-4xl md:text-5xl font-serif tracking-tight">
                    Browse all books
                  </h2>
                </div>

                <Button asChild variant="outline" className="rounded-full px-6">
                  <Link href="/explore/books">
                    View All <ArrowRight className="ml-2" size={16} />
                  </Link>
                </Button>
              </div>

              {filteredBooks.length > 0 ? (
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                  {filteredBooks.map((book) => (
                    <BookPoster key={book._id} book={book} />
                  ))}
                </div>
              ) : (
                <div className="rounded-3xl border border-border bg-card p-16 text-center">
                  <h3 className="text-3xl font-serif mb-4">No books found</h3>
                  <p className="text-muted-foreground text-lg">
                    Try adjusting your search terms.
                  </p>
                </div>
              )}
            </section>
          </div>

          {/* ==================== SIDEBAR (1/3) ==================== */}
          <div className="lg:col-span-4 space-y-8">
            {/* Compact Featured Read */}
            {featuredBook && (
              <div className="rounded-3xl border border-border bg-card p-6">
                <div className="inline-flex items-center gap-2 text-primary mb-4">
                  <Flame size={20} />
                  <span className="uppercase tracking-[0.2em] text-sm font-medium">
                    Featured Read
                  </span>
                </div>

                <div className="flex gap-4">
                  <img
                    src={featuredBook.coverUrl}
                    alt={featuredBook.title}
                    className="w-24 h-36 object-cover rounded-2xl shadow-md flex-shrink-0"
                  />

                  <div className="flex-1 min-w-0">
                    <h3 className="font-serif text-lg leading-tight line-clamp-2 mb-2">
                      {featuredBook.title}
                    </h3>

                    <p className="text-sm text-muted-foreground mb-3">
                      by {featuredBook.author?.name || "Unknown"}
                    </p>

                    <p className="text-xs text-muted-foreground line-clamp-3 mb-4">
                      {featuredBook.synopsis}
                    </p>

                    <Button asChild size="sm" className="w-full rounded-full">
                      <Link href={`/book/${featuredBook._id}`}>
                        Read Now <ArrowRight className="ml-2" size={16} />
                      </Link>
                    </Button>
                  </div>
                </div>
              </div>
            )}

            {/* Trending Books in Sidebar */}
            <div className="rounded-3xl border border-border bg-card p-6">
              <h3 className="text-xl font-serif mb-5">Trending Books</h3>

              <div className="space-y-4">
                {trendingBooks.slice(0, 4).map((book) => (
                  <Link
                    key={book._id}
                    href={`/book/${book._id}`}
                    className="flex gap-3 group"
                  >
                    <img
                      src={book.coverUrl}
                      alt={book.title}
                      className="w-12 h-16 object-cover rounded-lg flex-shrink-0"
                    />
                    <div className="flex-1 min-w-0 pt-1">
                      <p className="font-medium text-sm line-clamp-2 group-hover:text-primary transition-colors">
                        {book.title}
                      </p>
                      <p className="text-xs text-muted-foreground mt-1">
                        {book.author?.name}
                      </p>
                    </div>
                  </Link>
                ))}
              </div>

              <Button variant="ghost" size="sm" className="w-full mt-4" asChild>
                <Link href="/explore/books">View All Books</Link>
              </Button>
            </div>

            {/* Popular Authors */}
            {authors.length > 0 && (
              <div className="rounded-3xl border border-border bg-card p-6">
                <h3 className="text-xl font-serif mb-5">Popular Authors</h3>

                <div className="space-y-4">
                  {authors.slice(0, 5).map((author) => (
                    <Link
                      key={author._id}
                      href={`/author/${author._id}`}
                      className="flex items-center gap-3 hover:bg-accent/50 -mx-2 px-2 py-2 rounded-xl transition-colors group"
                    >
                      <img
                        src={author.avatar || "/default-avatar.png"}
                        alt={author.name}
                        className="w-10 h-10 rounded-full object-cover border border-border"
                      />
                      <div>
                        <p className="font-medium group-hover:text-primary transition-colors">
                          {author.name}
                        </p>
                        <p className="text-xs text-muted-foreground">
                          {author.booksCount || 0} books
                        </p>
                      </div>
                    </Link>
                  ))}
                </div>

                <Button
                  variant="ghost"
                  size="sm"
                  className="w-full mt-4"
                  asChild
                >
                  <Link href="/authors">Browse All Authors</Link>
                </Button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
