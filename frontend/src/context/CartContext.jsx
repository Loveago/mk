import { createContext, useContext, useEffect, useMemo, useState } from 'react';

const CartContext = createContext(null);
const STORAGE_KEY = 'mk_cart_items';

const isBrowser = () => typeof window !== 'undefined' && typeof window.localStorage !== 'undefined';

function loadCart() {
  if (!isBrowser()) return [];
  const raw = window.localStorage.getItem(STORAGE_KEY);
  if (!raw) return [];
  try {
    const parsed = JSON.parse(raw);
    if (!Array.isArray(parsed)) return [];
    return parsed.map((item) => ({
      ...item,
      quantity: Number(item.quantity) > 0 ? Number(item.quantity) : 1,
      price: Number(item.price) || 0,
    }));
  } catch (err) {
    return [];
  }
}

export function CartProvider({ children }) {
  const [items, setItems] = useState(() => loadCart());

  useEffect(() => {
    if (!isBrowser()) return;
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(items));
  }, [items]);

  const addItem = (product, quantity = 1) => {
    setItems((prev) => {
      const existing = prev.find((item) => item.id === product.id);
      if (existing) {
        return prev.map((item) =>
          item.id === product.id
            ? { ...item, quantity: item.quantity + (Number(quantity) || 1) }
            : item
        );
      }
      return [
        ...prev,
        {
          ...product,
          price: Number(product.price) || 0,
          quantity: Number(quantity) > 0 ? Number(quantity) : 1,
        },
      ];
    });
  };

  const updateQuantity = (productId, quantity) => {
    const nextQuantity = Number(quantity);
    setItems((prev) =>
      prev
        .map((item) =>
          item.id === productId
            ? { ...item, quantity: nextQuantity > 0 ? nextQuantity : 1 }
            : item
        )
        .filter((item) => item.quantity > 0)
    );
  };

  const removeItem = (productId) => {
    setItems((prev) => prev.filter((item) => item.id !== productId));
  };

  const clearCart = () => setItems([]);

  const totals = useMemo(() => {
    const subtotal = items.reduce((sum, item) => sum + Number(item.price || 0) * item.quantity, 0);
    return { subtotal, total: subtotal };
  }, [items]);

  const value = useMemo(
    () => ({
      items,
      count: items.reduce((sum, item) => sum + item.quantity, 0),
      totals,
      isEmpty: items.length === 0,
      addItem,
      updateQuantity,
      removeItem,
      clearCart,
    }),
    [items, totals]
  );

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}

export function useCart() {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error('useCart must be used within CartProvider');
  return ctx;
}


