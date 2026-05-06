"use client";

import React, { useState } from "react";
import Link from "next/link";
import { Users, Heart, BookOpen, Search, TrendingUp } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { getStoredPublicLists } from "@/data/publicListsData";

export default function ListsPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [sortBy, setSortBy] = useState("popular");
  const publicLists = getStoredPublicLists();

  const filteredLists = publicLists.filter((list) => {
    const matchesSearch =
      list.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      list.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      list.userName.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesSearch;
  });

  const sortedLists = [...filteredLists].sort((a, b) => {
    if (sortBy === "popular") return b.likes - a.likes;
    if (sortBy === "followers") return b.followers - a.followers;
    if (sortBy === "recent")
      return new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime();
    return 0;
  });

  return (
    <div className="min-h-screen py-8" data-testid="lists-page">
      <div className="container mx-auto px-4 md:px-8 lg:px-12">
        {/* Header */}
        <div className="mb-12 text-center">
          <h1 className="text-4xl md:text-5xl font-serif tracking-tight mb-4">
            Discover Lists
          </h1>
          <p className="text-base md:text-lg text-slate-600 dark:text-slate-300 max-w-2xl mx-auto">
            Explore curated book lists created by passionate readers from our
            community
          </p>
        </div>

        {/* Search and Sort */}
        <div className="max-w-3xl mx-auto mb-12 space-y-4">
          <div className="relative">
            <Search
              className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400"
              size={20}
            />
            <Input
              type="text"
              placeholder="Search lists by name, description, or creator..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-12 h-14 text-lg rounded-2xl shadow-lg border-slate-200 dark:border-slate-700"
              data-testid="search-lists-input"
            />
          </div>

          {/* Sort Options */}
          <div className="flex items-center justify-center gap-3 flex-wrap">
            <span className="text-sm text-slate-600 dark:text-slate-400">
              Sort by:
            </span>
            <Badge
              variant={sortBy === "popular" ? "default" : "outline"}
              className="cursor-pointer px-4 py-2"
              onClick={() => setSortBy("popular")}
              data-testid="sort-popular"
            >
              <Heart size={14} className="mr-1" />
              Most Liked
            </Badge>
            <Badge
              variant={sortBy === "followers" ? "default" : "outline"}
              className="cursor-pointer px-4 py-2"
              onClick={() => setSortBy("followers")}
              data-testid="sort-followers"
            >
              <Users size={14} className="mr-1" />
              Most Followed
            </Badge>
            <Badge
              variant={sortBy === "recent" ? "default" : "outline"}
              className="cursor-pointer px-4 py-2"
              onClick={() => setSortBy("recent")}
              data-testid="sort-recent"
            >
              <TrendingUp size={14} className="mr-1" />
              Recently Updated
            </Badge>
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-3 gap-4 max-w-3xl mx-auto mb-12">
          <div className="bg-gradient-to-br from-indigo-50 to-purple-50 dark:from-indigo-950/50 dark:to-purple-950/50 rounded-xl p-6 text-center">
            <div className="text-3xl font-serif font-bold text-primary mb-1">
              {publicLists.length}
            </div>
            <div className="text-sm text-slate-600 dark:text-slate-400">
              Public Lists
            </div>
          </div>
          <div className="bg-gradient-to-br from-teal-50 to-cyan-50 dark:from-teal-950/50 dark:to-cyan-950/50 rounded-xl p-6 text-center">
            <div className="text-3xl font-serif font-bold text-primary mb-1">
              {publicLists.reduce((acc, list) => acc + list.likes, 0)}
            </div>
            <div className="text-sm text-slate-600 dark:text-slate-400">
              Total Likes
            </div>
          </div>
          <div className="bg-gradient-to-br from-amber-50 to-orange-50 dark:from-amber-950/50 dark:to-orange-950/50 rounded-xl p-6 text-center">
            <div className="text-3xl font-serif font-bold text-primary mb-1">
              {publicLists.reduce((acc, list) => acc + list.followers, 0)}
            </div>
            <div className="text-sm text-slate-600 dark:text-slate-400">
              Total Followers
            </div>
          </div>
        </div>

        {/* Lists Grid */}
        {sortedLists.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {sortedLists.map((list) => (
              <Link
                key={list.id}
                href={`/list/${list.id}`}
                className="group"
                data-testid={`list-card-${list.id}`}
              >
                <Card className="overflow-hidden hover:shadow-2xl transition-all duration-300 hover:-translate-y-2 border-none h-full">
                  <div className="relative h-48 overflow-hidden">
                    <img
                      src={list.coverImage}
                      alt={list.name}
                      className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/50 to-transparent" />
                    <div className="absolute top-4 right-4">
                      <Badge
                        variant="secondary"
                        className="backdrop-blur-sm bg-white/90 dark:bg-slate-900/90"
                      >
                        <BookOpen size={14} className="mr-1" />
                        {list.books.length} books
                      </Badge>
                    </div>
                    <div className="absolute bottom-4 left-4 right-4">
                      <h3 className="text-xl font-serif font-semibold text-white mb-1 line-clamp-2">
                        {list.name}
                      </h3>
                    </div>
                  </div>
                  <div className="p-6">
                    <p className="text-slate-600 dark:text-slate-300 mb-4 line-clamp-2 text-sm">
                      {list.description}
                    </p>

                    {/* Creator Info */}
                    <div className="flex items-center gap-2 mb-4">
                      <img
                        src={list.userAvatar}
                        alt={list.userName}
                        className="w-8 h-8 rounded-full"
                      />
                      <div>
                        <p className="text-sm font-semibold">{list.userName}</p>
                        <p className="text-xs text-slate-500 dark:text-slate-400">
                          {new Date(list.updatedAt).toLocaleDateString(
                            "en-US",
                            { month: "short", day: "numeric" },
                          )}
                        </p>
                      </div>
                    </div>

                    {/* Stats */}
                    <div className="flex items-center justify-between text-sm text-slate-500 dark:text-slate-400">
                      <div className="flex items-center gap-1">
                        <Heart size={16} className="text-red-500" />
                        <span>{list.likes}</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <Users size={16} className="text-primary" />
                        <span>{list.followers} followers</span>
                      </div>
                    </div>
                  </div>
                </Card>
              </Link>
            ))}
          </div>
        ) : (
          <div className="text-center py-12">
            <p className="text-lg text-slate-600 dark:text-slate-400">
              No lists found matching your search.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
