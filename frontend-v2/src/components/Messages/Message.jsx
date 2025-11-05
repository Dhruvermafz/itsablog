import React from "react";

const Message = ({ message, conservant, user }) => {
  const isFromUser = message.direction === "from";
  const avatarUrl = isFromUser
    ? user.avatarUrl || "images/avatar/avatar-12.jpg"
    : conservant.avatarUrl || "images/avatar/avatar-12.jpg";

  // Placeholder for image messages (assuming message.images exists)
  const images = message.images || [];

  return (
    <div
      className={`flex items-start ${
        isFromUser ? "justify-end" : ""
      } space-x-2.5 sm:space-x-5`}
    >
      {!isFromUser && (
        <div className="avatar">
          <img className="rounded-full" src={avatarUrl} alt="avatar" />
        </div>
      )}
      <div
        className={`flex flex-col ${
          isFromUser ? "items-end" : "items-start"
        } space-y-3.5`}
      >
        {message.content && (
          <div
            className={`max-w-lg ${
              isFromUser ? "ml-4 sm:ml-10" : "mr-4 sm:mr-10"
            }`}
          >
            <div
              className={`rounded-2xl ${
                isFromUser
                  ? "rounded-tr-none bg-info/10 dark:bg-accent dark:text-white"
                  : "rounded-tl-none bg-white dark:bg-navy-700 dark:text-navy-100"
              } p-3 text-slate-700 shadow-xs`}
            >
              {message.content}
            </div>
            <p
              className={`mt-1 text-xs text-slate-400 dark:text-navy-300 ${
                isFromUser ? "text-left" : "ml-auto text-right"
              }`}
            >
              {new Date(message.createdAt || Date.now()).toLocaleTimeString(
                [],
                {
                  hour: "2-digit",
                  minute: "2-digit",
                }
              )}
            </p>
          </div>
        )}
        {images.length > 0 && (
          <div
            className={`max-w-lg ${
              isFromUser ? "ml-4 sm:ml-10" : "mr-4 sm:mr-10"
            }`}
          >
            <div className="grid grid-cols-12 gap-2">
              {images.map((src, index) => (
                <div
                  key={index}
                  className={`group relative ${
                    images.length === 1
                      ? "col-span-12"
                      : "col-span-6 sm:col-span-4"
                  }`}
                >
                  <img
                    className="h-full rounded-lg object-cover"
                    src={src}
                    alt="image"
                  />
                  <div className="absolute top-0 flex h-full w-full items-center justify-center rounded-lg bg-black/30 opacity-0 transition-all duration-300 group-hover:opacity-100">
                    <button className="btn size-9 rounded-full bg-info p-0 font-medium text-white hover:bg-info-focus focus:bg-info-focus active:bg-info-focus/90">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="size-5"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth="2"
                          d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4"
                        />
                      </svg>
                    </button>
                  </div>
                </div>
              ))}
            </div>
            <p
              className={`mt-1 text-xs text-slate-400 dark:text-navy-300 ${
                isFromUser ? "text-left" : "ml-auto text-right"
              }`}
            >
              {new Date(message.createdAt || Date.now()).toLocaleTimeString(
                [],
                {
                  hour: "2-digit",
                  minute: "2-digit",
                }
              )}
            </p>
          </div>
        )}
      </div>
      {isFromUser && (
        <div className="avatar">
          <img className="rounded-full" src={avatarUrl} alt="avatar" />
        </div>
      )}
    </div>
  );
};

export default Message;
