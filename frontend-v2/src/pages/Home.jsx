// src/pages/Home.jsx
import React, { useState, useEffect } from "react";
import { useSearchParams, Link } from "react-router-dom";
import { Select, Spin, message } from "antd";
import {
  useGetPostsQuery,
  useGetUserLikedPostsQuery,
  useSavePostMutation,
  useDeletePostMutation,
} from "../api/postApi";
import { useGetCategoriesQuery } from "../api/categoriesApi";
import { useGetRandomUsersQuery, useGetUsersQuery } from "../api/userApi";
import { isLoggedIn } from "../helpers/authHelper";
import { FaArrowUp } from "react-icons/fa";
import Avatar from "react-avatar";
import UserCard from "../components/User/UserCard";
import PostCard from "../components/Blogs/PostCard";
const { Option } = Select;

const Home = ({ profileUser = null, contentType = "posts" }) => {
  const [page, setPage] = useState(1);
  const [sortBy, setSortBy] = useState("-createdAt");
  const [category, setCategory] = useState(null);
  const [topAuthor, setTopAuthor] = useState(null);
  const [randomUsers, setRandomUsers] = useState([]);
  const user = isLoggedIn();
  const [searchParams] = useSearchParams();
  const searchQuery = searchParams.get("search");
  const searchExists = searchQuery && searchQuery.length > 0;

  /* -------------------------------------------------
   *  DATA FETCHING
   * ------------------------------------------------- */

  const {
    data = { data: [], count: 0 },
    isLoading: categoriesLoading,

    error,
  } = useGetCategoriesQuery();

  // Extract the actual array
  const categories = data.data || [];
  const query = {
    page,
    sortBy,
    ...(profileUser && { author: profileUser.username }),
    ...(searchExists && { search: searchQuery }),
    ...(category && { category }),
  };

  const {
    data: postsData,
    isLoading: postsLoading,
    isError: postsError,
  } = useGetPostsQuery(query);

  const {
    data: likedPostsData,
    isLoading: likedPostsLoading,
    isError: likedPostsError,
  } = useGetUserLikedPostsQuery(
    { id: profileUser?._id, params: query },
    { skip: !profileUser?._id || contentType !== "liked" }
  );

  const {
    data: allUsersData,
    isLoading: allUsersLoading,
    isError: allUsersError,
  } = useGetUsersQuery({ limit: 100 });

  const { data: rawRandomUsers, isLoading: usersLoading } =
    useGetRandomUsersQuery();

  /* -------------------------------------------------
   *  DERIVED STATE
   * ------------------------------------------------- */
  const selectedData = contentType === "posts" ? postsData : likedPostsData;
  const isLoading = contentType === "posts" ? postsLoading : likedPostsLoading;
  const isError = contentType === "posts" ? postsError : likedPostsError;
  const posts = selectedData?.data || [];
  const count = selectedData?.count || 0;
  const totalPages = Math.ceil(count / 10);

  /* -------------------------------------------------
   *  TOP AUTHOR CALCULATION
   * ------------------------------------------------- */
  useEffect(() => {
    if (allUsersData?.data && !allUsersLoading && !allUsersError) {
      const top = allUsersData.data
        .map((u) => ({
          ...u,
          monthlyPostCount: u.postCount || 0,
        }))
        .filter((u) => u.monthlyPostCount > 0)
        .reduce(
          (prev, cur) =>
            (prev.monthlyPostCount || 0) > (cur.monthlyPostCount || 0)
              ? prev
              : cur,
          { monthlyPostCount: 0 }
        );

      setTopAuthor(top.monthlyPostCount ? top : null);
    }
  }, [allUsersData, allUsersLoading, allUsersError]);

  /* -------------------------------------------------
   *  RANDOM USERS (exclude self)
   * ------------------------------------------------- */
  useEffect(() => {
    if (rawRandomUsers && user?._id) {
      const filtered = rawRandomUsers
        .filter((u) => u._id !== user._id)
        .slice(0, 3);
      setRandomUsers(filtered);
    } else {
      setRandomUsers(rawRandomUsers?.slice(0, 3) || []);
    }
  }, [rawRandomUsers, user?._id]);

  /* -------------------------------------------------
   *  MUTATIONS
   * ------------------------------------------------- */
  const [savePost, { isLoading: savePostLoading }] = useSavePostMutation();
  const [deletePost] = useDeletePostMutation();

  const handleSavePost = async (postId) => {
    try {
      await savePost(postId).unwrap();
      message.success("Post saved");
    } catch {
      message.error("Failed to save post");
    }
  };

  const handleDeletePost = async (postId) => {
    try {
      await deletePost(postId).unwrap();
      message.success("Post deleted");
    } catch {
      message.error("Failed to delete post");
    }
  };

  /* -------------------------------------------------
   *  UI HANDLERS
   * ------------------------------------------------- */
  const handleSortBy = (v) => {
    setSortBy(v);
    setPage(1);
  };
  const handleCategoryChange = (v) => {
    setCategory(v || null);
    setPage(1);
  };
  const handlePageChange = (p) => {
    setPage(p);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };
  const handleBackToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const sorts = {
    posts: {
      "-createdAt": "Latest",
      "-likeCount": "Likes",
      "-commentCount": "Comments",
      createdAt: "Most Recent",
    },
    liked: {
      "-createdAt": "Latest",
      createdAt: "Earliest",
    },
  }[contentType];

  return (
    <Spin spinning={isLoading || categoriesLoading || allUsersLoading}>
      <div className="flex flex-col lg:flex-row gap-6">
        {/* ---------- LEFT: POSTS ---------- */}
        <div className="lg:w-2/5">
          {/* POST LIST – USING PostCard */}
          <div className="grid grid-cols-1 gap-4 sm:gap-5 lg:gap-6">
            {posts.length > 0 ? (
              posts.map((post) => (
                <PostCard
                  key={post._id}
                  post={post}
                  preview="primary" // keep the “primary” preview style
                  removePost={(removed) => {
                    // optimistic UI update when deleting from a list
                    // (optional – you can also refetch)
                  }}
                  // you can pass extra callbacks if you need them
                  onSave={handleSavePost}
                  onDelete={handleDeletePost}
                />
              ))
            ) : (
              <p className="col-span-1 text-center text-slate-600 dark:text-navy-200">
                {isError ? "Failed to load posts." : "No posts available."}
              </p>
            )}
          </div>

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="flex justify-center mt-6">
              <div className="flex space-x-2">
                {Array.from({ length: totalPages }, (_, i) => i + 1).map(
                  (p) => (
                    <button
                      key={p}
                      onClick={() => handlePageChange(p)}
                      className={`btn h-9 w-9 rounded-full p-0 font-medium ${
                        page === p
                          ? "bg-primary text-white dark:bg-accent-light"
                          : "bg-slate-200 hover:bg-slate-300 dark:bg-navy-500 dark:hover:bg-navy-400"
                      }`}
                    >
                      {p}
                    </button>
                  )
                )}
              </div>
            </div>
          )}
        </div>

        {/* ---------- RIGHT: SIDEBAR ---------- */}
        <div className="lg:w-2/5 flex flex-col space-y-6">
          {/* Top Author */}
          <div className="card bg-white dark:bg-navy-700 rounded-lg shadow-md p-5">
            <h3 className="text-lg font-semibold text-slate-700 dark:text-navy-100">
              Top Author This Month
            </h3>
            {allUsersLoading ? (
              <Spin />
            ) : topAuthor ? (
              <>
                <UserCard
                  name={topAuthor.name || "Unknown"}
                  username={topAuthor.username}
                  avatar={topAuthor.avatar}
                  isOnline={topAuthor.isOnline ?? false}
                  onFollow={() => console.log(`Follow ${topAuthor.username}`)}
                />
                <Link
                  to={`/u/${topAuthor.username}`}
                  className="btn mt-4 w-full bg-primary font-medium text-white hover:bg-primary-focus dark:bg-accent dark:hover:bg-accent-focus"
                >
                  View Profile
                </Link>
              </>
            ) : (
              <p className="text-sm text-slate-600 dark:text-navy-200 mt-4">
                No top author found.
              </p>
            )}
          </div>

          {/* Random Writers */}
          <div className="card bg-white dark:bg-navy-700 rounded-lg shadow-md p-5">
            <h3 className="text-lg font-semibold text-slate-700 dark:text-navy-100">
              Connect with New Writers
            </h3>
            <div className="mt-4 space-y-3">
              {usersLoading ? (
                <Spin />
              ) : randomUsers.length > 0 ? (
                randomUsers.map((u) => (
                  <UserCard
                    key={u._id}
                    name={u.name || "Unknown"}
                    username={u.username}
                    avatar={u.avatar}
                    isOnline={u.isOnline ?? false}
                    onFollow={() => console.log(`Follow ${u.username}`)}
                  />
                ))
              ) : (
                <p className="text-sm text-slate-600 dark:text-navy-200">
                  No new writers found.
                </p>
              )}
            </div>
            <Link
              to="/users"
              className="btn mt-4 w-full bg-slate-200 font-medium text-slate-700 hover:bg-slate-300 dark:bg-navy-500 dark:text-navy-100 dark:hover:bg-navy-400"
            >
              See More Writers
            </Link>
          </div>
        </div>
      </div>
    </Spin>
  );
};

export default Home;
