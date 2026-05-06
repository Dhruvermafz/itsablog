import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

export const bookApi = createApi({
  reducerPath: "bookApi",
  baseQuery: fetchBaseQuery({
    baseUrl: "http://localhost:5000/api/books", // adjust
    prepareHeaders: (headers, { getState }) => {
      const token = getState().auth?.token;

      if (token) {
        headers.set("authorization", `Bearer ${token}`);
      }

      return headers;
    },
  }),
  tagTypes: ["Books", "Book", "Reviews", "Bookmarks"],
  endpoints: (builder) => ({
    // ========================
    // 📚 BOOKS (PUBLIC)
    // ========================

    getBooks: builder.query({
      query: () => "/",
      providesTags: ["Books"],
    }),

    getBook: builder.query({
      query: (id) => `/${id}`,
      providesTags: (result, error, id) => [{ type: "Book", id }],
    }),

    getBooksByCategory: builder.query({
      query: (slug) => `/category/${slug}`,
      providesTags: ["Books"],
    }),

    // ========================
    // 🔐 BOOKS (PROTECTED)
    // ========================

    createBook: builder.mutation({
      query: (data) => ({
        url: "/",
        method: "POST",
        body: data,
      }),
      invalidatesTags: ["Books"],
    }),

    updateBook: builder.mutation({
      query: ({ id, ...data }) => ({
        url: `/${id}`,
        method: "PUT",
        body: data,
      }),
      invalidatesTags: (result, error, { id }) => [
        { type: "Book", id },
        "Books",
      ],
    }),

    deleteBook: builder.mutation({
      query: (id) => ({
        url: `/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: ["Books"],
    }),

    addCategories: builder.mutation({
      query: ({ id, categories }) => ({
        url: `/${id}/categories`,
        method: "POST",
        body: { categories },
      }),
      invalidatesTags: (result, error, { id }) => [{ type: "Book", id }],
    }),

    // ========================
    // ⭐ REVIEWS
    // ========================

    getBookReviews: builder.query({
      query: (bookId) => `/${bookId}/reviews`,
      providesTags: (result, error, bookId) => [
        { type: "Reviews", id: bookId },
      ],
    }),

    createReview: builder.mutation({
      query: ({ bookId, ...data }) => ({
        url: `/${bookId}/reviews`,
        method: "POST",
        body: data,
      }),
      invalidatesTags: (result, error, { bookId }) => [
        { type: "Reviews", id: bookId },
      ],
    }),

    toggleReviewLike: builder.mutation({
      query: (reviewId) => ({
        url: `/reviews/${reviewId}/like`,
        method: "POST",
      }),
      invalidatesTags: ["Reviews"],
    }),

    addReviewComment: builder.mutation({
      query: ({ reviewId, comment }) => ({
        url: `/reviews/${reviewId}/comments`,
        method: "POST",
        body: { comment },
      }),
      invalidatesTags: ["Reviews"],
    }),

    // ========================
    // 🔖 BOOKMARK
    // ========================

    toggleBookmark: builder.mutation({
      query: (id) => ({
        url: `/${id}/bookmark`,
        method: "POST",
      }),
      invalidatesTags: ["Bookmarks", "Book"],
    }),
  }),
});

export const {
  useGetBooksQuery,
  useGetBookQuery,
  useGetBooksByCategoryQuery,

  useCreateBookMutation,
  useUpdateBookMutation,
  useDeleteBookMutation,
  useAddCategoriesMutation,

  useGetBookReviewsQuery,
  useCreateReviewMutation,
  useToggleReviewLikeMutation,
  useAddReviewCommentMutation,

  useToggleBookmarkMutation,
} = bookApi;
