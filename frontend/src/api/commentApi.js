import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

// Define the comment API service
export const commentApi = createApi({
  reducerPath: "commentApi",
  baseQuery: fetchBaseQuery({ baseUrl: "http://localhost:5000/api/comment" }), // Change this to your API base URL
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
