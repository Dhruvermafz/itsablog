"use client";

import React, { useEffect, useMemo, useState } from "react";
import { useRouter, useParams } from "next/navigation";
import { BookOpen, ArrowLeft } from "lucide-react";

import { Button } from "@/components/ui/button";
import { useAuth } from "@/contexts/AuthContext";

import { getStoredReadingShelf, SHELF_TYPES } from "@/data/readingShelfData";
import { AddToShelfDialog } from "@/components/AddToShelfDialog";
import { BookShelfItem } from "@/components/BookShelfItem";

import { mockBooks } from "@/data/mockData";

function ShelfSection({ title, items, profileUser, handleRefresh }) {
  return (
    <div>
      <h3 className="text-2xl font-serif mb-6">
        {title} <span className="text-muted-foreground">({items.length})</span>
      </h3>

      {items.length > 0 ? (
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-6">
          {items.map((item) => {
            const book = mockBooks.find((b) => b.id === item.bookId);
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
        <div className="bg-card border border-dashed border-border rounded-[2rem] py-16 text-center">
          <p className="text-muted-foreground">No books in this shelf yet.</p>
        </div>
      )}
    </div>
  );
}

export default function ReadingManagerPage() {
  const router = useRouter();
  const params = useParams();
  const username = Array.isArray(params?.username)
    ? params.username[0]
    : params?.username;

  const { user: authUser, loading: authLoading, isAuthenticated } = useAuth();
  const [refreshKey, setRefreshKey] = useState(0);

  // Fetch profile (you can reuse the same query)
  // For simplicity, you can also fetch it here if needed

  const readingShelf = useMemo(() => {
    // In real app, fetch from API. For now using mock
    return getStoredReadingShelf(authUser?._id || ""); // Only show for current user
  }, [authUser, refreshKey]);

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

  const handleRefresh = () => setRefreshKey((prev) => prev + 1);

  useEffect(() => {
    if (!authLoading && !isAuthenticated) {
      router.push("/login");
    }
  }, [authLoading, isAuthenticated, router]);

  // Only owner can access their reading manager
  const isOwner = authUser?.username === username;

  if (!isOwner) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-red-500">
          You can only view your own Reading Manager.
        </p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background py-8">
      <div className="container mx-auto px-4 md:px-8 lg:px-12">
        <Button
          variant="ghost"
          onClick={() => router.push(`/${username}`)}
          className="mb-8"
        >
          <ArrowLeft className="mr-2" /> Back to Profile
        </Button>

        <div className="flex justify-between items-center mb-10">
          <div>
            <h1 className="text-4xl font-serif">Reading Manager</h1>
            <p className="text-muted-foreground">
              Track your reading journey and daily logs
            </p>
          </div>

          <AddToShelfDialog userId={authUser._id} onBookAdded={handleRefresh} />
        </div>

        <div className="space-y-16">
          <ShelfSection
            title="Currently Reading"
            items={currentlyReading}
            profileUser={authUser}
            handleRefresh={handleRefresh}
          />

          <ShelfSection
            title="Want To Read"
            items={wantToRead}
            profileUser={authUser}
            handleRefresh={handleRefresh}
          />

          <ShelfSection
            title="Recommended"
            items={recommended}
            profileUser={authUser}
            handleRefresh={handleRefresh}
          />

          <ShelfSection
            title="Finished"
            items={finished}
            profileUser={authUser}
            handleRefresh={handleRefresh}
          />
        </div>

        {/* Future: Daily Reading Log Section */}
        {/* You can add a new section here for daily logs, progress, notes, etc. */}
      </div>
    </div>
  );
}
