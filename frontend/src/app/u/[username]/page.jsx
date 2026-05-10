"use client";

import React, { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { useRouter, useParams } from "next/navigation";

import { Plus, Trash2, LogOut } from "lucide-react";

import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

import { Button } from "@/components/ui/button";
import { ReviewCard } from "@/components/ReviewCard";
import { BookPoster } from "@/components/BookPoster";

import { useAuth } from "@/contexts/AuthContext";

import { getStoredLists, mockBooks, saveList } from "@/data/mockData";

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

import { useGetUserReviewsQuery } from "@/api/bookApi";

export default function ProfilePage() {
  const router = useRouter();
  const params = useParams();

  const username = Array.isArray(params?.username)
    ? params.username[0]
    : params?.username;

  const {
    user: authUser,
    loading: authLoading,
    logout,
    isAuthenticated,
  } = useAuth();

  const [newListName, setNewListName] = useState("");
  const [dialogOpen, setDialogOpen] = useState(false);
  const [refreshKey, setRefreshKey] = useState(0);

  const { data: profileResponse, isLoading: profileLoading } =
    useGetProfileQuery(username, {
      skip: !username,
    });

  const profileUser = profileResponse?.data;

  const { data: followersResponse } = useGetFollowersQuery(profileUser?._id, {
    skip: !profileUser?._id,
  });

  const { data: followingResponse } = useGetFollowingQuery(profileUser?._id, {
    skip: !profileUser?._id,
  });

  const { data: reviewsResponse, isLoading: reviewsLoading } =
    useGetUserReviewsQuery(
      {
        userId: profileUser?._id,
        page: 1,
        limit: 50,
      },
      {
        skip: !profileUser?._id,
      },
    );

  const followers = followersResponse?.data || [];
  const following = followingResponse?.data || [];
  const userReviews = reviewsResponse?.data || [];

  const loading = authLoading || profileLoading || reviewsLoading;

  useEffect(() => {
    if (!authLoading && !isAuthenticated) {
      router.push("/login");
    }
  }, [authLoading, isAuthenticated, router]);

  const handleRefresh = () => setRefreshKey((prev) => prev + 1);

  const userLists = useMemo(() => {
    if (!profileUser) return [];
    return getStoredLists().filter((list) => list.userId === profileUser._id);
  }, [profileUser, refreshKey]);

  const isOwnProfile = authUser?.username === profileUser?.username;

  const handleCreateList = () => {
    if (!newListName.trim()) return;

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

  const handleDeleteList = (listId) => {
    const lists = getStoredLists();
    const updatedLists = lists.filter((list) => list.id !== listId);
    localStorage.setItem("itsablog_lists", JSON.stringify(updatedLists));
    handleRefresh();
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <p className="text-muted-foreground">Loading profile...</p>
      </div>
    );
  }

  if (!profileUser) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <p className="text-red-500">Profile not found</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background py-8">
      <div className="container mx-auto px-4 md:px-8 lg:px-12">
        <div className="grid lg:grid-cols-12 gap-8">
          {/* LEFT SIDEBAR */}
          <div className="lg:col-span-4 xl:col-span-3">
            <div className="sticky top-24 bg-card border border-border rounded-[2rem] p-8">
              <div className="flex flex-col items-center text-center mb-8">
                <img
                  src={profileUser.avatar || "/default-avatar.png"}
                  alt={profileUser.username}
                  className="w-28 h-28 rounded-full object-cover ring-4 ring-background shadow-xl mb-6"
                />

                <h1 className="text-3xl font-serif tracking-tight">
                  @{profileUser.username}
                </h1>

                <p className="text-muted-foreground mt-1">
                  {profileUser.email}
                </p>

                {profileUser.bio && (
                  <p className="mt-4 text-foreground leading-relaxed">
                    {profileUser.bio}
                  </p>
                )}
              </div>

              {/* Stats */}
              <div className="grid grid-cols-2 gap-4 text-center">
                <div className="bg-muted/50 rounded-2xl p-4">
                  <p className="text-2xl font-semibold">{userReviews.length}</p>
                  <p className="text-sm text-muted-foreground">Reviews</p>
                </div>

                <div className="bg-muted/50 rounded-2xl p-4">
                  <p className="text-2xl font-semibold">{userLists.length}</p>
                  <p className="text-sm text-muted-foreground">Lists</p>
                </div>
              </div>

              {isOwnProfile && (
                <Button
                  variant="destructive"
                  className="w-full mt-8 rounded-2xl"
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

          {/* MAIN CONTENT */}
          <div className="lg:col-span-8 xl:col-span-9">
            <Tabs defaultValue="reviews" className="w-full" key={refreshKey}>
              <TabsList className="w-full md:w-auto mb-10 bg-card border border-border rounded-[2rem] p-1">
                <TabsTrigger value="reviews" className="rounded-[1.5rem]">
                  Reviews
                </TabsTrigger>
                <TabsTrigger value="lists" className="rounded-[1.5rem]">
                  Lists
                </TabsTrigger>
              </TabsList>

              {/* Reviews Tab */}
              <TabsContent value="reviews">
                {userReviews.length > 0 ? (
                  <div className="max-w-3xl mx-auto space-y-8">
                    {userReviews.map((review) => (
                      <ReviewCard key={review._id} review={review} />
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-20 bg-card rounded-[2rem]">
                    <p className="text-muted-foreground mb-6">
                      No reviews yet.
                    </p>
                    <Button asChild>
                      <Link href="/explore">Start Reviewing Books</Link>
                    </Button>
                  </div>
                )}
              </TabsContent>

              {/* Lists Tab */}
              <TabsContent value="lists">
                {isOwnProfile && (
                  <div className="mb-8">
                    <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
                      <DialogTrigger asChild>
                        <Button size="lg" className="rounded-2xl">
                          <Plus className="mr-2" size={20} />
                          Create New List
                        </Button>
                      </DialogTrigger>

                      <DialogContent className="rounded-[2rem]">
                        <DialogHeader>
                          <DialogTitle className="font-serif text-2xl">
                            Create New List
                          </DialogTitle>
                        </DialogHeader>

                        <div className="space-y-4 mt-6">
                          <div>
                            <Label>List Name</Label>
                            <Input
                              value={newListName}
                              onChange={(e) => setNewListName(e.target.value)}
                              placeholder="My Favorites"
                            />
                          </div>

                          <Button
                            onClick={handleCreateList}
                            className="w-full rounded-2xl"
                          >
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
                          className="bg-card border border-border rounded-[2rem] p-8"
                        >
                          <div className="flex items-center justify-between mb-6">
                            <h3 className="text-2xl font-serif">{list.name}</h3>

                            {isOwnProfile && (
                              <Button
                                variant="ghost"
                                size="icon"
                                onClick={() => handleDeleteList(list.id)}
                              >
                                <Trash2 size={20} className="text-red-500" />
                              </Button>
                            )}
                          </div>

                          {listBooks.length > 0 ? (
                            <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-6">
                              {listBooks.map((book) => (
                                <BookPoster key={book.id} book={book} />
                              ))}
                            </div>
                          ) : (
                            <p className="text-muted-foreground py-12 text-center">
                              This list is empty.
                            </p>
                          )}
                        </div>
                      );
                    })}
                  </div>
                ) : (
                  <div className="text-center py-20 bg-card rounded-[2rem]">
                    <p className="text-muted-foreground">
                      No reading lists yet.
                    </p>
                  </div>
                )}
              </TabsContent>
            </Tabs>
          </div>
        </div>
      </div>
    </div>
  );
}
