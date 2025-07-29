/**
 * State Management Index
 * Re-exports all local state stores for easy importing
 */

// Store classes
export { default as ProductStore, updateProductState } from "./ProductStore.js";
export { default as CartStore, updateCartState } from "./CartStore.js";
export { default as UIStore, updateUIState } from "./UIStore.js";

// Convenience exports for backwards compatibility
export const createProductStore = () =>
  import("./ProductStore.js").then((m) => m.default.createInstance());
export const createCartStore = () =>
  import("./CartStore.js").then((m) => m.default.createInstance());
export const createUIStore = () =>
  import("./UIStore.js").then((m) => m.default.createInstance());
