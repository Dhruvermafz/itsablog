import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

export const authorApi = createApi({
  reducerPath: "authorApi",
  baseQuery: fetchBaseQuery({
    baseUrl: "http://localhost:5000/api/authors", // adjust
    prepareHeaders: (headers, { getState }) => {
      const token = getState().auth?.token;

      if (token) {
        headers.set("authorization", `Bearer ${token}`);
      }

      return headers;
    },
  }),
  tagTypes: ["Authors", "Author"],
  endpoints: (builder) => ({
    // ========================
    // 📚 PUBLIC
    // ========================

    getAuthors: builder.query({
      query: ({ search = "", page = 1, limit = 10 } = {}) =>
        `/?search=${search}&page=${page}&limit=${limit}`,
      providesTags: ["Authors"],
    }),

    getAuthor: builder.query({
      query: (id) => `/${id}`,
      providesTags: (result, error, id) => [{ type: "Author", id }],
    }),

    // ========================
    // 🔐 CRUD
    // ========================

    createAuthor: builder.mutation({
      query: (data) => ({
        url: "/",
        method: "POST",
        body: data,
      }),
      invalidatesTags: ["Authors"],
    }),

    updateAuthor: builder.mutation({
      query: ({ id, ...data }) => ({
        url: `/${id}`,
        method: "PUT",
        body: data,
      }),
      invalidatesTags: (result, error, { id }) => [
        { type: "Author", id },
        "Authors",
      ],
    }),

    deleteAuthor: builder.mutation({
      query: (id) => ({
        url: `/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: ["Authors"],
    }),

    // ========================
    // ❤️ FOLLOW SYSTEM
    // ========================

    followAuthor: builder.mutation({
      query: (id) => ({
        url: `/${id}/follow`,
        method: "POST",
      }),
      invalidatesTags: (result, error, id) => [{ type: "Author", id }],
    }),

    unfollowAuthor: builder.mutation({
      query: (id) => ({
        url: `/${id}/follow`,
        method: "DELETE",
      }),
      invalidatesTags: (result, error, id) => [{ type: "Author", id }],
    }),
  }),
});

export const {
  useGetAuthorsQuery,
  useGetAuthorQuery,

  useCreateAuthorMutation,
  useUpdateAuthorMutation,
  useDeleteAuthorMutation,

  useFollowAuthorMutation,
  useUnfollowAuthorMutation,
} = authorApi;
