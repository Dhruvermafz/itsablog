import React, { useState, useEffect } from "react";
import { useNavigate, useLocation, useParams } from "react-router-dom";
import { Tabs, Spin, Typography, message, Button } from "antd";
import PopularPostsPage from "../Blogs/PopularPost";
import LastCommentsWidget from "../Extras/LastCommentsWidget";
import Pagination from "../Extras/Pagination";
import {
  useGetProfileQuery,
  useLogoutMutation,
  useRequestWriterRoleMutation,
} from "../../api/userApi";
import { isLoggedIn, logoutUser } from "../../helpers/authHelper";
import Avatar from "react-avatar";
import PostCard from "../Blogs/PostCard";
const { Title } = Typography;

const Profile = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { username } = useParams();
  const [user, setUser] = useState(null);
  const currentUser = isLoggedIn();
  const isOwnProfile = username ? username === currentUser?.username : true;

  const query = new URLSearchParams(location.search);
  const page = parseInt(query.get("page")) || 1;
  const pageSize = 10;
  const [activeTab, setActiveTab] = useState("all");

  const {
    data: profileData,
    isLoading,
    error,
  } = useGetProfileQuery(
    { username: username || currentUser?.username, page, pageSize },
    { skip: !username && !currentUser?.username }
  );

  const [logout, { isLoading: isLoggingOut }] = useLogoutMutation();
  const [requestWriterRole, { isLoading: isRequestingWriterRole }] =
    useRequestWriterRoleMutation();

  useEffect(() => {
    if (profileData?.user) {
      setUser({
        ...profileData.user,
        avatar: profileData.user.profileImage || "",
      });
    }
    if (error) {
      const errorMessage =
        error.status === 404
          ? "User not found"
          : error.status === 401
          ? "Unauthorized access. Please log in."
          : "Failed to load profile";
      message.error(errorMessage);
      if (error.status === 401) {
        logoutUser();
        navigate("/login");
      }
    }
  }, [profileData, error, navigate]);

  const handleLogout = async () => {
    try {
      await logout().unwrap();
      logoutUser();
      message.success("Logged out successfully");
      navigate("/login");
    } catch (err) {
      message.error("Failed to logout");
    }
  };

  const handleTabChange = (key) => {
    setActiveTab(key);
    navigate(`/u/${username || currentUser?.username}?page=1`);
  };

  // Filter posts based on the active tab
  const filteredPosts = () => {
    if (!profileData?.posts?.data) return [];
    if (activeTab === "popular") {
      return profileData.posts.data.filter((post) => post.likeCount >= 10); // Example: Popular if likes >= 10
    }
    if (activeTab === "liked" && isOwnProfile) {
      return profileData.posts.data.filter((post) => post.liked);
    }
    if (activeTab === "commented" && isOwnProfile) {
      return profileData.posts.data.filter((post) => post.commentCount > 0); // Placeholder: Needs backend support
    }
    return profileData.posts.data; // All posts
  };

  const tabItems = [
    { key: "all", label: "All Posts" },
    { key: "popular", label: "Popular Posts" },
    ...(isOwnProfile
      ? [
          { key: "liked", label: "Liked Posts" },
          { key: "commented", label: "Commented Posts" },
        ]
      : []),
  ];

  return (
    <div className="max-w-7xl mx-auto p-4 sm:p-6">
      {isLoading ? (
        <div className="flex justify-center items-center h-64">
          <Spin size="large" />
        </div>
      ) : error ? (
        <div className="text-center text-red-500">
          {error.status === 404 ? "User not found" : "Error loading profile"}
        </div>
      ) : (
        <div className="grid grid-cols-12 gap-4 sm:gap-5 lg:gap-6">
          <div className="col-span-12 lg:col-span-4">
            <div className="card p-4 sm:p-5">
              <div className="flex items-center space-x-4">
                <div className="avatar size-14">
                  <Avatar
                    name={user?.username || "User"}
                    src={user?.avatar}
                    size="56"
                    round={true}
                    className="rounded-full"
                  />
                </div>
                <div>
                  <h3 className="text-base font-medium text-slate-700 dark:text-navy-100">
                    {user?.username || "Unknown User"}
                  </h3>
                  <p className="text-xs-plus capitalize">
                    {user?.role || "Unknown"}
                  </p>
                </div>
              </div>
              <p className="mt-4 text-sm text-slate-600 dark:text-navy-200">
                {user?.biography || "No biography available"}
              </p>
              {isOwnProfile && (
                <button
                  className="btn mt-4 min-w-[7rem] rounded-full bg-primary font-medium text-white hover:bg-primary-focus focus:bg-primary-focus active:bg-primary-focus/90 dark:bg-accent dark:hover:bg-accent-focus dark:focus:bg-accent-focus dark:active:bg-accent/90"
                  onClick={() => navigate("/settings")}
                >
                  Edit Profile
                </button>
              )}
              <ul className="mt-6 space-y-1.5 font-inter font-medium">
                {isOwnProfile && (
                  <>
                    <li>
                      <button
                        className="group flex space-x-2 rounded-lg px-4 py-2.5 tracking-wide outline-hidden transition-all hover:bg-slate-100 hover:text-slate-800 focus:bg-slate-100 focus:text-slate-800 dark:hover:bg-navy-600 dark:hover:text-navy-100 dark:focus:bg-navy-600 dark:focus:text-navy-100 w-full text-left"
                        onClick={() => navigate("/settings")}
                      >
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          className="size-5 text-slate-400 transition-colors group-hover:text-slate-500 group-focus:text-slate-500 dark:text-navy-300 dark:group-hover:text-navy-200 dark:group-focus:text-navy-200"
                          fill="none"
                          viewBox="0 0 24 24"
                          stroke="currentColor"
                          strokeWidth="1.5"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            d="M10.343 3.94c.09-.542.56-.94 1.11-.94h1.093c.55 0 1.02.398 1.11.94l.149.894c.07.424.384.764.78.93.398.164.855.142 1.205-.108l.737-.527a1.125 1.125 0 011.45.12l.773.774c.39.389.44 1.002.12 1.45l-.527.737c-.25.35-.272.806-.107 1.204.165.397.505.71.93.78l.893.15c.543.09.94.56.94 1.109v1.094c0 .55-.397 1.02-.94 1.11l-.893.149c-.425.07-.765.383-.93.78-.165.398-.143.854.107 1.204l.527.738c.32.447.269 1.06-.12 1.45l-.774.773a1.125 1.125 0 01-1.45.12l-.737-.527c-.35-.25-.807-.272-1.204-.107-.397.165-.78.505-.78.93l-.15.894c-.09.542-.56.94-1.11.94h-1.094c-.55 0-1.019-.398-1.11-.94l-.148-.894c-.071-.424-.384-.764-.781-.93-.398-.164-.854-.142-1.204.108l-.738.527c-.447.32-1.06.269-1.45-.12l-.773-.774a1.125 1.125 0 01-.12-1.45l.527-.737c.25-.35.273-.806.108-1.204-.165-.397-.505-.71-.93-.78l-.894-.15c-.542-.09-.94-.56-.94-1.109v-1.094c0-.55.398-1.02.94-1.11l.894-.149c.424-.07.765-.383.93-.78.165-.398.143-.854-.107-1.204l-.527-.738a1.125 1.125 0 01.12-1.45l.773-.773a1.125 1.125 0 011.45-.12l.737.527c.35.25.807.272 1.204.107.397-.165.78-.505.78-.93l.15-.894z"
                          />
                        </svg>
                        <span>Settings</span>
                      </button>
                    </li>
                    {user?.role === "reader" && (
                      <li>
                        <button
                          className="group flex space-x-2 rounded-lg px-4 py-2.5 tracking-wide outline-hidden transition-all hover:bg-slate-100 hover:text-slate-800 focus:bg-slate-100 focus:text-slate-800 dark:hover:bg-navy-600 dark:hover:text-navy-100 dark:focus:bg-navy-600 dark:focus:text-navy-100 w-full text-left"
                          onClick={async () => {
                            try {
                              await requestWriterRole({
                                userId: user._id,
                                reason:
                                  "I want to contribute articles to the platform",
                              }).unwrap();
                              message.success("Writer role request submitted");
                            } catch (err) {
                              message.error(
                                "Failed to submit writer role request"
                              );
                            }
                          }}
                          disabled={isRequestingWriterRole}
                        >
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            className="size-5 text-slate-400 transition-colors group-hover:text-slate-500 group-focus:text-slate-500 dark:text-navy-300 dark:group-hover:text-navy-200 dark:group-focus:text-navy-200"
                            fill="none"
                            viewBox="0 0 24 24"
                            stroke="currentColor"
                            strokeWidth="1.5"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"
                            />
                          </svg>
                          <span>Request Writer Role</span>
                        </button>
                      </li>
                    )}
                  </>
                )}
              </ul>
            </div>
          </div>

          <div className="col-span-12 lg:col-span-8">
            <div className="card">
              <div className="p-4 sm:p-5">
                <Tabs
                  activeKey={activeTab}
                  onChange={handleTabChange}
                  items={tabItems}
                />
                <div className="mt-4 space-y-4">
                  {filteredPosts().length > 0 ? (
                    filteredPosts().map((post) => (
                      <PostCard key={post._id} post={post} />
                    ))
                  ) : (
                    <p>No posts available</p>
                  )}
                </div>
                <Pagination
                  currentPage={profileData?.currentPage || 1}
                  totalItems={profileData?.totalPosts || 0}
                  pageSize={pageSize}
                  onPageChange={(page) =>
                    navigate(
                      `/u/${username || currentUser?.username}?page=${page}`
                    )
                  }
                />
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Profile;
