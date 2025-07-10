import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

// Define API service for messages
export const messageApi = createApi({
  reducerPath: "messageApi",
  baseQuery: fetchBaseQuery({ baseUrl: "http://localhost:5000/api/messages" }), // Change this to your API base URL
  endpoints: (builder) => ({
    getConversations: builder.query({
      query: () => "/conversations",
    }),
    sendMessage: builder.mutation({
      query: (messageData) => ({
        url: `/${messageData.id}`,
        method: "POST",
        body: messageData.message,
      }),
    }),
    getMessages: builder.query({
      query: (id) => `/${id}`,
    }),
  }),
});

export const {
  useGetConversationsQuery,
  useSendMessageMutation,
  useGetMessagesQuery,
} = messageApi;
