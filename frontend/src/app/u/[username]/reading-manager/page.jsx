"use client";

import React, { useEffect, useMemo, useState } from "react";
import { useRouter, useParams } from "next/navigation";
import {
  ArrowLeft,
  Plus,
  BookOpen,
  Clock,
  Heart,
  Trophy,
  Search,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useAuth } from "@/contexts/AuthContext";
import { AddToShelfDialog } from "@/components/AddToShelfDialog";
import { BookShelfItem } from "@/components/BookShelfItem";
import { useGetReadingLogsQuery } from "@/api/userApi";

const STATUS_TYPES = {
  CURRENTLY_READING: "reading",
  WANT_TO_READ: "want_to_read",
  RECOMMENDED: "recommended",
  FINISHED: "finished",
};

/* ==================== HERO SECTION ==================== */
function HeroShelf({ items }) {
  return (
    <div className="mb-16">
      <div className="flex items-center gap-3 mb-6">
        <div className="w-11 h-11 bg-gradient-to-br from-amber-500 to-orange-600 rounded-2xl flex items-center justify-center shadow-lg">
          <BookOpen className="w-6 h-6 text-white" />
        </div>
        <div>
          <h2 className="text-3xl font-bold tracking-tight">
            Continue Reading
          </h2>
          <p className="text-muted-foreground">Pick up where you left off</p>
        </div>
      </div>

      {items.length === 0 ? (
        <div className="bg-card border border-dashed border-muted-foreground/40 rounded-3xl h-80 flex flex-col items-center justify-center text-center px-6">
          <Clock className="w-16 h-16 text-muted-foreground mb-6" />
          <p className="text-2xl font-medium mb-3">No books in progress</p>
          <p className="text-muted-foreground max-w-md mb-8">
            Start reading a book to see your progress here
          </p>
          <AddToShelfDialog
            trigger={
              <Button size="lg">
                <Plus className="mr-2 h-5 w-5" />
                Start Reading
              </Button>
            }
          />
        </div>
      ) : (
        <div className="flex gap-6 overflow-x-auto pb-8 snap-x snap-mandatory scrollbar-hide">
          {items.map((item) => (
            <div
              key={item._id}
              className="min-w-[270px] snap-start transition-transform hover:scale-[1.03]"
            >
              <BookShelfItem book={item.book} shelfType={item.status} />
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

/* ==================== SHELF SECTION ==================== */
function ShelfSection({ title, icon: Icon, items, emptyMessage }) {
  return (
    <div className="mb-16">
      <div className="flex items-center gap-4 mb-6">
        <div className="w-9 h-9 bg-muted rounded-2xl flex items-center justify-center">
          <Icon className="w-5 h-5" />
        </div>
        <h3 className="text-2xl font-semibold tracking-tight">{title}</h3>
        {items.length > 0 && (
          <span className="text-sm text-muted-foreground font-medium ml-2">
            ({items.length})
          </span>
        )}
      </div>

      {items.length === 0 ? (
        <div className="border border-dashed border-muted-foreground/30 bg-muted/30 rounded-3xl py-16 text-center">
          <p className="text-muted-foreground text-lg mb-6">{emptyMessage}</p>
          <AddToShelfDialog
            trigger={
              <Button variant="outline">
                <Plus className="mr-2 h-4 w-4" />
                Add Books
              </Button>
            }
          />
        </div>
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 2xl:grid-cols-7 gap-6">
          {items.map((item) => (
            <BookShelfItem
              key={item._id}
              book={item.book}
              shelfType={item.status}
            />
          ))}
        </div>
      )}
    </div>
  );
}

/* ==================== MAIN PAGE ==================== */
export default function ReadingManagerPage() {
  const router = useRouter();
  const params = useParams();
  const [searchTerm, setSearchTerm] = useState("");

  const username = Array.isArray(params?.username)
    ? params.username[0]
    : params?.username;

  const { user: authUser, loading: authLoading, isAuthenticated } = useAuth();

  const { data, isLoading, refetch } = useGetReadingLogsQuery(undefined, {
    skip: !authUser,
  });

  const readingLogs = data?.data || [];
  const isOwner = authUser?.username === username;

  const grouped = useMemo(() => {
    const filteredLogs = readingLogs.filter((log) => {
      const title = log.book?.title?.toLowerCase() || "";
      const author = log.book?.author?.toLowerCase() || "";
      return (
        title.includes(searchTerm.toLowerCase()) ||
        author.includes(searchTerm.toLowerCase())
      );
    });

    return {
      reading: filteredLogs.filter(
        (l) => l.status === STATUS_TYPES.CURRENTLY_READING,
      ),
      want: filteredLogs.filter((l) => l.status === STATUS_TYPES.WANT_TO_READ),
      rec: filteredLogs.filter((l) => l.status === STATUS_TYPES.RECOMMENDED),
      done: filteredLogs.filter((l) => l.status === STATUS_TYPES.FINISHED),
    };
  }, [readingLogs, searchTerm]);

  useEffect(() => {
    if (!authLoading && !isAuthenticated) {
      router.push("/login");
    }
  }, [authLoading, isAuthenticated, router]);

  if (!isOwner) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="text-center">
          <p className="text-2xl font-semibold mb-2">Access Denied</p>
          <p className="text-muted-foreground">
            You can only manage your own library.
          </p>
        </div>
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <div className="w-8 h-8 border-4 border-primary border-t-transparent animate-spin rounded-full" />
          <p className="text-muted-foreground">Loading your library...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background pb-20">
      <div className="max-w-7xl mx-auto px-5 sm:px-6 py-10">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-6 mb-12">
          <div>
            <Button
              variant="ghost"
              onClick={() => router.push(`/u/${username}`)}
              className="mb-6 -ml-2"
            >
              <ArrowLeft className="mr-2 h-5 w-5" />
              Back to Profile
            </Button>

            <h1 className="text-5xl font-bold tracking-tighter">
              Your Library
            </h1>
            <p className="text-xl text-muted-foreground mt-2">
              Manage your reading journey
            </p>
          </div>

          <AddToShelfDialog
            userId={authUser._id}
            onBookAdded={refetch}
            trigger={
              <Button size="lg" className="shadow-md">
                <Plus className="mr-2 h-5 w-5" />
                Add to Shelf
              </Button>
            }
          />
        </div>

        {/* Search Bar */}
        <div className="relative mb-10">
          <Search className="absolute left-4 top-4 h-5 w-5 text-muted-foreground" />
          <Input
            placeholder="Search your books..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-12 py-7 text-base rounded-2xl bg-card"
          />
        </div>

        {/* Continue Reading Hero */}
        <HeroShelf items={grouped.reading} />

        {/* Other Shelves */}
        <ShelfSection
          title="Want to Read"
          icon={Heart}
          items={grouped.want}
          emptyMessage="Books you plan to read will appear here"
        />

        <ShelfSection
          title="Recommended"
          icon={Trophy}
          items={grouped.rec}
          emptyMessage="No recommended books yet"
        />

        <ShelfSection
          title="Finished"
          icon={Trophy}
          items={grouped.done}
          emptyMessage="Your finished books will show up here"
        />
      </div>
    </div>
  );
}
