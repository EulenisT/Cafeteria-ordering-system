import { configureStore } from "@reduxjs/toolkit";
import { expenseSlice } from "./expense/expense-slice.ts";

const store = configureStore({
  reducer: {
    EXPENSE: expenseSlice.reducer,
  },
});

export { store };
