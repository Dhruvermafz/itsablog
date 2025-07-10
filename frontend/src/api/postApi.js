import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

// Define API service for posts
export const postApi = createApi({
  reducerPath: "postApi",
  baseQuery: fetchBaseQuery({ baseUrl: "http://localhost:5000/api/posts" }), // Change this to your API base URL
  endpoints: (builder) => ({
    getPosts: builder.query({
      query: ({ page = 1 }) => `?page=${page}`,
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
      query: (id) => `/liked/${id}`,
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
