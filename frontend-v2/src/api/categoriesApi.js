// src/services/categoryApi.js
import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

export const categoryApi = createApi({
  reducerPath: "categoryApi",
  baseQuery: fetchBaseQuery({
    baseUrl: "http://localhost:5000/api/category", // adjust according to your backend route prefix
    prepareHeaders: (headers, { getState }) => {
      const user = localStorage.getItem("user");
      const token = user?.token; // Assuming token is stored in Redux
      if (token) {
        headers.set("Authorization", `Bearer ${token}`);
      }
      return headers;
    },
  }),
  tagTypes: ["Category"],
  endpoints: (builder) => ({
    // Create category (admin only)
    createCategory: builder.mutation({
      query: (newCategory) => ({
        url: "/",
        method: "POST",
        body: newCategory,
      }),
      invalidatesTags: ["Category"],
    }),

    // Get all categories
    getCategories: builder.query({
      query: () => "/",
      providesTags: ["Category"],
    }),

    // Get single category by slug
    getCategory: builder.query({
      query: (slug) => `/${slug}`,
      providesTags: (result, error, slug) => [{ type: "Category", id: slug }],
    }),

    // Update category (admin only)
    updateCategory: builder.mutation({
      query: ({ slug, ...data }) => ({
        url: `/${slug}`,
        method: "PUT",
        body: data,
      }),
      invalidatesTags: (result, error, { slug }) => [
        { type: "Category", id: slug },
        "Category",
      ],
    }),

    // Delete category (admin only)
    deleteCategory: builder.mutation({
      query: (slug) => ({
        url: `/${slug}`,
        method: "DELETE",
      }),
      invalidatesTags: ["Category"],
    }),
  }),
});

// Export hooks for usage in components
export const {
  useCreateCategoryMutation,
  useGetCategoriesQuery,
  useGetCategoryQuery,
  useUpdateCategoryMutation,
  useDeleteCategoryMutation,
} = categoryApi;
