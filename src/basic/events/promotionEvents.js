import { products } from '../data/productList.js';
import { DISCOUNT_RATES, TIME_DELAYS } from '../utils/constants.js';
import { updateSelectOptions } from '../utils/updateSelectOptions.js';

export function bindPromotionEvents(sel, cartDisp, stockInfo, sum, getLastSel) {
  const lightningDelay = Math.random() * TIME_DELAYS.LIGHTNING_SALE_MAX;
  setTimeout(() => {
    setInterval(function () {
      const luckyIdx = Math.floor(Math.random() * products.length);
      const luckyItem = products[luckyIdx];
      if (luckyItem.quantity > 0 && !luckyItem.onSale) {
        luckyItem.discountPrice = Math.round(luckyItem.price * (1 - DISCOUNT_RATES.LIGHTNING_SALE_RATE));
        luckyItem.onSale = true;
        alert('⚡번개세일! ' + luckyItem.name + `이(가) ${DISCOUNT_RATES.LIGHTNING_SALE_RATE * 100}% 할인 중입니다!`);
        updateSelectOptions(sel, products);
        if (typeof window.doUpdatePricesInCart === 'function') {
          window.doUpdatePricesInCart(cartDisp, stockInfo, sum);
        }
      }
    }, TIME_DELAYS.LIGHTNING_SALE_INTERVAL);
  }, lightningDelay);

  setTimeout(function () {
    setInterval(function () {
      const lastSel = getLastSel();
      if (lastSel) {
        const suggest = products.find((p) => p.id !== lastSel && p.quantity > 0 && !p.suggestSale);
        if (suggest) {
          alert(
            '💝 ' +
              suggest.name +
              `은(는) 어떠세요? 지금 구매하시면 ${DISCOUNT_RATES.SUGGEST_SALE_RATE * 100}% 추가 할인!`
          );
          suggest.discountPrice = Math.round(suggest.discountPrice * (1 - DISCOUNT_RATES.SUGGEST_SALE_RATE));
          suggest.suggestSale = true;
          updateSelectOptions(sel, products);
          if (typeof window.doUpdatePricesInCart === 'function') {
            window.doUpdatePricesInCart(cartDisp, stockInfo, sum);
          }
        }
      }
    }, TIME_DELAYS.SUGGEST_SALE_INTERVAL);
  }, Math.random() * TIME_DELAYS.SUGGEST_SALE_MAX);
}
