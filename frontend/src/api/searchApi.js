// src/features/search/searchApi.js
import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { API_URL } from "@/lib/config";
export const searchApi = createApi({
  reducerPath: "searchApi",
  baseQuery: fetchBaseQuery({
    baseUrl: `${API_URL}`, // adjust
    credentials: "include",

    prepareHeaders: (headers) => {
      if (typeof window !== "undefined") {
        const token = localStorage.getItem("token");

        if (token) {
          headers.set("authorization", `Bearer ${token}`);
        }
      }

      return headers;
    },
  }),
  endpoints: (builder) => ({
    globalSearch: builder.query({
      query: ({ q, limit = 10, page = 1, type }) => ({
        url: "/search",
        params: {
          q,
          limit,
          page,
          ...(type && { type }), // Only send type if provided
        },
      }),
      transformResponse: (response) => {
        return {
          ...response,
          // Optional: You can add any transformation here
        };
      },
    }),

    // Optional: Search by specific type only
    searchBooks: builder.query({
      query: ({ q, limit = 10, page = 1 }) => ({
        url: "/search",
        params: { q, limit, page, type: "book" },
      }),
    }),

    searchAuthors: builder.query({
      query: ({ q, limit = 10, page = 1 }) => ({
        url: "/search",
        params: { q, limit, page, type: "author" },
      }),
    }),
  }),
});

// Export hooks
export const {
  useGlobalSearchQuery,
  useSearchBooksQuery,
  useSearchAuthorsQuery,
  useLazyGlobalSearchQuery, // Useful for search as you type
} = searchApi;
