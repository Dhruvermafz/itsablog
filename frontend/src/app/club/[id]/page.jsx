"use client";

import React, { useState, useEffect, use } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  ArrowLeft,
  Users,
  MessageSquare,
  Heart,
  Send,
  CheckCircle,
  BookOpen,
  Sparkles,
  Clock3,
  TrendingUp,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Textarea } from "@/components/ui/textarea";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Checkbox } from "@/components/ui/checkbox";

import {
  mockClubs,
  getStoredClubPosts,
  isUserMemberOfClub,
  joinClub,
  createClubPost,
} from "@/data/clubsData";

import { useAuth } from "@/contexts/AuthContext";

export default function ClubDetailPage({ params }) {
  const { id } = use(params);

  const { user } = useAuth();
  const router = useRouter();

  const club = mockClubs.find((c) => c.id === id);

  const [showJoinDialog, setShowJoinDialog] = useState(false);
  const [acceptedTerms, setAcceptedTerms] = useState(false);
  const [isMember, setIsMember] = useState(false);
  const [newPost, setNewPost] = useState("");
  const [posts, setPosts] = useState([]);

  useEffect(() => {
    if (user && club) {
      setIsMember(isUserMemberOfClub(user.id, id));
    }

    if (club) {
      setPosts(getStoredClubPosts(id));
    }
  }, [user, club, id]);

  if (!club) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-background to-slate-100 dark:to-slate-950">
        <div className="text-center">
          <h1 className="text-3xl font-serif mb-4">Club not found</h1>

          <Button asChild>
            <Link href="/clubs">Back to Clubs</Link>
          </Button>
        </div>
      </div>
    );
  }

  const handleJoinClick = () => {
    if (!user) {
      router.push("/login");
      return;
    }

    setShowJoinDialog(true);
  };

  const handleJoinConfirm = () => {
    if (!acceptedTerms) {
      alert("Please accept the terms and conditions");
      return;
    }

    joinClub(user.id, club.id);

    setIsMember(true);
    setShowJoinDialog(false);
    setAcceptedTerms(false);
  };

  const handleCreatePost = () => {
    if (!user) {
      router.push("/login");
      return;
    }

    if (!isMember) {
      alert("Join the club first");
      return;
    }

    if (!newPost.trim()) {
      alert("Write something first");
      return;
    }

    const post = {
      id: "post" + Date.now(),
      clubId: club.id,
      userId: user.id,
      userName: user.name,
      userAvatar: user.avatar,
      content: newPost.trim(),
      likes: 0,
      comments: 0,
      createdAt: new Date().toISOString(),
    };

    createClubPost(post);

    setPosts([post, ...posts]);
    setNewPost("");
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);

    const now = new Date();

    const diffInHours = Math.floor(
      (now.getTime() - date.getTime()) / (1000 * 60 * 60),
    );

    if (diffInHours < 1) return "Just now";
    if (diffInHours < 24) return `${diffInHours}h ago`;
    if (diffInHours < 48) return "Yesterday";

    return date.toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
    });
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-background via-slate-50/50 to-background dark:via-slate-950/50">
      <div className="container mx-auto px-4 md:px-8 lg:px-12 py-8">
        {/* BACK */}
        <Button variant="ghost" asChild className="mb-8 rounded-full px-5">
          <Link href="/clubs">
            <ArrowLeft className="mr-2" size={18} />
            Back to Clubs
          </Link>
        </Button>

        {/* HERO */}
        <div className="relative overflow-hidden rounded-[2rem] mb-10 shadow-2xl border border-white/10">
          <div className="absolute inset-0">
            <img
              src={club.coverImage}
              alt={club.name}
              className="w-full h-full object-cover scale-105"
            />

            <div className="absolute inset-0 bg-black/60" />

            <div className="absolute inset-0 bg-gradient-to-t from-black via-black/40 to-black/20" />
          </div>

          <div className="relative z-10 px-8 md:px-12 py-20 md:py-28">
            <Badge className="mb-5 bg-white/10 backdrop-blur-md border border-white/20 text-white hover:bg-white/20">
              <Sparkles size={14} className="mr-2" />
              {club.category}
            </Badge>

            <h1 className="text-5xl md:text-7xl font-serif text-white tracking-tight mb-5 max-w-4xl leading-tight">
              {club.name}
            </h1>

            <p className="text-white/80 text-lg md:text-xl max-w-3xl leading-relaxed mb-8">
              {club.description}
            </p>

            <div className="flex flex-wrap items-center gap-6 text-white/80">
              <div className="flex items-center gap-2">
                <Users size={20} />
                <span>{club.memberCount.toLocaleString()} readers</span>
              </div>

              <div className="flex items-center gap-2">
                <MessageSquare size={20} />
                <span>{club.postCount} discussions</span>
              </div>

              <div className="flex items-center gap-2">
                <TrendingUp size={20} />
                <span>Very Active</span>
              </div>
            </div>
          </div>
        </div>

        {/* CONTENT */}
        <div className="grid lg:grid-cols-[1fr_360px] gap-8">
          {/* FEED */}
          <div>
            {/* CREATE POST */}
            {isMember && (
              <div className="bg-white/80 dark:bg-slate-900/70 backdrop-blur-xl border border-white/10 rounded-3xl p-6 md:p-8 shadow-xl mb-8">
                <div className="flex items-center gap-3 mb-5">
                  <div className="w-12 h-12 rounded-2xl bg-primary/10 flex items-center justify-center">
                    <BookOpen className="text-primary" size={24} />
                  </div>

                  <div>
                    <h3 className="text-2xl font-serif">Share your thoughts</h3>

                    <p className="text-sm text-slate-500">
                      Discuss books with the community
                    </p>
                  </div>
                </div>

                <Textarea
                  value={newPost}
                  onChange={(e) => setNewPost(e.target.value)}
                  placeholder="What are you currently reading? Any favorite quotes or thoughts?"
                  rows={5}
                  className="rounded-2xl border-slate-200 dark:border-slate-700 text-base resize-none"
                />

                <div className="flex items-center justify-between mt-5">
                  <p className="text-sm text-slate-500">
                    Keep discussions respectful and meaningful.
                  </p>

                  <Button
                    onClick={handleCreatePost}
                    className="rounded-full px-6"
                  >
                    <Send size={18} className="mr-2" />
                    Publish
                  </Button>
                </div>
              </div>
            )}

            {/* POSTS */}
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <h2 className="text-3xl font-serif">Community Discussions</h2>

                <Badge variant="outline" className="rounded-full px-4 py-1">
                  {posts.length} Posts
                </Badge>
              </div>

              {posts.length > 0 ? (
                posts.map((post) => (
                  <div
                    key={post.id}
                    className="group bg-white/80 dark:bg-slate-900/70 backdrop-blur-xl border border-white/10 rounded-3xl p-6 shadow-lg hover:shadow-2xl transition-all duration-300"
                  >
                    <div className="flex items-start gap-4">
                      <img
                        src={post.userAvatar}
                        alt={post.userName}
                        className="w-14 h-14 rounded-2xl object-cover ring-2 ring-primary/10"
                      />

                      <div className="flex-1">
                        <div className="flex items-center justify-between mb-2">
                          <div>
                            <h4 className="font-semibold text-lg">
                              {post.userName}
                            </h4>

                            <div className="flex items-center gap-2 text-sm text-slate-500">
                              <Clock3 size={14} />
                              {formatDate(post.createdAt)}
                            </div>
                          </div>
                        </div>

                        {post.bookTitle && (
                          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 text-primary text-sm mb-4">
                            <BookOpen size={14} />
                            Reading {post.bookTitle}
                          </div>
                        )}

                        <p className="text-slate-700 dark:text-slate-300 leading-relaxed text-[15px] mb-5">
                          {post.content}
                        </p>

                        <div className="flex items-center gap-6">
                          <button className="flex items-center gap-2 text-sm text-slate-500 hover:text-red-500 transition-colors">
                            <Heart size={18} />
                            <span>{post.likes}</span>
                          </button>

                          <button className="flex items-center gap-2 text-sm text-slate-500 hover:text-primary transition-colors">
                            <MessageSquare size={18} />
                            <span>{post.comments}</span>
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                ))
              ) : (
                <div className="rounded-3xl bg-white/60 dark:bg-slate-900/50 border border-dashed border-slate-300 dark:border-slate-700 py-20 text-center">
                  <BookOpen size={40} className="mx-auto text-slate-400 mb-4" />

                  <h3 className="text-2xl font-serif mb-2">
                    No discussions yet
                  </h3>

                  <p className="text-slate-500">
                    {isMember
                      ? "Start the first conversation in this club."
                      : "Join the club to participate in discussions."}
                  </p>
                </div>
              )}
            </div>
          </div>

          {/* SIDEBAR */}
          <div>
            <div className="sticky top-24 bg-white/80 dark:bg-slate-900/70 backdrop-blur-xl border border-white/10 rounded-3xl p-8 shadow-xl">
              <h3 className="text-2xl font-serif mb-6">About This Club</h3>

              {isMember ? (
                <div className="mb-6 bg-green-500/10 border border-green-500/20 rounded-2xl p-4">
                  <div className="flex items-center gap-3 text-green-600 dark:text-green-400">
                    <CheckCircle size={22} />
                    <div>
                      <p className="font-semibold">You're a member</p>
                      <p className="text-sm opacity-80">
                        Join the conversations anytime
                      </p>
                    </div>
                  </div>
                </div>
              ) : (
                <Button
                  onClick={handleJoinClick}
                  className="w-full h-12 rounded-2xl text-base mb-6"
                >
                  <Users className="mr-2" size={18} />
                  Join Club
                </Button>
              )}

              <div className="space-y-6">
                <div className="p-4 rounded-2xl bg-slate-100 dark:bg-slate-800/60">
                  <p className="text-sm text-slate-500 mb-1">Created by</p>

                  <p className="font-semibold">{club.createdBy}</p>
                </div>

                <div className="p-4 rounded-2xl bg-slate-100 dark:bg-slate-800/60">
                  <p className="text-sm text-slate-500 mb-1">Created on</p>

                  <p className="font-semibold">
                    {new Date(club.createdAt).toLocaleDateString("en-US", {
                      month: "long",
                      day: "numeric",
                      year: "numeric",
                    })}
                  </p>
                </div>

                <div className="p-4 rounded-2xl bg-slate-100 dark:bg-slate-800/60">
                  <p className="text-sm text-slate-500 mb-2">Category</p>

                  <Badge className="rounded-full px-4 py-1">
                    {club.category}
                  </Badge>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* JOIN DIALOG */}
        <Dialog open={showJoinDialog} onOpenChange={setShowJoinDialog}>
          <DialogContent className="rounded-3xl border-none">
            <DialogHeader>
              <DialogTitle className="text-3xl font-serif">
                Join {club.name}
              </DialogTitle>
            </DialogHeader>

            <div className="space-y-5 mt-4">
              <div className="rounded-2xl bg-slate-100 dark:bg-slate-800 p-5 max-h-52 overflow-y-auto">
                <p className="text-sm leading-relaxed text-slate-700 dark:text-slate-300">
                  {club.termsAndConditions}
                </p>
              </div>

              <div className="flex items-start gap-3">
                <Checkbox
                  id="terms"
                  checked={acceptedTerms}
                  onCheckedChange={setAcceptedTerms}
                />

                <label
                  htmlFor="terms"
                  className="text-sm leading-relaxed cursor-pointer"
                >
                  I agree to the club's community rules and terms.
                </label>
              </div>
            </div>

            <DialogFooter className="mt-6">
              <Button
                variant="outline"
                onClick={() => setShowJoinDialog(false)}
                className="rounded-xl"
              >
                Cancel
              </Button>

              <Button
                onClick={handleJoinConfirm}
                disabled={!acceptedTerms}
                className="rounded-xl"
              >
                Join Club
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
    </div>
  );
}
