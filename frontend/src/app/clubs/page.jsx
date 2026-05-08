"use client";

import React, { useMemo, useState } from "react";

import Link from "next/link";

import {
  Users,
  TrendingUp,
  Search,
  Sparkles,
  BookOpen,
  MessageCircle,
  Flame,
  Compass,
} from "lucide-react";

import { Input } from "@/components/ui/input";

import { Badge } from "@/components/ui/badge";

import { Card, CardContent } from "@/components/ui/card";

import { Button } from "@/components/ui/button";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

import { mockClubs } from "@/data/clubsData";

export default function ClubsPage() {
  const [searchQuery, setSearchQuery] = useState("");

  const [selectedCategory, setSelectedCategory] = useState("all");

  const categories = ["all", "Genre", "Reading Group"];

  const filteredClubs = useMemo(() => {
    return mockClubs.filter((club) => {
      const matchesSearch =
        club.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        club.description.toLowerCase().includes(searchQuery.toLowerCase());

      const matchesCategory =
        selectedCategory === "all" || club.category === selectedCategory;

      return matchesSearch && matchesCategory;
    });
  }, [searchQuery, selectedCategory]);

  const featuredClub = mockClubs[0];

  return (
    <div
      className="min-h-screen bg-background text-foreground"
      data-testid="clubs-page"
    >
      {/* HERO */}
      <section className="relative overflow-hidden border-b border-border">
        {/* Background */}
        <div className="absolute inset-0">
          <div className="absolute inset-0 bg-gradient-to-br from-primary/10 via-background to-background" />

          <div className="absolute top-0 left-0 w-[500px] h-[500px] bg-primary/10 rounded-full blur-3xl" />

          <div className="absolute bottom-0 right-0 w-[400px] h-[400px] bg-accent/10 rounded-full blur-3xl" />
        </div>

        <div className="relative container mx-auto px-4 md:px-8 lg:px-12 py-20 md:py-28">
          <div className="max-w-4xl mx-auto text-center">
            <div className="inline-flex items-center gap-2 px-5 py-2 rounded-full border border-border bg-card mb-6">
              <Sparkles size={16} className="text-primary" />

              <span className="text-sm text-muted-foreground">
                Reader Communities
              </span>
            </div>

            <h1 className="text-5xl md:text-7xl font-serif tracking-tight leading-tight mb-6">
              Find your
              <span className="text-primary"> reading circle</span>
            </h1>

            <p className="text-lg md:text-xl text-muted-foreground leading-9 max-w-3xl mx-auto mb-10">
              Join passionate book lovers, discuss unforgettable stories, attend
              reading sessions, and discover new literary worlds together.
            </p>

            {/* Search */}
            <div className="max-w-3xl mx-auto">
              <div className="relative">
                <Search
                  className="absolute left-5 top-1/2 -translate-y-1/2 text-muted-foreground"
                  size={22}
                />

                <Input
                  type="text"
                  placeholder="Search clubs, genres, or communities..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-14 h-16 rounded-2xl text-lg border-border bg-card/80 backdrop-blur-sm shadow-xl"
                  data-testid="search-clubs-input"
                />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* STATS */}
      <section className="py-10 border-b border-border">
        <div className="container mx-auto px-4 md:px-8 lg:px-12">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-5">
            <Card className="rounded-[2rem] border-border bg-card/70">
              <CardContent className="p-8 text-center">
                <Users className="mx-auto mb-4 text-primary" size={30} />

                <div className="text-4xl font-serif mb-2">
                  {mockClubs.length}
                </div>

                <p className="text-sm text-muted-foreground">Active Clubs</p>
              </CardContent>
            </Card>

            <Card className="rounded-[2rem] border-border bg-card/70">
              <CardContent className="p-8 text-center">
                <BookOpen className="mx-auto mb-4 text-primary" size={30} />

                <div className="text-4xl font-serif mb-2">120+</div>

                <p className="text-sm text-muted-foreground">
                  Monthly Discussions
                </p>
              </CardContent>
            </Card>

            <Card className="rounded-[2rem] border-border bg-card/70">
              <CardContent className="p-8 text-center">
                <MessageCircle
                  className="mx-auto mb-4 text-primary"
                  size={30}
                />

                <div className="text-4xl font-serif mb-2">10K+</div>

                <p className="text-sm text-muted-foreground">
                  Reader Conversations
                </p>
              </CardContent>
            </Card>

            <Card className="rounded-[2rem] border-border bg-card/70">
              <CardContent className="p-8 text-center">
                <Flame className="mx-auto mb-4 text-primary" size={30} />

                <div className="text-4xl font-serif mb-2">Daily</div>

                <p className="text-sm text-muted-foreground">
                  Reading Activity
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* FEATURED CLUB */}
      {featuredClub && (
        <section className="py-16">
          <div className="container mx-auto px-4 md:px-8 lg:px-12">
            <div className="flex items-center gap-2 text-primary mb-4">
              <Compass size={18} />

              <span className="uppercase tracking-[0.2em] text-sm">
                Featured Community
              </span>
            </div>

            <Card className="overflow-hidden rounded-[2rem] border-border bg-card/80">
              <div className="grid lg:grid-cols-2">
                {/* Image */}
                <div className="relative h-[320px] lg:h-full">
                  <img
                    src={featuredClub.coverImage}
                    alt={featuredClub.name}
                    className="w-full h-full object-cover"
                  />

                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent" />

                  <div className="absolute bottom-6 left-6">
                    <Badge className="rounded-full px-4 py-1">
                      {featuredClub.category}
                    </Badge>
                  </div>
                </div>

                {/* Content */}
                <div className="p-8 md:p-12 flex flex-col justify-center">
                  <h2 className="text-4xl md:text-5xl font-serif tracking-tight mb-5">
                    {featuredClub.name}
                  </h2>

                  <p className="text-lg leading-8 text-muted-foreground mb-8">
                    {featuredClub.description}
                  </p>

                  <div className="flex flex-wrap gap-4 mb-10">
                    <div className="flex items-center gap-2 px-5 py-3 rounded-full border border-border bg-background">
                      <Users size={16} />

                      <span>
                        {featuredClub.memberCount.toLocaleString()} members
                      </span>
                    </div>

                    <div className="flex items-center gap-2 px-5 py-3 rounded-full border border-border bg-background">
                      <TrendingUp size={16} />

                      <span>{featuredClub.postCount} discussions</span>
                    </div>
                  </div>

                  <Button asChild size="lg" className="rounded-2xl w-fit">
                    <Link href={`/club/${featuredClub.id}`}>
                      Join Discussion
                    </Link>
                  </Button>
                </div>
              </div>
            </Card>
          </div>
        </section>
      )}

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
                data-testid={`category-filter-${category}`}
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

          {filteredClubs.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-8">
              {filteredClubs.map((club) => (
                <Link
                  key={club.id}
                  href={`/club/${club.id}`}
                  className="group"
                  data-testid={`club-card-${club.id}`}
                >
                  <Card className="overflow-hidden rounded-[2rem] border-border bg-card/80 hover:-translate-y-2 hover:shadow-2xl transition-all duration-500 h-full">
                    {/* Image */}
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

                            <span>{club.memberCount.toLocaleString()}</span>
                          </div>

                          <div className="flex items-center gap-1">
                            <MessageCircle size={15} />

                            <span>{club.postCount} posts</span>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Content */}
                    <CardContent className="p-7">
                      <p className="text-muted-foreground leading-7 mb-8 line-clamp-3">
                        {club.description}
                      </p>

                      {/* Fake Members */}
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
