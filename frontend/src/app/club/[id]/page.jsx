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
  // ✅ Unwrap the params Promise using React.use()
  const { id } = use(params);

  const { user } = useAuth();
  const router = useRouter();

  const club = mockClubs.find((c) => c.id === id);

  const [showJoinDialog, setShowJoinDialog] = useState(false);
  const [acceptedTerms, setAcceptedTerms] = useState(false);
  const [isMember, setIsMember] = useState(false);
  const [newPost, setNewPost] = useState("");
  const [posts, setPosts] = useState([]);

  // Initialize membership and posts
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
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-serif mb-4">Club not found</h1>
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
      alert("Please accept the terms and conditions to join");
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
      alert("Please join the club to create posts");
      return;
    }
    if (!newPost.trim()) {
      alert("Please write something before posting");
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
    <div className="min-h-screen py-8" data-testid="club-detail-page">
      <div className="container mx-auto px-4 md:px-8 lg:px-12">
        {/* Back Button */}
        <Button
          variant="ghost"
          asChild
          className="mb-6"
          data-testid="back-button"
        >
          <Link href="/clubs">
            <ArrowLeft className="mr-2" size={18} />
            Back to Clubs
          </Link>
        </Button>

        {/* Club Header */}
        <div className="relative h-64 md:h-80 rounded-2xl overflow-hidden mb-8 shadow-2xl">
          <img
            src={club.coverImage}
            alt={club.name}
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/50 to-transparent" />
          <div className="absolute bottom-0 left-0 right-0 p-8">
            <Badge variant="secondary" className="mb-3">
              {club.category}
            </Badge>
            <h1 className="text-4xl md:text-5xl font-serif tracking-tight text-white mb-3">
              {club.name}
            </h1>
            <p className="text-lg text-white/90 mb-4 max-w-3xl">
              {club.description}
            </p>
            <div className="flex flex-wrap items-center gap-6 text-white/80">
              <div className="flex items-center gap-2">
                <Users size={20} />
                <span>{club.memberCount.toLocaleString()} members</span>
              </div>
              <div className="flex items-center gap-2">
                <MessageSquare size={20} />
                <span>{club.postCount} posts</span>
              </div>
            </div>
          </div>
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2">
            {/* Create Post Section */}
            {isMember && (
              <div
                className="bg-white dark:bg-slate-900 rounded-xl p-6 shadow-lg mb-6"
                data-testid="create-post-section"
              >
                <h3 className="font-serif text-xl mb-4">Share with the club</h3>
                <Textarea
                  value={newPost}
                  onChange={(e) => setNewPost(e.target.value)}
                  placeholder="What's on your mind? Share your thoughts about books..."
                  rows={4}
                  className="mb-4"
                  data-testid="new-post-textarea"
                />
                <Button onClick={handleCreatePost} data-testid="post-button">
                  <Send size={18} className="mr-2" />
                  Post
                </Button>
              </div>
            )}

            {/* Posts Feed */}
            <div className="space-y-6">
              <h2 className="text-2xl font-serif">Recent Posts</h2>
              {posts.length > 0 ? (
                posts.map((post) => (
                  <div
                    key={post.id}
                    className="bg-white dark:bg-slate-900 rounded-xl p-6 shadow-lg"
                    data-testid={`club-post-${post.id}`}
                  >
                    <div className="flex items-start gap-4 mb-4">
                      <img
                        src={post.userAvatar}
                        alt={post.userName}
                        className="w-12 h-12 rounded-full ring-2 ring-primary/20 object-cover"
                      />
                      <div className="flex-1">
                        <div className="flex items-center justify-between">
                          <h4 className="font-semibold">{post.userName}</h4>
                          <span className="text-sm text-slate-500 font-mono">
                            {formatDate(post.createdAt)}
                          </span>
                        </div>
                        {post.bookTitle && (
                          <p className="text-sm text-slate-600 dark:text-slate-400">
                            reading{" "}
                            <span className="font-serif text-primary">
                              {post.bookTitle}
                            </span>
                            {post.bookAuthor && ` by ${post.bookAuthor}`}
                          </p>
                        )}
                      </div>
                    </div>
                    <p className="text-slate-700 dark:text-slate-300 leading-relaxed mb-4">
                      {post.content}
                    </p>
                    <div className="flex items-center gap-6 text-sm text-slate-600 dark:text-slate-400">
                      <button className="flex items-center gap-2 hover:text-primary transition-colors">
                        <Heart size={16} />
                        <span>{post.likes} likes</span>
                      </button>
                      <button className="flex items-center gap-2 hover:text-primary transition-colors">
                        <MessageSquare size={16} />
                        <span>{post.comments} comments</span>
                      </button>
                    </div>
                  </div>
                ))
              ) : (
                <div className="text-center py-12 bg-slate-50 dark:bg-slate-900/50 rounded-xl">
                  <p className="text-slate-600 dark:text-slate-400">
                    No posts yet. {isMember && "Be the first to post!"}
                  </p>
                </div>
              )}
            </div>
          </div>

          {/* Sidebar */}
          <div className="lg:col-span-1">
            <div className="bg-white dark:bg-slate-900 rounded-xl p-6 shadow-lg sticky top-24">
              <h3 className="font-serif text-xl mb-4">About This Club</h3>

              {isMember ? (
                <div className="mb-6 p-4 bg-green-50 dark:bg-green-900/20 rounded-lg">
                  <div className="flex items-center gap-2 text-green-700 dark:text-green-400">
                    <CheckCircle size={20} />
                    <span className="font-semibold">You're a member</span>
                  </div>
                </div>
              ) : (
                <Button
                  onClick={handleJoinClick}
                  className="w-full mb-6 bg-primary hover:bg-primary/90"
                  data-testid="join-club-button"
                >
                  <Users className="mr-2" size={18} />
                  Join Club
                </Button>
              )}

              <div className="space-y-4 text-sm">
                <div>
                  <p className="text-slate-500 dark:text-slate-400 mb-1">
                    Created by
                  </p>
                  <p className="font-semibold">{club.createdBy}</p>
                </div>
                <div>
                  <p className="text-slate-500 dark:text-slate-400 mb-1">
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
                <div>
                  <p className="text-slate-500 dark:text-slate-400 mb-1">
                    Category
                  </p>
                  <Badge>{club.category}</Badge>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Join Dialog */}
        <Dialog open={showJoinDialog} onOpenChange={setShowJoinDialog}>
          <DialogContent data-testid="join-dialog">
            <DialogHeader>
              <DialogTitle className="font-serif text-2xl">
                Join {club.name}
              </DialogTitle>
            </DialogHeader>
            <div className="space-y-4 mt-4">
              <div>
                <h4 className="font-semibold mb-2">Terms and Conditions</h4>
                <div className="bg-slate-50 dark:bg-slate-800 p-4 rounded-lg max-h-48 overflow-y-auto">
                  <p className="text-sm text-slate-700 dark:text-slate-300 leading-relaxed">
                    {club.termsAndConditions}
                  </p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <Checkbox
                  id="terms"
                  checked={acceptedTerms}
                  onCheckedChange={setAcceptedTerms}
                  data-testid="accept-terms-checkbox"
                />
                <label htmlFor="terms" className="text-sm cursor-pointer">
                  I have read and agree to the club's terms and conditions
                </label>
              </div>
            </div>
            <DialogFooter>
              <Button
                variant="outline"
                onClick={() => setShowJoinDialog(false)}
              >
                Cancel
              </Button>
              <Button
                onClick={handleJoinConfirm}
                disabled={!acceptedTerms}
                data-testid="confirm-join-button"
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
