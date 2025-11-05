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
import { useGetUsersQuery } from "../api/userApi";
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
    data: categoriesData = { data: [], count: 0 },
    isLoading: categoriesLoading,
    error: categoriesError,
  } = useGetCategoriesQuery();

  const categories = categoriesData.data || [];

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
  } = useGetUsersQuery({ limit: 200 });

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
   *  RANDOM USERS – Derived from allUsersData
   * ------------------------------------------------- */
  useEffect(() => {
    if (!allUsersData?.data || allUsersData.data.length === 0) {
      setRandomUsers([]);
      return;
    }

    const pool = allUsersData.data.filter(
      (u) => !user?._id || u._id !== user._id
    );
    if (pool.length === 0) {
      setRandomUsers([]);
      return;
    }

    const shuffled = [...pool];
    for (let i = shuffled.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
    }

    setRandomUsers(shuffled.slice(0, 3));
  }, [allUsersData?.data, user?._id]);

  /* -------------------------------------------------
   *  MUTATIONS
   * ------------------------------------------------- */
  const [savePost] = useSavePostMutation();
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
          {/* Filters */}
          <div className="flex flex-col sm:flex-row gap-3 mb-6">
            <Select
              placeholder="Sort by"
              style={{ width: "100%", maxWidth: 200 }}
              onChange={handleSortBy}
              value={sortBy}
            >
              {Object.entries(sorts).map(([value, label]) => (
                <Option key={value} value={value}>
                  {label}
                </Option>
              ))}
            </Select>

            <Select
              allowClear
              placeholder="Filter by category"
              style={{ width: "100%", maxWidth: 200 }}
              onChange={handleCategoryChange}
              value={category}
            >
              {categories.map((cat) => (
                <Option key={cat._id} value={cat._id}>
                  {cat.name}
                </Option>
              ))}
            </Select>
          </div>

          {/* POST LIST */}
          <div className="grid grid-cols-1 gap-4 sm:gap-5 lg:gap-6">
            {posts.length > 0 ? (
              posts.map((post) => (
                <PostCard
                  key={post._id}
                  post={post}
                  preview="primary"
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

          {/* Back to Top */}
          {page > 1 && (
            <div className="flex justify-center mt-4">
              <button
                onClick={handleBackToTop}
                className="btn btn-circle bg-primary text-white hover:bg-primary-focus"
              >
                <FaArrowUp />
              </button>
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
              <div className="flex justify-center py-4">
                <Spin />
              </div>
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

          {/* Connect with New Writers */}
          <div className="card bg-white dark:bg-navy-700 rounded-lg shadow-md p-5">
            <h3 className="text-lg font-semibold text-slate-700 dark:text-navy-100">
              Connect with New Writers
            </h3>
            <div className="mt-4 space-y-3">
              {allUsersLoading ? (
                <div className="flex justify-center py-4">
                  <Spin />
                </div>
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

          {/* NEW: Explore Categories */}
          <div className="card bg-white dark:bg-navy-700 rounded-lg shadow-md p-5">
            <h3 className="text-lg font-semibold text-slate-700 dark:text-navy-100">
              Explore Categories
            </h3>
            <div className="mt-4 grid grid-cols-2 gap-3 sm:grid-cols-3">
              {categoriesLoading ? (
                <div className="col-span-full flex justify-center py-4">
                  <Spin />
                </div>
              ) : categories.length > 0 ? (
                categories.map((cat) => (
                  <Link
                    key={cat._id}
                    to={`/category/${cat.slug}`}
                    className="group flex flex-col items-center p-3 rounded-lg bg-slate-100 hover:bg-slate-200 dark:bg-navy-600 dark:hover:bg-navy-500 transition-colors"
                  >
                    <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center mb-2">
                      <span className="text-primary font-bold text-sm">
                        {cat.name.charAt(0).toUpperCase()}
                      </span>
                    </div>
                    <span className="text-xs font-medium text-slate-700 dark:text-navy-100 group-hover:text-primary dark:group-hover:text-accent">
                      {cat.name}
                    </span>
                  </Link>
                ))
              ) : (
                <p className="col-span-full text-sm text-slate-600 dark:text-navy-200 text-center">
                  No categories available.
                </p>
              )}
            </div>
            <Link
              to="/categories"
              className="btn mt-4 w-full bg-slate-200 font-medium text-slate-700 hover:bg-slate-300 dark:bg-navy-500 dark:text-navy-100 dark:hover:bg-navy-400"
            >
              View All Categories
            </Link>
          </div>
        </div>
      </div>
    </Spin>
  );
};

export default Home;
