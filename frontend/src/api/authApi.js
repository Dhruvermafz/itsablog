import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

export const authApi = createApi({
  reducerPath: "authApi",

  baseQuery: fetchBaseQuery({
    baseUrl: "http://localhost:5000/api/auth",
    credentials: "include",

    prepareHeaders: (headers) => {
      // Get token from localStorage
      const token =
        typeof window !== "undefined" ? localStorage.getItem("token") : null;

      if (token) {
        headers.set("authorization", `Bearer ${token}`);
      }

      return headers;
    },
  }),

  endpoints: (builder) => ({
    // REGISTER
    register: builder.mutation({
      query: (data) => ({
        url: "/register",
        method: "POST",
        body: data,
      }),
    }),

    // LOGIN
    login: builder.mutation({
      query: (data) => ({
        url: "/login",
        method: "POST",
        body: data,
      }),
    }),

    // CURRENT USER
    getMe: builder.query({
      query: () => ({
        url: "/me",
        method: "GET",
      }),
    }),
  }),
});

export const { useRegisterMutation, useLoginMutation, useGetMeQuery } = authApi;
