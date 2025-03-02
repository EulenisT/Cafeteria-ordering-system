import { configureStore } from "@reduxjs/toolkit";
import { expenseSlice } from "./expense/expense-slice.ts";

const store = configureStore({
  reducer: {
    EXPENSE: expenseSlice.reducer,
  },
});

// Exportar tipos para Redux
export type RootState = ReturnType<typeof store.getState>;
// export type AppDispatch = typeof store.dispatch;

export { store };
