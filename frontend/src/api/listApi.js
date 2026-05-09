import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { API_URL } from "@/lib/config";
export const listApi = createApi({
  reducerPath: "listApi",
  baseQuery: fetchBaseQuery({
    baseUrl: `${API_URL}/lists`, // adjust
    prepareHeaders: (headers, { getState }) => {
      const token = getState().auth?.token;

      if (token) {
        headers.set("authorization", `Bearer ${token}`);
      }

      return headers;
    },
  }),
  tagTypes: ["Lists", "List", "ListItems", "UserLists"],
  endpoints: (builder) => ({
    // ========================
    // 📚 PUBLIC LISTS
    // ========================

    getLists: builder.query({
      query: () => "/",
      providesTags: ["Lists"],
    }),

    getList: builder.query({
      query: (id) => `/${id}`,
      providesTags: (result, error, id) => [{ type: "List", id }],
    }),

    getListItems: builder.query({
      query: (id) => `/${id}/items`,
      providesTags: (result, error, id) => [{ type: "ListItems", id }],
    }),

    // ========================
    // 🔐 LIST MANAGEMENT
    // ========================

    createList: builder.mutation({
      query: (data) => ({
        url: "/",
        method: "POST",
        body: data,
      }),
      invalidatesTags: ["Lists", "UserLists"],
    }),

    updateList: builder.mutation({
      query: ({ id, ...data }) => ({
        url: `/${id}`,
        method: "PUT",
        body: data,
      }),
      invalidatesTags: (result, error, { id }) => [
        { type: "List", id },
        "Lists",
        "UserLists",
      ],
    }),

    deleteList: builder.mutation({
      query: (id) => ({
        url: `/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: ["Lists", "UserLists"],
    }),

    // ========================
    // 📦 ITEMS (BOOKS IN LIST)
    // ========================

    addItem: builder.mutation({
      query: ({ listId, ...data }) => ({
        url: `/${listId}/items`,
        method: "POST",
        body: data,
      }),
      invalidatesTags: (result, error, { listId }) => [
        { type: "ListItems", id: listId },
      ],
    }),

    removeItem: builder.mutation({
      query: ({ listId, bookId }) => ({
        url: `/${listId}/items/${bookId}`,
        method: "DELETE",
      }),
      invalidatesTags: (result, error, { listId }) => [
        { type: "ListItems", id: listId },
      ],
    }),

    // ========================
    // ❤️ LIKE LIST
    // ========================

    toggleLike: builder.mutation({
      query: (listId) => ({
        url: `/${listId}/like`,
        method: "POST",
      }),
      invalidatesTags: (result, error, listId) => [
        { type: "List", id: listId },
        "Lists",
      ],
    }),

    // ========================
    // 👤 USER LISTS
    // ========================

    getMyLists: builder.query({
      query: () => "/user/me",
      providesTags: ["UserLists"],
    }),

    getUserLists: builder.query({
      query: (userId) => `/user/${userId}`,
      providesTags: ["UserLists"],
    }),
  }),
});

export const {
  useGetListsQuery,
  useGetListQuery,
  useGetListItemsQuery,

  useCreateListMutation,
  useUpdateListMutation,
  useDeleteListMutation,

  useAddItemMutation,
  useRemoveItemMutation,

  useToggleLikeMutation,

  useGetMyListsQuery,
  useGetUserListsQuery,
} = listApi;
