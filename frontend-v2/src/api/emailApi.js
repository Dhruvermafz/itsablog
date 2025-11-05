import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

// Define the email API service
export const emailApi = createApi({
  reducerPath: "emailApi",
  baseQuery: fetchBaseQuery({ baseUrl: "http://localhost:5000/api/emails" }), // Change this to your API base URL
  endpoints: (builder) => ({
    collectEmail: builder.mutation({
      query: (emailData) => ({
        url: "/",
        method: "POST",
        body: emailData,
      }),
    }),
    confirmEmail: builder.query({
      query: (id) => `/confirm/${id}`,
    }),
  }),
});

export const { useCollectEmailMutation, useConfirmEmailQuery } = emailApi;
