export const cartStore = {
  products: [],
  totalAmount: 0,
  itemCount: 0,
  bonusPoints: 0,
  lastSelectedId: null,
};

export const cartStoreActions = {
  setProducts(products) {
    cartStore.products = products.map(p => ({
      ...p,
      originalQuantity: p.q, // 최초 재고 보존
      quantity: p.q,
    }));
  },

  addToCart(productId, quantity = 1) {
    if (quantity <= 0) return false;

    const product = cartStore.products.find(p => p.id === productId);
    if (!product || product.quantity < quantity) return false;

    product.quantity -= quantity;
    cartStore.itemCount += quantity;
    cartStore.totalAmount += product.val * quantity;
    cartStore.lastSelectedId = productId;

    return true;
  },

  removeFromCart(productId, quantity = 1) {
    if (quantity <= 0) return false;

    const product = cartStore.products.find(p => p.id === productId);
    if (!product) return false;

    product.quantity += quantity;
    cartStore.itemCount -= quantity;
    cartStore.totalAmount -= product.val * quantity;

    return true;
  },

  updateBonusPoints(points) {
    cartStore.bonusPoints = points;
  },

  reset() {
    cartStore.totalAmount = 0;
    cartStore.itemCount = 0;
    cartStore.bonusPoints = 0;
    cartStore.lastSelectedId = null;
    cartStore.products = cartStore.products.map(p => ({
      ...p,
      quantity: p.originalQuantity,
    }));
  },
};
