"use client";

import React, { useMemo, useState } from "react";
import { Users, BookOpen, Compass, Home } from "lucide-react";

import {
  useGetClubsQuery,
  useGetFeedQuery,
  useGetFollowingClubsQuery,
} from "@/api/clubApi";
import { TabBar } from "@/components/clubs/TabBar";
import { ClubsGrid } from "@/components/clubs/ClubsGrid";
import { FeedPostCard } from "@/components/clubs/FeedPostCard";

// Tab definitions — icons live here so ClubsPage owns the business context
const TABS = [
  { id: "feed", label: "Feed", icon: <Home size={18} /> },
  { id: "following", label: "Following", icon: <Users size={18} /> },
  { id: "discover", label: "Discover", icon: <Compass size={18} /> },
];

export default function ClubsPage() {
  const [activeTab, setActiveTab] = useState("feed");
  const [searchQuery, setSearchQuery] = useState("");

  // ── Data fetching ──────────────────────────────────────────────────────────
  const { data: clubsResponse, isLoading: clubsLoading } = useGetClubsQuery();
  const { data: feedResponse, isLoading: feedLoading } = useGetFeedQuery();
  const { data: followingResponse, isLoading: followingLoading } =
    useGetFollowingClubsQuery();

  const allClubs = clubsResponse?.clubs || clubsResponse?.data || [];
  const feedPosts = feedResponse?.posts || [];
  const followingClubs = followingResponse?.clubs || [];

  const filteredClubs = useMemo(() => {
    if (!Array.isArray(allClubs)) return [];
    const q = searchQuery.toLowerCase().trim();
    if (!q) return allClubs;
    return allClubs.filter(
      (club) =>
        (club.name || "").toLowerCase().includes(q) ||
        (club.description || "").toLowerCase().includes(q),
    );
  }, [allClubs, searchQuery]);

  // ── Tab content ────────────────────────────────────────────────────────────
  const renderContent = () => {
    if (activeTab === "feed") {
      return (
        <div className="space-y-8">
          <h1 className="text-4xl font-serif tracking-tight">Your Feed</h1>

          {feedPosts.length > 0 ? (
            <div className="space-y-8">
              {feedPosts.map((post) => (
                <FeedPostCard key={post._id} post={post} />
              ))}
            </div>
          ) : (
            <div className="text-center py-20">
              <p className="text-2xl font-serif mb-3">Your feed is empty</p>
              <p className="text-muted-foreground">
                Join some clubs to see posts here
              </p>
            </div>
          )}
        </div>
      );
    }

    if (activeTab === "following") {
      return (
        <div>
          <div className="flex items-center justify-between mb-10">
            <h1 className="text-4xl font-serif tracking-tight">Following</h1>
            <p className="text-muted-foreground">
              {followingClubs.length} communities
            </p>
          </div>
          <ClubsGrid clubs={followingClubs} />
        </div>
      );
    }

    // Discover
    return (
      <div>
        <div className="flex items-center justify-between mb-10">
          <div>
            <div className="inline-flex items-center gap-2 text-primary mb-3">
              <BookOpen size={18} />
              <span className="uppercase tracking-widest text-sm">EXPLORE</span>
            </div>
            <h1 className="text-4xl font-serif tracking-tight">
              Discover Clubs
            </h1>
          </div>
          <p className="text-muted-foreground">
            {filteredClubs.length} communities found
          </p>
        </div>
        <ClubsGrid clubs={filteredClubs} />
      </div>
    );
  };

  // ── Layout ─────────────────────────────────────────────────────────────────
  return (
    <div className="min-h-screen bg-background text-foreground">
      {/* Sticky header with tab bar */}
      <div className="border-b border-border bg-background sticky top-0 z-50">
        <div className="container mx-auto px-6 md:px-10">
          <div className="flex items-center justify-between py-6">
            <TabBar tabs={TABS} activeTab={activeTab} onChange={setActiveTab} />
          </div>
        </div>
      </div>

      {/* Main content area */}
      <main className="container mx-auto px-6 md:px-10 py-10 max-w-7xl">
        {renderContent()}
      </main>
    </div>
  );
}
