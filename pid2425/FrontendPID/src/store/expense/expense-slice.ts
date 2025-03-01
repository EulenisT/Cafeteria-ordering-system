import { createSlice } from "@reduxjs/toolkit";

export const expenseSlice = createSlice({
  name: "expenseSlice",
  initialState: {
    expenseList: [{ name: "", price: "" }],
  },
  reducers: {
    addSandwich: (currentSlice, action) => {
      currentSlice.expenseList.push(action.payload);
    },
    addGarniture: (currentSlice, action) => {
      currentSlice.expenseList.push(action.payload);
    },
    addSauces: (currentSlice, action) => {
      currentSlice.expenseList.push(action.payload);
    },
  },
});

const { addSandwich, addGarniture, addSauces } = expenseSlice.actions;

export { addSandwich, addGarniture, addSauces };
