/**
 * Product State - Simple React-like State Management
 */

// Simple state object
export let productState = {
  point: 0,
  amount: 0,
  itemCount: 0,
  lastSelectedProduct: null,
  products: [],
};

// Simple state setter (React-like)
export const setProductState = (updates) => {
  productState = { ...productState, ...updates };
};

// Product-specific operations
export const updateProduct = (productId, updates) => {
  const updatedProducts = productState.products.map((product) =>
    product.id === productId ? { ...product, ...updates } : product
  );
  setProductState({ products: updatedProducts });
};

// Reset state
export const resetProductState = () => {
  productState = {
    point: 0,
    amount: 0,
    itemCount: 0,
    lastSelectedProduct: null,
    products: [],
  };
};

// Backward compatibility only
export default {
  createInstance: () => ({
    getProducts: () => productState.products,
    setProducts: (products) => setProductState({ products }),
    getAmount: () => productState.amount,
    setAmount: (amount) => setProductState({ amount }),
    getItemCount: () => productState.itemCount,
    setItemCount: (itemCount) => setProductState({ itemCount }),
    getPoint: () => productState.point,
    setPoint: (point) => setProductState({ point }),
    getLastSelectedProduct: () => productState.lastSelectedProduct,
    setLastSelectedProduct: (product) =>
      setProductState({ lastSelectedProduct: product }),
    updateProduct,
    updateState: setProductState,
    destroyInstance: resetProductState,
  }),
};
