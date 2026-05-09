"use client";

import React, { useState, useEffect, use } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  ArrowLeft,
  Heart,
  MessageSquare,
  Send,
  Clock3,
  BookOpen,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";

import { getStoredClubPosts, mockClubs } from "@/data/clubsData";
import { useAuth } from "@/contexts/AuthContext";

export default function PostDetailPage({ params }) {
  const { id } = use(params);
  const { user } = useAuth();
  const router = useRouter();

  const [post, setPost] = useState(null);
  const [comments, setComments] = useState([]);
  const [newComment, setNewComment] = useState("");
  const [liked, setLiked] = useState(false);
  const [likeCount, setLikeCount] = useState(0);
  const [isSubmitting, setIsSubmitting] = useState(false);

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

  useEffect(() => {
    const allPosts = getStoredClubPosts();
    const foundPost = allPosts.find((p) => p.id === id);

    if (foundPost) {
      setPost(foundPost);
      setLikeCount(foundPost.likes || 0);

      setComments([
        {
          id: "c1",
          userName: "Elena Reads",
          avatar: "https://i.pravatar.cc/150?img=32",
          content:
            "This quote really hit me hard. I've been thinking about it all week.",
          time: "2h ago",
          likes: 7,
        },
        {
          id: "c2",
          userName: "BookishNomad",
          avatar: "https://i.pravatar.cc/150?img=45",
          content: "Totally agree! Which translation are you reading?",
          time: "1h ago",
          likes: 3,
        },
      ]);
    }
  }, [id]);

  const handleAddComment = () => {
    if (!newComment.trim() || !user || isSubmitting) return;

    setIsSubmitting(true);

    const comment = {
      id: "c" + Date.now(),
      userName: user.name || "You",
      avatar: user.avatar,
      content: newComment.trim(),
      time: "Just now",
      likes: 0,
    };

    setComments([comment, ...comments]);
    setNewComment("");
    setIsSubmitting(false);
  };

  const toggleLike = () => {
    setLiked(!liked);
    setLikeCount((prev) => (liked ? prev - 1 : prev + 1));
  };

  if (!post) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="text-center">
          <h2 className="text-2xl font-serif mb-4">Post not found</h2>
          <Button asChild>
            <Link href="/clubs">Back to Clubs</Link>
          </Button>
        </div>
      </div>
    );
  }

  const club = mockClubs.find((c) => c.id === post.clubId);

  return (
    <div className="min-h-screen bg-background py-6">
      <div className="container mx-auto max-w-5xl px-4">
        {/* Back Button */}
        <Button variant="ghost" asChild className="mb-6 rounded-full">
          <Link href={club ? `/club/${club.id}` : "/clubs"}>
            <ArrowLeft className="mr-2" size={20} />
            Back to Club
          </Link>
        </Button>

        <div className="bg-card border border-border rounded-3xl shadow-2xl overflow-hidden">
          <div className="grid lg:grid-cols-2 min-h-[650px]">
            {/* ==================== LEFT SIDE - POST CONTENT ==================== */}
            <div className="flex flex-col border-r border-border">
              {/* Author Header */}
              <div className="flex items-center gap-3 p-5 border-b border-border">
                <Avatar className="w-11 h-11">
                  <AvatarImage src={post.userAvatar} />
                  <AvatarFallback>{post.userName?.[0]}</AvatarFallback>
                </Avatar>
                <div>
                  <p className="font-semibold">{post.userName}</p>
                  <p className="text-sm text-muted-foreground flex items-center gap-1">
                    <Clock3 size={13} />
                    {formatDate(post.createdAt)}
                  </p>
                </div>
                {club && (
                  <Badge variant="outline" className="ml-auto text-xs">
                    {club.name}
                  </Badge>
                )}
              </div>

              {/* Post Content Area */}
              <div className="flex-1 p-6 md:p-8 flex flex-col">
                {post.bookTitle && (
                  <div className="inline-flex items-center gap-2 bg-primary/10 text-primary px-5 py-2 rounded-full mb-6 w-fit">
                    <BookOpen size={18} />
                    <span>
                      {post.bookTitle}
                      {post.bookAuthor && (
                        <span className="opacity-70"> • {post.bookAuthor}</span>
                      )}
                    </span>
                  </div>
                )}

                <p className="text-[17px] leading-relaxed text-foreground whitespace-pre-wrap">
                  {post.content}
                </p>
              </div>

              {/* Post Actions */}
              <div className="p-6 border-t border-border flex items-center gap-6">
                <button
                  onClick={toggleLike}
                  className={`flex items-center gap-3 text-2xl transition-all ${
                    liked
                      ? "text-red-500"
                      : "hover:text-red-500 text-muted-foreground"
                  }`}
                >
                  <Heart className={liked ? "fill-current" : ""} size={28} />
                  <span className="text-base font-medium">{likeCount}</span>
                </button>

                <div className="flex items-center gap-3 text-muted-foreground">
                  <MessageSquare size={28} />
                  <span className="text-base font-medium">
                    {comments.length}
                  </span>
                </div>
              </div>
            </div>

            {/* ==================== RIGHT SIDE - COMMENTS ==================== */}
            <div className="flex flex-col h-full lg:max-h-[650px]">
              <div className="p-5 border-b border-border bg-muted/30">
                <h3 className="font-serif text-xl">
                  Comments ({comments.length})
                </h3>
              </div>

              {/* Comments Scrollable Area */}
              <div className="flex-1 overflow-y-auto p-5 space-y-6 custom-scrollbar">
                {comments.length > 0 ? (
                  comments.map((comment) => (
                    <div key={comment.id} className="flex gap-3">
                      <Avatar className="w-9 h-9 mt-0.5">
                        <AvatarImage src={comment.avatar} />
                        <AvatarFallback>{comment.userName[0]}</AvatarFallback>
                      </Avatar>

                      <div className="flex-1">
                        <div className="bg-muted/50 rounded-2xl px-4 py-3">
                          <p className="font-semibold text-sm">
                            {comment.userName}
                          </p>
                          <p className="leading-relaxed text-foreground">
                            {comment.content}
                          </p>
                        </div>

                        <div className="flex items-center gap-4 mt-2 text-xs text-muted-foreground">
                          <span>{comment.time}</span>
                          <button className="hover:text-foreground">
                            Like
                          </button>
                          <button className="hover:text-foreground">
                            Reply
                          </button>
                        </div>
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="h-full flex items-center justify-center text-muted-foreground">
                    No comments yet. Be the first to comment!
                  </div>
                )}
              </div>

              {/* Comment Input */}
              <div className="p-5 border-t border-border bg-background">
                <div className="flex gap-3">
                  <Avatar className="w-9 h-9">
                    <AvatarImage src={user?.avatar} />
                    <AvatarFallback>{user?.name?.[0] || "U"}</AvatarFallback>
                  </Avatar>

                  <div className="flex-1 relative">
                    <Textarea
                      value={newComment}
                      onChange={(e) => setNewComment(e.target.value)}
                      placeholder="Write a comment..."
                      className="resize-none rounded-2xl pr-20 py-3 min-h-[52px] bg-muted border-border"
                      rows={1}
                    />
                    <Button
                      onClick={handleAddComment}
                      disabled={!newComment.trim() || isSubmitting}
                      size="sm"
                      className="absolute right-2 bottom-2 rounded-xl"
                    >
                      <Send size={18} />
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
