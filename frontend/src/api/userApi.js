import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

// Define API service
export const userApi = createApi({
  reducerPath: "userApi",
  baseQuery: fetchBaseQuery({ baseUrl: "http://yourapiurl.com/api" }), // Change this to your API base URL
  endpoints: (builder) => ({
    register: builder.mutation({
      query: (userData) => ({
        url: "/register",
        method: "POST",
        body: userData,
      }),
    }),
    login: builder.mutation({
      query: (userData) => ({
        url: "/login",
        method: "POST",
        body: userData,
      }),
    }),
    getRandomUsers: builder.query({
      query: () => "/random",
    }),
    getUser: builder.query({
      query: (username) => `/${username}`,
    }),
    updateUser: builder.mutation({
      query: ({ id, userData }) => ({
        url: `/${id}`,
        method: "PATCH",
        body: userData,
      }),
    }),
    follow: builder.mutation({
      query: (id) => ({
        url: `/follow/${id}`,
        method: "POST",
      }),
    }),
    unfollow: builder.mutation({
      query: (id) => ({
        url: `/unfollow/${id}`,
        method: "DELETE",
      }),
    }),
    getFollowers: builder.query({
      query: (id) => `/followers/${id}`,
    }),
    getFollowing: builder.query({
      query: (id) => `/following/${id}`,
    }),
    deleteUser: builder.mutation({
      query: (id) => ({
        url: `/delete/${id}`,
        method: "DELETE",
      }),
    }),
  }),
});

export const {
  useRegisterMutation,
  useLoginMutation,
  useGetRandomUsersQuery,
  useGetUserQuery,
  useUpdateUserMutation,
  useFollowMutation,
  useUnfollowMutation,
  useGetFollowersQuery,
  useGetFollowingQuery,
  useDeleteUserMutation,
} = userApi;
