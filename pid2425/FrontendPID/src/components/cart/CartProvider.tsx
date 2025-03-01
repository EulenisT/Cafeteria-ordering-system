import { createContext, useContext, useState } from "react";

export interface CartItem {
    code: string;
    nom: string;
    prix: number;
    quantity: number;
}

interface CartContextType {
    cart: CartItem[];
    addToCart: (item: CartItem) => void;
    removeFromCart: (code: string) => void;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export function CartProvider({ children }: { children: React.ReactNode }) {
    const [cart, setCart] = useState<CartItem[]>([]);

    const addToCart = (item: CartItem) => {
        setCart((prevCart) => {
            const existingItem = prevCart.find((cartItem) => cartItem.code === item.code);
            if (existingItem) {
                return prevCart.map((cartItem) =>
                    cartItem.code === item.code
                        ? { ...cartItem, quantity: cartItem.quantity + 1 }
                        : cartItem
                );
            } else {
                return [...prevCart, { ...item, quantity: 1 }];
            }
        });
    };

    const removeFromCart = (code: string) => {
        setCart((prevCart) => prevCart.filter((item) => item.code !== code));
    };

    return (
        <CartContext.Provider value={{ cart, addToCart, removeFromCart }}>
            {children}
        </CartContext.Provider>
    );
}

export function useCart() {
    const context = useContext(CartContext);
    if (!context) {
        throw new Error("useCart only in CartProvider");
    }
    return context;
}
