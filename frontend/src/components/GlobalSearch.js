"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Search, Book, User, List, Users, Command } from "lucide-react";
import { Dialog, DialogContent } from "./ui/dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "./ui/tabs";
import { Input } from "./ui/input";
import { Badge } from "./ui/badge";
import { enhancedBooks } from "@/data/categoriesData";
import { mockAuthors } from "@/data/mockData";
import { getStoredPublicLists } from "@/data/publicListsData";

export const GlobalSearch = ({ open, onOpenChange }) => {
  const [searchQuery, setSearchQuery] = useState("");
  const [activeTab, setActiveTab] = useState("books");
  const router = useRouter();

  // Mock users data
  const mockUsers = [
    {
      id: "user1",
      name: "Sarah Chen",
      avatar:
        "https://ui-avatars.com/api/?name=Sarah+Chen&background=6366F1&color=fff",
      bio: "Book lover and avid reader",
    },
    {
      id: "user2",
      name: "James Wilson",
      avatar:
        "https://ui-avatars.com/api/?name=James+Wilson&background=6366F1&color=fff",
      bio: "Mystery enthusiast",
    },
    {
      id: "user3",
      name: "Emily Rodriguez",
      avatar:
        "https://ui-avatars.com/api/?name=Emily+Rodriguez&background=6366F1&color=fff",
      bio: "Romance novel addict",
    },
  ];

  // Filter results
  const filteredBooks = enhancedBooks.filter(
    (book) =>
      book.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      book.author.toLowerCase().includes(searchQuery.toLowerCase()),
  );

  const filteredAuthors = mockAuthors.filter((author) =>
    author.name.toLowerCase().includes(searchQuery.toLowerCase()),
  );

  const filteredUsers = mockUsers.filter((user) =>
    user.name.toLowerCase().includes(searchQuery.toLowerCase()),
  );

  const filteredLists = getStoredPublicLists().filter(
    (list) =>
      list.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      list.description.toLowerCase().includes(searchQuery.toLowerCase()),
  );

  // Keyboard shortcut (Cmd+K / Ctrl+K)
  useEffect(() => {
    const handleKeyDown = (e) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === "k") {
        e.preventDefault();
        onOpenChange(true);
      }
    };

    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, [onOpenChange]);

  // Reset search when modal closes
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
        // No user profile pages yet
        break;
      default:
        break;
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent
        className="max-w-3xl p-0 gap-0"
        data-testid="global-search-modal"
      >
        {/* Search Input */}
        <div className="flex items-center gap-3 px-6 py-5 border-b">
          <Search className="text-slate-400" size={20} />
          <Input
            type="text"
            placeholder="Search for books, authors, lists, or users..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="border-0 focus-visible:ring-0 text-lg h-auto p-0"
            autoFocus
            data-testid="global-search-input"
          />
          <kbd className="hidden sm:inline-flex items-center gap-1 px-2 py-1 text-xs font-mono text-slate-500 bg-slate-100 dark:bg-slate-800 rounded">
            <Command size={12} />K
          </kbd>
        </div>

        {/* Tabs */}
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="w-full justify-start rounded-none border-b bg-transparent px-6 h-12">
            <TabsTrigger
              value="books"
              className="gap-2"
              data-testid="tab-books"
            >
              <Book size={16} />
              Books
              {searchQuery && (
                <Badge variant="secondary" className="ml-1 h-5 px-1.5 text-xs">
                  {filteredBooks.length}
                </Badge>
              )}
            </TabsTrigger>
            <TabsTrigger
              value="authors"
              className="gap-2"
              data-testid="tab-authors"
            >
              <User size={16} />
              Authors
              {searchQuery && (
                <Badge variant="secondary" className="ml-1 h-5 px-1.5 text-xs">
                  {filteredAuthors.length}
                </Badge>
              )}
            </TabsTrigger>
            <TabsTrigger
              value="lists"
              className="gap-2"
              data-testid="tab-lists"
            >
              <List size={16} />
              Lists
              {searchQuery && (
                <Badge variant="secondary" className="ml-1 h-5 px-1.5 text-xs">
                  {filteredLists.length}
                </Badge>
              )}
            </TabsTrigger>
            <TabsTrigger
              value="users"
              className="gap-2"
              data-testid="tab-users"
            >
              <Users size={16} />
              Users
              {searchQuery && (
                <Badge variant="secondary" className="ml-1 h-5 px-1.5 text-xs">
                  {filteredUsers.length}
                </Badge>
              )}
            </TabsTrigger>
          </TabsList>

          <div className="max-h-96 overflow-y-auto">
            {/* Books Tab */}
            <TabsContent value="books" className="p-4 mt-0">
              {searchQuery ? (
                filteredBooks.length > 0 ? (
                  <div className="space-y-2">
                    {filteredBooks.map((book) => (
                      <button
                        key={book.id}
                        onClick={() => handleResultClick("book", book.id)}
                        className="w-full flex items-center gap-4 p-3 hover:bg-slate-50 dark:hover:bg-slate-800 rounded-lg transition-colors text-left"
                        data-testid={`book-result-${book.id}`}
                      >
                        <img
                          src={book.coverUrl}
                          alt={book.title}
                          className="w-12 h-16 object-cover rounded"
                        />
                        <div className="flex-1 min-w-0">
                          <h4 className="font-semibold truncate">
                            {book.title}
                          </h4>
                          <p className="text-sm text-slate-600 dark:text-slate-400">
                            {book.author}
                          </p>
                          <div className="flex items-center gap-2 mt-1">
                            <Badge variant="outline" className="text-xs">
                              {book.year}
                            </Badge>
                            <span className="text-xs text-slate-500">
                              ★ {book.rating}
                            </span>
                          </div>
                        </div>
                      </button>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-12 text-slate-500">
                    No books found
                  </div>
                )
              ) : (
                <div className="text-center py-12 text-slate-400">
                  <Book size={48} className="mx-auto mb-3 opacity-20" />
                  <p>Start typing to search for books</p>
                </div>
              )}
            </TabsContent>

            {/* Authors Tab */}
            <TabsContent value="authors" className="p-4 mt-0">
              {searchQuery ? (
                filteredAuthors.length > 0 ? (
                  <div className="space-y-2">
                    {filteredAuthors.map((author) => (
                      <button
                        key={author.id}
                        onClick={() => handleResultClick("author", author.id)}
                        className="w-full flex items-center gap-4 p-3 hover:bg-slate-50 dark:hover:bg-slate-800 rounded-lg transition-colors text-left"
                        data-testid={`author-result-${author.id}`}
                      >
                        <img
                          src={author.avatar}
                          alt={author.name}
                          className="w-12 h-12 object-cover rounded-full"
                        />
                        <div className="flex-1 min-w-0">
                          <h4 className="font-semibold">{author.name}</h4>
                          <p className="text-sm text-slate-600 dark:text-slate-400 truncate">
                            {author.bio}
                          </p>
                          <div className="flex items-center gap-2 mt-1">
                            <Badge variant="outline" className="text-xs">
                              {author.booksCount} books
                            </Badge>
                            <span className="text-xs text-slate-500">
                              {author.nationality}
                            </span>
                          </div>
                        </div>
                      </button>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-12 text-slate-500">
                    No authors found
                  </div>
                )
              ) : (
                <div className="text-center py-12 text-slate-400">
                  <User size={48} className="mx-auto mb-3 opacity-20" />
                  <p>Start typing to search for authors</p>
                </div>
              )}
            </TabsContent>

            {/* Lists Tab */}
            <TabsContent value="lists" className="p-4 mt-0">
              {searchQuery ? (
                filteredLists.length > 0 ? (
                  <div className="space-y-2">
                    {filteredLists.map((list) => (
                      <button
                        key={list.id}
                        onClick={() => handleResultClick("list", list.id)}
                        className="w-full flex items-center gap-4 p-3 hover:bg-slate-50 dark:hover:bg-slate-800 rounded-lg transition-colors text-left"
                        data-testid={`list-result-${list.id}`}
                      >
                        <img
                          src={list.coverImage}
                          alt={list.name}
                          className="w-16 h-12 object-cover rounded"
                        />
                        <div className="flex-1 min-w-0">
                          <h4 className="font-semibold truncate">
                            {list.name}
                          </h4>
                          <p className="text-sm text-slate-600 dark:text-slate-400 truncate">
                            {list.description}
                          </p>
                          <div className="flex items-center gap-2 mt-1">
                            <span className="text-xs text-slate-500">
                              {list.books.length} books
                            </span>
                            <span className="text-xs text-slate-400">
                              by {list.userName}
                            </span>
                          </div>
                        </div>
                      </button>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-12 text-slate-500">
                    No lists found
                  </div>
                )
              ) : (
                <div className="text-center py-12 text-slate-400">
                  <List size={48} className="mx-auto mb-3 opacity-20" />
                  <p>Start typing to search for lists</p>
                </div>
              )}
            </TabsContent>

            {/* Users Tab */}
            <TabsContent value="users" className="p-4 mt-0">
              {searchQuery ? (
                filteredUsers.length > 0 ? (
                  <div className="space-y-2">
                    {filteredUsers.map((user) => (
                      <button
                        key={user.id}
                        onClick={() => handleResultClick("user", user.id)}
                        className="w-full flex items-center gap-4 p-3 hover:bg-slate-50 dark:hover:bg-slate-800 rounded-lg transition-colors text-left"
                        data-testid={`user-result-${user.id}`}
                      >
                        <img
                          src={user.avatar}
                          alt={user.name}
                          className="w-12 h-12 object-cover rounded-full"
                        />
                        <div className="flex-1 min-w-0">
                          <h4 className="font-semibold">{user.name}</h4>
                          <p className="text-sm text-slate-600 dark:text-slate-400 truncate">
                            {user.bio}
                          </p>
                        </div>
                      </button>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-12 text-slate-500">
                    No users found
                  </div>
                )
              ) : (
                <div className="text-center py-12 text-slate-400">
                  <Users size={48} className="mx-auto mb-3 opacity-20" />
                  <p>Start typing to search for users</p>
                </div>
              )}
            </TabsContent>
          </div>
        </Tabs>
      </DialogContent>
    </Dialog>
  );
};
