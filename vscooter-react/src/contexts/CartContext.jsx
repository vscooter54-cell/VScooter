import { createContext, useContext, useState, useEffect } from 'react';
import { cartAPI } from '../services/api';
import { useAuth } from './AuthContext';

const CartContext = createContext();

export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
};

export const CartProvider = ({ children }) => {
  const { isAuthenticated } = useAuth();
  const [cart, setCart] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Load cart when authenticated
  useEffect(() => {
    if (isAuthenticated) {
      loadCart();
    } else {
      // Load guest cart from localStorage
      const guestCart = JSON.parse(localStorage.getItem('guestCart') || 'null');
      setCart(guestCart);
    }
  }, [isAuthenticated]);

  const loadCart = async () => {
    try {
      setLoading(true);
      const response = await cartAPI.getCart();
      setCart(response.data.data);
    } catch (err) {
      console.error('Error loading cart:', err);
      setError(err.response?.data?.message || 'Failed to load cart');
    } finally {
      setLoading(false);
    }
  };

  const addToCart = async (productId, quantity = 1) => {
    try {
      setError(null);

      if (isAuthenticated) {
        const response = await cartAPI.addToCart({ productId, quantity });
        setCart(response.data.data);
      } else {
        // Guest cart - store in localStorage
        const guestCart = JSON.parse(localStorage.getItem('guestCart') || '[]');
        const existingItem = guestCart.find(item => item.productId === productId);

        if (existingItem) {
          existingItem.quantity += quantity;
        } else {
          guestCart.push({ productId, quantity });
        }

        localStorage.setItem('guestCart', JSON.stringify(guestCart));
        setCart({ items: guestCart });
      }

      return { success: true };
    } catch (err) {
      const errorMessage = err.response?.data?.message || 'Failed to add to cart';
      setError(errorMessage);
      return { success: false, error: errorMessage };
    }
  };

  const updateQuantity = async (productId, quantity) => {
    try {
      setError(null);

      if (isAuthenticated) {
        const response = await cartAPI.updateCartItem(productId, { quantity });
        setCart(response.data.data);
      } else {
        // Guest cart
        const guestCart = JSON.parse(localStorage.getItem('guestCart') || '[]');
        const item = guestCart.find(item => item.productId === productId);

        if (item) {
          item.quantity = quantity;
          localStorage.setItem('guestCart', JSON.stringify(guestCart));
          setCart({ items: guestCart });
        }
      }

      return { success: true };
    } catch (err) {
      const errorMessage = err.response?.data?.message || 'Failed to update cart';
      setError(errorMessage);
      return { success: false, error: errorMessage };
    }
  };

  const removeFromCart = async (productId) => {
    try {
      setError(null);

      if (isAuthenticated) {
        const response = await cartAPI.removeFromCart(productId);
        setCart(response.data.data);
      } else {
        // Guest cart
        const guestCart = JSON.parse(localStorage.getItem('guestCart') || '[]');
        const filtered = guestCart.filter(item => item.productId !== productId);
        localStorage.setItem('guestCart', JSON.stringify(filtered));
        setCart({ items: filtered });
      }

      return { success: true };
    } catch (err) {
      const errorMessage = err.response?.data?.message || 'Failed to remove from cart';
      setError(errorMessage);
      return { success: false, error: errorMessage };
    }
  };

  const clearCart = async () => {
    try {
      setError(null);

      if (isAuthenticated) {
        await cartAPI.clearCart();
        setCart(null);
      } else {
        localStorage.removeItem('guestCart');
        setCart(null);
      }

      return { success: true };
    } catch (err) {
      const errorMessage = err.response?.data?.message || 'Failed to clear cart';
      setError(errorMessage);
      return { success: false, error: errorMessage };
    }
  };

  const applyCoupon = async (code) => {
    try {
      setError(null);
      const response = await cartAPI.applyCoupon(code);
      setCart(response.data.data);
      return { success: true, data: response.data.data };
    } catch (err) {
      const errorMessage = err.response?.data?.message || 'Invalid coupon code';
      setError(errorMessage);
      return { success: false, error: errorMessage };
    }
  };

  const removeCoupon = async () => {
    try {
      setError(null);
      const response = await cartAPI.removeCoupon();
      setCart(response.data.data);
      return { success: true };
    } catch (err) {
      const errorMessage = err.response?.data?.message || 'Failed to remove coupon';
      setError(errorMessage);
      return { success: false, error: errorMessage };
    }
  };

  const getCartCount = () => {
    if (!cart || !cart.items) return 0;
    return cart.items.reduce((total, item) => total + item.quantity, 0);
  };

  const getCartTotal = () => {
    return cart?.calculations?.total || 0;
  };

  const value = {
    cart,
    loading,
    error,
    cartCount: getCartCount(),
    cartTotal: getCartTotal(),
    addToCart,
    updateQuantity,
    removeFromCart,
    clearCart,
    applyCoupon,
    removeCoupon,
    refreshCart: loadCart,
  };

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
};

export default CartContext;
