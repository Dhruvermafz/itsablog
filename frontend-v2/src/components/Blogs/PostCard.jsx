import React, { useState } from "react";
import { message, Dropdown, Space, Avatar as AntAvatar } from "antd";
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

const PostCard = ({ post, preview, removePost }) => {
  const [isCommentSectionOpen, setIsCommentSectionOpen] = useState(false);
  const [commentContent, setCommentContent] = useState("");
  const navigate = useNavigate();
  const user = isLoggedIn();
  const [currentPost, setCurrentPost] = useState(post);
  const [likeCount, setLikeCount] = useState(post.likeCount);

  const [deletePost, { isLoading: deleteLoading }] = useDeletePostMutation();
  const [likePost] = useLikePostMutation();
  const [unlikePost] = useUnlikePostMutation();
  const [createComment, { isLoading: commentLoading }] =
    useCreateCommentMutation();

  const { data: comments, isLoading: commentsLoading } =
    useGetPostCommentsQuery(currentPost._id, { skip: !isCommentSectionOpen });

  const maxHeight = preview === "primary" ? "250px" : null;
  const isAuthor = user?.username === currentPost?.poster?.username;

  const handleDeletePost = async (e) => {
    e.domEvent.stopPropagation();
    try {
      await deletePost(currentPost._id).unwrap();
      message.success("Post deleted successfully!");
      if (preview && removePost) removePost(currentPost);
      else navigate("/");
    } catch (error) {
      message.error("Failed to delete post. Please try again.");
    }
  };

  const handleEditPost = (e) => {
    e.domEvent.stopPropagation();
    navigate(`/blog/${currentPost._id}/edit`);
  };

  const handleLike = async (liked) => {
    if (!user) {
      message.error("Please log in to like posts.");
      return;
    }
    try {
      if (liked) {
        setLikeCount((prev) => prev + 1);
        await likePost(currentPost._id).unwrap();
        setCurrentPost({ ...currentPost, liked: true });
      } else {
        setLikeCount((prev) => prev - 1);
        await unlikePost(currentPost._id).unwrap();
        setCurrentPost({ ...currentPost, liked: false });
      }
    } catch (error) {
      message.error("Failed to update like. Please try again.");
      setLikeCount((prev) => (liked ? prev - 1 : prev + 1));
    }
  };

  const handleCommentSubmit = async (e) => {
    e.preventDefault();
    if (!user) {
      message.error("Please log in to comment.");
      return;
    }
    if (!commentContent.trim()) {
      message.error("Comment cannot be empty.");
      return;
    }
    try {
      await createComment({
        id: currentPost._id,
        content: commentContent,
      }).unwrap();
      message.success("Comment posted successfully!");
      setCommentContent("");
    } catch (error) {
      message.error("Failed to post comment. Please try again.");
    }
  };

  const toggleCommentSection = () => {
    setIsCommentSectionOpen(!isCommentSectionOpen);
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  // AntD Dropdown Menu
  const menuItems = [
    {
      key: "edit",
      label: "Edit Post",
      icon: (
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className="h-4 w-4"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"
          />
        </svg>
      ),
      onClick: handleEditPost,
    },
    {
      key: "delete",
      label: "Delete Post",
      danger: true,
      icon: (
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className="h-4 w-4"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M6 18L18 6M6 6l12 12"
          />
        </svg>
      ),
      onClick: handleDeletePost,
    },
  ];

  return (
    <div className="card bg-white dark:bg-navy-700 rounded-lg shadow-md border border-slate-200 dark:border-navy-500">
      {/* Header */}
      <div className="flex items-center justify-between p-4">
        <div className="flex items-center space-x-3">
          <div className="relative group">
            <div className="avatar h-9 w-9">
              <Avatar
                size="36"
                round={true}
                src={currentPost?.poster?.avatar}
                name={currentPost?.poster?.username || "Unknown User"}
              />
            </div>

            {/* Hover Card */}
            <div className="absolute z-20 hidden group-hover:block w-48 rounded-md border border-slate-150 bg-white p-3 text-center shadow-lg dark:border-navy-600 dark:bg-navy-700">
              <AntAvatar
                size={64}
                src={currentPost?.poster?.avatar}
                alt={currentPost?.poster?.username}
              >
                {currentPost?.poster?.username?.[0]}
              </AntAvatar>
              <p className="mt-2 font-medium text-slate-700 dark:text-navy-100">
                {currentPost?.poster?.username}
              </p>
              <Link
                to={`/user/${currentPost?.poster?.username}`}
                className="text-xs text-primary hover:underline dark:text-accent-light"
              >
                @{currentPost?.poster?.username}
              </Link>
              <button className="mt-3 h-7 rounded-full bg-primary px-4 text-xs font-medium text-white hover:bg-primary-focus dark:bg-accent dark:hover:bg-accent-focus">
                Follow
              </button>
            </div>
          </div>

          <div>
            <p className="text-sm font-medium text-slate-700 dark:text-navy-100">
              {currentPost?.poster?.username || "Unknown User"}
            </p>
            <p className="text-xs text-slate-400 dark:text-navy-300">
              {formatDate(currentPost?.createdAt)}
              {currentPost?.edited && " (Edited)"}
            </p>
          </div>
        </div>

        {/* AntD Dropdown for Edit/Delete */}
        {user && (isAuthor || user.isAdmin) && preview !== "secondary" && (
          <Dropdown
            menu={{ items: menuItems }}
            trigger={["click"]}
            placement="bottomRight"
            disabled={deleteLoading}
          >
            <button
              className="btn -mr-1.5 h-8 w-8 rounded-full p-0 hover:bg-slate-300/20 focus:bg-slate-300/20 active:bg-slate-300/25 dark:hover:bg-navy-300/20 dark:focus:bg-navy-300/20 dark:active:bg-navy-300/25"
              onClick={(e) => e.stopPropagation()}
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-5 w-5"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth="2"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M12 5v.01M12 12v.01M12 19v.01M12 6a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2z"
                />
              </svg>
            </button>
          </Dropdown>
        )}
      </div>

      {/* Content */}
      <div className="px-4 pt-4">
        <Link
          to={`/blog/${currentPost._id}`}
          className="text-base font-medium text-slate-700 hover:text-primary focus:text-primary dark:text-navy-100 dark:hover:text-accent-light dark:focus:text-accent-light"
        >
          {currentPost?.title}
        </Link>

        {preview !== "secondary" && (
          <div
            className="mt-2 line-clamp-3 text-slate-600 dark:text-navy-200"
            style={{ maxHeight, overflow: "hidden" }}
          >
            {currentPost?.content}
          </div>
        )}

        <div className="mt-3 flex flex-wrap gap-2">
          {currentPost?.tags?.map((tag) => (
            <Link
              key={tag}
              to={`/tags/${tag}`}
              className="tag rounded-full bg-primary/10 text-primary hover:bg-primary/20 focus:bg-primary/20 active:bg-primary/25 dark:bg-accent-light/10 dark:text-accent-light dark:hover:bg-accent-light/20 dark:focus:bg-accent-light/20 dark:active:bg-accent-light/25 px-3 py-1 text-xs"
            >
              {tag}
            </Link>
          ))}
        </div>
      </div>

      {/* Footer: Like & Comment */}
      <div className="flex justify-between px-4 py-4">
        <div className="flex items-center space-x-2">
          {likeCount > 0 && (
            <span className="text-xs text-slate-400 dark:text-navy-300">
              {likeCount} {likeCount === 1 ? "Like" : "Likes"}
            </span>
          )}
        </div>

        <Space>
          <button
            onClick={() => handleLike(!currentPost?.liked)}
            className={`btn h-7 w-7 rounded-full p-0 ${
              currentPost?.liked
                ? "text-secondary dark:text-secondary-light"
                : "hover:bg-slate-300/20 focus:bg-slate-300/20 active:bg-slate-300/25 dark:hover:bg-navy-300/20 dark:focus:bg-navy-300/20 dark:active:bg-navy-300/25"
            }`}
            disabled={deleteLoading}
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-4.5 w-4.5"
              fill={currentPost?.liked ? "currentColor" : "none"}
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth="2"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"
              />
            </svg>
            <span className="ml-1 text-xs">{likeCount}</span>
          </button>

          <button
            onClick={toggleCommentSection}
            className="btn h-7 w-7 rounded-full p-0 hover:bg-slate-300/20 focus:bg-slate-300/20 active:bg-slate-300/25 dark:hover:bg-navy-300/20 dark:focus:bg-navy-300/20 dark:active:bg-navy-300/25"
            disabled={deleteLoading}
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-4.5 w-4.5"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth="2"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M8 10h.01M12 10h.01M16 10h.01M9 16H5v-4a2 2 0 012-2h10a2 2 0 012 2v4h-4M9 16l3 3m0 0l3-3"
              />
            </svg>
            <span className="ml-1 text-xs">
              {currentPost?.commentCount || 0}
            </span>
          </button>
        </Space>
      </div>

      {/* Comment Section */}
      {isCommentSectionOpen && (
        <div className="border-t border-slate-200 dark:border-navy-500 px-4 py-4">
          {user ? (
            <form
              onSubmit={handleCommentSubmit}
              className="relative flex w-full mb-4"
            >
              <input
                className="form-input peer h-10 w-full bg-transparent px-8 py-2 text-sm placeholder:text-slate-400/70 dark:placeholder:text-navy-300"
                placeholder="Write a comment..."
                value={commentContent}
                onChange={(e) => setCommentContent(e.target.value)}
                disabled={commentLoading}
              />
              <button
                type="submit"
                className="absolute right-0 top-0 h-full flex items-center justify-center px-3 text-primary dark:text-accent"
                disabled={commentLoading}
              >
                <i className="fa fa-paper-plane"></i>
              </button>
            </form>
          ) : (
            <p className="text-sm text-slate-400 dark:text-navy-300 mb-4">
              Please{" "}
              <Link to="/login" className="text-primary hover:underline">
                log in
              </Link>{" "}
              to comment.
            </p>
          )}

          {commentsLoading ? (
            <p className="text-sm text-slate-400 dark:text-navy-300">
              Loading comments...
            </p>
          ) : comments && comments.length > 0 ? (
            <div className="space-y-4">
              {comments.map((comment) => (
                <div key={comment._id} className="flex items-start space-x-3">
                  <Avatar
                    size="32"
                    round={true}
                    src={comment.commenter?.avatar}
                    name={comment.commenter?.username || "Unknown User"}
                  />
                  <div>
                    <p className="text-sm font-medium text-slate-700 dark:text-navy-100">
                      {comment.commenter?.username || "Unknown User"}
                    </p>
                    <p className="text-xs text-slate-600 dark:text-navy-200">
                      {comment.content}
                    </p>
                    <p className="text-xs text-slate-400 dark:text-navy-300">
                      {formatDate(comment.createdAt)}
                      {comment.edited && " (Edited)"}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-sm text-slate-400 dark:text-navy-300">
              No comments yet.
            </p>
          )}
        </div>
      )}
    </div>
  );
};

export default PostCard;
