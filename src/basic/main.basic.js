import { App } from "./shared/components/App.js";
import { initialProducts } from "./features/product/constants/productConstants.js";
import ProductStore from "./features/product/store/ProductStore.js";
import CartStore from "./features/cart/store/CartStore.js";

// Feature Services
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

  // Initialize Stores
  window.productStore = ProductStore.createInstance();
  window.cartStore = CartStore.createInstance();

  // Set initial product data
  window.productStore.setProducts(initialProducts);
  window.productStore.setAmount(0);
  window.productStore.setItemCount(0);
  window.productStore.setLastSelectedProduct(null);

  // Initialize all feature services
  initializeCartService();
  initializePointService();
  initializeProductService();
  initializeCartPromotion();

  // Render App
  const app = App();
  root.appendChild(app.appElement);
  root.appendChild(app.helpModal.toggleButton);
  root.appendChild(app.helpModal.overlay);

  // Register HelpModal events directly
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

// Calculate cart function
const calculateCart = (callback) => {
  // 1. Calculate cart totals
  const cartResults = calculateCartTotals();

  // 2. Update UI components
  updateCartUI(cartResults);

  // 3. Calculate and render points
  const pointsResults = calculateAndRenderPoints(cartResults);

  // 4. Update order summary
  updateOrderSummary(cartResults);

  // 5. Render cart total with points
  renderCartTotalComponent(pointsResults);

  // 6. Update stock info
  updateStockInfo();

  // 7. Callback with results
  if (callback) {
    callback({
      ...cartResults,
      points: pointsResults.points,
      pointsDetails: pointsResults.details,
    });
  }
};

main((helpModal) => {
  // Initial setup
  updateProductSelector();
  calculateCart();

  // Setup promotions
  setupFlashSaleTimer();
  setupRecommendationTimer();

  // Register events
  registerCartEvents(calculateCart, updateProductSelector);

  // Listen for cart update events
  window.addEventListener("cart-updated", () => {
    calculateCart();
  });
});
