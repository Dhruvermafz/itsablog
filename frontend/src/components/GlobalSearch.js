"use client";

import React, { useState, useEffect, useMemo } from "react";
import Link from "next/link";
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

import { enhancedBooks } from "@/data/categoriesData";
import { mockAuthors } from "@/data/mockData";
import { getStoredPublicLists } from "@/data/publicListsData";

export const GlobalSearch = ({ open, onOpenChange }) => {
  const [searchQuery, setSearchQuery] = useState("");
  const [activeTab, setActiveTab] = useState("books");

  const router = useRouter();

  /* Mock Users */
  const mockUsers = [
    {
      id: "user1",
      name: "Sarah Chen",
      avatar:
        "https://ui-avatars.com/api/?name=Sarah+Chen&background=6366F1&color=fff",
      bio: "Book lover and literary critic",
    },
    {
      id: "user2",
      name: "James Wilson",
      avatar:
        "https://ui-avatars.com/api/?name=James+Wilson&background=8B5CF6&color=fff",
      bio: "Mystery & thriller enthusiast",
    },
    {
      id: "user3",
      name: "Emily Rodriguez",
      avatar:
        "https://ui-avatars.com/api/?name=Emily+Rodriguez&background=EC4899&color=fff",
      bio: "Romance novel addict",
    },
  ];

  /* Search Logic */
  const filteredBooks = useMemo(() => {
    return enhancedBooks.filter(
      (book) =>
        book.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        book.author.toLowerCase().includes(searchQuery.toLowerCase()),
    );
  }, [searchQuery]);

  const filteredAuthors = useMemo(() => {
    return mockAuthors.filter((author) =>
      author.name.toLowerCase().includes(searchQuery.toLowerCase()),
    );
  }, [searchQuery]);

  const filteredUsers = useMemo(() => {
    return mockUsers.filter((user) =>
      user.name.toLowerCase().includes(searchQuery.toLowerCase()),
    );
  }, [searchQuery]);

  const filteredLists = useMemo(() => {
    return getStoredPublicLists().filter(
      (list) =>
        list.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        list.description.toLowerCase().includes(searchQuery.toLowerCase()),
    );
  }, [searchQuery]);

  /* Keyboard Shortcut */
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

  /* Reset Modal */
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

      default:
        break;
    }
  };

  const EmptyState = ({ icon: Icon, text }) => (
    <div className="flex flex-col items-center justify-center py-20 text-center">
      <div className="w-16 h-16 rounded-2xl bg-muted flex items-center justify-center mb-4">
        <Icon className="w-8 h-8 text-muted-foreground opacity-70" />
      </div>

      <p className="text-muted-foreground">{text}</p>
    </div>
  );

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent
        className="overflow-hidden border-border/50 bg-background/95 backdrop-blur-xl p-0 gap-0 sm:max-w-4xl rounded-3xl"
        data-testid="global-search-modal"
      >
        {/* Top Search */}
        <div className="border-b border-border/50">
          <div className="flex items-center gap-4 px-6 py-5">
            <div className="flex items-center justify-center w-10 h-10 rounded-2xl bg-primary/10 text-primary">
              <Search size={18} />
            </div>

            <Input
              autoFocus
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search books, authors, readers, or lists..."
              className="border-0 shadow-none text-lg h-auto px-0 focus-visible:ring-0 bg-transparent"
              data-testid="global-search-input"
            />

            <kbd className="hidden sm:flex items-center gap-1 rounded-lg border bg-muted px-2.5 py-1 text-xs text-muted-foreground font-mono">
              <Command size={12} />K
            </kbd>
          </div>

          {/* Suggestions */}
          {!searchQuery && (
            <div className="px-6 pb-5 flex flex-wrap gap-2">
              {[
                "Fantasy",
                "Dark Academia",
                "Mystery",
                "Classic Literature",
              ].map((item) => (
                <Badge
                  key={item}
                  variant="secondary"
                  className="rounded-full px-3 py-1 cursor-pointer hover:bg-primary hover:text-primary-foreground transition-colors"
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
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="w-full h-14 rounded-none border-b bg-transparent justify-start px-4">
            <TabsTrigger value="books" className="gap-2 rounded-full">
              <BookOpen size={16} />
              Books
              {!!searchQuery && (
                <Badge variant="secondary" className="ml-1 rounded-full">
                  {filteredBooks.length}
                </Badge>
              )}
            </TabsTrigger>

            <TabsTrigger value="authors" className="gap-2 rounded-full">
              <User size={16} />
              Authors
              {!!searchQuery && (
                <Badge variant="secondary" className="ml-1 rounded-full">
                  {filteredAuthors.length}
                </Badge>
              )}
            </TabsTrigger>

            <TabsTrigger value="lists" className="gap-2 rounded-full">
              <List size={16} />
              Lists
              {!!searchQuery && (
                <Badge variant="secondary" className="ml-1 rounded-full">
                  {filteredLists.length}
                </Badge>
              )}
            </TabsTrigger>

            <TabsTrigger value="users" className="gap-2 rounded-full">
              <Users size={16} />
              Users
              {!!searchQuery && (
                <Badge variant="secondary" className="ml-1 rounded-full">
                  {filteredUsers.length}
                </Badge>
              )}
            </TabsTrigger>
          </TabsList>

          <ScrollArea className="h-[520px]">
            {/* BOOKS */}
            <TabsContent value="books" className="p-4 mt-0">
              {searchQuery ? (
                filteredBooks.length > 0 ? (
                  <div className="space-y-2">
                    {filteredBooks.map((book) => (
                      <button
                        key={book.id}
                        onClick={() => handleResultClick("book", book.id)}
                        className="w-full group rounded-2xl border border-transparent hover:border-border hover:bg-muted/40 transition-all p-3 text-left"
                      >
                        <div className="flex items-center gap-4">
                          <img
                            src={book.coverUrl}
                            alt={book.title}
                            className="w-14 h-20 rounded-xl object-cover shadow-md"
                          />

                          <div className="flex-1 min-w-0">
                            <h4 className="font-semibold truncate text-base">
                              {book.title}
                            </h4>

                            <p className="text-sm text-muted-foreground">
                              by {book.author}
                            </p>

                            <div className="flex items-center gap-2 mt-2">
                              <Badge variant="outline" className="rounded-full">
                                {book.year}
                              </Badge>

                              <div className="flex items-center gap-1 text-xs text-amber-500">
                                <Star className="w-3 h-3 fill-current" />
                                {book.rating}
                              </div>
                            </div>
                          </div>

                          <ArrowUpRight className="w-4 h-4 opacity-0 group-hover:opacity-100 transition-opacity text-muted-foreground" />
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

            {/* AUTHORS */}
            <TabsContent value="authors" className="p-4 mt-0">
              {searchQuery ? (
                filteredAuthors.length > 0 ? (
                  <div className="space-y-2">
                    {filteredAuthors.map((author) => (
                      <button
                        key={author.id}
                        onClick={() => handleResultClick("author", author.id)}
                        className="w-full group rounded-2xl border border-transparent hover:border-border hover:bg-muted/40 transition-all p-3 text-left"
                      >
                        <div className="flex items-center gap-4">
                          <Avatar className="w-14 h-14">
                            <AvatarImage src={author.avatar} />

                            <AvatarFallback>
                              {author.name?.charAt(0)}
                            </AvatarFallback>
                          </Avatar>

                          <div className="flex-1">
                            <h4 className="font-semibold">{author.name}</h4>

                            <p className="text-sm text-muted-foreground line-clamp-1">
                              {author.bio}
                            </p>

                            <div className="flex gap-2 mt-2">
                              <Badge variant="outline" className="rounded-full">
                                {author.booksCount} books
                              </Badge>

                              <Badge
                                variant="secondary"
                                className="rounded-full"
                              >
                                {author.nationality}
                              </Badge>
                            </div>
                          </div>

                          <ArrowUpRight className="w-4 h-4 opacity-0 group-hover:opacity-100 transition-opacity text-muted-foreground" />
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

            {/* LISTS */}
            <TabsContent value="lists" className="p-4 mt-0">
              {searchQuery ? (
                filteredLists.length > 0 ? (
                  <div className="space-y-2">
                    {filteredLists.map((list) => (
                      <button
                        key={list.id}
                        onClick={() => handleResultClick("list", list.id)}
                        className="w-full group rounded-2xl border border-transparent hover:border-border hover:bg-muted/40 transition-all p-3 text-left"
                      >
                        <div className="flex items-center gap-4">
                          <img
                            src={list.coverImage}
                            alt={list.name}
                            className="w-20 h-14 rounded-xl object-cover"
                          />

                          <div className="flex-1">
                            <h4 className="font-semibold line-clamp-1">
                              {list.name}
                            </h4>

                            <p className="text-sm text-muted-foreground line-clamp-1">
                              {list.description}
                            </p>

                            <div className="flex items-center gap-3 mt-2 text-xs text-muted-foreground">
                              <span>{list.books.length} books</span>

                              <span>by {list.userName}</span>
                            </div>
                          </div>

                          <ArrowUpRight className="w-4 h-4 opacity-0 group-hover:opacity-100 transition-opacity text-muted-foreground" />
                        </div>
                      </button>
                    ))}
                  </div>
                ) : (
                  <EmptyState icon={List} text="No lists found" />
                )
              ) : (
                <EmptyState
                  icon={List}
                  text="Explore curated reading collections"
                />
              )}
            </TabsContent>

            {/* USERS */}
            <TabsContent value="users" className="p-4 mt-0">
              {searchQuery ? (
                filteredUsers.length > 0 ? (
                  <div className="space-y-2">
                    {filteredUsers.map((user) => (
                      <button
                        key={user.id}
                        onClick={() => handleResultClick("user", user.id)}
                        className="w-full group rounded-2xl border border-transparent hover:border-border hover:bg-muted/40 transition-all p-3 text-left"
                      >
                        <div className="flex items-center gap-4">
                          <Avatar className="w-14 h-14">
                            <AvatarImage src={user.avatar} />

                            <AvatarFallback>
                              {user.name?.charAt(0)}
                            </AvatarFallback>
                          </Avatar>

                          <div className="flex-1">
                            <h4 className="font-semibold">{user.name}</h4>

                            <p className="text-sm text-muted-foreground">
                              {user.bio}
                            </p>
                          </div>

                          <ArrowUpRight className="w-4 h-4 opacity-0 group-hover:opacity-100 transition-opacity text-muted-foreground" />
                        </div>
                      </button>
                    ))}
                  </div>
                ) : (
                  <EmptyState icon={Users} text="No users found" />
                )
              ) : (
                <EmptyState
                  icon={Users}
                  text="Find readers with similar taste"
                />
              )}
            </TabsContent>
          </ScrollArea>

          {/* Footer */}
          <div className="border-t border-border/50 px-5 py-3 flex items-center justify-between text-xs text-muted-foreground bg-muted/20">
            <div className="flex items-center gap-2">
              <Clock3 size={14} />
              Instant search experience
            </div>

            <div className="hidden sm:flex items-center gap-4">
              <span>↑↓ navigate</span>
              <span>↵ open</span>
              <span>esc close</span>
            </div>
          </div>
        </Tabs>
      </DialogContent>
    </Dialog>
  );
};
