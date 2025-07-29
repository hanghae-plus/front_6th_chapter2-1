import { App } from "./shared/components/App.js";
import { initialProducts } from "./features/product/constants/productConstants.js";

// Simple state imports
import {
  productState,
  setProductState,
} from "./features/product/store/ProductStore.js";
import { cartState, setCartState } from "./features/cart/store/CartStore.js";

// Import stores for backward compatibility
import ProductStore from "./features/product/store/ProductStore.js";
import CartStore from "./features/cart/store/CartStore.js";

import {
  initializeCartService,
  calculateCartTotals,
  updateCartUI,
  renderCartTotalComponent,
} from "./features/cart/services/cartService.js";
import {
  initializePointService,
  calculateAndRenderPoints,
} from "./features/point/services/pointService.js";
import {
  initializeProductService,
  updateProductSelector,
  updateStockInfo,
} from "./features/product/services/productService.js";
import { updateOrderSummary } from "./features/order/services/orderService.js";
import {
  initializeCartPromotion,
  setupFlashSaleTimer,
  setupRecommendationTimer,
} from "./features/cart/services/promotionService.js";
import { registerCartEvents } from "./features/cart/events/cartEventHandler.js";

const main = (callbackFn) => {
  const root = document.getElementById("app");

  // Set initial product data
  setProductState({
    products: initialProducts,
    amount: 0,
    itemCount: 0,
    lastSelectedProduct: null,
  });

  // Make states globally accessible (for services compatibility)
  window.productState = productState;
  window.setProductState = setProductState;
  window.cartState = cartState;
  window.setCartState = setCartState;

  // Backward compatibility - create store instances for existing code
  window.productStore = ProductStore.createInstance();
  window.cartStore = CartStore.createInstance();

  initializeCartService();
  initializePointService();
  initializeProductService();
  initializeCartPromotion();

  const app = App();
  root.appendChild(app.appElement);
  root.appendChild(app.helpModal.toggleButton);
  root.appendChild(app.helpModal.overlay);

  document.addEventListener("click", (event) => {
    const target = event.target;

    if (target.closest(".help-toggle")) {
      app.helpModal.handleToggle();
      return;
    }

    if (
      target.closest(".help-close") ||
      (target.closest(".help-overlay") &&
        event.target.classList.contains("help-overlay"))
    ) {
      app.helpModal.handleClose();
      return;
    }
  });

  callbackFn(app.helpModal);
};

const calculateCart = (callback) => {
  const cartResults = calculateCartTotals();
  updateCartUI(cartResults);
  const pointsResults = calculateAndRenderPoints(cartResults);
  updateOrderSummary(cartResults);
  renderCartTotalComponent(pointsResults);
  updateStockInfo();

  if (callback) {
    callback({
      ...cartResults,
      points: pointsResults.points,
      pointsDetails: pointsResults.details,
    });
  }
};

main((helpModal) => {
  updateProductSelector();
  calculateCart();

  setupFlashSaleTimer();
  setupRecommendationTimer();

  registerCartEvents(calculateCart, updateProductSelector);

  window.addEventListener("cart-updated", () => {
    calculateCart();
  });
});
