/**
 * Cart State - React useState-like State Management
 * Simulates React's useState pattern for easier migration
 */

// Initial cart state (like React's useState initial value)
const initialCartState = {
  items: [],
  totalAmount: 0,
  totalItemCount: 0,
};

// Global cart state
let cartState = { ...initialCartState };

// State setter (like React's setState)
const setCartState = (updates) => {
  if (typeof updates === "function") {
    // Support functional updates like setState((prev) => ({ ...prev, newValue }))
    cartState = { ...cartState, ...updates(cartState) };
  } else {
    // Support object updates like setState({ newValue })
    cartState = { ...cartState, ...updates };
  }
};

// State getter (for accessing current state)
const getCartState = () => cartState;

// Individual state updaters (for backward compatibility)
export const setItems = (value) => setCartState({ items: value });
export const setTotalAmount = (value) => setCartState({ totalAmount: value });
export const setTotalItemCount = (value) =>
  setCartState({ totalItemCount: value });

// Individual state getters (for backward compatibility)
export const getItems = () => cartState.items;
export const getTotalAmount = () => cartState.totalAmount;
export const getTotalItemCount = () => cartState.totalItemCount;

// Cart-specific operations
export const addItem = (item) => {
  const updatedItems = [...cartState.items, item];
  setCartState({ items: updatedItems });
};

export const removeItem = (itemId) => {
  const updatedItems = cartState.items.filter((item) => item.id !== itemId);
  setCartState({ items: updatedItems });
};

export const updateItem = (itemId, updates) => {
  const updatedItems = cartState.items.map((item) =>
    item.id === itemId ? { ...item, ...updates } : item
  );
  setCartState({ items: updatedItems });
};

export const findItem = (itemId) => {
  return cartState.items.find((item) => item.id === itemId);
};

// Calculate totals from items
export const calculateTotals = () => {
  const totalItemCount = cartState.items.reduce(
    (sum, item) => sum + item.quantity,
    0
  );
  const totalAmount = cartState.items.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0
  );

  // Update state with calculated values
  setCartState({ totalItemCount, totalAmount });

  return {
    totalItemCount,
    totalAmount,
  };
};

// Check if cart is empty
export const isEmpty = () => cartState.items.length === 0;

// Clear all items
export const clearCart = () => {
  setCartState({ ...initialCartState });
};

// Batch state update (like React's setState with multiple values)
export const updateCartState = (updates) => {
  setCartState(updates);
  return getCartState();
};

// Reset to initial state
export const resetCartState = () => {
  cartState = { ...initialCartState };
};

// useState-like hook simulation (for future React migration)
export const useCartState = () => {
  return [getCartState(), setCartState];
};

// Export state and setter for direct access
export { cartState, setCartState, getCartState };

// Default export for backward compatibility
export default {
  createInstance: () => ({
    getItems,
    setItems,
    addItem,
    removeItem,
    updateItem,
    findItem,
    getTotalAmount,
    setTotalAmount,
    getTotalItemCount,
    setTotalItemCount,
    updateCartState,
    calculateTotals,
    isEmpty,
    clear: clearCart,
    destroyInstance: resetCartState,
  }),
};
