import { createSlice, PayloadAction } from "@reduxjs/toolkit";

// Définition de l'interface pour un sandwich personnalisé
interface PersonalizedSandwich {
  id: number;
  code: string;
  sandwichName: string;
  sandwichPrice: number;
  garnitures: string[];
  sauces: string[];
}

// Interface pour le panier d'un utilisateur, contenant les sandwichs personnalisés et un compteur
interface CartByUser {
  personalizedSandwiches: PersonalizedSandwich[];
  personalizedCount: number;
}

// État global pour les dépenses, incluant l'utilisateur courant, les paniers par utilisateur et le solde
interface ExpenseState {
  currentUser: string | null;
  carts: { [user: string]: CartByUser };
  balanceUser: number;
}

// État initial de la slice
const initialState: ExpenseState = {
  currentUser: null,
  carts: {},
  balanceUser: 0,
};

export const expenseSlice = createSlice({
  name: "expenseSlice", // Nom de la slice
  initialState, // État initial
  reducers: {
    // Définit l'utilisateur courant et initialise son panier s'il n'existe pas déjà
    setCurrentUser: (state, action: PayloadAction<string>) => {
      state.currentUser = action.payload;
      if (!state.carts[action.payload]) {
        state.carts[action.payload] = {
          personalizedSandwiches: [],
          personalizedCount: 0,
        };
      }
    },
    // Met à jour le solde de l'utilisateur
    setBalanceUser: (state, action: PayloadAction<number>) => {
      state.balanceUser = action.payload;
    },
    // Ajoute un sandwich personnalisé au panier de l'utilisateur courant
    addPersonalizedSandwich: (
      state,
      action: PayloadAction<Omit<PersonalizedSandwich, "id">>,
    ) => {
      if (state.currentUser) {
        const userCart = state.carts[state.currentUser];
        // Incrémente le compteur de sandwichs personnalisés
        userCart.personalizedCount += 1;
        // Crée un nouveau sandwich avec un identifiant unique
        const newSandwich: PersonalizedSandwich = {
          id: userCart.personalizedCount,
          ...action.payload,
        };
        // Ajoute le sandwich au panier
        userCart.personalizedSandwiches.push(newSandwich);
      }
    },
    // Vide le panier de l'utilisateur courant
    clearCart: (state) => {
      if (state.currentUser) {
        state.carts[state.currentUser] = {
          personalizedSandwiches: [],
          personalizedCount: 0,
        };
      }
    },
    // Retire un sandwich du panier à partir de son identifiant
    removeFromCart: (state, action: PayloadAction<{ id?: number }>) => {
      if (state.currentUser && action.payload.id) {
        state.carts[state.currentUser].personalizedSandwiches = state.carts[
          state.currentUser
        ].personalizedSandwiches.filter(
          (sandwich) => sandwich.id !== action.payload.id,
        );
      }
    },
  },
});

// Exportation des actions pour pouvoir les utiliser dans l'application
export const {
  setCurrentUser,
  setBalanceUser,
  addPersonalizedSandwich,
  clearCart,
  removeFromCart,
} = expenseSlice.actions;

export default expenseSlice.reducer;
