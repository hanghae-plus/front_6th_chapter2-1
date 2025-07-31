// PromoScheduler: handles timed promotions like Lightning Sale & Suggestion Sale
import AlertService from "./AlertService.js";

/**
 * @param {import('../domain/Product.js').default[]} products
 */
function findRandomProductWithStock(products) {
  const candidates = products.filter((p) => p.stock > 0);
  if (candidates.length === 0) return null;
  return candidates[Math.floor(Math.random() * candidates.length)];
}

export default class PromoScheduler {
  /**
   * @param {import('../domain/Product.js').default[]} products
   * @param {AlertService} alertSvc
   * @param {() => string|null} getLastSelectedId  // callback to know last selected product
   * @param {() => void} onPromotionApplied         // callback after price change (to refresh UI)
   */
  constructor(products, alertSvc, getLastSelectedId, onPromotionApplied) {
    this.products = products;
    this.alertSvc = alertSvc;
    this.getLastSelectedId = getLastSelectedId;
    this.onPromotionApplied = onPromotionApplied;
  }

  start() {
    this.scheduleLightningSale();
    this.scheduleSuggestSale();
  }

  scheduleLightningSale() {
    const delay = Math.random() * 10000;
    setTimeout(() => {
      setInterval(() => {
        const prod = findRandomProductWithStock(this.products);
        if (!prod) return;
        // apply 20% off if not already
        const newPrice = Math.round(prod.originalPrice * 0.8);
        if (prod.salePrice !== newPrice) {
          prod.price = newPrice;
          this.alertSvc.info(
            `⚡번개세일! ${prod.name}이(가) 20% 할인 중입니다!`
          );
          this.onPromotionApplied();
        }
      }, 30000);
    }, delay);
  }

  scheduleSuggestSale() {
    const delay = Math.random() * 20000;
    setTimeout(() => {
      setInterval(() => {
        const lastId = this.getLastSelectedId();
        if (!lastId) return;
        const candidates = this.products.filter(
          (p) => p.id !== lastId && p.stock > 0
        );
        if (candidates.length === 0) return;
        const prod = candidates.find((p) => p.price === p.originalPrice); // not already discounted by suggestion
        if (!prod) return;
        const newPrice = Math.round(prod.price * 0.95);
        prod.price = newPrice;
        this.alertSvc.info(
          `💝 ${prod.name}은(는) 어떠세요? 지금 구매하시면 5% 추가 할인!`
        );
        this.onPromotionApplied();
      }, 60000);
    }, delay);
  }
}
