import React, { useState } from "react";
import { message, Dropdown, Avatar as AntAvatar, Spin } from "antd";
import { useNavigate, Link } from "react-router-dom";
import {
  useDeletePostMutation,
  useLikePostMutation,
  useUnlikePostMutation,
} from "../../api/postApi";
import {
  useCreateCommentMutation,
  useGetPostCommentsQuery,
} from "../../api/commentApi";
import { isLoggedIn } from "../../helpers/authHelper";
import Avatar from "react-avatar";
import { FaHeart, FaComment, FaPaperPlane, FaEllipsisV } from "react-icons/fa";

const PostCard = ({ post, preview = "primary", removePost }) => {
  const [isCommentSectionOpen, setIsCommentSectionOpen] = useState(false);
  const [commentContent, setCommentContent] = useState("");
  const navigate = useNavigate();
  const user = isLoggedIn();
  const [currentPost, setCurrentPost] = useState(post);
  const [likeCount, setLikeCount] = useState(post.likeCount || 0);

  const [deletePost, { isLoading: deleteLoading }] = useDeletePostMutation();
  const [likePost] = useLikePostMutation();
  const [unlikePost] = useUnlikePostMutation();
  const [createComment, { isLoading: commentLoading }] =
    useCreateCommentMutation();

  const { data: comments = [], isLoading: commentsLoading } =
    useGetPostCommentsQuery(currentPost._id, { skip: !isCommentSectionOpen });

  const isAuthor = user?.username === currentPost?.poster?.username;
  const hasImage = currentPost?.image;

  const handleDeletePost = async (e) => {
    e.stopPropagation();
    try {
      await deletePost(currentPost._id).unwrap();
      message.success("Post deleted successfully!");
      if (preview && removePost) removePost(currentPost);
      else navigate("/");
    } catch {
      message.error("Failed to delete post.");
    }
  };

  const handleEditPost = (e) => {
    e.stopPropagation();
    navigate(`/blog/${currentPost._id}/edit`);
  };

  const handleLike = async () => {
    if (!user) {
      message.warning("Please log in to like posts.");
      return;
    }

    const wasLiked = currentPost.liked;
    const newCount = wasLiked ? likeCount - 1 : likeCount + 1;

    setLikeCount(newCount);
    setCurrentPost({ ...currentPost, liked: !wasLiked });

    try {
      if (wasLiked) {
        await unlikePost(currentPost._id).unwrap();
      } else {
        await likePost(currentPost._id).unwrap();
      }
    } catch {
      message.error("Failed to update like.");
      setLikeCount(likeCount);
      setCurrentPost({ ...currentPost, liked: wasLiked });
    }
  };

  const handleCommentSubmit = async (e) => {
    e.preventDefault();
    if (!user) return message.warning("Please log in to comment.");
    if (!commentContent.trim())
      return message.warning("Comment cannot be empty.");

    try {
      await createComment({
        id: currentPost._id,
        content: commentContent,
      }).unwrap();
      message.success("Comment posted!");
      setCommentContent("");
    } catch {
      message.error("Failed to post comment.");
    }
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffMs = now - date;
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMs / 3600000);
    const diffDays = Math.floor(diffMs / 86400000);

    if (diffMins < 60) return `${diffMins}m ago`;
    if (diffHours < 24) return `${diffHours}h ago`;
    if (diffDays < 7) return `${diffDays}d ago`;
    return date.toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    });
  };

  const menuItems = [
    { key: "edit", label: "Edit Post", onClick: handleEditPost },
    {
      key: "delete",
      label: "Delete Post",
      danger: true,
      onClick: handleDeletePost,
    },
  ].filter((item) => user?.isAdmin || isAuthor);

  return (
    <div className="bg-white dark:bg-gray-900 rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 overflow-hidden border border-gray-100 dark:border-gray-800">
      {/* Header */}
      <div className="p-6 pb-4">
        <div className="flex items-center justify-between">
          <Link
            to={`/u/${currentPost?.poster?.username}`}
            className="flex items-center space-x-4 group"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="relative">
              <Avatar
                size="48"
                round={true}
                src={currentPost?.poster?.avatar}
                name={currentPost?.poster?.username}
                className="ring-4 ring-white dark:ring-gray-900 shadow-md"
              />
              {currentPost?.poster?.isOnline && (
                <span className="absolute bottom-0 right-0 w-4 h-4 bg-green-500 rounded-full ring-4 ring-white dark:ring-gray-900"></span>
              )}
            </div>
            <div>
              <p className="font-semibold text-gray-900 dark:text-gray-100 group-hover:text-primary dark:group-hover:text-blue-400 transition-colors">
                {currentPost?.poster?.username || "Unknown"}
              </p>
              <p className="text-sm text-gray-500 dark:text-gray-400">
                {formatDate(currentPost?.createdAt)}
                {currentPost?.edited && " · Edited"}
              </p>
            </div>
          </Link>

          {(isAuthor || user?.isAdmin) && menuItems.length > 0 && (
            <Dropdown
              menu={{ items: menuItems }}
              trigger={["click"]}
              placement="bottomRight"
            >
              <button
                onClick={(e) => e.stopPropagation()}
                className="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
                disabled={deleteLoading}
              >
                <FaEllipsisV className="text-gray-500" />
              </button>
            </Dropdown>
          )}
        </div>
      </div>

      {/* Featured Image (if exists) */}
      {hasImage && preview === "primary" && (
        <div className="relative overflow-hidden">
          <img
            src={currentPost.image}
            alt={currentPost.title}
            className="w-full h-64 object-cover hover:scale-105 transition-transform duration-500"
          />
        </div>
      )}

      {/* Content */}
      <div className="p-6 pt-4">
        <Link to={`/blog/${currentPost._id}`} className="block">
          <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-100 hover:text-primary dark:hover:text-blue-400 transition-colors mb-3">
            {currentPost?.title}
          </h2>
        </Link>

        {preview === "primary" && (
          <p className="text-gray-700 dark:text-gray-300 line-clamp-3 leading-relaxed text-base">
            {currentPost?.content}
          </p>
        )}

        {/* Tags */}
        {currentPost?.tags?.length > 0 && (
          <div className="flex flex-wrap gap-2 mt-5">
            {currentPost.tags.map((tag) => (
              <Link
                key={tag}
                to={`/tags/${tag}`}
                className="px-4 py-1.5 text-sm font-medium bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400 rounded-full hover:bg-blue-200 dark:hover:bg-blue-800/50 transition-colors"
                onClick={(e) => e.stopPropagation()}
              >
                #{tag}
              </Link>
            ))}
          </div>
        )}
      </div>

      {/* Actions Footer */}
      <div className="px-6 pb-6 flex items-center justify-between">
        <div className="flex items-center space-x-6">
          <button
            onClick={(e) => {
              e.stopPropagation();
              handleLike();
            }}
            className={`flex items-center space-x-2 group transition-all ${
              currentPost?.liked
                ? "text-red-500"
                : "text-gray-600 dark:text-gray-400"
            }`}
          >
            <FaHeart
              className={`text-lg group-hover:scale-110 transition-transform ${
                currentPost?.liked ? "fill-current" : ""
              }`}
            />
            <span className="text-sm font-medium">{likeCount}</span>
          </button>

          <button
            onClick={(e) => {
              e.stopPropagation();
              setIsCommentSectionOpen(!isCommentSectionOpen);
            }}
            className="flex items-center space-x-2 text-gray-600 dark:text-gray-400 hover:text-primary transition-colors"
          >
            <FaComment className="text-lg" />
            <span className="text-sm font-medium">
              {currentPost?.commentCount || 0}
            </span>
          </button>
        </div>
      </div>

      {/* Comment Section */}
      {isCommentSectionOpen && (
        <div className="border-t border-gray-200 dark:border-gray-800 px-6 py-5">
          {user ? (
            <form
              onSubmit={handleCommentSubmit}
              className="flex items-center space-x-3 mb-5"
            >
              <Avatar size="36" round src={user.avatar} name={user.username} />
              <input
                type="text"
                placeholder="Write a comment..."
                value={commentContent}
                onChange={(e) => setCommentContent(e.target.value)}
                className="flex-1 px-4 py-2.5 bg-gray-100 dark:bg-gray-800 rounded-full focus:outline-none focus:ring-2 focus:ring-primary text-sm"
                disabled={commentLoading}
              />
              <button
                type="submit"
                disabled={commentLoading || !commentContent.trim()}
                className="p-2.5 rounded-full bg-primary text-white hover:bg-primary/90 disabled:opacity-50 transition-colors"
              >
                <FaPaperPlane />
              </button>
            </form>
          ) : (
            <p className="text-sm text-gray-500 text-center mb-4">
              <Link
                to="/login"
                className="text-primary hover:underline font-medium"
              >
                Log in
              </Link>{" "}
              to join the discussion.
            </p>
          )}

          {commentsLoading ? (
            <div className="flex justify-center py-4">
              <Spin />
            </div>
          ) : comments.length > 0 ? (
            <div className="space-y-4">
              {comments.map((comment) => (
                <div key={comment._id} className="flex space-x-3">
                  <Avatar
                    size="32"
                    round
                    src={comment.commenter?.avatar}
                    name={comment.commenter?.username}
                  />
                  <div className="flex-1">
                    <div className="bg-gray-100 dark:bg-gray-800 rounded-2xl px-4 py-3">
                      <p className="font-medium text-sm text-gray-900 dark:text-gray-100">
                        {comment.commenter?.username}
                      </p>
                      <p className="text-sm text-gray-700 dark:text-gray-300 mt-1">
                        {comment.content}
                      </p>
                    </div>
                    <p className="text-xs text-gray-500 mt-1.5 ml-4">
                      {formatDate(comment.createdAt)}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-center text-gray-500 text-sm">
              No comments yet. Be the first!
            </p>
          )}
        </div>
      )}
    </div>
  );
};

export default PostCard;
