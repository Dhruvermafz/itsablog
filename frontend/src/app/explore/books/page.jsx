"use client";

import React, { useState, useEffect, useMemo } from "react";
import { Search, X, SlidersHorizontal } from "lucide-react";

import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { BookPoster } from "@/components/BookPoster";

import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";

import { useGetBooksQuery } from "@/api/bookApi";

// Debounce hook
const useDebounce = (value, delay) => {
  const [debouncedValue, setDebouncedValue] = useState(value);

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedValue(value);
    }, delay);
    return () => clearTimeout(handler);
  }, [value, delay]);

  return debouncedValue;
};

export default function BooksPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedGenres, setSelectedGenres] = useState([]);
  const [showFilters, setShowFilters] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 20;

  const debouncedSearch = useDebounce(searchQuery, 500);

  // Server-side query
  const {
    data: booksResponse,
    isLoading,
    error,
  } = useGetBooksQuery({
    page: currentPage,
    limit: itemsPerPage,
    search: debouncedSearch,
    genres: selectedGenres,
  });

  const allBooks = booksResponse?.books || [];
  const paginationInfo = booksResponse?.pagination;

  const totalBooks = paginationInfo?.total || 0;
  const totalPages = paginationInfo?.pages || 1;

  // Extract unique genres from current results (limitation of server-side)
  const allGenres = useMemo(() => {
    const genresSet = new Set();
    allBooks.forEach((book) => {
      book.genres?.forEach((genre) => {
        if (genre) genresSet.add(genre);
      });
    });
    return Array.from(genresSet).sort();
  }, [allBooks]);

  const toggleGenre = (genre) => {
    if (selectedGenres.includes(genre)) {
      setSelectedGenres(selectedGenres.filter((g) => g !== genre));
    } else {
      setSelectedGenres([...selectedGenres, genre]);
    }
    setCurrentPage(1); // Reset to first page
  };

  const clearFilters = () => {
    setSearchQuery("");
    setSelectedGenres([]);
    setCurrentPage(1);
  };

  const goToPage = (page) => {
    setCurrentPage(Math.max(1, Math.min(page, totalPages)));
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin w-10 h-10 border-4 border-primary border-t-transparent rounded-full mx-auto mb-4" />
          <p className="text-lg">Loading books...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center text-red-500">
        Failed to load books. Please try again.
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background pb-16">
      <div className="container mx-auto px-4 md:px-6 lg:px-8 pt-8">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-10 gap-4">
          <div>
            <h1 className="text-5xl font-serif tracking-tight">All Books</h1>
            <p className="text-muted-foreground mt-2 text-lg">
              Discover {totalBooks} titles
            </p>
          </div>

          <Button
            variant="outline"
            onClick={() => setShowFilters(!showFilters)}
            className="flex items-center gap-2"
          >
            <SlidersHorizontal size={18} />
            Filters
            {selectedGenres.length > 0 && (
              <Badge variant="secondary">{selectedGenres.length}</Badge>
            )}
          </Button>
        </div>

        {/* Search Bar */}
        <div className="relative mb-8 max-w-2xl">
          <Search
            className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground"
            size={20}
          />
          <Input
            placeholder="Search by title or author..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-12 py-6 text-lg rounded-2xl"
          />
        </div>

        <div className="flex flex-col lg:flex-row gap-8">
          {/* Filters Sidebar */}
          <div
            className={`lg:w-72 lg:sticky lg:top-20 lg:self-start transition-all duration-300 ${
              showFilters ? "block" : "hidden lg:block"
            }`}
          >
            <div className="bg-card border border-border rounded-3xl p-6">
              <div className="flex items-center justify-between mb-6">
                <h3 className="font-semibold text-xl">Filters</h3>
                {(searchQuery || selectedGenres.length > 0) && (
                  <Button variant="ghost" size="sm" onClick={clearFilters}>
                    Clear All <X size={16} className="ml-1" />
                  </Button>
                )}
              </div>

              <div>
                <p className="font-medium mb-3 text-sm uppercase tracking-wider text-muted-foreground">
                  Genres
                </p>
                <div className="flex flex-wrap gap-2">
                  {allGenres.map((genre) => (
                    <Badge
                      key={genre}
                      variant={
                        selectedGenres.includes(genre) ? "default" : "outline"
                      }
                      className="cursor-pointer transition-all hover:scale-105 active:scale-95"
                      onClick={() => toggleGenre(genre)}
                    >
                      {genre}
                    </Badge>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Books Content */}
          <div className="flex-1">
            {allBooks.length > 0 ? (
              <>
                <p className="text-muted-foreground mb-6">
                  Showing {(currentPage - 1) * itemsPerPage + 1}–
                  {Math.min(currentPage * itemsPerPage, totalBooks)} of{" "}
                  {totalBooks} books
                </p>

                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6">
                  {allBooks.map((book) => (
                    <BookPoster key={book._id} book={book} />
                  ))}
                </div>

                {/* Pagination */}
                {totalPages > 1 && (
                  <div className="mt-12 flex justify-center">
                    <Pagination>
                      <PaginationContent>
                        <PaginationItem>
                          <PaginationPrevious
                            href="#"
                            onClick={(e) => {
                              e.preventDefault();
                              goToPage(currentPage - 1);
                            }}
                            className={
                              currentPage === 1
                                ? "pointer-events-none opacity-50"
                                : "cursor-pointer"
                            }
                          />
                        </PaginationItem>

                        {Array.from(
                          { length: totalPages },
                          (_, i) => i + 1,
                        ).map((page) => {
                          if (
                            page === 1 ||
                            page === totalPages ||
                            (page >= currentPage - 2 && page <= currentPage + 2)
                          ) {
                            return (
                              <PaginationItem key={page}>
                                <PaginationLink
                                  href="#"
                                  isActive={currentPage === page}
                                  onClick={(e) => {
                                    e.preventDefault();
                                    goToPage(page);
                                  }}
                                >
                                  {page}
                                </PaginationLink>
                              </PaginationItem>
                            );
                          }

                          if (
                            page === currentPage - 3 ||
                            page === currentPage + 3
                          ) {
                            return (
                              <PaginationItem key={page}>
                                <PaginationEllipsis />
                              </PaginationItem>
                            );
                          }
                          return null;
                        })}

                        <PaginationItem>
                          <PaginationNext
                            href="#"
                            onClick={(e) => {
                              e.preventDefault();
                              goToPage(currentPage + 1);
                            }}
                            className={
                              currentPage === totalPages
                                ? "pointer-events-none opacity-50"
                                : "cursor-pointer"
                            }
                          />
                        </PaginationItem>
                      </PaginationContent>
                    </Pagination>
                  </div>
                )}
              </>
            ) : (
              <div className="text-center py-20">
                <h3 className="text-3xl font-serif mb-3">No books found</h3>
                <p className="text-muted-foreground">
                  Try adjusting your search or filters.
                </p>
                <Button onClick={clearFilters} className="mt-6">
                  Clear Filters
                </Button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
