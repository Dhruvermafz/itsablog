"use client";

import React, { useState } from "react";
import Link from "next/link";
import { Search, Filter } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
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

  const filteredBooks = mockBooks.filter((book) => {
    const matchesSearch =
      book.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      book.author.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesGenre =
      selectedGenre === "all" || book.genres.includes(selectedGenre);
    return matchesSearch && matchesGenre;
  });

  const newReleases = mockBooks.filter((b) => b.year >= 2020).slice(0, 4);
  const editorsPicks = mockBooks.slice(0, 3);

  return (
    <div className="min-h-screen py-8" data-testid="explore-page">
      <div className="container mx-auto px-4 md:px-8 lg:px-12">
        {/* Header */}
        <div className="mb-12 text-center">
          <h1 className="text-4xl md:text-5xl font-serif tracking-tight mb-4">
            Explore Books
          </h1>
          <p className="text-base md:text-lg text-slate-600 dark:text-slate-300 max-w-2xl mx-auto">
            Discover your next favorite read from our curated collection
          </p>
        </div>

        {/* Search Bar */}
        <div className="max-w-3xl mx-auto mb-12">
          <div className="relative">
            <Search
              className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400"
              size={20}
            />
            <Input
              type="text"
              placeholder="Search books, authors, genres..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-12 h-14 text-lg rounded-2xl shadow-lg border-slate-200 dark:border-slate-700"
              data-testid="search-input"
            />
          </div>
        </div>

        {/* Genre Filters */}
        <div className="flex items-center gap-3 mb-12 overflow-x-auto pb-2">
          <Filter size={20} className="text-slate-400 flex-shrink-0" />
          {genres.map((genre) => (
            <Badge
              key={genre}
              variant={selectedGenre === genre ? "default" : "outline"}
              className="cursor-pointer whitespace-nowrap px-4 py-2 text-sm"
              onClick={() => setSelectedGenre(genre)}
              data-testid={`genre-filter-${genre}`}
            >
              {genre}
            </Badge>
          ))}
        </div>

        {/* Bento Grid Layout */}
        <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-4 mb-12 auto-rows-[300px]">
          {/* New Releases - Large card */}
          <div className="md:col-span-2 md:row-span-2 bg-gradient-to-br from-indigo-100 to-purple-100 dark:from-indigo-950 dark:to-purple-950 rounded-xl p-8 flex flex-col justify-between overflow-hidden relative">
            <div className="relative z-10">
              <h2 className="text-3xl font-serif mb-2">New Releases</h2>
              <p className="text-slate-600 dark:text-slate-300 mb-6">
                Fresh picks from 2020 onwards
              </p>
              <div className="grid grid-cols-2 gap-3">
                {newReleases.map((book) => (
                  <Link
                    key={book.id}
                    href={`/book/${book.id}`}
                    className="aspect-[2/3] rounded-lg overflow-hidden hover:scale-105 transition-transform"
                  >
                    <img
                      src={book.coverUrl}
                      alt={book.title}
                      className="w-full h-full object-cover"
                    />
                  </Link>
                ))}
              </div>
            </div>
          </div>

          {/* Editor's Pick */}
          <div className="bg-gradient-to-br from-teal-100 to-cyan-100 dark:from-teal-950 dark:to-cyan-950 rounded-xl p-6 flex flex-col justify-between">
            <div>
              <h3 className="text-2xl font-serif mb-2">Editor's Pick</h3>
              <p className="text-sm text-slate-600 dark:text-slate-300 mb-4">
                Our top recommendation
              </p>
            </div>
            {editorsPicks[0] && (
              <Link
                href={`/book/${editorsPicks[0].id}`}
                className="block hover:scale-105 transition-transform"
              >
                <img
                  src={editorsPicks[0].coverUrl}
                  alt={editorsPicks[0].title}
                  className="w-32 h-48 object-cover rounded-lg shadow-lg mx-auto"
                />
              </Link>
            )}
          </div>

          {/* Top Authors */}
          <div className="bg-gradient-to-br from-amber-100 to-orange-100 dark:from-amber-950 dark:to-orange-950 rounded-xl p-6">
            <h3 className="text-2xl font-serif mb-4">Top Authors</h3>
            <div className="space-y-3">
              {mockAuthors.slice(0, 3).map((author) => (
                <Link
                  key={author.id}
                  href={`/author/${author.id}`}
                  className="flex items-center gap-3 hover:opacity-80 transition-opacity"
                >
                  <img
                    src={author.avatar}
                    alt={author.name}
                    className="w-10 h-10 rounded-full object-cover"
                  />
                  <div>
                    <p className="font-semibold text-sm">{author.name}</p>
                    <p className="text-xs text-slate-600 dark:text-slate-400">
                      {author.booksCount} books
                    </p>
                  </div>
                </Link>
              ))}
            </div>
          </div>

          {/* Stats Card */}
          <div className="bg-gradient-to-br from-pink-100 to-rose-100 dark:from-pink-950 dark:to-rose-950 rounded-xl p-6 flex flex-col justify-center items-center text-center">
            <div className="text-5xl font-serif font-bold text-primary mb-2">
              {mockBooks.length}
            </div>
            <p className="text-lg font-semibold">Books Available</p>
            <p className="text-sm text-slate-600 dark:text-slate-400 mt-1">
              And growing daily
            </p>
          </div>
        </div>

        {/* All Books Grid */}
        <div className="mb-8">
          <h2 className="text-3xl font-serif mb-6">All Books</h2>
          {filteredBooks.length > 0 ? (
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-6">
              {filteredBooks.map((book) => (
                <BookPoster key={book.id} book={book} />
              ))}
            </div>
          ) : (
            <div className="text-center py-12">
              <p className="text-lg text-slate-600 dark:text-slate-400">
                No books found matching your search.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
