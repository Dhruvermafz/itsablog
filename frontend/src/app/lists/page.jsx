"use client";

import React, { useMemo, useState } from "react";
import Link from "next/link";

import {
  Search,
  Heart,
  Users,
  BookOpen,
  TrendingUp,
  ArrowRight,
  Quote,
} from "lucide-react";

import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

import { useGetListsQuery } from "@/api/listApi";

export default function ListsPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [sortBy, setSortBy] = useState("popular");

  // Fetch public lists from API
  const { data: response, isLoading, error } = useGetListsQuery();

  // Extract the actual array from response.data
  const publicLists = response?.data || [];

  const filteredLists = useMemo(() => {
    return publicLists.filter((list) => {
      const matchesSearch =
        list.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        list.description?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        list.userName?.toLowerCase().includes(searchQuery.toLowerCase());

      return matchesSearch;
    });
  }, [publicLists, searchQuery]);

  const sortedLists = useMemo(() => {
    return [...filteredLists].sort((a, b) => {
      if (sortBy === "popular") return (b.likes ?? 0) - (a.likes ?? 0);
      if (sortBy === "followers")
        return (b.followers ?? 0) - (a.followers ?? 0);
      if (sortBy === "recent") {
        return (
          new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime()
        );
      }
      return 0;
    });
  }, [filteredLists, sortBy]);

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h3 className="text-2xl font-serif mb-2">
            Failed to load collections
          </h3>
          <p className="text-muted-foreground">Please try again later.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background text-foreground">
      {/* Search + Sort Bar */}
      <div className="sticky top-16 z-20 border-b border-border bg-background/80 backdrop-blur-xl">
        <div className="container mx-auto px-4 md:px-8 lg:px-12 py-5">
          <div className="flex flex-col sm:flex-row gap-4 items-center">
            <div className="relative flex-1 max-w-md">
              <Search
                className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground"
                size={18}
              />
              <Input
                placeholder="Search collections, creators, or topics..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10 rounded-full"
              />
            </div>

            <div className="flex flex-wrap items-center gap-3">
              <span className="text-sm uppercase tracking-[0.2em] text-muted-foreground hidden sm:inline">
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
          </div>
        </div>
      </div>

      {/* Main Content */}
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

          {isLoading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-8">
              {[...Array(6)].map((_, i) => (
                <div
                  key={i}
                  className="h-[28rem] rounded-[2rem] bg-muted animate-pulse"
                />
              ))}
            </div>
          ) : sortedLists.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-8">
              {sortedLists.map((list) => (
                <Link key={list.id} href={`/list/${list.id}`} className="group">
                  <Card className="overflow-hidden border-border bg-card hover:shadow-2xl hover:-translate-y-2 transition-all duration-500 rounded-[2rem] h-full">
                    <div className="relative h-72 overflow-hidden">
                      <img
                        src={list.coverImage}
                        alt={list.name}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/95 via-black/50 to-transparent" />

                      <div className="absolute top-5 right-5">
                        <Badge className="bg-background/90 text-foreground backdrop-blur-md border border-border">
                          <BookOpen size={14} className="mr-1" />
                          {list.books?.length ?? 0} books
                        </Badge>
                      </div>

                      <div className="absolute bottom-6 left-6 right-6">
                        <h3 className="text-3xl font-serif text-white leading-tight mb-3 line-clamp-2">
                          {list.name}
                        </h3>
                        <p className="text-sm text-white/80 line-clamp-2 leading-6">
                          {list.description}
                        </p>
                      </div>
                    </div>

                    <div className="p-6">
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

                      <div className="flex items-center justify-between text-sm">
                        <div className="flex items-center gap-2 text-muted-foreground">
                          <Heart size={16} className="text-red-500" />
                          <span>{list.likes ?? 0} likes</span>
                        </div>

                        <div className="flex items-center gap-2 text-muted-foreground">
                          <Users size={16} className="text-primary" />
                          <span>{list.followers ?? 0} followers</span>
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
