import { TIMER_DELAYS, DISCOUNT_RATES } from '../constants/shopPolicy.js';
import { setProduct, getAllProducts } from '../managers/product.js';

export function startLightningSale(onUpdate, onPriceUpdate) {
  const lightningDelay = Math.random() * TIMER_DELAYS.LIGHTNING.DELAY_MAX;

  setTimeout(() => {
    setInterval(function () {
      const allProducts = getAllProducts();
      const luckyIdx = Math.floor(Math.random() * allProducts.length);
      const luckyItem = allProducts[luckyIdx];

      if (luckyItem.quantity > 0 && !luckyItem.isLightningSale) {
        const newPrice = Math.round(
          luckyItem.originalPrice * (1 - DISCOUNT_RATES.LIGHTNING)
        );

        setProduct(luckyItem.id, {
          price: newPrice,
          isLightningSale: true,
        });

        alert(
          `⚡번개세일! ${luckyItem.name}이(가) ${DISCOUNT_RATES.LIGHTNING * 100}% 할인 중입니다!`
        );

        onUpdate();
        onPriceUpdate();
      }
    }, TIMER_DELAYS.LIGHTNING.INTERVAL);
  }, lightningDelay);
}
