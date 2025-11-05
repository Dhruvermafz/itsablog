import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { BASE_URL } from "../config";
// Define the comment API service
export const commentApi = createApi({
  reducerPath: "commentApi",
  baseQuery: fetchBaseQuery({
    baseUrl: `${BASE_URL}/comments`,
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
  }), // Change this to your API base URL
  endpoints: (builder) => ({
    createComment: builder.mutation({
      query: ({ id, content }) => ({
        url: `/${id}`,
        method: "POST",
        body: { content },
      }),
    }),
    updateComment: builder.mutation({
      query: ({ id, content }) => ({
        url: `/${id}`,
        method: "PATCH",
        body: { content },
      }),
    }),
    deleteComment: builder.mutation({
      query: (id) => ({
        url: `/${id}`,
        method: "DELETE",
      }),
    }),
    getPostComments: builder.query({
      query: (id) => `/post/${id}`,
    }),
    getUserComments: builder.query({
      query: (id) => `/user/${id}`,
    }),
  }),
});

export const {
  useCreateCommentMutation,
  useUpdateCommentMutation,
  useDeleteCommentMutation,
  useGetPostCommentsQuery,
  useGetUserCommentsQuery,
} = commentApi;
