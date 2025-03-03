import { createSlice, PayloadAction} from "@reduxjs/toolkit";

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
  saldoUser: number;
}

const initialState: ExpenseState = {
  expenseList: [],
  personalizedSandwiches: [],
  personalizedCount: 0,
  saldoUser: 0,
};

export const expenseSlice = createSlice({
  name: "expenseSlice",
  initialState,
  reducers: {
    setSaldoUser: (state, action: PayloadAction<number>) => {
      state.saldoUser = action.payload;
    },

    addSandwich: (state, action: PayloadAction<AllItem>) => {
      state.expenseList.push(action.payload);
    },

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

    payCart: (state) => {
      const totalGasto =
        state.expenseList.reduce((sum, item) => sum + item.price, 0) +
        state.personalizedSandwiches.reduce(
          (sum, item) => sum + item.sandwichPrice,
          0,
        );

      if (state.saldoUser >= totalGasto) {
        state.saldoUser -= totalGasto;
        state.expenseList = [];
        state.personalizedSandwiches = [];
        state.personalizedCount = 0;
      } else {
        console.warn("Solde insuffisant pour payer");
      }
    },

    removeFromCart: (
      state,
      action: PayloadAction<{ id?: number; name?: string }>,
    ) => {
      if (action.payload.id) {
        state.personalizedSandwiches = state.personalizedSandwiches.filter(
          (sandwich) => sandwich.id !== action.payload.id,
        );
      } else if (action.payload.name) {
        const index = state.expenseList.findIndex(
          (item) => item.name === action.payload.name,
        );
        if (index !== -1) state.expenseList.splice(index, 1);
      }
    },
  },
});

export const {
  addSandwich,
  addPersonalizedSandwich,
  setSaldoUser,
  payCart,
  removeFromCart,
} = expenseSlice.actions;

export default expenseSlice.reducer;
