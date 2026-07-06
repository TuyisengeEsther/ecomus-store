import { createContext, useContext, useEffect, useState } from "react";
import { useAuth } from "./AuthContext";
import {
  getCart,
  addCartItem,
  updateCartItem,
  removeCartItem,
  clearApiCart,
} from "../services/cartService";

const CartContext = createContext();

export function CartProvider({ children }) {
  const { token } = useAuth();

  const [cartItems, setCartItems] = useState(() => {
    return JSON.parse(localStorage.getItem("cart")) || [];
  });

  const [loadingCart, setLoadingCart] = useState(false);

  useEffect(() => {
    if (token) {
      loadCart();
    }
  }, [token]);

  useEffect(() => {
    localStorage.setItem("cart", JSON.stringify(cartItems));
  }, [cartItems]);

  const normalizeCartItems = (cartResponse) => {
    return (
      cartResponse.data?.items ||
      cartResponse.cart?.items ||
      cartResponse.items ||
      []
    );
  };

  const loadCart = async () => {
    try {
      setLoadingCart(true);
      const response = await getCart();
      setCartItems(normalizeCartItems(response));
    } catch (err) {
      console.error("Failed to load cart", err);
    } finally {
      setLoadingCart(false);
    }
  };

  const addToCart = async (product) => {
    const productId = product.id;
    const variantId = product.selectedVariant?.id;
    const quantity = product.quantity || 1;

    if (token && variantId) {
      try {
        await addCartItem({
          productId,
          variantId,
          quantity,
        });

        await loadCart();
        return;
      } catch (err) {
        console.error("Failed to add item to API cart", err);
      }
    }

    setCartItems((prev) => {
      const existing = prev.find((item) => item.id === product.id);

      if (existing) {
        return prev.map((item) =>
          item.id === product.id
            ? { ...item, quantity: item.quantity + quantity }
            : item
        );
      }

      return [...prev, { ...product, quantity }];
    });
  };

  const updateQuantity = async (itemId, quantity) => {
    if (quantity < 1) return;

    if (token) {
      try {
        await updateCartItem(itemId, quantity);
        await loadCart();
        return;
      } catch (err) {
        console.error("Failed to update API cart item", err);
      }
    }

    setCartItems((prev) =>
      prev.map((item) =>
        item.id === itemId ? { ...item, quantity } : item
      )
    );
  };

  const removeFromCart = async (itemId) => {
    if (token) {
      try {
        await removeCartItem(itemId);
        await loadCart();
        return;
      } catch (err) {
        console.error("Failed to remove API cart item", err);
      }
    }

    setCartItems((prev) => prev.filter((item) => item.id !== itemId));
  };

  const clearCart = async () => {
    if (token) {
      try {
        await clearApiCart();
        setCartItems([]);
        return;
      } catch (err) {
        console.error("Failed to clear API cart", err);
      }
    }

    setCartItems([]);
  };

  const total = cartItems.reduce((sum, item) => {
    const price =
      item.product?.price ||
      item.selectedVariant?.price ||
      item.price ||
      0;

    return sum + Number(price) * Number(item.quantity || 1);
  }, 0);

  const cartCount = cartItems.reduce(
    (sum, item) => sum + Number(item.quantity || 1),
    0
  );

  return (
    <CartContext.Provider
      value={{
        cartItems,
        loadingCart,
        addToCart,
        updateQuantity,
        removeFromCart,
        clearCart,
        total,
        cartCount,
        loadCart,
      }}
    >
      {children}
    </CartContext.Provider>
  );
}

export const useCart = () => useContext(CartContext);