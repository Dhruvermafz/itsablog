import React from "react";
import Avatar from "react-avatar"; // Import react-avatar
import { FaUserPlus, FaUserMinus } from "react-icons/fa";

const UserCard = ({
  name,
  username,
  avatar,
  isOnline,
  onFollow,
  isFollowing,
}) => {
  return (
    <div className="rounded-lg border border-slate-200 bg-white p-4 dark:border-navy-500 dark:bg-navy-700">
      <div className="flex items-center space-x-4">
        {/* Avatar */}
        <div className="relative">
          <Avatar
            name={name || username} // Use name or username for avatar generation
            src={avatar} // Use provided avatar URL if available
            size="48" // Adjust size as needed
            round={true} // Circular avatar
            color={Avatar.getRandomColor("sitebase")} // Consistent color scheme
            textSizeRatio={2.5} // Adjust text size for initials
            className="object-cover"
          />
          {isOnline && (
            <span className="absolute bottom-0 right-0 h-3 w-3 rounded-full border-2 border-white bg-green-500 dark:border-navy-700"></span>
          )}
        </div>

        {/* User Info */}
        <div className="flex-1">
          <h3 className="text-base font-medium text-slate-700 dark:text-navy-100">
            {name || "Unknown"}
          </h3>
          <p className="text-xs text-slate-400 dark:text-navy-300">
            @{username}
          </p>
        </div>

        {/* Follow/Unfollow Button */}
        <button
          onClick={onFollow}
          className={`btn h-8 w-8 rounded-full p-0 hover:bg-slate-300/20 focus:bg-slate-300/20 active:bg-slate-300/25 dark:hover:bg-navy-300/20 dark:focus:bg-navy-300/20 dark:active:bg-navy-300/25 ${
            isFollowing ? "text-red-500" : "text-primary dark:text-accent"
          }`}
        >
          {isFollowing ? (
            <FaUserMinus className="size-4" />
          ) : (
            <FaUserPlus className="size-4" />
          )}
        </button>
      </div>
    </div>
  );
};

export default UserCard;
