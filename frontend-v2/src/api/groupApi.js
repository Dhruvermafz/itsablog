import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

// Define API service for groups
export const groupApi = createApi({
  reducerPath: "groupApi",
  baseQuery: fetchBaseQuery({
    baseUrl: "http://localhost:5000/api", // Corrected base URL for group endpoints
    prepareHeaders: (headers, { getState }) => {
      const user = JSON.parse(localStorage.getItem("user")); // Parse JSON string
      const token = user?.token; // Assuming token is stored in user object
      if (token) {
        headers.set("Authorization", `Bearer ${token}`);
      }
      return headers;
    },
  }),
  endpoints: (builder) => ({
    // Fetch all groups
    getAllGroups: builder.query({
      query: () => ({
        url: "/groups",
        method: "GET",
      }),
      providesTags: ["Groups"], // For caching and invalidation
    }),

    // Search groups by query
    searchGroups: builder.query({
      query: (query) => ({
        url: `/groups/search?query=${encodeURIComponent(query)}`,
        method: "GET",
      }),
      providesTags: ["Groups"], // Optional, depending on caching needs
    }),

    // Create a new group
    createGroup: builder.mutation({
      query: (groupData) => ({
        url: "/groups",
        method: "POST",
        body: groupData,
      }),
      invalidatesTags: ["Groups"], // Invalidate cache to refetch groups
    }),

    // Join a group
    joinGroup: builder.mutation({
      query: ({ groupId, userData }) => ({
        url: `/groups/${groupId}/join`,
        method: "POST",
        body: userData,
      }),
      invalidatesTags: ["Groups"], // Invalidate to update group members
    }),

    // Create a post inside a group
    createPostInGroup: builder.mutation({
      query: ({ groupId, postData }) => ({
        url: `/groups/${groupId}/posts`,
        method: "POST",
        body: postData,
      }),
      invalidatesTags: ["Groups"], // Invalidate to update group posts
    }),

    // Get a single group by ID
    getGroup: builder.query({
      query: (groupId) => ({
        url: `/groups/${groupId}`,
        method: "GET",
      }),
      providesTags: (result, error, groupId) => [
        { type: "Group", id: groupId },
      ],
    }),

    // Fetch popular groups (e.g., top 5 by member count)
    getPopularGroups: builder.query({
      query: () => ({
        url: "/groups/popular",
        method: "GET",
      }),
      providesTags: ["Groups"], // For caching and invalidation
    }),

    // Fetch groups the user is a member of
    getMyGroups: builder.query({
      query: () => ({
        url: "/groups/my-groups",
        method: "GET",
      }),
      providesTags: ["Groups"], // For caching and invalidation
    }),
  }),
});

export const {
  useGetAllGroupsQuery,
  useSearchGroupsQuery,
  useCreateGroupMutation,
  useJoinGroupMutation,
  useCreatePostInGroupMutation,
  useGetGroupQuery,
  useGetPopularGroupsQuery,
  useGetMyGroupsQuery,
} = groupApi;
