import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { BASE_URL } from "../config";
export const postApi = createApi({
  reducerPath: "postApi",
  baseQuery: fetchBaseQuery({
    baseUrl: `${BASE_URL}/posts`,
    prepareHeaders: (headers, { getState }) => {
      const user = localStorage.getItem("user");
      if (user) {
        const parsedUser = JSON.parse(user); // Parse the user string
        const token = parsedUser?.token;
        if (token) {
          headers.set("Authorization", `Bearer ${token}`);
        }
      }
      return headers;
    },
  }),

  endpoints: (builder) => ({
    getPosts: builder.query({
      query: (params) => ({
        url: "/",
        params, // Pass query parameters like page, sortBy, author, search
      }),
    }),
    createPost: builder.mutation({
      query: (postData) => ({
        url: "/",
        method: "POST",
        body: postData,
      }),
    }),
    getPost: builder.query({
      query: (id) => `/${id}`,
    }),
    updatePost: builder.mutation({
      query: ({ id, postData }) => ({
        url: `/${id}`,
        method: "PATCH",
        body: postData,
      }),
    }),
    deletePost: builder.mutation({
      query: (id) => ({
        url: `/${id}`,
        method: "DELETE",
      }),
    }),
    likePost: builder.mutation({
      query: (id) => ({
        url: `/like/${id}`,
        method: "POST",
      }),
    }),
    unlikePost: builder.mutation({
      query: (id) => ({
        url: `/like/${id}`,
        method: "DELETE",
      }),
    }),
    getUserLikedPosts: builder.query({
      query: ({ id, params }) => ({
        url: `/liked/${id}`,
        params, // Pass query parameters
      }),
    }),
    getUserLikes: builder.query({
      query: (postId) => `/like/${postId}/users`,
    }),
    reportPost: builder.mutation({
      query: (id) => ({
        url: `/${id}/report`,
        method: "PATCH",
      }),
    }),
    savePost: builder.mutation({
      query: (id) => ({
        url: `/savePost/${id}`,
        method: "PATCH",
      }),
    }),
    unsavePost: builder.mutation({
      query: (id) => ({
        url: `/unSavePost/${id}`,
        method: "PATCH",
      }),
    }),
    getSavePosts: builder.query({
      query: () => "/getSavePosts",
    }),
  }),
});

export const {
  useGetPostsQuery,
  useCreatePostMutation,
  useGetPostQuery,
  useUpdatePostMutation,
  useDeletePostMutation,
  useLikePostMutation,
  useUnlikePostMutation,
  useGetUserLikedPostsQuery,
  useGetUserLikesQuery,
  useReportPostMutation,
  useSavePostMutation,
  useUnsavePostMutation,
  useGetSavePostsQuery,
} = postApi;
