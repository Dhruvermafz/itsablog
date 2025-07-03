import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

// Define API service
export const userApi = createApi({
  reducerPath: "userApi",
  baseQuery: fetchBaseQuery({
    baseUrl: "http://yourapiurl.com/api", // Replace with your actual API base URL
    prepareHeaders: (headers, { getState }) => {
      const token = getState().auth.token; // Assuming token is stored in Redux
      if (token) {
        headers.set("Authorization", `Bearer ${token}`);
      }
      return headers;
    },
  }),
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
    getProfile: builder.query({
      query: ({ userId, page, pageSize }) => ({
        url: `/profile/${userId}`,
        params: { page, pageSize },
      }),
    }),
    // Add logout endpoint
    logout: builder.mutation({
      query: () => ({
        url: "/logout",
        method: "POST", // Adjust method based on your backend (POST, DELETE, etc.)
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
  useGetProfileQuery,
  useLogoutMutation, // Export the new hook
} = userApi;
