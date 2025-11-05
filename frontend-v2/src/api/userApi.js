import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { BASE_URL } from "../config";
export const userApi = createApi({
  reducerPath: "userApi",
  baseQuery: fetchBaseQuery({
    baseUrl: `${BASE_URL}/users`,
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
    getUsers: builder.query({
      query: () => "/all",
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
      query: ({ username, page, pageSize }) => ({
        url: `/profile/${username}`,
        params: { page, pageSize },
      }),
    }),
    logout: builder.mutation({
      query: () => ({
        url: "/logout",
        method: "POST",
      }),
    }),
    requestWriterRole: builder.mutation({
      query: (data) => ({
        url: "/request-writer",
        method: "POST",
        body: data,
      }),
    }),
    handleWriterRoleRequest: builder.mutation({
      query: (data) => ({
        url: "/handle-writer-request",
        method: "POST",
        body: data,
      }),
    }),
  }),
});

export const {
  useGetUsersQuery,
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
  useLogoutMutation,
  useRequestWriterRoleMutation,
  useHandleWriterRoleRequestMutation,
} = userApi;
