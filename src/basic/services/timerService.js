import { TIMERS } from "../constants/index.js";
import { cartService } from "./cartService.js";

export class TimerService {
  constructor(productService, onUpdateSelectOptions, doUpdatePricesInCart, cartDisplay) {
    this.productService = productService;
    this.onUpdateSelectOptions = onUpdateSelectOptions;
    this.doUpdatePricesInCart = doUpdatePricesInCart;
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
      console.log("cartDisplay 길이가 0입니다.");
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
    this.onUpdateSelectOptions();
    this.doUpdatePricesInCart();
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
