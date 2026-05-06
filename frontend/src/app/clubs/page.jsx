"use client";

import React, { useState } from "react";
import Link from "next/link";
import { Users, TrendingUp, Search } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { mockClubs } from "@/data/clubsData";
import { Card } from "@/components/ui/card";

export default function ClubsPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");

  const categories = ["all", "Genre", "Reading Group"];

  const filteredClubs = mockClubs.filter((club) => {
    const matchesSearch =
      club.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      club.description.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory =
      selectedCategory === "all" || club.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  return (
    <div className="min-h-screen py-8" data-testid="clubs-page">
      <div className="container mx-auto px-4 md:px-8 lg:px-12">
        {/* Header */}
        <div className="mb-12 text-center">
          <h1 className="text-4xl md:text-5xl font-serif tracking-tight mb-4">
            Book Clubs
          </h1>
          <p className="text-base md:text-lg text-slate-600 dark:text-slate-300 max-w-2xl mx-auto">
            Join communities of passionate readers. Discuss books, share
            insights, and make friends.
          </p>
        </div>

        {/* Search Bar */}
        <div className="max-w-3xl mx-auto mb-8">
          <div className="relative">
            <Search
              className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400"
              size={20}
            />
            <Input
              type="text"
              placeholder="Search clubs..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-12 h-14 text-lg rounded-2xl shadow-lg border-slate-200 dark:border-slate-700"
              data-testid="search-clubs-input"
            />
          </div>
        </div>

        {/* Category Filters */}
        <div className="flex items-center gap-3 mb-12 justify-center">
          {categories.map((category) => (
            <Badge
              key={category}
              variant={selectedCategory === category ? "default" : "outline"}
              className="cursor-pointer whitespace-nowrap px-4 py-2 text-sm capitalize"
              onClick={() => setSelectedCategory(category)}
              data-testid={`category-filter-${category}`}
            >
              {category}
            </Badge>
          ))}
        </div>

        {/* Clubs Grid */}
        {filteredClubs.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredClubs.map((club) => (
              <Link
                key={club.id}
                href={`/club/${club.id}`}
                className="group"
                data-testid={`club-card-${club.id}`}
              >
                <Card className="overflow-hidden hover:shadow-2xl transition-all duration-300 hover:-translate-y-1 border-none">
                  <div className="relative h-48 overflow-hidden">
                    <img
                      src={club.coverImage}
                      alt={club.name}
                      className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent" />
                    <div className="absolute bottom-4 left-4 right-4">
                      <h3 className="text-xl font-serif font-semibold text-white mb-1">
                        {club.name}
                      </h3>
                      <Badge variant="secondary" className="text-xs">
                        {club.category}
                      </Badge>
                    </div>
                  </div>
                  <div className="p-6">
                    <p className="text-slate-600 dark:text-slate-300 mb-4 line-clamp-2">
                      {club.description}
                    </p>
                    <div className="flex items-center justify-between text-sm text-slate-500 dark:text-slate-400">
                      <div className="flex items-center gap-1">
                        <Users size={16} />
                        <span>{club.memberCount.toLocaleString()} members</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <TrendingUp size={16} />
                        <span>{club.postCount} posts</span>
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
              No clubs found matching your search.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
