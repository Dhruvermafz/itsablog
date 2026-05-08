import { configureStore } from "@reduxjs/toolkit";
import { authApi } from "@/api/authApi";
import { userApi } from "@/api/userApi";
import { bookApi } from "@/api/bookApi";
import { authorApi } from "@/api/authorApi";
export const store = configureStore({
  reducer: {
    [authApi.reducerPath]: authApi.reducer,
    [userApi.reducerPath]: userApi.reducer,
    [bookApi.reducerPath]: bookApi.reducer,
    [authorApi.reducerPath]: authorApi.reducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat(
      authApi.middleware,
      userApi.middleware,
      bookApi.middleware,
      authorApi.middleware,
    ),
});
