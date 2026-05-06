"use client";

import React, { use } from "react";
import Link from "next/link";
import { ArrowLeft, Calendar, MapPin, Users } from "lucide-react";
import { useGetAuthorQuery } from "@/redux/services/authorApi"; // adjust path

import { Button } from "@/components/ui/button";

export default function AuthorPage({ params }) {
  const { id } = use(params);

  const { data: author, isLoading, error } = useGetAuthorQuery(id);

  // ⏳ Loading
  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p>Loading author...</p>
      </div>
    );
  }

  // ❌ Error / Not Found
  if (error || !author) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-serif mb-4">Author not found</h1>
          <Button asChild>
            <Link href="/explore">Back to Explore</Link>
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen py-8">
      <div className="container mx-auto px-4 md:px-8 lg:px-12">
        {/* Back */}
        <Button variant="ghost" asChild className="mb-6">
          <Link href="/explore">
            <ArrowLeft className="mr-2" size={18} />
            Back to Explore
          </Link>
        </Button>

        {/* Author Header */}
        <div className="bg-gradient-to-br from-indigo-50 to-purple-50 dark:from-indigo-950/50 dark:to-purple-950/50 rounded-2xl p-8 md:p-12 mb-12">
          <div className="flex flex-col md:flex-row gap-8 items-start">
            <img
              src={author.avatar}
              alt={author.name}
              className="w-48 h-48 rounded-2xl object-cover shadow-2xl"
            />

            <div className="flex-1">
              <h1 className="text-4xl md:text-5xl font-serif mb-4">
                {author.name}
              </h1>

              <div className="flex flex-wrap gap-4 mb-6 text-slate-600 dark:text-slate-300">
                {author.birthYear && (
                  <div className="flex items-center gap-2">
                    <Calendar size={18} />
                    <span>Born {author.birthYear}</span>
                  </div>
                )}

                {author.nationality && (
                  <div className="flex items-center gap-2">
                    <MapPin size={18} />
                    <span>{author.nationality}</span>
                  </div>
                )}

                <div className="flex items-center gap-2">
                  <Users size={18} />
                  <span>
                    {author.followersCount?.toLocaleString() || 0} followers
                  </span>
                </div>
              </div>

              <p className="text-base md:text-lg text-slate-700 dark:text-slate-300 max-w-3xl">
                {author.bio}
              </p>
            </div>
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-12">
          <div className="bg-white dark:bg-slate-900 p-6 text-center rounded-xl">
            <div className="text-3xl font-bold text-primary">
              {author.booksCount || 0}
            </div>
            <div className="text-sm">Books Published</div>
          </div>

          <div className="bg-white dark:bg-slate-900 p-6 text-center rounded-xl">
            <div className="text-3xl font-bold text-primary">—</div>
            <div className="text-sm">In Library</div>
          </div>

          <div className="bg-white dark:bg-slate-900 p-6 text-center rounded-xl">
            <div className="text-3xl font-bold text-primary">—</div>
            <div className="text-sm">Avg Rating</div>
          </div>

          <div className="bg-white dark:bg-slate-900 p-6 text-center rounded-xl">
            <div className="text-3xl font-bold text-primary">
              {author.followersCount || 0}
            </div>
            <div className="text-sm">Followers</div>
          </div>
        </div>

        {/* Placeholder */}
        <div className="text-center py-12">
          <p className="text-slate-500">
            Books integration coming from backend next 🚀
          </p>
        </div>
      </div>
    </div>
  );
}
