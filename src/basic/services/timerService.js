import { TIMERS } from "../constants/index.js";
import { cartService } from "./cartService.js";
import { uiEventBus } from "../core/eventBus.js";
import { discountService } from "./discountService.js";

export class TimerService {
  constructor(productService, cartDisplay) {
    this.productService = productService;
    this.cartDisplay = cartDisplay;
    this.timers = new Map();
  }

  startLightningSaleTimer() {
    const delay = this.getRandomDelay(TIMERS.LIGHTNING_SALE_DELAY);
    const timerId = setTimeout(() => {
      const intervalId = setInterval(() => {
        this.executeLightningSale();
      }, TIMERS.LIGHTNING_SALE_INTERVAL);
      this.timers.set("lightningSale", intervalId);
    }, delay);

    this.timers.set("lightningSaleDelay", timerId);
  }

  startSuggestSaleTimer() {
    const delay = this.getRandomDelay(TIMERS.SUGGEST_SALE_DELAY);
    const timerId = setTimeout(() => {
      const intervalId = setInterval(() => {
        this.executeSuggestSale();
      }, TIMERS.SUGGEST_SALE_INTERVAL);
      this.timers.set("suggestSale", intervalId);
    }, delay);

    this.timers.set("suggestSaleDelay", timerId);
  }

  executeLightningSale() {
    const result = this.productService.applyLightningSale();

    if (result.success) {
      alert(result.message);
      this.updateUI();
    }
  }

  executeSuggestSale() {
    if (this.cartDisplay.children.length === 0) {
      return;
    }

    const lastSelectedProduct = cartService.getLastSelectedProduct();
    if (!lastSelectedProduct) return;

    const result = this.productService.applySuggestSale(lastSelectedProduct);

    if (result.success) {
      alert(result.message);
      this.updateUI();
    }
  }

  updateUI() {
    // 직접 이벤트 발송
    const products = this.productService.getProducts();
    const discountInfos = this.calculateProductDiscountInfos(products);

    uiEventBus.emit("product:options:updated", {
      products,
      discountInfos,
      success: true,
    });

    // 장바구니 가격 업데이트
    const cartItems = Array.from(this.cartDisplay.children);
    if (cartItems.length > 0) {
      this.updateCartPrices(cartItems);
    }
  }

  updateCartPrices(cartItems) {
    const itemsToUpdate = cartItems
      .map(cartItem => {
        const productId = cartItem.id;
        const product = this.productService.getProductById(productId);
        if (product) {
          const discountInfo = {
            rate: discountService.calculateProductDiscountRate(product),
            status: discountService.getProductDiscountStatus(product),
          };
          return { cartItem, product, discountInfo };
        }
        return null;
      })
      .filter(item => item !== null);

    uiEventBus.emit("product:prices:updated", {
      itemsToUpdate,
      success: true,
    });
  }

  calculateProductDiscountInfos(products) {
    return products.map(product => ({
      productId: product.id,
      rate: discountService.calculateProductDiscountRate(product),
      status: discountService.getProductDiscountStatus(product),
    }));
  }

  getRandomDelay(maxDelay) {
    return Math.random() * maxDelay;
  }

  stopAllTimers() {
    this.timers.forEach(timerId => {
      clearTimeout(timerId);
      clearInterval(timerId);
    });
    this.timers.clear();
  }

  stopTimer(timerName) {
    const timerId = this.timers.get(timerName);
    if (timerId) {
      clearTimeout(timerId);
      clearInterval(timerId);
      this.timers.delete(timerName);
    }
  }
}
