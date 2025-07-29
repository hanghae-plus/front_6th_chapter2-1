/**
 * Cart State - Simple React-like State Management
 */

// Simple state object
export let cartState = {
  items: [],
  totalAmount: 0,
  totalItemCount: 0,
};

// Simple state setter (React-like)
export const setCartState = (updates) => {
  cartState = { ...cartState, ...updates };
};

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

  setCartState({ totalItemCount, totalAmount });

  return { totalItemCount, totalAmount };
};

// Reset state
export const resetCartState = () => {
  cartState = {
    items: [],
    totalAmount: 0,
    totalItemCount: 0,
  };
};

// Backward compatibility only
export default {
  createInstance: () => ({
    getItems: () => cartState.items,
    setItems: (items) => setCartState({ items }),
    addItem,
    removeItem,
    updateItem,
    findItem,
    getTotalAmount: () => cartState.totalAmount,
    setTotalAmount: (amount) => setCartState({ totalAmount: amount }),
    getTotalItemCount: () => cartState.totalItemCount,
    setTotalItemCount: (count) => setCartState({ totalItemCount: count }),
    updateCartState: setCartState,
    calculateTotals,
    isEmpty: () => cartState.items.length === 0,
    clear: () => resetCartState(),
    destroyInstance: resetCartState,
  }),
};
