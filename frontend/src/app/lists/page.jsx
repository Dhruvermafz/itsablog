"use client";

import React, { useMemo, useState } from "react";
import Link from "next/link";

import {
  Search,
  Heart,
  Users,
  BookOpen,
  TrendingUp,
  Sparkles,
  Library,
  ArrowRight,
  Quote,
} from "lucide-react";

import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

import { getStoredPublicLists } from "@/data/publicListsData";

export default function ListsPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [sortBy, setSortBy] = useState("popular");

  const publicLists = getStoredPublicLists();

  const filteredLists = useMemo(() => {
    return publicLists.filter((list) => {
      const matchesSearch =
        list.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        list.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
        list.userName.toLowerCase().includes(searchQuery.toLowerCase());

      return matchesSearch;
    });
  }, [publicLists, searchQuery]);

  const sortedLists = useMemo(() => {
    return [...filteredLists].sort((a, b) => {
      if (sortBy === "popular") return b.likes - a.likes;

      if (sortBy === "followers") return b.followers - a.followers;

      if (sortBy === "recent") {
        return (
          new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime()
        );
      }

      return 0;
    });
  }, [filteredLists, sortBy]);

  return (
    <div className="min-h-screen bg-background text-foreground">
      {/* HERO */}
      <section className="relative overflow-hidden border-b border-border">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,rgba(120,90,60,0.12),transparent_45%)] dark:bg-[radial-gradient(circle_at_top,rgba(255,220,180,0.08),transparent_40%)]" />

        <div className="container relative mx-auto px-4 md:px-8 lg:px-12 py-20 md:py-24">
          <div className="max-w-4xl mx-auto text-center">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-border bg-card mb-6">
              <Sparkles size={16} className="text-primary" />

              <span className="text-sm text-muted-foreground">
                Curated reading journeys from passionate readers
              </span>
            </div>

            <h1 className="text-5xl md:text-6xl lg:text-7xl font-serif tracking-tight leading-tight mb-6">
              Discover beautiful{" "}
              <span className="text-primary italic">book collections</span>
            </h1>

            <p className="text-lg md:text-xl text-muted-foreground leading-8 max-w-3xl mx-auto mb-10">
              Explore thematic reading lists, literary rabbit holes, genre
              essentials, and carefully curated shelves created by the ITSABLOG
              community.
            </p>

            {/* Search */}
            <div className="relative max-w-3xl mx-auto">
              <Search
                className="absolute left-5 top-1/2 -translate-y-1/2 text-muted-foreground"
                size={22}
              />

              <Input
                type="text"
                placeholder="Search lists, creators, or themes..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="h-16 pl-14 rounded-2xl border-border bg-card text-base shadow-lg"
              />
            </div>
          </div>
        </div>
      </section>

      {/* SORT BAR */}
      <section className="sticky top-16 z-20 border-b border-border bg-background/80 backdrop-blur-xl">
        <div className="container mx-auto px-4 md:px-8 lg:px-12 py-5">
          <div className="flex flex-wrap items-center justify-between gap-4">
            {/* Filters */}
            <div className="flex flex-wrap items-center gap-3">
              <span className="text-sm uppercase tracking-[0.2em] text-muted-foreground">
                Sort
              </span>

              <Badge
                variant={sortBy === "popular" ? "default" : "outline"}
                className="cursor-pointer rounded-full px-5 py-2"
                onClick={() => setSortBy("popular")}
              >
                <Heart size={14} className="mr-2" />
                Most Loved
              </Badge>

              <Badge
                variant={sortBy === "followers" ? "default" : "outline"}
                className="cursor-pointer rounded-full px-5 py-2"
                onClick={() => setSortBy("followers")}
              >
                <Users size={14} className="mr-2" />
                Most Followed
              </Badge>

              <Badge
                variant={sortBy === "recent" ? "default" : "outline"}
                className="cursor-pointer rounded-full px-5 py-2"
                onClick={() => setSortBy("recent")}
              >
                <TrendingUp size={14} className="mr-2" />
                Recently Updated
              </Badge>
            </div>

            {/* Count */}
            <div className="text-sm text-muted-foreground">
              {sortedLists.length} collections found
            </div>
          </div>
        </div>
      </section>

      {/* FEATURED STATS */}
      <section className="py-20">
        <div className="container mx-auto px-4 md:px-8 lg:px-12">
          <div className="grid md:grid-cols-3 gap-8">
            {/* Card */}
            <div className="rounded-[2rem] border border-border bg-card p-8">
              <div className="w-14 h-14 rounded-2xl bg-primary/10 text-primary flex items-center justify-center mb-6">
                <Library size={28} />
              </div>

              <div className="text-5xl font-serif font-bold mb-2">
                {publicLists.length}
              </div>

              <p className="text-lg font-medium mb-2">Public Collections</p>

              <p className="text-muted-foreground leading-7">
                Curated reading lists crafted by readers across every genre and
                mood.
              </p>
            </div>

            {/* Card */}
            <div className="rounded-[2rem] border border-border bg-card p-8">
              <div className="w-14 h-14 rounded-2xl bg-primary/10 text-primary flex items-center justify-center mb-6">
                <Heart size={28} />
              </div>

              <div className="text-5xl font-serif font-bold mb-2">
                {publicLists.reduce((acc, list) => acc + list.likes, 0)}
              </div>

              <p className="text-lg font-medium mb-2">Community Likes</p>

              <p className="text-muted-foreground leading-7">
                Thousands of readers supporting and sharing incredible literary
                collections.
              </p>
            </div>

            {/* Card */}
            <div className="rounded-[2rem] border border-border bg-card p-8">
              <div className="w-14 h-14 rounded-2xl bg-primary/10 text-primary flex items-center justify-center mb-6">
                <Users size={28} />
              </div>

              <div className="text-5xl font-serif font-bold mb-2">
                {publicLists.reduce((acc, list) => acc + list.followers, 0)}
              </div>

              <p className="text-lg font-medium mb-2">Followers</p>

              <p className="text-muted-foreground leading-7">
                Readers building communities around meaningful reading journeys.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* LISTS GRID */}
      <section className="pb-24">
        <div className="container mx-auto px-4 md:px-8 lg:px-12">
          <div className="flex items-center justify-between mb-12">
            <div>
              <div className="inline-flex items-center gap-2 text-primary mb-3">
                <Quote size={18} />

                <span className="uppercase tracking-[0.2em] text-sm">
                  Community Collections
                </span>
              </div>

              <h2 className="text-4xl md:text-5xl font-serif tracking-tight">
                Explore curated reading paths
              </h2>
            </div>

            <Button variant="ghost" className="hidden md:flex">
              Browse All
              <ArrowRight className="ml-2" size={18} />
            </Button>
          </div>

          {sortedLists.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-8">
              {sortedLists.map((list) => (
                <Link key={list.id} href={`/list/${list.id}`} className="group">
                  <Card className="overflow-hidden border-border bg-card hover:shadow-2xl hover:-translate-y-2 transition-all duration-500 rounded-[2rem] h-full">
                    {/* Cover */}
                    <div className="relative h-72 overflow-hidden">
                      <img
                        src={list.coverImage}
                        alt={list.name}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                      />

                      <div className="absolute inset-0 bg-gradient-to-t from-black/95 via-black/50 to-transparent" />

                      {/* Book Count */}
                      <div className="absolute top-5 right-5">
                        <Badge className="bg-background/90 text-foreground backdrop-blur-md border border-border">
                          <BookOpen size={14} className="mr-1" />
                          {list.books.length} books
                        </Badge>
                      </div>

                      {/* Title */}
                      <div className="absolute bottom-6 left-6 right-6">
                        <h3 className="text-3xl font-serif text-white leading-tight mb-3 line-clamp-2">
                          {list.name}
                        </h3>

                        <p className="text-sm text-white/80 line-clamp-2 leading-6">
                          {list.description}
                        </p>
                      </div>
                    </div>

                    {/* Bottom */}
                    <div className="p-6">
                      {/* Creator */}
                      <div className="flex items-center gap-3 mb-6">
                        <Avatar className="w-11 h-11 border border-border">
                          <AvatarImage
                            src={list.userAvatar}
                            alt={list.userName}
                          />

                          <AvatarFallback>
                            {list.userName?.slice(0, 2)}
                          </AvatarFallback>
                        </Avatar>

                        <div>
                          <p className="font-semibold">{list.userName}</p>

                          <p className="text-sm text-muted-foreground">
                            Updated{" "}
                            {new Date(list.updatedAt).toLocaleDateString(
                              "en-US",
                              {
                                month: "short",
                                day: "numeric",
                              },
                            )}
                          </p>
                        </div>
                      </div>

                      {/* Stats */}
                      <div className="flex items-center justify-between text-sm">
                        <div className="flex items-center gap-2 text-muted-foreground">
                          <Heart size={16} className="text-red-500" />

                          <span>{list.likes} likes</span>
                        </div>

                        <div className="flex items-center gap-2 text-muted-foreground">
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
            <div className="rounded-[2rem] border border-border bg-card p-20 text-center">
              <h3 className="text-4xl font-serif mb-4">No collections found</h3>

              <p className="text-lg text-muted-foreground max-w-xl mx-auto leading-8">
                Try searching for another theme, creator, or literary topic.
              </p>
            </div>
          )}
        </div>
      </section>
    </div>
  );
}
