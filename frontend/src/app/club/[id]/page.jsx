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
  Plus,
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
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [acceptedTerms, setAcceptedTerms] = useState(false);
  const [isMember, setIsMember] = useState(false);
  const [newPost, setNewPost] = useState("");
  const [posts, setPosts] = useState([]);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (user && club) {
      setIsMember(isUserMemberOfClub(user.id, id));
    }
    if (club) {
      setPosts(getStoredClubPosts(id));
    }
  }, [user, club, id]);

  const handleJoinClick = () => {
    if (!user) {
      router.push("/login");
      return;
    }
    setShowJoinDialog(true);
  };

  const handleJoinConfirm = () => {
    if (!acceptedTerms) return;
    joinClub(user.id, club.id);
    setIsMember(true);
    setShowJoinDialog(false);
    setAcceptedTerms(false);
  };

  const handleCreatePost = async () => {
    if (!user || !isMember || !newPost.trim()) return;

    setIsSubmitting(true);

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
    setShowCreateModal(false);
    setIsSubmitting(false);
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

  if (!club) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="text-center">
          <h1 className="text-3xl font-serif mb-4">Club not found</h1>
          <Button asChild>
            <Link href="/clubs">Back to Clubs</Link>
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background pb-20">
      <div className="container mx-auto px-4 md:px-8 lg:px-12 py-8">
        {/* Back Button */}
        <Button variant="ghost" asChild className="mb-8 rounded-full px-5">
          <Link href="/clubs">
            <ArrowLeft className="mr-2" size={18} />
            Back to Clubs
          </Link>
        </Button>

        {/* Hero Section */}
        <div className="relative overflow-hidden rounded-[2rem] mb-10 shadow-2xl border border-border">
          <div className="absolute inset-0">
            <img
              src={club.coverImage}
              alt={club.name}
              className="w-full h-full object-cover scale-105"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/60 to-black/40" />
          </div>

          <div className="relative z-10 px-8 md:px-12 py-20 md:py-28">
            <Badge className="mb-5 bg-white/10 backdrop-blur-md border border-white/20 text-white">
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

        {/* Main Content */}
        <div className="grid lg:grid-cols-[1fr_360px] gap-8">
          {/* Feed */}
          <div>
            {/* Desktop Create Post Box */}
            {isMember && (
              <div className="hidden md:block bg-card/80 backdrop-blur-xl border border-border rounded-[2rem] p-6 md:p-8 shadow-xl mb-8">
                <div className="flex items-center gap-3 mb-5">
                  <div className="w-12 h-12 rounded-2xl bg-primary/10 flex items-center justify-center">
                    <BookOpen className="text-primary" size={24} />
                  </div>
                  <div>
                    <h3 className="text-2xl font-serif">Share your thoughts</h3>
                    <p className="text-sm text-muted-foreground">
                      Discuss books with the community
                    </p>
                  </div>
                </div>

                <Textarea
                  value={newPost}
                  onChange={(e) => setNewPost(e.target.value)}
                  placeholder="What are you currently reading? Any favorite quotes or thoughts?"
                  rows={4}
                  className="rounded-2xl text-base resize-none bg-background border-border"
                />

                <div className="flex justify-end mt-4">
                  <Button onClick={handleCreatePost} disabled={!newPost.trim()}>
                    <Send size={18} className="mr-2" />
                    Publish
                  </Button>
                </div>
              </div>
            )}

            {/* Posts List */}
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <h2 className="text-3xl font-serif">Community Discussions</h2>
                <Badge variant="outline" className="rounded-full px-4 py-1">
                  {posts.length} Posts
                </Badge>
              </div>

              {posts.length > 0 ? (
                posts.map((post) => (
                  <Link
                    key={post.id}
                    href={`/post/${post.id}`}
                    className="block group"
                  >
                    <div className="bg-card/80 backdrop-blur-xl border border-border rounded-[2rem] p-6 shadow-lg hover:shadow-xl transition-all duration-300 cursor-pointer">
                      <div className="flex items-start gap-4">
                        <img
                          src={post.userAvatar}
                          alt={post.userName}
                          className="w-14 h-14 rounded-2xl object-cover ring-2 ring-primary/10"
                        />

                        <div className="flex-1 min-w-0">
                          <div className="flex items-center justify-between mb-2">
                            <div>
                              <h4 className="font-semibold text-lg group-hover:text-primary transition-colors">
                                {post.userName}
                              </h4>
                              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                                <Clock3 size={14} />
                                {formatDate(post.createdAt)}
                              </div>
                            </div>
                          </div>

                          {/* Book Title (if exists) */}
                          {post.bookTitle && (
                            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-primary/10 text-primary text-sm mb-3">
                              <BookOpen size={16} />
                              {post.bookTitle}
                              {post.bookAuthor && (
                                <span className="text-primary/70">
                                  by {post.bookAuthor}
                                </span>
                              )}
                            </div>
                          )}

                          <p className="text-foreground leading-relaxed text-[15px] mb-5 line-clamp-4">
                            {post.content}
                          </p>

                          <div className="flex items-center gap-6">
                            <div className="flex items-center gap-2 text-sm text-muted-foreground">
                              <Heart size={18} />
                              <span>{post.likes}</span>
                            </div>
                            <div className="flex items-center gap-2 text-sm text-muted-foreground">
                              <MessageSquare size={18} />
                              <span>{post.comments}</span>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </Link>
                ))
              ) : (
                <div className="rounded-[2rem] bg-card/60 border border-dashed border-border py-20 text-center">
                  <BookOpen
                    size={40}
                    className="mx-auto text-muted-foreground mb-4"
                  />
                  <h3 className="text-2xl font-serif mb-2">
                    No discussions yet
                  </h3>
                  <p className="text-muted-foreground">
                    {isMember
                      ? "Be the first to start a conversation!"
                      : "Join to participate"}
                  </p>
                </div>
              )}
            </div>
          </div>

          {/* Sidebar */}
          <div className="hidden lg:block">
            <div className="sticky top-24 bg-card/80 backdrop-blur-xl border border-border rounded-[2rem] p-8 shadow-xl">
              <h3 className="text-2xl font-serif mb-6">About This Club</h3>

              {isMember ? (
                <div className="mb-6 bg-green-500/10 border border-green-500/20 rounded-2xl p-4">
                  <div className="flex items-center gap-3 text-green-600 dark:text-green-400">
                    <CheckCircle size={22} />
                    <div>
                      <p className="font-semibold">You're a member</p>
                      <p className="text-sm">You can post anytime</p>
                    </div>
                  </div>
                </div>
              ) : (
                <Button
                  onClick={handleJoinClick}
                  className="w-full h-12 rounded-2xl mb-6"
                >
                  <Users className="mr-2" size={18} />
                  Join Club
                </Button>
              )}

              <div className="space-y-6">
                <div className="p-4 rounded-2xl bg-muted/50">
                  <p className="text-sm text-muted-foreground mb-1">
                    Created by
                  </p>
                  <p className="font-semibold">{club.createdBy}</p>
                </div>
                <div className="p-4 rounded-2xl bg-muted/50">
                  <p className="text-sm text-muted-foreground mb-1">
                    Created on
                  </p>
                  <p className="font-semibold">
                    {new Date(club.createdAt).toLocaleDateString("en-US", {
                      month: "long",
                      day: "numeric",
                      year: "numeric",
                    })}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Mobile Floating Button */}
      {isMember && (
        <button
          onClick={() => setShowCreateModal(true)}
          className="md:hidden fixed bottom-6 right-6 w-16 h-16 bg-primary text-primary-foreground rounded-full shadow-2xl flex items-center justify-center z-50 hover:scale-105 active:scale-95 transition-transform"
        >
          <Plus size={32} />
        </button>
      )}

      {/* Mobile Create Post Modal */}
      <Dialog open={showCreateModal} onOpenChange={setShowCreateModal}>
        <DialogContent className="rounded-[2rem] md:rounded-3xl max-w-lg mx-auto h-[85vh] md:h-auto flex flex-col">
          <DialogHeader>
            <DialogTitle className="text-2xl font-serif text-center">
              New Discussion
            </DialogTitle>
          </DialogHeader>

          <div className="flex-1 flex flex-col mt-4">
            <Textarea
              value={newPost}
              onChange={(e) => setNewPost(e.target.value)}
              placeholder="What are you thinking about? Share a book review, quote, or question..."
              className="flex-1 resize-none text-base bg-background border-border rounded-2xl p-5"
            />

            <p className="text-xs text-muted-foreground mt-3 text-center">
              Keep discussions respectful and book-related.
            </p>
          </div>

          <DialogFooter className="mt-6 flex gap-3">
            <Button
              variant="outline"
              onClick={() => {
                setShowCreateModal(false);
                setNewPost("");
              }}
              className="flex-1 rounded-2xl"
            >
              Cancel
            </Button>
            <Button
              onClick={handleCreatePost}
              disabled={!newPost.trim() || isSubmitting}
              className="flex-1 rounded-2xl"
            >
              {isSubmitting ? "Publishing..." : "Publish Post"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Join Dialog */}
      <Dialog open={showJoinDialog} onOpenChange={setShowJoinDialog}>
        <DialogContent className="rounded-[2rem]">
          <DialogHeader>
            <DialogTitle className="text-3xl font-serif">
              Join {club.name}
            </DialogTitle>
          </DialogHeader>

          <div className="space-y-5 mt-4">
            <div className="rounded-2xl bg-muted/50 p-5 max-h-52 overflow-y-auto text-sm leading-relaxed">
              {club.termsAndConditions}
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
  );
}
