"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";

import {
  ArrowLeft,
  Heart,
  MessageSquare,
  Send,
  Clock3,
  BookOpen,
  Pencil,
  Trash2,
  Check,
  X,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";

import { useAuth } from "@/contexts/AuthContext";

// RTK Query
import {
  useGetPostQuery,
  useToggleLikeMutation,
  useGetPostCommentsQuery,
  useCreateCommentMutation,
  useEditCommentMutation,
  useDeleteCommentMutation,
} from "@/api/clubApi";

export default function PostDetailPage({ params }) {
  const { id } = React.use(params);

  const { user } = useAuth();
  const router = useRouter();

  // ========================================
  // Queries
  // ========================================

  const {
    data: postResponse,
    isLoading,
    error,
    refetch,
  } = useGetPostQuery(id, { skip: !id });

  const post = postResponse?.data;
  const club = post?.club;

  const { data: commentsData, refetch: refetchComments } =
    useGetPostCommentsQuery(id, { skip: !id });

  const comments = commentsData?.data || [];

  // ========================================
  // Mutations
  // ========================================

  const [toggleLikeMutation] = useToggleLikeMutation();
  const [createCommentMutation] = useCreateCommentMutation();
  const [editCommentMutation] = useEditCommentMutation();
  const [deleteCommentMutation] = useDeleteCommentMutation();

  // ========================================
  // State
  // ========================================

  const [newComment, setNewComment] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const [editingCommentId, setEditingCommentId] = useState(null);
  const [editText, setEditText] = useState("");
  const [isUpdating, setIsUpdating] = useState(false);

  // Timer to re-evaluate edit eligibility
  const [now, setNow] = useState(Date.now());

  // ========================================
  // Live Timer Effect
  // ========================================

  useEffect(() => {
    const interval = setInterval(() => {
      setNow(Date.now());
    }, 30000); // Update every 30 seconds (sufficient for 10-min window)

    return () => clearInterval(interval);
  }, []);

  // ========================================
  // Helpers
  // ========================================

  const formatDate = (dateString) => {
    if (!dateString) return "";

    const date = new Date(dateString);
    const diffInHours = Math.floor(
      (Date.now() - date.getTime()) / (1000 * 60 * 60),
    );

    if (diffInHours < 1) return "Just now";
    if (diffInHours < 24) return `${diffInHours}h ago`;
    if (diffInHours < 48) return "Yesterday";

    return date.toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
    });
  };

  // ========================================
  // Actions
  // ========================================

  const handleAddComment = async () => {
    if (!newComment.trim() || !user || isSubmitting) return;

    setIsSubmitting(true);
    try {
      await createCommentMutation({
        postId: id,
        content: newComment.trim(),
      }).unwrap();

      setNewComment("");
      refetchComments();
      refetch();
    } catch (err) {
      console.error("Failed to add comment:", err);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleEditComment = async (commentId) => {
    if (!editText.trim()) return;

    setIsUpdating(true);
    try {
      await editCommentMutation({
        commentId,
        content: editText.trim(),
      }).unwrap();

      setEditingCommentId(null);
      setEditText("");
      refetchComments();
    } catch (err) {
      console.error("Failed to edit comment:", err);
    } finally {
      setIsUpdating(false);
    }
  };

  const handleDeleteComment = async (commentId) => {
    const confirmDelete = window.confirm(
      "Are you sure you want to delete this comment?",
    );
    if (!confirmDelete) return;

    try {
      await deleteCommentMutation(commentId).unwrap();
      refetchComments();
      refetch();
    } catch (err) {
      console.error("Failed to delete comment:", err);
    }
  };

  const toggleLike = async () => {
    if (!user) {
      router.push("/login");
      return;
    }

    try {
      await toggleLikeMutation(id).unwrap();
      refetch();
    } catch (err) {
      console.error("Failed to like post:", err);
    }
  };

  // ========================================
  // Loading & Error
  // ========================================

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        Loading post...
      </div>
    );
  }

  if (error || !post) {
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

  // ========================================
  // Render
  // ========================================

  return (
    <div className="min-h-screen bg-background py-6">
      <div className="container mx-auto max-w-5xl px-4">
        {/* Back Button */}
        <Button variant="ghost" asChild className="mb-6 rounded-full">
          <Link href={club ? `/club/${club._id}` : "/clubs"}>
            <ArrowLeft className="mr-2" size={20} />
            Back to Club
          </Link>
        </Button>

        <div className="bg-card border border-border rounded-3xl shadow-2xl overflow-hidden">
          <div className="grid lg:grid-cols-2 min-h-[650px]">
            {/* LEFT SIDE - POST */}
            <div className="flex flex-col border-r border-border">
              {/* Header */}
              <div className="flex items-center gap-3 p-5 border-b border-border">
                <Avatar className="w-11 h-11">
                  <AvatarImage src={post.author?.avatar} />
                  <AvatarFallback>
                    {post.author?.name?.[0] || "U"}
                  </AvatarFallback>
                </Avatar>

                <div>
                  <p className="font-semibold">{post.author?.name}</p>
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

              {/* Content */}
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

              {/* Actions */}
              <div className="p-6 border-t border-border flex items-center gap-6">
                <button
                  onClick={toggleLike}
                  className="flex items-center gap-3 text-2xl transition-all hover:text-red-500 text-muted-foreground"
                >
                  <Heart size={28} />
                  <span className="text-base font-medium">
                    {post.likesCount ?? 0}
                  </span>
                </button>

                <div className="flex items-center gap-3 text-muted-foreground">
                  <MessageSquare size={28} />
                  <span className="text-base font-medium">
                    {comments.length}
                  </span>
                </div>
              </div>
            </div>

            {/* COMMENTS SECTION */}
            <div className="flex flex-col h-full lg:max-h-[650px]">
              <div className="p-5 border-b border-border bg-muted/30">
                <h3 className="font-serif text-xl">
                  Comments ({comments.length})
                </h3>
              </div>

              {/* Comments List */}
              <div className="flex-1 overflow-y-auto p-5 space-y-6 custom-scrollbar">
                {comments.length > 0 ? (
                  comments.map((comment) => {
                    const isOwner = user?._id === comment.user?._id;
                    const commentTime = new Date(comment.createdAt).getTime();
                    const canEdit =
                      isOwner && now - commentTime < 10 * 60 * 1000;

                    return (
                      <div key={comment._id} className="flex gap-3">
                        <Avatar className="w-9 h-9 mt-0.5">
                          <AvatarImage src={comment.user?.avatar} />
                          <AvatarFallback>
                            {comment.user?.name?.[0] || "U"}
                          </AvatarFallback>
                        </Avatar>

                        <div className="flex-1">
                          <div className="bg-muted/50 rounded-2xl px-4 py-3">
                            <div className="flex items-center justify-between gap-3">
                              <p className="font-semibold text-sm">
                                {comment.user?.name}
                              </p>

                              {isOwner && (
                                <div className="flex items-center gap-2">
                                  <button
                                    disabled={!canEdit}
                                    title={
                                      canEdit
                                        ? "Edit comment"
                                        : "Editing allowed only within 10 minutes"
                                    }
                                    onClick={() => {
                                      if (!canEdit) return;
                                      setEditingCommentId(comment._id);
                                      setEditText(comment.content);
                                    }}
                                    className={`transition-colors ${
                                      canEdit
                                        ? "text-muted-foreground hover:text-foreground"
                                        : "text-muted-foreground/40 cursor-not-allowed"
                                    }`}
                                  >
                                    <Pencil size={14} />
                                  </button>

                                  <button
                                    onClick={() =>
                                      handleDeleteComment(comment._id)
                                    }
                                    className="text-muted-foreground hover:text-red-500 transition-colors"
                                  >
                                    <Trash2 size={14} />
                                  </button>
                                </div>
                              )}
                            </div>

                            {editingCommentId === comment._id ? (
                              <div className="mt-3">
                                <Textarea
                                  value={editText}
                                  onChange={(e) => setEditText(e.target.value)}
                                  className="mb-3"
                                />
                                <div className="flex items-center gap-2">
                                  <Button
                                    size="sm"
                                    onClick={() =>
                                      handleEditComment(comment._id)
                                    }
                                    disabled={isUpdating}
                                  >
                                    <Check size={16} />
                                  </Button>
                                  <Button
                                    size="sm"
                                    variant="outline"
                                    onClick={() => {
                                      setEditingCommentId(null);
                                      setEditText("");
                                    }}
                                  >
                                    <X size={16} />
                                  </Button>
                                </div>
                              </div>
                            ) : (
                              <p className="leading-relaxed text-foreground mt-1">
                                {comment.content}
                              </p>
                            )}
                          </div>

                          <div className="flex items-center gap-2 mt-2 text-xs text-muted-foreground">
                            <span>{formatDate(comment.createdAt)}</span>
                            {comment.isEdited && <span>• edited</span>}
                          </div>
                        </div>
                      </div>
                    );
                  })
                ) : (
                  <div className="h-full flex items-center justify-center text-muted-foreground">
                    No comments yet. Be the first to comment!
                  </div>
                )}
              </div>

              {/* Add Comment */}
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
