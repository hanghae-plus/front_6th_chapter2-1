// controllers/saleTimers.ts
import { DISCOUNT_RATES, TIMERS } from '../constants/index.js';
import {
  getProducts,
  getLastSelectedProductId,
  updateProduct,
  getCartItems,
} from '../store/state.js';
import { updateCart } from '../services/discount.js';

export function setupSaleTimers(): void {
  setupLightningSale();
  setupRecommendSale();
}

function setupLightningSale(): void {
  const delay = Math.random() * TIMERS.LIGHTNING_SALE_MAX_DELAY;

  setTimeout(() => {
    setInterval(() => {
      const products = getProducts();
      const availableProducts = products.filter((p) => p.stock > 0 && !p.onSale);

      if (availableProducts.length === 0) return;

      const randomProduct =
        availableProducts[Math.floor(Math.random() * availableProducts.length)];
      const newPrice = Math.round(
        randomProduct.originalPrice * (1 - DISCOUNT_RATES.LIGHTNING),
      );

      updateProduct(randomProduct.id, {
        price: newPrice,
        onSale: true,
      });

      alert(`⚡번개세일! ${randomProduct.name}이(가) 20% 할인 중입니다!`);

      updateCart();
    }, TIMERS.LIGHTNING_SALE_INTERVAL);
  }, delay);
}

function setupRecommendSale(): void {
  const delay = Math.random() * TIMERS.RECOMMEND_SALE_MAX_DELAY;

  setTimeout(() => {
    setInterval(() => {
      const cartItems = getCartItems();
      const lastSelectedId = getLastSelectedProductId();

      if (Object.keys(cartItems).length === 0 || !lastSelectedId) return;

      const products = getProducts();
      const recommendableProducts = products.filter(
        (p) => p.id !== lastSelectedId && p.stock > 0 && !p.recommendSale,
      );

      if (recommendableProducts.length === 0) return;

      const recommendProduct = recommendableProducts[0];
      const newPrice = Math.round(
        recommendProduct.price * (1 - DISCOUNT_RATES.RECOMMEND),
      );

      alert(
        `💝 ${recommendProduct.name}은(는) 어떠세요? 지금 구매하시면 5% 추가 할인!`,
      );

      updateProduct(recommendProduct.id, {
        price: newPrice,
        recommendSale: true,
      });

      updateCart();
    }, TIMERS.RECOMMEND_SALE_INTERVAL);
  }, delay);
}