import { configureStore } from "@reduxjs/toolkit";
import { postApi } from "../api/postApi";
import { commentApi } from "../api/commentApi";
import { emailApi } from "../api/emailApi";
import { messageApi } from "../api/messageApi";
import { notifyApi } from "../api/notifyApi";
import { adminApi } from "../api/adminApi";
import { userApi } from "../api/userApi";
const store = configureStore({
  reducer: {
    [postApi.reducerPath]: postApi.reducer,
    [commentApi.reducerPath]: commentApi.reducer, // Add the userApi reducer to the store
    [userApi.reducerPath]: userApi.reducer,
    [emailApi.reducerPath]: emailApi.reducer,
    [messageApi.reducerPath]: messageApi.reducer,
    [notifyApi.reducerPath]: notifyApi.reducer,
    [adminApi.reducerPath]: adminApi.reducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat(
      userApi.middleware,
      commentApi.middleware,
      postApi.middleware,
      emailApi.middleware,
      messageApi.middleware,
      notifyApi.middleware,
      adminApi.middleware
    ), // Adding the RTK Query middleware
});

export default store;
