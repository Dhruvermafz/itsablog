import { configureStore } from "@reduxjs/toolkit";
import { authApi } from "@/api/authApi";
import { userApi } from "@/api/userApi";
import { bookApi } from "@/api/bookApi";
import { authorApi } from "@/api/authorApi";
import { listApi } from "@/api/listApi";
import { clubApi } from "@/api/clubApi";
import { searchApi } from "@/api/searchApi";
export const store = configureStore({
  reducer: {
    [authApi.reducerPath]: authApi.reducer,
    [userApi.reducerPath]: userApi.reducer,
    [bookApi.reducerPath]: bookApi.reducer,
    [listApi.reducerPath]: listApi.reducer,
    [authorApi.reducerPath]: authorApi.reducer,
    [clubApi.reducerPath]: clubApi.reducer,
    [searchApi.reducerPath]: searchApi.reducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat(
      authApi.middleware,
      userApi.middleware,
      bookApi.middleware,
      authorApi.middleware,
      listApi.middleware,
      clubApi.middleware,
      searchApi.middleware,
    ),
});
