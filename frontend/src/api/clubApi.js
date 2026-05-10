import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { API_URL } from "@/lib/config";
export const clubApi = createApi({
  reducerPath: "clubApi",
  baseQuery: fetchBaseQuery({
    baseUrl: `${API_URL}/clubs`, // adjust
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
  tagTypes: ["Clubs", "Club", "Posts", "Comments"],
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
    // 🔐 CLUBS (PROTECTED)
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
    // 📝 CLUB POSTS
    // ========================

    getClubPosts: builder.query({
      query: (clubId) => `/${clubId}/posts`,
      providesTags: (result, error, clubId) => [{ type: "Posts", id: clubId }],
    }),

    createPost: builder.mutation({
      query: ({ clubId, ...data }) => ({
        url: `/${clubId}/posts`,
        method: "POST",
        body: data,
      }),
      invalidatesTags: (result, error, { clubId }) => [
        { type: "Posts", id: clubId },
      ],
    }),

    // ========================
    // ❤️ POST INTERACTIONS
    // ========================

    toggleLike: builder.mutation({
      query: (postId) => ({
        url: `/posts/${postId}/like`,
        method: "POST",
      }),
      invalidatesTags: ["Posts"],
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
    getPost: builder.query({
      query: (postId) => `/posts/${postId}`,
      providesTags: (result, error, postId) => [{ type: "Posts", id: postId }],
    }),
    createComment: builder.mutation({
      query: ({ postId, text }) => ({
        url: `/posts/${postId}/comments`,
        method: "POST",
        body: { text },
      }),
      invalidatesTags: (result, error, { postId }) => [
        { type: "Comments", id: postId },
      ],
    }),
  }),
});

export const {
  useGetClubsQuery,
  useGetClubQuery,

  useCreateClubMutation,
  useJoinClubMutation,
  useCheckMembershipQuery,
  useGetClubPostsQuery,
  useCreatePostMutation,
  useToggleLikeMutation,
  useGetPostQuery,
  useGetPostCommentsQuery,
  useCreateCommentMutation,
} = clubApi;
