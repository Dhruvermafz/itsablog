// src/pages/Home.jsx
import React, { useState, useEffect } from "react";
import { useSearchParams, Link } from "react-router-dom";
import { Select, Spin, message, Pagination } from "antd";
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

  const { data: likedPostsData, isLoading: likedPostsLoading } =
    useGetUserLikedPostsQuery(
      { id: profileUser?._id, params: query },
      { skip: !profileUser?._id || contentType !== "liked" }
    );

  const { data: allUsersData, isLoading: allUsersLoading } = useGetUsersQuery({
    limit: 200,
  });

  /* -------------------------------------------------
   *  DERIVED STATE
   * ------------------------------------------------- */
  const selectedData = contentType === "posts" ? postsData : likedPostsData;
  const isLoading = contentType === "posts" ? postsLoading : likedPostsLoading;
  const posts = selectedData?.data || [];
  const count = selectedData?.count || 0;
  const pageSize = 10;
  const totalPages = Math.ceil(count / pageSize);

  /* -------------------------------------------------
   *  TOP AUTHOR CALCULATION
   * ------------------------------------------------- */
  useEffect(() => {
    if (allUsersData?.data && !allUsersLoading) {
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
  }, [allUsersData, allUsersLoading]);

  /* -------------------------------------------------
   *  RANDOM USERS
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

    const shuffled = [...pool].sort(() => 0.5 - Math.random());
    setRandomUsers(shuffled.slice(0, 5)); // Increased to 5 for better sidebar fill
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
      "-likeCount": "Most Liked",
      "-commentCount": "Most Discussed",
      createdAt: "Oldest",
    },
    liked: {
      "-createdAt": "Latest Saved",
      createdAt: "Earliest Saved",
    },
  }[contentType];

  return (
    <Spin spinning={isLoading || categoriesLoading || allUsersLoading}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* ---------- MAIN CONTENT: POSTS (2/3 width) ---------- */}
          <div className="lg:col-span-2 space-y-8">
            {/* Filters */}
            <div className="flex flex-col sm:flex-row gap-4">
              <Select
                placeholder="Sort by"
                className="w-full sm:w-48"
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
                className="w-full sm:w-48"
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
            <div className="space-y-8">
              {posts.length > 0 ? (
                posts.map((post) => (
                  <div
                    key={post._id}
                    className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg hover:shadow-xl transition-shadow duration-300 overflow-hidden"
                  >
                    <PostCard
                      post={post}
                      preview="primary"
                      onSave={handleSavePost}
                      onDelete={handleDeletePost}
                    />
                  </div>
                ))
              ) : (
                <div className="text-center py-12">
                  <p className="text-gray-500 dark:text-gray-400 text-lg">
                    {postsError
                      ? "Failed to load posts."
                      : "No posts available yet."}
                  </p>
                </div>
              )}
            </div>

            {/* Pagination */}
            {totalPages > 1 && (
              <div className="flex justify-center mt-12">
                <Pagination
                  current={page}
                  total={count}
                  pageSize={pageSize}
                  onChange={handlePageChange}
                  showSizeChanger={false}
                  className="ant-pagination-modern"
                />
              </div>
            )}

            {/* Back to Top */}
            {page > 1 && (
              <div className="flex justify-center mt-8">
                <button
                  onClick={handleBackToTop}
                  className="fixed bottom-8 right-8 btn btn-circle btn-primary shadow-lg hover:shadow-xl"
                >
                  <FaArrowUp className="text-xl" />
                </button>
              </div>
            )}
          </div>

          {/* ---------- SIDEBAR (1/3 width, sticky) ---------- */}
          <aside className="space-y-8">
            {/* Top Author */}
            <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-6">
              <h3 className="text-xl font-bold text-gray-800 dark:text-gray-100 mb-6">
                Top Author This Month
              </h3>
              {allUsersLoading ? (
                <Spin />
              ) : topAuthor ? (
                <div className="space-y-4">
                  <UserCard
                    name={topAuthor.name || "Unknown"}
                    username={topAuthor.username}
                    avatar={topAuthor.avatar}
                    isOnline={topAuthor.isOnline ?? false}
                    onFollow={() => console.log(`Follow ${topAuthor.username}`)}
                    size="large"
                  />
                  <Link
                    to={`/u/${topAuthor.username}`}
                    className="block w-full btn btn-primary rounded-xl"
                  >
                    View Profile
                  </Link>
                </div>
              ) : (
                <p className="text-gray-500 dark:text-gray-400">
                  No top author this month.
                </p>
              )}
            </div>

            {/* Connect with Writers */}
            <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-6">
              <h3 className="text-xl font-bold text-gray-800 dark:text-gray-100 mb-6">
                Connect with Writers
              </h3>
              <div className="space-y-4">
                {allUsersLoading ? (
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
                      size="medium"
                    />
                  ))
                ) : (
                  <p className="text-gray-500 dark:text-gray-400">
                    No writers to suggest.
                  </p>
                )}
              </div>
              <Link
                to="/users"
                className="block mt-6 btn btn-outline rounded-xl"
              >
                See All Writers
              </Link>
            </div>

            {/* Explore Categories */}
            <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-6">
              <h3 className="text-xl font-bold text-gray-800 dark:text-gray-100 mb-6">
                Explore Categories
              </h3>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
                {categoriesLoading ? (
                  <Spin />
                ) : categories.length > 0 ? (
                  categories.map((cat) => (
                    <Link
                      key={cat._id}
                      to={`/category/${cat.slug}`}
                      className="group flex flex-col items-center p-4 rounded-xl bg-gray-100 dark:bg-gray-700 hover:bg-primary hover:text-white transition-all duration-300"
                    >
                      <div className="w-12 h-12 rounded-full bg-primary/10 dark:bg-primary/20 flex items-center justify-center mb-3 group-hover:bg-white/20">
                        <span className="text-2xl font-bold group-hover:text-white">
                          {cat.name.charAt(0).toUpperCase()}
                        </span>
                      </div>
                      <span className="text-sm font-medium text-center group-hover:text-white">
                        {cat.name}
                      </span>
                    </Link>
                  ))
                ) : (
                  <p className="col-span-full text-center text-gray-500 dark:text-gray-400">
                    No categories yet.
                  </p>
                )}
              </div>
              <Link
                to="/categories"
                className="block mt-6 btn btn-outline rounded-xl"
              >
                View All Categories
              </Link>
            </div>
          </aside>
        </div>
      </div>
    </Spin>
  );
};

export default Home;
