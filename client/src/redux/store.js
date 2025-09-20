import { configureStore, combineReducers } from "@reduxjs/toolkit";
import storage from "redux-persist/lib/storage";
import { persistReducer, persistStore } from "redux-persist";

import authReducer from "./slice/authSlice";
import fileReducer from "./slice/fileSlice";

const persistConfig = {
  key: "root",
  storage,
  whitelist: ["auth", "files"], // ✅ only persist auth slice
};

const rootReducer = combineReducers({
  auth: authReducer,
  files: fileReducer,
});

const persistedReducer = persistReducer(persistConfig, rootReducer);

export const store = configureStore({
  reducer: persistedReducer,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: false, // required for redux-persist
    }),
});

export const persistor = persistStore(store);
