/**
 * Product State - React useState-like State Management
 * Simulates React's useState pattern for easier migration
 */

// Initial product state (like React's useState initial value)
const initialProductState = {
  point: 0,
  amount: 0,
  itemCount: 0,
  lastSelectedProduct: null,
  products: [],
};

// Global product state
let productState = { ...initialProductState };

// State setter (like React's setState)
const setProductState = (updates) => {
  if (typeof updates === "function") {
    // Support functional updates like setState((prev) => ({ ...prev, newValue }))
    productState = { ...productState, ...updates(productState) };
  } else {
    // Support object updates like setState({ newValue })
    productState = { ...productState, ...updates };
  }
};

// State getter (for accessing current state)
const getProductState = () => productState;

// Individual state updaters (for backward compatibility)
export const setPoint = (value) => setProductState({ point: value });
export const setAmount = (value) => setProductState({ amount: value });
export const setItemCount = (value) => setProductState({ itemCount: value });
export const setLastSelectedProduct = (value) =>
  setProductState({ lastSelectedProduct: value });
export const setProducts = (value) => setProductState({ products: value });

// Individual state getters (for backward compatibility)
export const getPoint = () => productState.point;
export const getAmount = () => productState.amount;
export const getItemCount = () => productState.itemCount;
export const getLastSelectedProduct = () => productState.lastSelectedProduct;
export const getProducts = () => productState.products;

// Product-specific operations
export const updateProduct = (productId, updates) => {
  const updatedProducts = productState.products.map((product) =>
    product.id === productId ? { ...product, ...updates } : product
  );
  setProductState({ products: updatedProducts });
};

// Batch state update (like React's setState with multiple values)
export const updateProductState = (updates) => {
  setProductState(updates);
  return getProductState();
};

// Reset to initial state
export const resetProductState = () => {
  productState = { ...initialProductState };
};

// useState-like hook simulation (for future React migration)
export const useProductState = () => {
  return [getProductState(), setProductState];
};

// Export state and setter for direct access
export { productState, setProductState, getProductState };

// Default export for backward compatibility
export default {
  createInstance: () => ({
    getPoint,
    setPoint,
    getAmount,
    setAmount,
    getItemCount,
    setItemCount,
    getLastSelectedProduct,
    setLastSelectedProduct,
    getProducts,
    setProducts,
    updateProduct,
    updateState: updateProductState,
    destroyInstance: resetProductState,
  }),
};
