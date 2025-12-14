import React, { createContext, useContext, useState, useEffect } from 'react';

export interface CartItem {
    id: number;
    skuCode: string;
    name: string;
    price: number;
    quantity: number;
}

interface CartContextType {
    items: CartItem[];
    addToCart: (item: CartItem) => void;
    removeFromCart: (id: number) => void;
    clearCart: () => void;
    total: number;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export function CartProvider({ children }: { children: React.ReactNode }) {
    const [items, setItems] = useState<CartItem[]>(() => {
        try {
            const saved = localStorage.getItem('cart');
            const parsed = saved ? JSON.parse(saved) : [];
            return Array.isArray(parsed) ? parsed : [];
        } catch (error) {
            console.error("Failed to access localStorage", error);
            return [];
        }
    });

    useEffect(() => {
        try {
            localStorage.setItem('cart', JSON.stringify(items));
        } catch (error) {
            console.error("Failed to save to localStorage", error);
        }
    }, [items]);

    const addToCart = (newItem: CartItem) => {
        setItems(current => {
            const currentItems = Array.isArray(current) ? current : [];
            const existing = currentItems.find(item => item.id === newItem.id);
            if (existing) {
                return currentItems.map(item =>
                    item.id === newItem.id
                        ? { ...item, quantity: item.quantity + newItem.quantity }
                        : item
                );
            }
            return [...currentItems, newItem];
        });
    };

    const removeFromCart = (id: number) => {
        setItems(current => (Array.isArray(current) ? current : []).filter(item => item.id !== id));
    };

    const clearCart = () => setItems([]);

    const total = (Array.isArray(items) ? items : []).reduce((sum, item) => sum + item.price * item.quantity, 0);

    return (
        <CartContext.Provider value={{ items, addToCart, removeFromCart, clearCart, total }}>
            {children}
        </CartContext.Provider>
    );
}

export const useCart = () => {
    const context = useContext(CartContext);
    if (context === undefined) throw new Error('useCart must be used within a CartProvider');
    return context;
};
