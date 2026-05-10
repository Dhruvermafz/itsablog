"use client";

import React, { useState, useEffect, useCallback } from "react";
import { useRouter } from "next/navigation";

import {
  Search,
  BookOpen,
  User,
  List,
  Users,
  Command,
  Sparkles,
  Clock3,
  ArrowUpRight,
  Star,
} from "lucide-react";

import { Dialog, DialogContent } from "./ui/dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "./ui/tabs";
import { Input } from "./ui/input";
import { Badge } from "./ui/badge";
import { ScrollArea } from "./ui/scroll-area";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";

import { useLazyGlobalSearchQuery } from "@/api/searchApi";

const MAX_RESULTS_PER_TAB = 10;

export const GlobalSearch = ({ open, onOpenChange }) => {
  const [searchQuery, setSearchQuery] = useState("");
  const [activeTab, setActiveTab] = useState("books");

  const router = useRouter();

  const [search, { data, isLoading, isFetching }] = useLazyGlobalSearchQuery();

  const debouncedSearch = useCallback(
    debounce((query) => {
      if (query.trim().length >= 2) {
        search({ q: query.trim(), limit: 15 });
      }
    }, 300),
    [search],
  );

  useEffect(() => {
    debouncedSearch(searchQuery);
  }, [searchQuery, debouncedSearch]);

  // Keyboard Shortcut
  useEffect(() => {
    const handleKeyDown = (e) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === "k") {
        e.preventDefault();
        onOpenChange(true);
      }
    };

    document.addEventListener("keydown", handleKeyDown);

    return () => {
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, [onOpenChange]);

  // Reset modal state
  useEffect(() => {
    if (!open) {
      setSearchQuery("");
      setActiveTab("books");
    }
  }, [open]);

  const handleResultClick = (type, id) => {
    onOpenChange(false);

    switch (type) {
      case "book":
        router.push(`/book/${id}`);
        break;

      case "author":
        router.push(`/author/${id}`);
        break;

      case "list":
        router.push(`/list/${id}`);
        break;

      case "user":
        router.push(`/u/${id}`);
        break;

      case "club":
        router.push(`/club/${id}`);
        break;

      default:
        break;
    }
  };

  const isSearching = isLoading || isFetching;

  const results = data || {
    books: [],
    authors: [],
    clubs: [],
    lists: [],
    users: [],
  };

  const limitedBooks = results.books.slice(0, MAX_RESULTS_PER_TAB);
  const limitedAuthors = results.authors.slice(0, MAX_RESULTS_PER_TAB);
  const limitedLists = results.lists.slice(0, MAX_RESULTS_PER_TAB);
  const limitedUsers = results.users.slice(0, MAX_RESULTS_PER_TAB);

  const EmptyState = ({ icon: Icon, text }) => (
    <div className="flex flex-col items-center justify-center py-16 sm:py-20 text-center">
      <div className="w-14 h-14 sm:w-16 sm:h-16 rounded-2xl bg-muted flex items-center justify-center mb-4">
        <Icon className="w-7 h-7 sm:w-8 sm:h-8 text-muted-foreground opacity-70" />
      </div>

      <p className="text-muted-foreground text-sm">{text}</p>
    </div>
  );

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent
        className="
          p-0
          gap-0
          border-border/50
          bg-background/95
          backdrop-blur-xl
          w-[95vw]
          max-w-4xl
          h-auto
          max-h-[90vh]
          rounded-2xl
          sm:rounded-3xl
          overflow-hidden
          flex
          flex-col
          mx-auto
        "
      >
        {/* Header */}
        <div className="border-b border-border/50 flex-shrink-0">
          <div className="flex items-center gap-3 px-4 sm:px-6 py-4">
            <div className="w-9 h-9 rounded-xl bg-primary/10 text-primary flex items-center justify-center flex-shrink-0">
              <Search size={18} />
            </div>

            <Input
              autoFocus
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search books, authors, readers, or lists..."
              className="
                border-0
                shadow-none
                text-sm
                sm:text-lg
                h-10
                px-0
                focus-visible:ring-0
                bg-transparent
              "
            />

            <kbd className="hidden sm:flex items-center gap-1 rounded-lg border bg-muted px-2.5 py-1 text-xs text-muted-foreground font-mono">
              <Command size={12} />K
            </kbd>
          </div>

          {/* Quick Suggestions */}
          {!searchQuery && (
            <div className="px-4 sm:px-6 pb-4 flex flex-wrap gap-2">
              {[
                "Fantasy",
                "Dark Academia",
                "Mystery",
                "Classic Literature",
              ].map((item) => (
                <Badge
                  key={item}
                  variant="secondary"
                  className="
                    rounded-full
                    px-3
                    py-1
                    cursor-pointer
                    hover:bg-primary
                    hover:text-primary-foreground
                    transition-colors
                  "
                  onClick={() => setSearchQuery(item)}
                >
                  <Sparkles className="w-3 h-3 mr-1" />
                  {item}
                </Badge>
              ))}
            </div>
          )}
        </div>

        {/* Tabs */}
        <Tabs
          value={activeTab}
          onValueChange={setActiveTab}
          className="flex flex-col flex-1 overflow-hidden"
        >
          <TabsList
            className="
              w-full
              min-h-14
              rounded-none
              border-b
              bg-transparent
              justify-start
              px-2
              sm:px-6
              gap-1
              overflow-x-auto
              flex-nowrap
              flex-shrink-0
            "
          >
            <TabsTrigger
              value="books"
              className="gap-2 rounded-full whitespace-nowrap text-sm"
            >
              <BookOpen size={16} />
              Books
              {searchQuery && (
                <Badge variant="secondary" className="ml-1 text-xs">
                  {results.books.length}
                </Badge>
              )}
            </TabsTrigger>

            <TabsTrigger
              value="authors"
              className="gap-2 rounded-full whitespace-nowrap text-sm"
            >
              <User size={16} />
              Authors
              {searchQuery && (
                <Badge variant="secondary" className="ml-1 text-xs">
                  {results.authors.length}
                </Badge>
              )}
            </TabsTrigger>

            <TabsTrigger
              value="lists"
              className="gap-2 rounded-full whitespace-nowrap text-sm"
            >
              <List size={16} />
              Lists
              {searchQuery && (
                <Badge variant="secondary" className="ml-1 text-xs">
                  {results.lists.length}
                </Badge>
              )}
            </TabsTrigger>

            <TabsTrigger
              value="users"
              className="gap-2 rounded-full whitespace-nowrap text-sm"
            >
              <Users size={16} />
              Users
              {searchQuery && (
                <Badge variant="secondary" className="ml-1 text-xs">
                  {results.users.length}
                </Badge>
              )}
            </TabsTrigger>
          </TabsList>

          {/* Scrollable Content */}
          <ScrollArea className="flex-1 overflow-y-auto">
            <div className="p-4 sm:p-6">
              {/* ================= BOOKS ================= */}
              <TabsContent value="books" className="mt-0 focus-visible:ring-0">
                {searchQuery ? (
                  isSearching ? (
                    <div className="py-12 text-center text-muted-foreground">
                      Searching books...
                    </div>
                  ) : limitedBooks.length > 0 ? (
                    <div className="space-y-3">
                      {limitedBooks.map((book) => (
                        <button
                          key={book._id}
                          onClick={() => handleResultClick("book", book._id)}
                          className="
                            w-full
                            group
                            rounded-2xl
                            border
                            border-transparent
                            hover:border-border
                            hover:bg-muted/50
                            transition-all
                            p-3
                            sm:p-4
                            text-left
                            active:scale-[0.985]
                          "
                        >
                          <div className="flex items-center gap-3 sm:gap-4">
                            <img
                              src={book.coverUrl || "/placeholder-book.jpg"}
                              alt={book.title}
                              className="
                                w-12
                                h-16
                                sm:w-16
                                sm:h-24
                                rounded-xl
                                object-cover
                                shadow-md
                                flex-shrink-0
                              "
                            />

                            <div className="flex-1 min-w-0">
                              <h4 className="font-semibold truncate text-sm sm:text-lg">
                                {book.title}
                              </h4>

                              <p className="text-xs sm:text-sm text-muted-foreground">
                                by {book.author?.name || "Unknown Author"}
                              </p>

                              <div className="flex items-center gap-2 mt-2 flex-wrap">
                                {book.year && (
                                  <Badge variant="outline" className="text-xs">
                                    {book.year}
                                  </Badge>
                                )}

                                {book.avgRating && (
                                  <div className="flex items-center gap-1 text-amber-500 text-xs">
                                    <Star className="w-3 h-3 fill-current" />
                                    {book.avgRating.toFixed(1)}
                                  </div>
                                )}
                              </div>
                            </div>

                            <ArrowUpRight
                              className="
                                w-4
                                h-4
                                opacity-0
                                group-hover:opacity-100
                                transition-opacity
                                hidden
                                sm:block
                              "
                            />
                          </div>
                        </button>
                      ))}
                    </div>
                  ) : (
                    <EmptyState icon={BookOpen} text="No books found" />
                  )
                ) : (
                  <EmptyState
                    icon={BookOpen}
                    text="Search for your next favorite book"
                  />
                )}
              </TabsContent>

              {/* ================= AUTHORS ================= */}
              <TabsContent
                value="authors"
                className="mt-0 focus-visible:ring-0"
              >
                {searchQuery ? (
                  isSearching ? (
                    <div className="py-12 text-center text-muted-foreground">
                      Searching authors...
                    </div>
                  ) : limitedAuthors.length > 0 ? (
                    <div className="space-y-3">
                      {limitedAuthors.map((author) => (
                        <button
                          key={author._id}
                          onClick={() =>
                            handleResultClick("author", author._id)
                          }
                          className="
                            w-full
                            group
                            rounded-2xl
                            border
                            border-transparent
                            hover:border-border
                            hover:bg-muted/50
                            transition-all
                            p-3
                            sm:p-4
                            text-left
                            active:scale-[0.985]
                          "
                        >
                          <div className="flex items-center gap-3 sm:gap-4">
                            <Avatar className="w-12 h-12 sm:w-16 sm:h-16">
                              <AvatarImage src={author.avatar} />

                              <AvatarFallback>
                                {author.name?.charAt(0)}
                              </AvatarFallback>
                            </Avatar>

                            <div className="flex-1 min-w-0">
                              <h4 className="font-semibold text-sm sm:text-lg truncate">
                                {author.name}
                              </h4>

                              <p className="text-xs sm:text-sm text-muted-foreground line-clamp-2">
                                {author.bio}
                              </p>

                              <div className="flex gap-2 mt-2 flex-wrap">
                                {author.booksCount && (
                                  <Badge variant="outline" className="text-xs">
                                    {author.booksCount} books
                                  </Badge>
                                )}

                                {author.nationality && (
                                  <Badge
                                    variant="secondary"
                                    className="text-xs"
                                  >
                                    {author.nationality}
                                  </Badge>
                                )}
                              </div>
                            </div>
                          </div>
                        </button>
                      ))}
                    </div>
                  ) : (
                    <EmptyState icon={User} text="No authors found" />
                  )
                ) : (
                  <EmptyState icon={User} text="Discover celebrated authors" />
                )}
              </TabsContent>

              {/* ================= LISTS ================= */}
              <TabsContent value="lists" className="mt-0 focus-visible:ring-0">
                {searchQuery ? (
                  isSearching ? (
                    <div className="py-12 text-center text-muted-foreground">
                      Searching lists...
                    </div>
                  ) : limitedLists.length > 0 ? (
                    <div className="space-y-3">
                      {limitedLists.map((list) => (
                        <button
                          key={list._id}
                          onClick={() => handleResultClick("list", list._id)}
                          className="
                            w-full
                            group
                            rounded-2xl
                            border
                            border-transparent
                            hover:border-border
                            hover:bg-muted/50
                            transition-all
                            p-4
                            text-left
                            active:scale-[0.985]
                          "
                        >
                          <div className="flex items-start gap-4">
                            <div className="flex-1 min-w-0">
                              <h4 className="font-semibold text-sm sm:text-lg truncate">
                                {list.title}
                              </h4>

                              <p className="text-xs sm:text-sm text-muted-foreground line-clamp-2 mt-1">
                                {list.description}
                              </p>

                              <div className="flex flex-wrap items-center gap-2 sm:gap-3 mt-3 text-xs text-muted-foreground">
                                <span>by @{list.user?.username}</span>

                                <span>• {list.itemsCount} items</span>

                                <span>• {list.likesCount} likes</span>
                              </div>
                            </div>
                          </div>
                        </button>
                      ))}
                    </div>
                  ) : (
                    <EmptyState icon={List} text="No lists found" />
                  )
                ) : (
                  <EmptyState icon={List} text="Browse public reading lists" />
                )}
              </TabsContent>

              {/* ================= USERS ================= */}
              <TabsContent value="users" className="mt-0 focus-visible:ring-0">
                {searchQuery ? (
                  isSearching ? (
                    <div className="py-12 text-center text-muted-foreground">
                      Searching readers...
                    </div>
                  ) : limitedUsers.length > 0 ? (
                    <div className="space-y-3">
                      {limitedUsers.map((user) => (
                        <button
                          key={user._id}
                          onClick={() => handleResultClick("user", user._id)}
                          className="
                            w-full
                            group
                            rounded-2xl
                            border
                            border-transparent
                            hover:border-border
                            hover:bg-muted/50
                            transition-all
                            p-4
                            text-left
                            active:scale-[0.985]
                          "
                        >
                          <div className="flex items-center gap-3 sm:gap-4">
                            <Avatar className="w-12 h-12 sm:w-14 sm:h-14">
                              <AvatarImage src={user.avatar} />

                              <AvatarFallback>
                                {user.username?.charAt(0).toUpperCase()}
                              </AvatarFallback>
                            </Avatar>

                            <div className="flex-1 min-w-0">
                              <h4 className="font-semibold text-sm sm:text-lg truncate">
                                @{user.username}
                              </h4>

                              <p className="text-xs sm:text-sm text-muted-foreground line-clamp-2">
                                {user.bio}
                              </p>

                              <div className="flex gap-4 mt-2 text-xs text-muted-foreground flex-wrap">
                                <span>{user.followersCount} followers</span>

                                <span>{user.reviewsCount} reviews</span>
                              </div>
                            </div>
                          </div>
                        </button>
                      ))}
                    </div>
                  ) : (
                    <EmptyState icon={Users} text="No readers found" />
                  )
                ) : (
                  <EmptyState icon={Users} text="Connect with fellow readers" />
                )}
              </TabsContent>
            </div>
          </ScrollArea>
        </Tabs>

        {/* Footer */}
        <div
          className="
            border-t
            border-border/50
            px-4
            sm:px-6
            py-3
            flex
            items-center
            justify-between
            text-xs
            text-muted-foreground
            bg-muted/30
            flex-shrink-0
          "
        >
          <div className="hidden md:flex items-center gap-4">
            <span>↑↓ navigate</span>
            <span>↵ open</span>
            <span>esc close</span>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

// Debounce Utility
function debounce(func, delay) {
  let timeoutId;

  return (...args) => {
    clearTimeout(timeoutId);

    timeoutId = setTimeout(() => {
      func(...args);
    }, delay);
  };
}
