import React, { useState, useEffect } from "react";
import { useNavigate, useLocation, useParams } from "react-router-dom";
import { Tabs, Spin, Typography, message, Button } from "antd";
import Avatar from "react-avatar";
import PostCard from "../Blogs/PostCard";
import Pagination from "../Extras/Pagination";
import {
  useGetProfileQuery,
  useFollowMutation,
  useUnfollowMutation,
  useLogoutMutation,
  useRequestWriterRoleMutation,
  useGetFollowersQuery,
  useGetFollowingQuery,
} from "../../api/userApi";
import { useGetUserCommentsQuery } from "../../api/commentApi";
import { useGetUserLikedPostsQuery } from "../../api/postApi";
import { isLoggedIn, logoutUser } from "../../helpers/authHelper";
import UserCard from "./UserCard";
const { Title } = Typography;

const UserPage = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { username } = useParams();
  const currentUser = isLoggedIn();
  const isOwnProfile = username === currentUser?.username;

  const query = new URLSearchParams(location.search);
  const page = parseInt(query.get("page")) || 1;
  const pageSize = 10;
  const [activeTab, setActiveTab] = useState("all");
  const [user, setUser] = useState(null);

  // Fetch user profile
  const {
    data: profileData,
    isLoading: profileLoading,
    error: profileError,
  } = useGetProfileQuery(
    { username: username || currentUser?.username, page, pageSize },
    { skip: !username && !currentUser?.username }
  );

  // Fetch followers and following
  const { data: followersData, isLoading: followersLoading } =
    useGetFollowersQuery(profileData?.user?._id, {
      skip: !profileData?.user?._id,
    });
  const { data: followingData, isLoading: followingLoading } =
    useGetFollowingQuery(profileData?.user?._id, {
      skip: !profileData?.user?._id,
    });

  // Fetch liked posts (for "Liked" tab)
  const { data: likedPostsData, isLoading: likedPostsLoading } =
    useGetUserLikedPostsQuery(
      { id: profileData?.user?._id, params: { page, pageSize } },
      { skip: !profileData?.user?._id || !isOwnProfile }
    );

  // Fetch commented posts (for "Commented" tab)
  const { data: userCommentsData, isLoading: commentsLoading } =
    useGetUserCommentsQuery(profileData?.user?._id, {
      skip: !profileData?.user?._id || !isOwnProfile,
    });

  // Mutations
  const [follow, { isLoading: isFollowing }] = useFollowMutation();
  const [unfollow, { isLoading: isUnfollowing }] = useUnfollowMutation();
  const [logout, { isLoading: isLoggingOut }] = useLogoutMutation();
  const [requestWriterRole, { isLoading: isRequestingWriterRole }] =
    useRequestWriterRoleMutation();

  // Set user data
  useEffect(() => {
    if (profileData?.user) {
      setUser({
        ...profileData.user,
        avatar: profileData.user.profileImage || "",
        isFollowing:
          currentUser?.following?.includes(profileData.user._id) || false,
      });
    }
    if (profileError) {
      const errorMessage =
        profileError.status === 404
          ? "User not found"
          : profileError.status === 401
          ? "Unauthorized access. Please log in."
          : "Failed to load profile";
      message.error(errorMessage);
      if (profileError.status === 401) {
        logoutUser();
        navigate("/login");
      }
    }
  }, [profileData, profileError, currentUser, navigate]);

  // Handle logout
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

  // Handle follow/unfollow
  const handleFollowToggle = async () => {
    try {
      if (user?.isFollowing) {
        await unfollow(user._id).unwrap();
        setUser((prev) => ({ ...prev, isFollowing: false }));
        message.success("User unfollowed");
      } else {
        await follow(user._id).unwrap();
        setUser((prev) => ({ ...prev, isFollowing: true }));
        message.success("User followed");
      }
    } catch (err) {
      message.error(
        `Failed to ${user?.isFollowing ? "unfollow" : "follow"} user`
      );
    }
  };

  // Handle tab change
  const handleTabChange = (key) => {
    setActiveTab(key);
    navigate(`/u/${username || currentUser?.username}?page=1`);
  };

  // Filter posts based on active tab
  const filteredPosts = () => {
    if (
      !profileData?.posts?.data &&
      activeTab !== "liked" &&
      activeTab !== "commented"
    ) {
      return [];
    }
    if (activeTab === "popular") {
      return (profileData?.posts?.data || []).filter(
        (post) => post.likeCount >= 10
      );
    }
    if (activeTab === "liked" && isOwnProfile) {
      return likedPostsData?.data || [];
    }
    if (activeTab === "commented" && isOwnProfile) {
      // Map comments to their posts (assuming comments include postId)
      const commentedPostIds =
        userCommentsData?.map((comment) => comment.postId) || [];
      return (profileData?.posts?.data || []).filter((post) =>
        commentedPostIds.includes(post._id)
      );
    }
    return profileData?.posts?.data || [];
  };

  // Tab items
  const tabItems = [
    { key: "all", label: `All Posts (${profileData?.totalPosts || 0})` },
    { key: "popular", label: "Popular Posts" },
    { key: "followers", label: `Followers (${followersData?.length || 0})` },
    { key: "following", label: `Following (${followingData?.length || 0})` },
    ...(isOwnProfile
      ? [
          { key: "liked", label: "Liked Posts" },
          { key: "commented", label: "Commented Posts" },
        ]
      : []),
  ];

  return (
    <div className="max-w-7xl mx-auto p-4 sm:p-6">
      {profileLoading ? (
        <div className="flex justify-center items-center h-64">
          <Spin size="large" />
        </div>
      ) : profileError ? (
        <div className="text-center text-red-500">
          {profileError.status === 404
            ? "User not found"
            : "Error loading profile"}
        </div>
      ) : (
        <div className="grid grid-cols-12 gap-4 sm:gap-5 lg:gap-6">
          {/* Left Sidebar: User Profile */}
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
                    color={Avatar.getRandomColor("sitebase")}
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
              <p className="mt-2 text-sm text-slate-600 dark:text-navy-200">
                Categories: {user?.categories?.join(", ") || "None"}
              </p>
              {!isOwnProfile && currentUser && (
                <Button
                  className="mt-4 min-w-[7rem] rounded-full"
                  type={user?.isFollowing ? "default" : "primary"}
                  onClick={handleFollowToggle}
                  loading={isFollowing || isUnfollowing}
                >
                  {user?.isFollowing ? "Unfollow" : "Follow"}
                </Button>
              )}
              {isOwnProfile && (
                <>
                  <Button
                    className="mt-4 min-w-[7rem] rounded-full bg-primary font-medium text-white hover:bg-primary-focus focus:bg-primary-focus active:bg-primary-focus/90 dark:bg-accent dark:hover:bg-accent-focus dark:focus:bg-accent-focus dark:active:bg-accent/90"
                    onClick={() => navigate("/settings")}
                  >
                    Edit Profile
                  </Button>
                  <ul className="mt-6 space-y-1.5 font-inter font-medium">
                    <li>
                      <Button
                        className="w-full text-left flex space-x-2 rounded-lg px-4 py-2.5 tracking-wide hover:bg-slate-100 hover:text-slate-800 focus:bg-slate-100 focus:text-slate-800 dark:hover:bg-navy-600 dark:hover:text-navy-100 dark:focus:bg-navy-600 dark:focus:text-navy-100"
                        onClick={() => navigate("/settings")}
                      >
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          className="size-5 text-slate-400"
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
                      </Button>
                    </li>
                    {user?.role === "reader" && (
                      <li>
                        <Button
                          className="w-full text-left flex space-x-2 rounded-lg px-4 py-2.5 tracking-wide hover:bg-slate-100 hover:text-slate-800 focus:bg-slate-100 focus:text-slate-800 dark:hover:bg-navy-600 dark:hover:text-navy-100 dark:focus:bg-navy-600 dark:focus:text-navy-100"
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
                          loading={isRequestingWriterRole}
                        >
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            className="size-5 text-slate-400"
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
                        </Button>
                      </li>
                    )}
                    <li>
                      <Button
                        className="w-full text-left flex space-x-2 rounded-lg px-4 py-2.5 tracking-wide hover:bg-error/20 hover:text-error focus:bg-error/20 focus:text-error"
                        onClick={handleLogout}
                        loading={isLoggingOut}
                      >
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          className="size-5 text-error"
                          fill="none"
                          viewBox="0 0 24 24"
                          stroke="currentColor"
                          strokeWidth="1.5"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"
                          />
                        </svg>
                        <span>Logout</span>
                      </Button>
                    </li>
                  </ul>
                </>
              )}
            </div>
          </div>

          {/* Main Content: Tabs for Posts, Followers, Following */}
          <div className="col-span-12 lg:col-span-8">
            <div className="card">
              <div className="p-4 sm:p-5">
                <Tabs
                  activeKey={activeTab}
                  onChange={handleTabChange}
                  items={tabItems}
                />
                <div className="mt-4 space-y-4">
                  {activeTab === "followers" ? (
                    followersLoading ? (
                      <Spin />
                    ) : followersData?.length > 0 ? (
                      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                        {followersData.map((follower) => (
                          <UserCard
                            key={follower._id}
                            name={follower.username}
                            username={follower.username}
                            avatar={follower.profileImage}
                            isOnline={follower.isOnline || false}
                            isFollowing={
                              currentUser?.following?.includes(follower._id) ||
                              false
                            }
                            onFollow={() =>
                              handleFollowToggle(
                                follower._id,
                                follower.isFollowing
                              )
                            }
                          />
                        ))}
                      </div>
                    ) : (
                      <p>No followers found</p>
                    )
                  ) : activeTab === "following" ? (
                    followingLoading ? (
                      <Spin />
                    ) : followingData?.length > 0 ? (
                      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                        {followingData.map((following) => (
                          <UserCard
                            key={following._id}
                            name={following.username}
                            username={following.username}
                            avatar={following.profileImage}
                            isOnline={following.isOnline || false}
                            isFollowing={
                              currentUser?.following?.includes(following._id) ||
                              false
                            }
                            onFollow={() =>
                              handleFollowToggle(
                                following._id,
                                following.isFollowing
                              )
                            }
                          />
                        ))}
                      </div>
                    ) : (
                      <p>No following found</p>
                    )
                  ) : (
                    <>
                      {(activeTab === "liked" && likedPostsLoading) ||
                      (activeTab === "commented" && commentsLoading) ||
                      profileLoading ? (
                        <Spin />
                      ) : filteredPosts().length > 0 ? (
                        filteredPosts().map((post) => (
                          <PostCard key={post._id} post={post} />
                        ))
                      ) : (
                        <p>No posts available</p>
                      )}
                      <Pagination
                        currentPage={profileData?.currentPage || 1}
                        totalItems={
                          activeTab === "liked"
                            ? likedPostsData?.totalItems || 0
                            : profileData?.totalPosts || 0
                        }
                        pageSize={pageSize}
                        onPageChange={(page) =>
                          navigate(
                            `/u/${
                              username || currentUser?.username
                            }?page=${page}`
                          )
                        }
                      />
                    </>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default UserPage;
