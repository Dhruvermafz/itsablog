"use client";

import React, { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { useRouter, useParams } from "next/navigation";

import { Plus, Trash2, BookOpen, LogOut } from "lucide-react";

import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

import { Button } from "@/components/ui/button";
import { ReviewCard } from "@/components/ReviewCard";
import { BookPoster } from "@/components/BookPoster";
import { Badge } from "@/components/ui/badge";

import { useAuth } from "@/contexts/AuthContext";

import {
  getStoredReviews,
  getStoredLists,
  mockBooks,
  saveList,
} from "@/data/mockData";

import { getStoredReadingShelf, SHELF_TYPES } from "@/data/readingShelfData";

import { BookShelfItem } from "@/components/BookShelfItem";

import { AddToShelfDialog } from "@/components/AddToShelfDialog";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

import {
  useGetProfileQuery,
  useGetFollowersQuery,
  useGetFollowingQuery,
} from "@/api/userApi";

export default function ProfilePage() {
  const router = useRouter();
  const params = useParams();

  const username = Array.isArray(params?.username)
    ? params.username[0]
    : params?.username;

  // =========================
  // AUTH
  // =========================

  const {
    user: authUser,
    loading: authLoading,
    logout,
    isAuthenticated,
  } = useAuth();

  // =========================
  // STATE
  // =========================

  const [newListName, setNewListName] = useState("");
  const [dialogOpen, setDialogOpen] = useState(false);
  const [refreshKey, setRefreshKey] = useState(0);

  // =========================
  // PROFILE QUERY
  // =========================

  const {
    data: profileResponse,
    isLoading: profileLoading,
    error: profileError,
  } = useGetProfileQuery(username, {
    skip: !username,
  });

  const profileUser = profileResponse?.data;

  console.log("AUTH USER:", authUser);
  console.log("PROFILE USER:", profileUser);

  // =========================
  // FOLLOWERS / FOLLOWING
  // =========================

  const { data: followersResponse } = useGetFollowersQuery(profileUser?._id, {
    skip: !profileUser?._id,
  });

  const { data: followingResponse } = useGetFollowingQuery(profileUser?._id, {
    skip: !profileUser?._id,
  });

  const followers = followersResponse?.data || [];
  const following = followingResponse?.data || [];

  // =========================
  // LOADING
  // =========================

  const loading = authLoading || profileLoading;

  // =========================
  // REDIRECT
  // =========================

  useEffect(() => {
    if (!authLoading && !isAuthenticated) {
      router.push("/login");
    }
  }, [authLoading, isAuthenticated, router]);

  // =========================
  // REFRESH
  // =========================

  const handleRefresh = () => {
    setRefreshKey((prev) => prev + 1);
  };

  // =========================
  // REVIEWS
  // =========================

  const userReviews = useMemo(() => {
    if (!profileUser) return [];

    return getStoredReviews().filter(
      (review) => review.userId === profileUser._id,
    );
  }, [profileUser, refreshKey]);

  // =========================
  // LISTS
  // =========================

  const userLists = useMemo(() => {
    if (!profileUser) return [];

    return getStoredLists().filter((list) => list.userId === profileUser._id);
  }, [profileUser, refreshKey]);

  // =========================
  // READING SHELF
  // =========================

  const readingShelf = useMemo(() => {
    if (!profileUser) return [];

    return getStoredReadingShelf(profileUser._id);
  }, [profileUser, refreshKey]);

  // =========================
  // FILTER SHELVES
  // =========================

  const currentlyReading = readingShelf.filter(
    (item) => item.shelfType === SHELF_TYPES.CURRENTLY_READING,
  );

  const wantToRead = readingShelf.filter(
    (item) => item.shelfType === SHELF_TYPES.WANT_TO_READ,
  );

  const recommended = readingShelf.filter(
    (item) => item.shelfType === SHELF_TYPES.RECOMMENDED,
  );

  const finished = readingShelf.filter(
    (item) => item.shelfType === SHELF_TYPES.FINISHED,
  );

  // =========================
  // OWN PROFILE
  // =========================

  const isOwnProfile = authUser?.username === profileUser?.username;

  // =========================
  // CREATE LIST
  // =========================

  const handleCreateList = () => {
    if (!newListName.trim()) {
      alert("Please enter a list name");
      return;
    }

    const newList = {
      id: "list_" + Date.now(),

      userId: profileUser._id,

      name: newListName.trim(),

      books: [],

      createdAt: new Date().toISOString(),
    };

    saveList(newList);

    setNewListName("");
    setDialogOpen(false);

    handleRefresh();
  };

  // =========================
  // DELETE LIST
  // =========================

  const handleDeleteList = (listId) => {
    const lists = getStoredLists();

    const updatedLists = lists.filter((list) => list.id !== listId);

    localStorage.setItem("itsablog_lists", JSON.stringify(updatedLists));

    handleRefresh();
  };

  // =========================
  // LOADING UI
  // =========================

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-slate-500">Loading profile...</p>
      </div>
    );
  }

  // =========================
  // ERROR UI
  // =========================

  if (profileError || !profileUser) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-red-500">Profile not found</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen py-8">
      <div className="container mx-auto px-4 md:px-8 lg:px-12">
        {/* PROFILE HEADER */}

        <div className="bg-gradient-to-br from-indigo-50 to-purple-50 dark:from-indigo-950/50 dark:to-purple-950/50 rounded-2xl p-8 md:p-12 mb-12">
          <div className="flex flex-col md:flex-row gap-6 items-start">
            <img
              src={profileUser.avatar || "/default-avatar.png"}
              alt={profileUser.username}
              className="w-32 h-32 rounded-full ring-4 ring-white dark:ring-slate-800 shadow-xl object-cover"
            />

            <div className="flex-1">
              <h1 className="text-4xl font-serif tracking-tight mb-2">
                @{profileUser.username}
              </h1>

              <p className="text-slate-600 dark:text-slate-300 mb-4">
                {profileUser.email}
              </p>

              {profileUser.bio && (
                <p className="text-slate-700 dark:text-slate-300 mb-4 max-w-2xl">
                  {profileUser.bio}
                </p>
              )}

              <div className="flex flex-wrap gap-4">
                <Badge variant="secondary" className="px-4 py-2">
                  {userReviews.length} Reviews
                </Badge>

                <Badge variant="secondary" className="px-4 py-2">
                  {userLists.length} Lists
                </Badge>

                <Badge variant="secondary" className="px-4 py-2">
                  {readingShelf.length} Books
                </Badge>

                <Badge variant="secondary" className="px-4 py-2">
                  {followers.length} Followers
                </Badge>

                <Badge variant="secondary" className="px-4 py-2">
                  {following.length} Following
                </Badge>
              </div>
            </div>

            {/* ACTIONS */}

            {isOwnProfile && (
              <Button
                variant="destructive"
                onClick={() => {
                  logout();
                  router.push("/");
                }}
              >
                <LogOut size={16} className="mr-2" />
                Logout
              </Button>
            )}
          </div>
        </div>

        {/* TABS */}

        <Tabs defaultValue="bookshelf" className="w-full" key={refreshKey}>
          <TabsList className="w-full md:w-auto mb-8">
            <TabsTrigger value="bookshelf">
              <BookOpen size={16} className="mr-2" />
              Bookshelf
            </TabsTrigger>

            <TabsTrigger value="reviews">Reviews</TabsTrigger>

            <TabsTrigger value="lists">Lists</TabsTrigger>
          </TabsList>

          {/* BOOKSHELF */}

          <TabsContent value="bookshelf">
            <div className="space-y-10">
              <div className="flex justify-between items-center">
                <div>
                  <h2 className="text-3xl font-serif mb-2">Reading Manager</h2>

                  <p className="text-slate-600 dark:text-slate-300">
                    Organize your reading journey.
                  </p>
                </div>

                {isOwnProfile && (
                  <AddToShelfDialog
                    userId={profileUser._id}
                    onBookAdded={handleRefresh}
                  />
                )}
              </div>

              <ShelfSection
                title="Currently Reading"
                items={currentlyReading}
                profileUser={profileUser}
                handleRefresh={handleRefresh}
              />

              <ShelfSection
                title="Want To Read"
                items={wantToRead}
                profileUser={profileUser}
                handleRefresh={handleRefresh}
              />

              <ShelfSection
                title="Recommended"
                items={recommended}
                profileUser={profileUser}
                handleRefresh={handleRefresh}
              />

              <ShelfSection
                title="Finished"
                items={finished}
                profileUser={profileUser}
                handleRefresh={handleRefresh}
              />
            </div>
          </TabsContent>

          {/* REVIEWS */}

          <TabsContent value="reviews">
            {userReviews.length > 0 ? (
              <div className="max-w-3xl mx-auto space-y-8">
                {userReviews.map((review) => (
                  <ReviewCard key={review.id} review={review} />
                ))}
              </div>
            ) : (
              <div className="text-center py-12 bg-slate-50 dark:bg-slate-900/50 rounded-xl">
                <p className="text-slate-600 dark:text-slate-400 mb-4">
                  No reviews yet.
                </p>

                <Button asChild>
                  <Link href="/explore">Explore Books</Link>
                </Button>
              </div>
            )}
          </TabsContent>

          {/* LISTS */}

          <TabsContent value="lists">
            {isOwnProfile && (
              <div className="mb-6">
                <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
                  <DialogTrigger asChild>
                    <Button>
                      <Plus className="mr-2" size={18} />
                      Create New List
                    </Button>
                  </DialogTrigger>

                  <DialogContent>
                    <DialogHeader>
                      <DialogTitle className="font-serif text-2xl">
                        Create a New List
                      </DialogTitle>
                    </DialogHeader>

                    <div className="space-y-4 mt-4">
                      <div>
                        <Label htmlFor="listName">List Name</Label>

                        <Input
                          id="listName"
                          value={newListName}
                          onChange={(e) => setNewListName(e.target.value)}
                          placeholder="Favorites"
                        />
                      </div>

                      <Button onClick={handleCreateList} className="w-full">
                        Create List
                      </Button>
                    </div>
                  </DialogContent>
                </Dialog>
              </div>
            )}

            {userLists.length > 0 ? (
              <div className="space-y-8">
                {userLists.map((list) => {
                  const listBooks = mockBooks.filter((book) =>
                    list.books.includes(book.id),
                  );

                  return (
                    <div
                      key={list.id}
                      className="bg-white dark:bg-slate-900 rounded-xl p-6 shadow-lg"
                    >
                      <div className="flex items-center justify-between mb-4">
                        <h3 className="text-2xl font-serif">{list.name}</h3>

                        {isOwnProfile && (
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => handleDeleteList(list.id)}
                          >
                            <Trash2 size={18} className="text-red-500" />
                          </Button>
                        )}
                      </div>

                      {listBooks.length > 0 ? (
                        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
                          {listBooks.map((book) => (
                            <BookPoster key={book.id} book={book} />
                          ))}
                        </div>
                      ) : (
                        <p className="text-slate-600 dark:text-slate-400">
                          No books in this list yet.
                        </p>
                      )}
                    </div>
                  );
                })}
              </div>
            ) : (
              <div className="text-center py-12 bg-slate-50 dark:bg-slate-900/50 rounded-xl">
                <p className="text-slate-600 dark:text-slate-400">
                  No lists created yet.
                </p>
              </div>
            )}
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}

// =========================
// SHELF SECTION
// =========================

function ShelfSection({ title, items, profileUser, handleRefresh }) {
  return (
    <div>
      <h3 className="text-2xl font-serif mb-4">
        {title} ({items.length})
      </h3>

      {items.length > 0 ? (
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-6">
          {items.map((item) => {
            const book = mockBooks.find((book) => book.id === item.bookId);

            if (!book) return null;

            return (
              <BookShelfItem
                key={item.id}
                book={book}
                shelfType={item.shelfType}
                recommendedBy={item.recommendedBy}
                userId={profileUser._id}
                onRemove={handleRefresh}
              />
            );
          })}
        </div>
      ) : (
        <div className="text-center py-12 bg-slate-50 dark:bg-slate-900/50 rounded-xl">
          <p className="text-slate-600 dark:text-slate-400">
            No books here yet.
          </p>
        </div>
      )}
    </div>
  );
}
