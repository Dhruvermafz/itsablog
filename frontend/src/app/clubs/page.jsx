"use client";

import React, { useMemo, useState } from "react";
import Link from "next/link";

import { Users, BookOpen, MessageCircle } from "lucide-react";

import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

import { useGetClubsQuery } from "@/api/clubApi";

export default function ClubsPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");

  const categories = ["all", "Genre", "Reading Group"];

  // Fetch from API
  const { data: response, isLoading, error } = useGetClubsQuery();

  // Safely extract the clubs array
  const clubs = response?.data || response?.clubs || [];

  const filteredClubs = useMemo(() => {
    if (!Array.isArray(clubs)) return [];

    return clubs.filter((club) => {
      const matchesSearch =
        club.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        club.description?.toLowerCase().includes(searchQuery.toLowerCase());

      const matchesCategory =
        selectedCategory === "all" || club.category === selectedCategory;

      return matchesSearch && matchesCategory;
    });
  }, [clubs, searchQuery, selectedCategory]);

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h3 className="text-2xl font-serif mb-2">Failed to load clubs</h3>
          <p className="text-muted-foreground">Please try again later.</p>
        </div>
      </div>
    );
  }

  return (
    <div
      className="min-h-screen bg-background text-foreground"
      data-testid="clubs-page"
    >
      {/* FILTERS */}
      <section className="pb-8">
        <div className="container mx-auto px-4 md:px-8 lg:px-12">
          <div className="flex flex-wrap items-center justify-center gap-3">
            {categories.map((category) => (
              <Badge
                key={category}
                variant={selectedCategory === category ? "default" : "outline"}
                className="cursor-pointer rounded-full px-5 py-2 text-sm capitalize"
                onClick={() => setSelectedCategory(category)}
              >
                {category}
              </Badge>
            ))}
          </div>
        </div>
      </section>

      {/* CLUBS GRID */}
      <section className="pb-24">
        <div className="container mx-auto px-4 md:px-8 lg:px-12">
          <div className="flex items-center justify-between mb-10">
            <div>
              <div className="inline-flex items-center gap-2 text-primary mb-3">
                <BookOpen size={18} />
                <span className="uppercase tracking-[0.2em] text-sm">
                  Explore Communities
                </span>
              </div>
              <h2 className="text-4xl md:text-5xl font-serif tracking-tight">
                Reader Clubs
              </h2>
            </div>

            <p className="hidden md:block text-muted-foreground">
              {filteredClubs.length} communities found
            </p>
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
          ) : filteredClubs.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-8">
              {filteredClubs.map((club) => (
                <Link key={club.id} href={`/club/${club.id}`} className="group">
                  <Card className="overflow-hidden rounded-[2rem] border-border bg-card/80 hover:-translate-y-2 hover:shadow-2xl transition-all duration-500 h-full">
                    <div className="relative h-64 overflow-hidden">
                      <img
                        src={club.coverImage}
                        alt={club.name}
                        className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                      />

                      <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/40 to-transparent" />

                      <div className="absolute top-5 right-5">
                        <Badge className="rounded-full px-4 py-1">
                          {club.category}
                        </Badge>
                      </div>

                      <div className="absolute bottom-5 left-5 right-5">
                        <h3 className="text-3xl font-serif text-white mb-2 leading-tight">
                          {club.name}
                        </h3>

                        <div className="flex items-center gap-4 text-white/80 text-sm">
                          <div className="flex items-center gap-1">
                            <Users size={15} />
                            <span>
                              {club.memberCount?.toLocaleString() || 0}
                            </span>
                          </div>
                          <div className="flex items-center gap-1">
                            <MessageCircle size={15} />
                            <span>{club.postCount || 0} posts</span>
                          </div>
                        </div>
                      </div>
                    </div>

                    <CardContent className="p-7">
                      <p className="text-muted-foreground leading-7 mb-8 line-clamp-3">
                        {club.description}
                      </p>

                      <div className="flex items-center justify-between">
                        <div className="flex -space-x-3">
                          {[1, 2, 3, 4].map((i) => (
                            <Avatar
                              key={i}
                              className="border-2 border-background"
                            >
                              <AvatarImage
                                src={`https://i.pravatar.cc/100?img=${i + 10}`}
                              />
                              <AvatarFallback>R</AvatarFallback>
                            </Avatar>
                          ))}
                        </div>

                        <Button variant="outline" className="rounded-full">
                          View Club
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                </Link>
              ))}
            </div>
          ) : (
            <Card className="rounded-[2rem] border-border bg-card">
              <CardContent className="p-16 text-center">
                <h3 className="text-3xl font-serif mb-4">No clubs found</h3>
                <p className="text-lg text-muted-foreground max-w-2xl mx-auto leading-8">
                  Try searching with another keyword or browse different
                  categories.
                </p>
              </CardContent>
            </Card>
          )}
        </div>
      </section>
    </div>
  );
}
