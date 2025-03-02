import { createSlice, PayloadAction } from "@reduxjs/toolkit";

interface AllItem {
  name: string;
  price: number;
}

interface PersonalizedSandwich {
  id: number;
  sandwichName: string;
  sandwichPrice: number;
  garnitures: string[];
  sauces: string[];
}

interface ExpenseState {
  expenseList: AllItem[];
  personalizedSandwiches: PersonalizedSandwich[];
  personalizedCount: number;
}

const initialState: ExpenseState = {
  expenseList: [],
  personalizedSandwiches: [],
  personalizedCount: 0,
};

export const expenseSlice = createSlice({
  name: "expenseSlice",
  initialState,
  reducers: {
    addSandwich: (state, action) => {
      state.expenseList.push(action.payload);
    },
    // addSandwichChoice: (state, action: PayloadAction<AllItem>) => {
    //   state.expenseList.push(action.payload);
    // },
    // addGarniture: (state, action: PayloadAction<AllItem>) => {
    //   state.expenseList.push(action.payload);
    // },
    // addSauces: (state, action: PayloadAction<AllItem>) => {
    //   state.expenseList.push(action.payload);
    // },
    addPersonalizedSandwich: (
      state,
      action: PayloadAction<Omit<PersonalizedSandwich, "id">>,
    ) => {
      state.personalizedCount += 1;
      const newSandwich: PersonalizedSandwich = {
        id: state.personalizedCount,
        ...action.payload,
      };
      state.personalizedSandwiches.push(newSandwich);
    },
  },
});

export const {
  addSandwich,
  // addSandwichChoice,
  // addGarniture,
  // addSauces,
  addPersonalizedSandwich,
} = expenseSlice.actions;

export default expenseSlice.reducer;
