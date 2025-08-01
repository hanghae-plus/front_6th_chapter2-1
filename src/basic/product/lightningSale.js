import { render } from '../render.js';

export function startLightningSale(state) {
  const lightningDelay = Math.random() * 10000;

  setTimeout(() => {
    setInterval(() => {
      const availableProducts = state.productList.filter(
        (p) => p.stock > 0 && !p.onSale
      );
      if (availableProducts.length > 0) {
        const luckyIdx = Math.floor(Math.random() * availableProducts.length);
        const luckyItem = availableProducts[luckyIdx];

        luckyItem.price = Math.round((luckyItem.originalPrice * 80) / 100);
        luckyItem.onSale = true;
        alert(`⚡번개세일! ${luckyItem.name}이(가) 20% 할인 중입니다!`);
        render(state);
      }
    }, 30000);
  }, lightningDelay);
}
