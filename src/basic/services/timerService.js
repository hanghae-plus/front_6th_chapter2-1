import { DISCOUNT_RATES, TIMERS } from "../constants/index.js";

export class TimerService {
  constructor(productList, onUpdateSelectOptions, doUpdatePricesInCart) {
    this.productList = productList;
    this.onUpdateSelectOptions = onUpdateSelectOptions;
    this.doUpdatePricesInCart = doUpdatePricesInCart;
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

  startSuggestSaleTimer(appState) {
    const delay = this.getRandomDelay(TIMERS.SUGGEST_SALE_DELAY);
    const timerId = setTimeout(() => {
      const intervalId = setInterval(() => {
        this.executeSuggestSale(appState);
      }, TIMERS.SUGGEST_SALE_INTERVAL);
      this.timers.set("suggestSale", intervalId);
    }, delay);

    this.timers.set("suggestSaleDelay", timerId);
  }

  executeLightningSale() {
    const luckyProduct = this.selectRandomAvailableProduct();

    if (luckyProduct && !luckyProduct.onSale) {
      this.applyLightningSaleDiscount(luckyProduct);
      this.notifyLightningSale(luckyProduct);
      this.updateUI();
    }
  }

  executeSuggestSale(appState) {
    const cartDisplay = appState.getCartDisplay();
    if (cartDisplay.children.length === 0) {
      console.log("cartDisplay 길이가 0입니다.");
      return;
    }

    const lastSelectedProduct = appState.getLastSelectedProduct();
    if (!lastSelectedProduct) return;

    const suggestedProduct = this.findSuggestionProduct(lastSelectedProduct);

    if (suggestedProduct) {
      this.applySuggestSaleDiscount(suggestedProduct);
      this.notifySuggestSale(suggestedProduct);
      this.updateUI();
    }
  }

  selectRandomAvailableProduct() {
    const availableProducts = this.productList.filter(product => product.quantity > 0 && !product.onSale);

    if (availableProducts.length === 0) return null;

    const randomIndex = Math.floor(Math.random() * availableProducts.length);
    return availableProducts[randomIndex];
  }

  findSuggestionProduct(lastSelectedProductId) {
    return this.productList.find(product => product.id !== lastSelectedProductId && product.quantity > 0 && !product.suggestSale);
  }

  applyLightningSaleDiscount(product) {
    product.price = Math.round(product.originalPrice * DISCOUNT_RATES.LIGHTNING_SALE);
    product.onSale = true;
  }

  applySuggestSaleDiscount(product) {
    product.price = Math.round(product.price * DISCOUNT_RATES.SUGGEST_SALE);
    product.suggestSale = true;
  }

  notifyLightningSale(product) {
    alert(`⚡번개세일! ${product.name}이(가) 20% 할인 중입니다!`);
  }

  notifySuggestSale(product) {
    alert(`💝 ${product.name}은(는) 어떠세요? 지금 구매하시면 5% 추가 할인!`);
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
