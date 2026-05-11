import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { API_URL } from "@/lib/config";

export const clubApi = createApi({
  reducerPath: "clubApi",
  baseQuery: fetchBaseQuery({
    baseUrl: `${API_URL}/clubs`,
    prepareHeaders: (headers) => {
      if (typeof window !== "undefined") {
        const token = localStorage.getItem("token");
        if (token) {
          headers.set("authorization", `Bearer ${token}`);
        }
      }
      return headers;
    },
  }),

  tagTypes: ["Clubs", "Club", "Posts", "Comments", "Feed", "Following"],

  endpoints: (builder) => ({
    // ========================
    // 🏠 CLUBS (PUBLIC)
    // ========================

    getClubs: builder.query({
      query: () => "/",
      providesTags: ["Clubs"],
    }),

    getClub: builder.query({
      query: (id) => `/${id}`,
      providesTags: (result, error, id) => [{ type: "Club", id }],
    }),

    checkMembership: builder.query({
      query: (clubId) => `/${clubId}/membership`,
      providesTags: (result, error, clubId) => [{ type: "Club", id: clubId }],
    }),

    // ========================
    // 🔐 PROTECTED ROUTES
    // ========================

    createClub: builder.mutation({
      query: (data) => ({
        url: "/",
        method: "POST",
        body: data,
      }),
      invalidatesTags: ["Clubs"],
    }),

    joinClub: builder.mutation({
      query: (id) => ({
        url: `/${id}/join`,
        method: "POST",
      }),
      invalidatesTags: (result, error, id) => [{ type: "Club", id }, "Clubs"],
    }),

    // ========================
    // ⭐ NEW: FEED & FOLLOWING
    // ========================

    getFeed: builder.query({
      query: (params = {}) => ({
        url: "/feed",
        params,
      }),
      providesTags: ["Feed"],
    }),

    getFollowingClubs: builder.query({
      query: (params = {}) => ({
        url: "/following",
        params,
      }),
      providesTags: ["Following"],
    }),

    // ========================
    // 📝 CLUB POSTS
    // ========================

    getClubPosts: builder.query({
      query: ({ clubId, ...params }) => ({
        url: `/${clubId}/posts`,
        params,
      }),
      providesTags: (result, error, { clubId }) => [
        { type: "Posts", id: clubId },
      ],
    }),

    createPost: builder.mutation({
      query: ({ clubId, ...data }) => ({
        url: `/${clubId}/posts`,
        method: "POST",
        body: data,
      }),
      invalidatesTags: (result, error, { clubId }) => [
        { type: "Posts", id: clubId },
        "Feed",
      ],
    }),

    getPost: builder.query({
      query: (postId) => `/posts/${postId}`,
      providesTags: (result, error, postId) => [{ type: "Posts", id: postId }],
    }),

    // ========================
    // ❤️ POST INTERACTIONS
    // ========================

    toggleLike: builder.mutation({
      query: (postId) => ({
        url: `/posts/${postId}/like`,
        method: "POST",
      }),
      invalidatesTags: ["Posts", "Feed"],
    }),

    // ========================
    // 💬 COMMENTS
    // ========================

    getPostComments: builder.query({
      query: (postId) => `/posts/${postId}/comments`,
      providesTags: (result, error, postId) => [
        { type: "Comments", id: postId },
      ],
    }),

    createComment: builder.mutation({
      query: ({ postId, content }) => ({
        url: `/posts/${postId}/comments`,
        method: "POST",
        body: { content },
      }),
      invalidatesTags: (result, error, { postId }) => [
        { type: "Comments", id: postId },
      ],
    }),

    editComment: builder.mutation({
      query: ({ commentId, content }) => ({
        url: `/posts/comments/${commentId}`,
        method: "PUT",
        body: { content },
      }),
      invalidatesTags: ["Comments"],
    }),

    deleteComment: builder.mutation({
      query: (commentId) => ({
        url: `/posts/comments/${commentId}`,
        method: "DELETE",
      }),
      invalidatesTags: ["Comments"],
    }),
  }),
});

export const {
  useGetClubsQuery,
  useGetClubQuery,
  useCheckMembershipQuery,
  useCreateClubMutation,
  useJoinClubMutation,

  // New Exports
  useGetFeedQuery,
  useGetFollowingClubsQuery,

  useGetClubPostsQuery,
  useCreatePostMutation,
  useGetPostQuery,
  useToggleLikeMutation,
  useGetPostCommentsQuery,
  useCreateCommentMutation,
  useEditCommentMutation,
  useDeleteCommentMutation,
} = clubApi;
