import React, { useState, useEffect } from "react";
import { Spin, message } from "antd";
import { FaChevronDown, FaPlus, FaDownload, FaCog } from "react-icons/fa";
import {
  useGetUsersQuery,
  useFollowMutation,
  useUnfollowMutation,
} from "../../api/userApi";
import { isLoggedIn } from "../../helpers/authHelper";
import UserCard from "./UserCard";
import { Link } from "react-router-dom";
const UserWrapper = () => {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [filteredUsers, setFilteredUsers] = useState([]);
  const user = isLoggedIn();

  // Fetch all users
  const {
    data: usersData,
    isLoading: usersLoading,
    isError: usersError,
  } = useGetUsersQuery({ limit: 100 });

  // Follow/Unfollow mutations
  const [followUser] = useFollowMutation();
  const [unfollowUser] = useUnfollowMutation();

  // Filter users based on search query
  useEffect(() => {
    if (usersData?.data) {
      const filtered = usersData.data
        .filter(
          (u) =>
            u.username?.toLowerCase().includes(searchQuery.toLowerCase()) ||
            u.email?.toLowerCase().includes(searchQuery.toLowerCase()) // Use email since 'name' isn't in schema
        )
        .map((u) => ({
          ...u,
          isFollowing: user?.following?.includes(u._id) || false, // Add isFollowing based on logged-in user's following list
        }));
      setFilteredUsers(filtered.filter((u) => u._id !== user?._id));
    }
  }, [usersData, searchQuery, user?._id, user?.following]);

  // Handle follow/unfollow action
  const handleFollowToggle = async (userId, isFollowing) => {
    try {
      if (isFollowing) {
        await unfollowUser(userId).unwrap();
        message.success("User unfollowed");
      } else {
        await followUser(userId).unwrap();
        message.success("User followed");
      }
    } catch (error) {
      message.error(`Failed to ${isFollowing ? "unfollow" : "follow"} user`);
    }
  };

  // Handle dropdown actions (placeholders)
  const handleNewUser = () => {
    console.log("Navigate to new user creation");
    setIsDropdownOpen(false);
  };

  const handleExportUsers = () => {
    console.log("Export users");
    setIsDropdownOpen(false);
  };

  const handleSettings = () => {
    console.log("Navigate to settings");
    setIsDropdownOpen(false);
  };

  return (
    <Spin spinning={usersLoading}>
      <div>
        {/* Header Section */}
        <div className="flex items-center justify-between py-5 lg:py-6">
          <div className="flex items-center space-x-1">
            <h2 className="text-xl font-medium text-slate-700 line-clamp-1 dark:text-navy-50 lg:text-2xl">
              Explore Users
            </h2>
            <div className="relative inline-flex">
              <button
                onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                className="btn size-8 rounded-full p-0 hover:bg-slate-300/20 focus:bg-slate-300/20 active:bg-slate-300/25 dark:hover:bg-navy-300/20 dark:focus:bg-navy-300/20 dark:active:bg-navy-300/25"
              >
                <FaChevronDown className="size-4" />
              </button>
              {isDropdownOpen && (
                <div className="absolute z-10 left-0 mt-2 rounded-md border border-slate-150 bg-white py-1.5 font-inter dark:border-navy-500 dark:bg-navy-700">
                  <ul>
                    <li>
                      <button
                        onClick={handleNewUser}
                        className="flex h-8 items-center space-x-3 px-3 pr-8 font-medium tracking-wide outline-hidden transition-all hover:bg-slate-100 hover:text-slate-800 focus:bg-slate-100 focus:text-slate-800 dark:hover:bg-navy-600 dark:hover:text-navy-100 dark:focus:bg-navy-600 dark:focus:text-navy-100 w-full text-left"
                      >
                        <FaPlus className="size-4.5" />
                        <span>New User</span>
                      </button>
                    </li>
                    <li>
                      <button
                        onClick={handleExportUsers}
                        className="flex h-8 items-center space-x-3 px-3 pr-8 font-medium tracking-wide outline-hidden transition-all hover:bg-slate-100 hover:text-slate-800 focus:bg-slate-100 focus:text-slate-800 dark:hover:bg-navy-600 dark:hover:text-navy-100 dark:focus:bg-navy-600 dark:focus:text-navy-100 w-full text-left"
                      >
                        <FaDownload className="size-4.5" />
                        <span>Export Users</span>
                      </button>
                    </li>
                    <li>
                      <button
                        onClick={handleSettings}
                        className="flex h-8 items-center space-x-3 px-3 pr-8 font-medium tracking-wide outline-hidden transition-all hover:bg-slate-100 hover:text-slate-800 focus:bg-slate-100 focus:text-slate-800 dark:hover:bg-navy-600 dark:hover:text-navy-100 dark:focus:bg-navy-600 dark:focus:text-navy-100 w-full text-left"
                      >
                        <FaCog className="size-4.5" />
                        <span>Settings</span>
                      </button>
                    </li>
                  </ul>
                </div>
              )}
            </div>
          </div>

          {/* Search and Filter Buttons */}
          <div className="flex items-center space-x-2">
            <label className="relative hidden sm:flex">
              <input
                className="form-input peer h-9 w-full rounded-full border border-slate-300 bg-transparent px-3 py-2 pl-9 text-xs-plus placeholder:text-slate-400/70 hover:border-slate-400 focus:border-primary dark:border-navy-450 dark:hover:border-navy-400 dark:focus:border-accent"
                placeholder="Search users..."
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
              <span className="pointer-events-none absolute flex h-full w-10 items-center justify-center text-slate-400 peer-focus:text-primary dark:text-navy-300 dark:peer-focus:text-accent">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="size-4 transition-colors duration-200"
                  fill="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path d="M3.316 13.781l.73-.171-.73.171zm0-5.457l.73.171-.73-.171zm15.473 0l.73-.171-.73.171zm0 5.457l.73.171-.73-.171zm-5.008 5.008l-.171-.73.171.73zm-5.457 0l-.171.73.171-.73zm0-15.473l-.171-.73.171.73zm5.457 0l.171-.73-.171.73zM20.47 21.53a.75.75 0 101.06-1.06l-1.06 1.06zM4.046 13.61a11.198 11.198 0 010-5.115l-1.46-.342a12.698 12.698 0 000 5.8l1.46-.343zm14.013-5.115a11.196 11.196 0 010 5.115l1.46.342a12.698 12.698 0 000-5.8l-1.46.343zm-4.45 9.564a11.196 11.196 0 01-5.114 0l-.342 1.46c1.907.448 3.892.448 5.8 0l-.343-1.46zM8.496 4.046a11.198 11.198 0 015.115 0l.342-1.46a12.698 12.698 0 00-5.8 0l.343 1.46zm0 14.013a5.97 5.97 0 01-4.45-4.45l-1.46.343a7.47 7.47 0 005.568 5.568l.342-1.46zm5.457 1.46a7.47 7.47 0 005.568-5.567l-1.46-.342a5.97 5.97 0 01-4.45 4.45l.342 1.46zM13.61 4.046a5.97 5.97 0 014.45 4.45l1.46-.343a7.47 7.47 0 00-5.568-5.567l-.342 1.46zm-5.457-1.46a7.47 7.47 0 00-5.567 5.567l1.46.342a5.97 5.97 0 014.45-4.45l-.343-1.46zm8.652 15.28l3.665 3.664 1.06-1.06-3.665-3.665-1.06 1.06z" />
                </svg>
              </span>
            </label>
            <div className="flex">
              <button className="btn size-8 rounded-full p-0 hover:bg-slate-300/20 focus:bg-slate-300/20 active:bg-slate-300/25 dark:hover:bg-navy-300/20 dark:focus:bg-navy-300/20 dark:active:bg-navy-300/25 sm:h-9 sm:w-9">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="size-5"
                  stroke="currentColor"
                  fill="none"
                  viewBox="0 0 24 24"
                >
                  <circle
                    cx="10.2"
                    cy="10.2"
                    r="7.2"
                    strokeWidth="1.5"
                  ></circle>
                  <path
                    strokeWidth="1.5"
                    strokeLinecap="round"
                    d="M21 21l-3.6-3.6"
                  />
                </svg>
              </button>
              <button className="btn size-8 rounded-full p-0 hover:bg-slate-300/20 focus:bg-slate-300/20 active:bg-slate-300/25 dark:hover:bg-navy-300/20 dark:focus:bg-navy-300/20 dark:active:bg-navy-300/25 sm:h-9 sm:w-9">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="size-5"
                  fill="none"
                  viewBox="0 0 24 24"
                >
                  <path
                    fill="currentColor"
                    d="M3 5.109C3 4.496 3.47 4 4.05 4h16.79c.58 0 1.049.496 1.049 1.109 0 .612-.47 1.108-1.05 1.108H4.05C3.47 6.217 3 5.721 3 5.11zM5.798 12.5c0-.612.47-1.109 1.05-1.109H18.04c.58 0 1.05.497 1.05 1.109s-.47 1.109-1.05 1.109H6.848c-.58 0-1.05-.497-1.05-1.109zM9.646 18.783c-.58 0-1.05.496-1.05 1.108 0 .613.47 1.109 1.05 1.109h5.597c.58 0 1.05-.496 1.05-1.109 0-.612-.47-1.108-1.05-1.108H9.646z"
                  />
                </svg>
              </button>
              <button className="btn size-8 rounded-full p-0 hover:bg-slate-300/20 focus:bg-slate-300/20 active:bg-slate-300/25 dark:hover:bg-navy-300/20 dark:focus:bg-navy-300/20 dark:active:bg-navy-300/25 sm:h-9 sm:w-9">
                <FaCog className="size-5" />
              </button>
            </div>
          </div>
        </div>

        {/* Users Grid */}
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 sm:gap-5 lg:grid-cols-3 lg:gap-6">
          {usersError ? (
            <p className="col-span-full text-center text-slate-600 dark:text-navy-200">
              Failed to load users.
            </p>
          ) : filteredUsers.length > 0 ? (
            filteredUsers.map((u) => (
              <Link to={`/user/${u.username}`}>
                <UserCard
                  key={u._id}
                  name={u.username} // Use username since 'name' isn't in schema
                  username={u.username}
                  avatar={u.profileImage} // Map to schema's profileImage
                  isOnline={u.isOnline || false} // Not in schema, default to false
                  isFollowing={u.isFollowing} // Added in useEffect
                  onFollow={() => handleFollowToggle(u._id, u.isFollowing)}
                />
              </Link>
            ))
          ) : (
            <p className="col-span-full text-center text-slate-600 dark:text-navy-200">
              No users found.
            </p>
          )}
        </div>
      </div>
    </Spin>
  );
};

export default UserWrapper;
