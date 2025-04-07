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

// Configuration de la persistance du store avec redux-persist
const persistConfig = {
  key: "root", // Clé racine pour le stockage
  storage, // Utilise le stockage local du navigateur
};

// Création d'un reducer persistant à partir du reducer expense
const persistedReducer = persistReducer(persistConfig, expenseReducer);

// Configuration du store Redux avec le reducer persistant
const store = configureStore({
  reducer: {
    EXPENSE: persistedReducer, // Le state "EXPENSE" utilise le reducer persistant
  },
  middleware: (getDefaultMiddleware) =>
    // Configure les middlewares en ignorant certaines actions non sérialisables
    getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: [FLUSH, REHYDRATE, PAUSE, PERSIST, PURGE, REGISTER],
      },
    }),
});

// Création du persistor pour contrôler la persistance du store
const persistor = persistStore(store);

// Définition du type RootState pour l'ensemble du state du store
export type RootState = ReturnType<typeof store.getState>;

export { store, persistor };
