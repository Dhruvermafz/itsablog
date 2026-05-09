import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { API_URL } from "@/lib/config";
export const userApi = createApi({
  reducerPath: "userApi",
  baseQuery: fetchBaseQuery({
    baseUrl: `${API_URL}/users`,
    credentials: "include",

    prepareHeaders: (headers, { getState }) => {
      const token = getState().auth?.token;

      if (token) {
        headers.set("authorization", `Bearer ${token}`);
      }

      return headers;
    },
  }),
  tagTypes: ["Profile", "Followers", "Following", "ReadingLogs", "LogEntries"],
  endpoints: (builder) => ({
    // ========================
    // 👤 PROFILE (PUBLIC)
    // ========================

    getProfile: builder.query({
      query: (username) => `/profile/${username}`,
      providesTags: (result, error, username) => [
        { type: "Profile", id: username },
      ],
    }),

    getFollowers: builder.query({
      query: (userId) => `/${userId}/followers`,
      providesTags: (result, error, userId) => [
        { type: "Followers", id: userId },
      ],
    }),

    getFollowing: builder.query({
      query: (userId) => `/${userId}/following`,
      providesTags: (result, error, userId) => [
        { type: "Following", id: userId },
      ],
    }),

    // ========================
    // 🔐 PROFILE UPDATE
    // ========================

    updateProfile: builder.mutation({
      query: (data) => ({
        url: "/profile",
        method: "PUT",
        body: data,
      }),
      invalidatesTags: ["Profile"],
    }),

    // ========================
    // 🤝 FOLLOW SYSTEM
    // ========================

    followUser: builder.mutation({
      query: (userId) => ({
        url: `/${userId}/follow`,
        method: "POST",
      }),
      invalidatesTags: (result, error, userId) => [
        { type: "Followers", id: userId },
        { type: "Following" }, // current user
        { type: "Profile" },
      ],
    }),

    unfollowUser: builder.mutation({
      query: (userId) => ({
        url: `/${userId}/follow`,
        method: "DELETE",
      }),
      invalidatesTags: (result, error, userId) => [
        { type: "Followers", id: userId },
        { type: "Following" },
        { type: "Profile" },
      ],
    }),

    // ========================
    // 📖 READING LOGS
    // ========================

    getReadingLogs: builder.query({
      query: () => "/reading-logs",
      providesTags: ["ReadingLogs"],
    }),

    upsertReadingLog: builder.mutation({
      query: ({ bookId, ...data }) => ({
        url: `/reading-log/${bookId}`,
        method: "POST",
        body: data,
      }),
      invalidatesTags: ["ReadingLogs"],
    }),

    // ========================
    // 📝 LOG ENTRIES
    // ========================

    getLogEntries: builder.query({
      query: (logId) => `/reading-log/${logId}/entries`,
      providesTags: (result, error, logId) => [
        { type: "LogEntries", id: logId },
      ],
    }),

    addLogEntry: builder.mutation({
      query: ({ logId, ...data }) => ({
        url: `/reading-log/${logId}/entries`,
        method: "POST",
        body: data,
      }),
      invalidatesTags: (result, error, { logId }) => [
        { type: "LogEntries", id: logId },
      ],
    }),
  }),
});

export const {
  useGetProfileQuery,
  useGetFollowersQuery,
  useGetFollowingQuery,

  useUpdateProfileMutation,

  useFollowUserMutation,
  useUnfollowUserMutation,

  useGetReadingLogsQuery,
  useUpsertReadingLogMutation,

  useGetLogEntriesQuery,
  useAddLogEntryMutation,
} = userApi;
