import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { BASE_URL } from "../config";
// Define the admin API service
export const adminApi = createApi({
  reducerPath: "adminApi",
  baseQuery: fetchBaseQuery({
    baseUrl: `${BASE_URL}/admin`,
    prepareHeaders: (headers, { getState }) => {
      const user = localStorage.getItem("user");
      const token = user?.token; // Assuming token is stored in Redux
      if (token) {
        headers.set("Authorization", `Bearer ${token}`);
      }
      return headers;
    },
  }), // Change this to your API base URL
  endpoints: (builder) => ({
    getTotalUsers: builder.query({
      query: () => "/get_total_users",
    }),
    getTotalPosts: builder.query({
      query: () => "/get_total_posts",
    }),
    getTotalComments: builder.query({
      query: () => "/get_total_comments",
    }),
    getTotalLikes: builder.query({
      query: () => "/get_total_likes",
    }),
    getTotalSpamPosts: builder.query({
      query: () => "/get_total_spam_posts",
    }),
    getSpamPosts: builder.query({
      query: () => "/get_spam_posts",
    }),
    deleteSpamPost: builder.mutation({
      query: (id) => ({
        url: `/delete_spam_posts/${id}`,
        method: "DELETE",
      }),
    }),
  }),
});

export const {
  useGetTotalUsersQuery,
  useGetTotalPostsQuery,
  useGetTotalCommentsQuery,
  useGetTotalLikesQuery,
  useGetTotalSpamPostsQuery,
  useGetSpamPostsQuery,
  useDeleteSpamPostMutation,
} = adminApi;
