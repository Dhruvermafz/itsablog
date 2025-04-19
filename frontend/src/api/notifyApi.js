import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

// Define API service for notifications
export const notifyApi = createApi({
  reducerPath: "notifyApi",
  baseQuery: fetchBaseQuery({ baseUrl: "http://yourapiurl.com/api" }), // Change this to your API base URL
  endpoints: (builder) => ({
    createNotify: builder.mutation({
      query: (notifyData) => ({
        url: "/notify",
        method: "POST",
        body: notifyData,
      }),
    }),
    removeNotify: builder.mutation({
      query: (id) => ({
        url: `/notify/${id}`,
        method: "DELETE",
      }),
    }),
    getNotifies: builder.query({
      query: () => "/notifies",
    }),
    isReadNotify: builder.mutation({
      query: (id) => ({
        url: `/isReadNotify/${id}`,
        method: "PATCH",
      }),
    }),
    deleteAllNotifies: builder.mutation({
      query: () => ({
        url: "/deleteAllNotify",
        method: "DELETE",
      }),
    }),
  }),
});

export const {
  useCreateNotifyMutation,
  useRemoveNotifyMutation,
  useGetNotifiesQuery,
  useIsReadNotifyMutation,
  useDeleteAllNotifiesMutation,
} = notifyApi;
