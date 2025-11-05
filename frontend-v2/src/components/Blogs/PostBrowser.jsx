import React, { useState, useEffect } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import {
  useGetPostsQuery,
  useGetUserLikedPostsQuery,
  useDeletePostMutation,
} from "../../api/postApi";
import { useAuth } from "../../store/AuthContext";
import { Modal, Button, Spin } from "antd"; // Add Ant Design components
import CreatePost from "./CreateBlog";
import PostCard from "./PostCard";

const PostBrowser = ({ contentType, createPost, profileUser }) => {
  const [page, setPage] = useState(1);
  const [sortBy, setSortBy] = useState("-createdAt");
  const [isSortOpen, setIsSortOpen] = useState(false);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false); // Modal state
  const { user, isLoggedIn } = useAuth(); // Use AuthContext
  const [searchParams, setSearchParams] = useSearchParams();
  const searchQuery = searchParams.get("search");
  const searchExists = searchQuery && searchQuery.length > 0;
  const navigate = useNavigate();

  const queryParams = {
    page,
    sortBy,
    ...(typeof profileUser === "object" &&
      profileUser !== null && { author: profileUser.username }),
    ...(searchExists && { search: searchQuery }),
  };

  // Call RTK Query hooks
  const postsQuery = useGetPostsQuery(queryParams, {
    skip: contentType !== "posts",
  });
  const likedPostsQuery = useGetUserLikedPostsQuery(
    { id: profileUser?._id, params: queryParams },
    { skip: contentType !== "liked" || !profileUser?._id }
  );

  // Select data based on contentType
  const { data, isLoading, isError, error } =
    contentType === "posts" ? postsQuery : likedPostsQuery;

  const posts = data?.data || [];
  const count = data?.count || 0;
  const totalPages = Math.ceil(count / 10);

  // Delete post mutation
  const [deletePost] = useDeletePostMutation();

  useEffect(() => {
    // Redirect to login if not authenticated and trying to access protected content
    if (!isLoggedIn && contentType === "liked") {
      navigate("/login");
    }
  }, [isLoggedIn, contentType, navigate]);

  useEffect(() => {
    // Reset page to 1 when sortBy, searchParams, profileUser, or contentType changes
    setPage(1);
  }, [sortBy, searchParams, profileUser, contentType]);

  const handleSortBy = (value) => {
    setSortBy(value);
    setIsSortOpen(false);
  };

  const handlePageChange = (newPage) => {
    setPage(newPage);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleRemovePost = async (postId) => {
    try {
      await deletePost(postId).unwrap();
      // RTK Query will automatically update the cache
    } catch (err) {
      console.error("Failed to delete post:", err);
    }
  };

  const handleBackToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleClearSearch = () => {
    setSearchParams({});
    setPage(1);
  };

  const contentTypeSorts = {
    posts: {
      "-createdAt": "Latest",
      "-likeCount": "Likes",
      "-commentCount": "Comments",
      createdAt: "Earliest",
    },
    liked: {
      "-createdAt": "Latest",
      createdAt: "Earliest",
    },
  };

  const sorts = contentTypeSorts[contentType] || contentTypeSorts.posts;

  return (
    <div className="max-w-7xl mx-auto p-4 sm:p-6">
      {/* Header */}
      <div className="flex items-center justify-between py-5 lg:py-6">
        <div className="flex items-center space-x-2">
          <h2 className="text-xl font-medium text-slate-700 dark:text-navy-50 lg:text-2xl">
            {contentType === "liked" ? "Liked Posts" : "Blog Posts"}
          </h2>
          <div className="relative">
            <button
              onClick={() => setIsSortOpen(!isSortOpen)}
              className="btn size-8 rounded-full p-0 hover:bg-slate-300/20 focus:bg-slate-300/20 active:bg-slate-300/25 dark:hover:bg-navy-300/20 dark:focus:bg-navy-300/20 dark:active:bg-navy-300/25"
              aria-label="Toggle sort options"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-5 w-5"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M19 9l-7 7-7-7"
                />
              </svg>
            </button>
            {isSortOpen && (
              <div className="absolute z-10 mt-2 w-48 rounded-md border border-slate-150 bg-white py-1.5 shadow-lg dark:border-navy-500 dark:bg-navy-700">
                {Object.entries(sorts).map(([value, label]) => (
                  <button
                    key={value}
                    onClick={() => handleSortBy(value)}
                    className="flex h-8 items-center px-3 pr-8 font-medium tracking-wide outline-none transition-all hover:bg-slate-100 hover:text-slate-800 focus:bg-slate-100 focus:text-slate-800 dark:hover:bg-navy-600 dark:hover:text-navy-100 dark:focus:bg-navy-600 dark:focus:text-navy-100"
                  >
                    {label}
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>
        {createPost && user && (
          <Button
            type="primary"
            onClick={() => setIsCreateModalOpen(true)}
            className="btn min-w-[7rem] bg-primary font-medium text-white hover:bg-primary-focus focus:bg-primary-focus active:bg-primary-focus/90 dark:bg-accent dark:hover:bg-accent-focus dark:focus:bg-accent-focus dark:active:bg-accent/90"
          >
            Create Post
          </Button>
        )}
      </div>

      {/* Create Post Modal */}
      <Modal
        title="Create New Post"
        open={isCreateModalOpen}
        onCancel={() => setIsCreateModalOpen(false)}
        footer={null}
        width={800}
      >
        <CreatePost />
      </Modal>

      {/* Search Results */}
      {searchExists && (
        <div className="mb-4 flex justify-between items-center">
          <div>
            <h5 className="text-lg font-medium text-slate-700 dark:text-navy-100">
              Showing results for "{searchQuery}"
            </h5>
            <p className="text-sm text-slate-400 dark:text-navy-300">
              {count} results found
            </p>
          </div>
          <Button onClick={handleClearSearch} type="link">
            Clear Search
          </Button>
        </div>
      )}

      {/* Loading State */}
      {isLoading && (
        <div className="flex justify-center py-8">
          <Spin size="large" />
        </div>
      )}

      {/* Error State */}
      {!isLoading && isError && (
        <div className="flex justify-center py-8">
          <div className="text-center">
            <h4 className="text-lg font-medium text-slate-400 dark:text-navy-300">
              {error?.data?.error || "Failed to load posts"}
            </h4>
            <button
              onClick={handleBackToTop}
              className="mt-2 text-primary hover:underline dark:text-accent-light"
              aria-label="Back to top"
            >
              Back to top
            </button>
          </div>
        </div>
      )}

      {/* Empty State */}
      {!isLoading && posts.length === 0 && !isError && (
        <div className="flex justify-center py-8">
          <div className="text-center">
            <h4 className="text-lg font-medium text-slate-400 dark:text-navy-300">
              No posts available
            </h4>
            <button
              onClick={handleBackToTop}
              className="mt-2 text-primary hover:underline dark:text-accent-light"
              aria-label="Back to top"
            >
              Back to top
            </button>
          </div>
        </div>
      )}

      {/* Post List */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:gap-6">
        {posts.map((post) => (
          <PostCard
            key={post._id}
            post={post}
            preview="primary"
            removePost={handleRemovePost}
          />
        ))}
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex justify-center mt-6">
          <div className="flex items-center space-x-2">
            <button
              onClick={() => handlePageChange(page - 1)}
              disabled={page === 1}
              className="btn h-9 w-9 rounded-full p-0 disabled:opacity-50 hover:bg-slate-300/20 focus:bg-slate-300/20 active:bg-slate-300/25 dark:hover:bg-navy-300/20 dark:focus:bg-navy-300/20 dark:active:bg-navy-300/25"
              aria-label="Previous page"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-5 w-5"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M15 19l-7-7 7-7"
                />
              </svg>
            </button>
            <div className="flex space-x-1">
              {[...Array(totalPages)].map((_, i) => (
                <button
                  key={i + 1}
                  onClick={() => handlePageChange(i + 1)}
                  className={`btn h-9 w-9 rounded-full p-0 ${
                    page === i + 1
                      ? "bg-primary text-white dark:bg-accent"
                      : "hover:bg-slate-300/20 focus:bg-slate-300/20 active:bg-slate-300/25 dark:hover:bg-navy-300/20 dark:focus:bg-navy-300/20 dark:active:bg-navy-300/25"
                  }`}
                  aria-label={`Page ${i + 1}`}
                >
                  {i + 1}
                </button>
              ))}
            </div>
            <button
              onClick={() => handlePageChange(page + 1)}
              disabled={page === totalPages}
              className="btn h-9 w-9 rounded-full p-0 disabled:opacity-50 hover:bg-slate-300/20 focus:bg-slate-300/20 active:bg-slate-300/25 dark:hover:bg-navy-300/20 dark:focus:bg-navy-300/20 dark:active:bg-navy-300/25"
              aria-label="Next page"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-5 w-5"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M9 5l7 7-7 7"
                />
              </svg>
            </button>
            <button
              onClick={handleBackToTop}
              className="text-primary hover:underline dark:text-accent-light"
              aria-label="Back to top"
            >
              Back to top
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default PostBrowser;
