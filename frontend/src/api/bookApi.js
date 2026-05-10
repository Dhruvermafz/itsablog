import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { API_URL } from "@/lib/config";

export const bookApi = createApi({
  reducerPath: "bookApi",
  baseQuery: fetchBaseQuery({
    baseUrl: `${API_URL}/books`,
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
  tagTypes: ["Books", "Book", "Reviews", "Bookmarks"],
  endpoints: (builder) => ({
    // ========================
    // 📚 BOOKS (PUBLIC)
    // ========================

    getBooks: builder.query({
      query: ({ page = 1, limit = 20, search = "", genres = [] } = {}) => ({
        url: "/",
        params: {
          page,
          limit,
          search: search.trim() || undefined,
          genres: genres.length > 0 ? genres.join(",") : undefined,
        },
      }),
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
    // 👤 USER REVIEWS
    // ========================

    getUserReviews: builder.query({
      query: ({ userId, page = 1, limit = 20 }) => ({
        url: `/reviews/user/${userId}`,
        params: {
          page,
          limit,
        },
      }),

      providesTags: (result, error, { userId }) => [
        { type: "Reviews", id: userId },
      ],
    }),
    getBooksByAuthor: builder.query({
      query: ({ authorId, page = 1, limit = 20 }) => ({
        url: `/author/${authorId}`,
        params: {
          page,
          limit,
        },
      }),

      providesTags: ["Books"],
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
  useGetUserReviewsQuery,
  useCreateBookMutation,
  useUpdateBookMutation,
  useDeleteBookMutation,
  useAddCategoriesMutation,
  useGetBooksByAuthorQuery,
  useGetBookReviewsQuery,
  useCreateReviewMutation,
  useToggleReviewLikeMutation,
  useAddReviewCommentMutation,

  useToggleBookmarkMutation,
} = bookApi;
