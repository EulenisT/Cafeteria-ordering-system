import { createSlice, PayloadAction } from "@reduxjs/toolkit";

interface PersonalizedSandwich {
  id: number;
  sandwichName: string;
  sandwichPrice: number;
  garnitures: string[];
  sauces: string[];
}

interface CartByUser {
  personalizedSandwiches: PersonalizedSandwich[];
  personalizedCount: number;
}

interface ExpenseState {
  currentUser: string | null;
  carts: { [user: string]: CartByUser };
  balanceUser: number;
}

const initialState: ExpenseState = {
  currentUser: null,
  carts: {},
  balanceUser: 0,
};

export const expenseSlice = createSlice({
  name: "expenseSlice",
  initialState,
  reducers: {
    // Al establecer el usuario actual, se inicializa su carrito si no existe.
    setCurrentUser: (state, action: PayloadAction<string>) => {
      state.currentUser = action.payload;
      if (!state.carts[action.payload]) {
        state.carts[action.payload] = { personalizedSandwiches: [], personalizedCount: 0 };
      }
    },
    setBalanceUser: (state, action: PayloadAction<number>) => {
      state.balanceUser = action.payload;
    },
    addPersonalizedSandwich: (
        state,
        action: PayloadAction<Omit<PersonalizedSandwich, "id">>
    ) => {
      if (state.currentUser) {
        const userCart = state.carts[state.currentUser];
        userCart.personalizedCount += 1;
        const newSandwich: PersonalizedSandwich = {
          id: userCart.personalizedCount,
          ...action.payload,
        };
        userCart.personalizedSandwiches.push(newSandwich);
      }
    },
    clearCart: (state) => {
      if (state.currentUser) {
        state.carts[state.currentUser] = { personalizedSandwiches: [], personalizedCount: 0 };
      }
    },
    removeFromCart: (state, action: PayloadAction<{ id?: number }>) => {
      if (state.currentUser && action.payload.id) {
        state.carts[state.currentUser].personalizedSandwiches =
            state.carts[state.currentUser].personalizedSandwiches.filter(
                (sandwich) => sandwich.id !== action.payload.id,
            );
      }
    },
  },
});

export const {
  setCurrentUser,
  setBalanceUser,
  addPersonalizedSandwich,
  clearCart,
  removeFromCart,
} = expenseSlice.actions;

export default expenseSlice.reducer;
