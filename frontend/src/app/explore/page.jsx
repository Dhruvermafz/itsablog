"use client";

import React, { useMemo, useState } from "react";
import Link from "next/link";

import {
  Search,
  Flame,
  Sparkles,
  BookOpen,
  Library,
  Filter,
  ArrowRight,
  Quote,
} from "lucide-react";

import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

import { BookPoster } from "@/components/BookPoster";

import { mockBooks, mockAuthors } from "@/data/mockData";

export default function ExplorePage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedGenre, setSelectedGenre] = useState("all");

  const genres = [
    "all",
    "Fiction",
    "Mystery",
    "Romance",
    "Science Fiction",
    "Self-Help",
    "Historical",
    "Fantasy",
  ];

  const filteredBooks = useMemo(() => {
    return mockBooks.filter((book) => {
      const matchesSearch =
        book.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        book.author.toLowerCase().includes(searchQuery.toLowerCase());

      const matchesGenre =
        selectedGenre === "all" || book.genres.includes(selectedGenre);

      return matchesSearch && matchesGenre;
    });
  }, [searchQuery, selectedGenre]);

  const featuredBook = mockBooks[0];
  const trendingBooks = mockBooks.slice(0, 5);
  const newReleases = mockBooks.filter((b) => b.year >= 2020).slice(0, 4);

  return (
    <div className="min-h-screen bg-background text-foreground">
      {/* HERO */}
      <section className="relative overflow-hidden border-b border-border">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,rgba(120,90,60,0.12),transparent_45%)] dark:bg-[radial-gradient(circle_at_top,rgba(255,220,180,0.08),transparent_40%)]" />

        <div className="container relative mx-auto px-4 md:px-8 lg:px-12 py-20 md:py-24">
          <div className="max-w-4xl mx-auto text-center">
            <div className="inline-flex items-center gap-2 rounded-full border border-border bg-card px-4 py-2 mb-6">
              <Sparkles size={16} className="text-primary" />

              <span className="text-sm text-muted-foreground">
                Discover books that stay with you forever
              </span>
            </div>

            <h1 className="text-5xl md:text-6xl lg:text-7xl font-serif tracking-tight leading-tight mb-6">
              Explore the world of{" "}
              <span className="text-primary italic">literature</span>
            </h1>

            <p className="text-lg md:text-xl text-muted-foreground leading-8 max-w-3xl mx-auto mb-10">
              Browse timeless classics, modern masterpieces, hidden gems, and
              reader favorites curated for passionate book lovers.
            </p>

            {/* Search */}
            <div className="relative max-w-3xl mx-auto">
              <Search
                className="absolute left-5 top-1/2 -translate-y-1/2 text-muted-foreground"
                size={22}
              />

              <Input
                type="text"
                placeholder="Search books, authors, genres..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="h-16 pl-14 rounded-2xl border-border bg-card text-base shadow-lg"
              />
            </div>
          </div>
        </div>
      </section>

      {/* GENRES */}
      <section className="py-8 border-b border-border bg-card/30 sticky top-16 z-20 backdrop-blur-xl">
        <div className="container mx-auto px-4 md:px-8 lg:px-12">
          <div className="flex items-center gap-3 overflow-x-auto pb-2 scrollbar-none">
            <div className="flex items-center gap-2 mr-2 text-muted-foreground flex-shrink-0">
              <Filter size={18} />
              <span className="text-sm uppercase tracking-wider">Genres</span>
            </div>

            {genres.map((genre) => (
              <Badge
                key={genre}
                variant={selectedGenre === genre ? "default" : "outline"}
                className="cursor-pointer px-5 py-2 rounded-full text-sm whitespace-nowrap transition-all hover:scale-105"
                onClick={() => setSelectedGenre(genre)}
              >
                {genre}
              </Badge>
            ))}
          </div>
        </div>
      </section>

      {/* FEATURED SECTION */}
      <section className="py-20">
        <div className="container mx-auto px-4 md:px-8 lg:px-12">
          <div className="grid lg:grid-cols-[1.3fr_0.7fr] gap-8">
            {/* FEATURED BOOK */}
            <div className="relative overflow-hidden rounded-[2rem] border border-border bg-card p-8 md:p-12">
              <div className="absolute top-0 right-0 w-72 h-72 bg-primary/5 blur-3xl rounded-full" />

              <div className="relative grid md:grid-cols-2 gap-10 items-center">
                <div className="flex justify-center">
                  <img
                    src={featuredBook.coverUrl}
                    alt={featuredBook.title}
                    className="w-64 rounded-2xl shadow-2xl rotate-[-4deg] hover:rotate-0 transition-transform duration-500"
                  />
                </div>

                <div>
                  <div className="inline-flex items-center gap-2 text-primary mb-4">
                    <Flame size={18} />
                    <span className="uppercase tracking-[0.2em] text-sm">
                      Featured Read
                    </span>
                  </div>

                  <h2 className="text-4xl md:text-5xl font-serif tracking-tight mb-4">
                    {featuredBook.title}
                  </h2>

                  <p className="text-lg text-muted-foreground mb-2">
                    by {featuredBook.author}
                  </p>

                  <p className="text-muted-foreground leading-8 mb-8">
                    A beautifully written story filled with unforgettable
                    characters, emotional depth, and themes that linger long
                    after the final page.
                  </p>

                  <Button asChild size="lg">
                    <Link href={`/book/${featuredBook.id}`}>
                      Read More
                      <ArrowRight className="ml-2" size={18} />
                    </Link>
                  </Button>
                </div>
              </div>
            </div>

            {/* SIDE PANEL */}
            <div className="space-y-8">
              {/* Stats */}
              <div className="rounded-[2rem] border border-border bg-card p-8">
                <div className="flex items-center gap-3 mb-6">
                  <Library className="text-primary" size={24} />

                  <h3 className="text-2xl font-serif">Literary Archive</h3>
                </div>

                <div className="space-y-6">
                  <div>
                    <p className="text-4xl font-serif font-bold">
                      {mockBooks.length}
                    </p>

                    <p className="text-muted-foreground">Books Available</p>
                  </div>

                  <div>
                    <p className="text-4xl font-serif font-bold">
                      {mockAuthors.length}
                    </p>

                    <p className="text-muted-foreground">Featured Authors</p>
                  </div>
                </div>
              </div>

              {/* Top Authors */}
              <div className="rounded-[2rem] border border-border bg-card p-8">
                <h3 className="text-2xl font-serif mb-6">Reader Favorites</h3>

                <div className="space-y-5">
                  {mockAuthors.slice(0, 4).map((author) => (
                    <Link
                      key={author.id}
                      href={`/author/${author.id}`}
                      className="flex items-center gap-4 hover:opacity-80 transition-opacity"
                    >
                      <img
                        src={author.avatar}
                        alt={author.name}
                        className="w-14 h-14 rounded-full object-cover border border-border"
                      />

                      <div>
                        <p className="font-semibold">{author.name}</p>

                        <p className="text-sm text-muted-foreground">
                          {author.booksCount} books
                        </p>
                      </div>
                    </Link>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* TRENDING */}
      <section className="py-20 border-y border-border bg-card/30">
        <div className="container mx-auto px-4 md:px-8 lg:px-12">
          <div className="flex items-end justify-between mb-10">
            <div>
              <div className="inline-flex items-center gap-2 text-primary mb-3">
                <BookOpen size={18} />

                <span className="uppercase tracking-[0.2em] text-sm">
                  Trending Shelf
                </span>
              </div>

              <h2 className="text-4xl md:text-5xl font-serif tracking-tight">
                Books readers adore right now
              </h2>
            </div>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-8">
            {trendingBooks.map((book) => (
              <BookPoster key={book.id} book={book} />
            ))}
          </div>
        </div>
      </section>

      {/* NEW RELEASES */}
      <section className="py-20">
        <div className="container mx-auto px-4 md:px-8 lg:px-12">
          <div className="flex items-center gap-2 text-primary mb-3">
            <Sparkles size={18} />

            <span className="uppercase tracking-[0.2em] text-sm">
              Fresh Arrivals
            </span>
          </div>

          <h2 className="text-4xl md:text-5xl font-serif tracking-tight mb-12">
            Recently released stories
          </h2>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {newReleases.map((book) => (
              <BookPoster key={book.id} book={book} />
            ))}
          </div>
        </div>
      </section>

      {/* ALL BOOKS */}
      <section className="py-20 border-t border-border">
        <div className="container mx-auto px-4 md:px-8 lg:px-12">
          <div className="flex items-center gap-2 text-primary mb-3">
            <Quote size={18} />

            <span className="uppercase tracking-[0.2em] text-sm">
              Complete Collection
            </span>
          </div>

          <h2 className="text-4xl md:text-5xl font-serif tracking-tight mb-12">
            Browse all books
          </h2>

          {filteredBooks.length > 0 ? (
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-8">
              {filteredBooks.map((book) => (
                <BookPoster key={book.id} book={book} />
              ))}
            </div>
          ) : (
            <div className="rounded-3xl border border-border bg-card p-16 text-center">
              <h3 className="text-3xl font-serif mb-4">No books found</h3>

              <p className="text-muted-foreground text-lg">
                Try searching with another title, author, or genre.
              </p>
            </div>
          )}
        </div>
      </section>
    </div>
  );
}
