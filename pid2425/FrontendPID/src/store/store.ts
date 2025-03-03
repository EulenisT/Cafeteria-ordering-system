import { configureStore } from "@reduxjs/toolkit";
import expenseReducer from "./expense/expense-slice.ts";
import storage from "redux-persist/lib/storage";
import {
  persistStore,
  persistReducer,
  FLUSH,
  REHYDRATE,
  PAUSE,
  PERSIST,
  PURGE,
  REGISTER,
} from "redux-persist";

// Configuración de persistencia
const persistConfig = {
  key: "root",
  storage, //(localStorage)
};

const persistedReducer = persistReducer(persistConfig, expenseReducer);

const store = configureStore({
  reducer: {
    EXPENSE: persistedReducer, // Ahora este reducer tiene persistencia
  },
  middleware: (getDefaultMiddleware) =>
      getDefaultMiddleware({
        serializableCheck: {
          ignoredActions: [FLUSH, REHYDRATE, PAUSE, PERSIST, PURGE, REGISTER],
        },
      }),
});

const persistor = persistStore(store);

export type RootState = ReturnType<typeof store.getState>;

export { store, persistor };
