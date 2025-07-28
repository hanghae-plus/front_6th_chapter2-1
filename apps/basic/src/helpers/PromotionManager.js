import { NotificationBar } from '../components/NotificationBar.js';

export class PromotionManager {
  constructor(state, uiUpdater, eventManager) {
    this.state = state;
    this.ui = uiUpdater;
    this.events = eventManager;
  }

  startPromotionTimers() {
    this.startFlashSaleTimer();
    this.startRecommendationTimer();
  }

  startFlashSaleTimer() {
    const delay = Math.random() * 10000;

    setTimeout(() => {
      setInterval(() => {
        this.triggerFlashSale();
      }, 30000);
    }, delay);
  }

  startRecommendationTimer() {
    const delay = Math.random() * 20000;

    setTimeout(() => {
      setInterval(() => {
        this.triggerRecommendation();
      }, 60000);
    }, delay);
  }

  triggerFlashSale() {
    const availableProducts = this.state.productList.filter(
      product => product.q > 0 && !product.onSale
    );

    if (availableProducts.length === 0) return;

    const luckyItem =
      availableProducts[Math.floor(Math.random() * availableProducts.length)];
    luckyItem.val = Math.round((luckyItem.originalVal * 80) / 100);
    luckyItem.onSale = true;

    NotificationBar.generateFlashSaleAlert(luckyItem);
    this.ui.updateProductSelector();
    this.ui.updatePricesInCart();
    this.events.performFullUpdate();
  }

  triggerRecommendation() {
    if (!this.state.lastSelectedProduct) return;

    const availableProducts = this.state.productList.filter(
      product =>
        product.id !== this.state.lastSelectedProduct &&
        product.q > 0 &&
        !product.suggestSale
    );

    if (availableProducts.length === 0) return;

    const suggestedItem = availableProducts[0];
    suggestedItem.val = Math.round((suggestedItem.val * 95) / 100);
    suggestedItem.suggestSale = true;

    NotificationBar.generateRecommendAlert(suggestedItem);
    this.ui.updateProductSelector();
    this.ui.updatePricesInCart();
    this.events.performFullUpdate();
  }
}
