import { TIMER_DELAYS, DISCOUNT_RATES } from '../constants/shopPolicy.js';

export function startLightningSale(products, onUpdate, onPriceUpdate) {
  const lightningDelay = Math.random() * TIMER_DELAYS.LIGHTNING.DELAY_MAX;

  setTimeout(() => {
    setInterval(function () {
      const luckyIdx = Math.floor(Math.random() * products.length);
      const luckyItem = products[luckyIdx];

      if (luckyItem.quantity > 0 && !luckyItem.isLightningSale) {
        luckyItem.price = Math.round(
          luckyItem.originalPrice * (1 - DISCOUNT_RATES.LIGHTNING)
        );
        luckyItem.isLightningSale = true;

        alert(
          `⚡번개세일! ${luckyItem.name}이(가) ${DISCOUNT_RATES.LIGHTNING * 100}% 할인 중입니다!`
        );

        onUpdate();
        onPriceUpdate();
      }
    }, TIMER_DELAYS.LIGHTNING.INTERVAL);
  }, lightningDelay);
}
