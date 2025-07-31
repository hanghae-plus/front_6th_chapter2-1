import { state } from './state.js';
import { DISCOUNT, TIMER } from './constants.js';
import { onUpdateSelectOptions, doUpdatePricesInCart } from './view.js';

export function startTimers(app) {
  const { cartDisp, productSelect, handleCalculateCartStuff } = app;

  const lightningDelay = Math.random() * 10000;
  setTimeout(() => {
    setInterval(function () {
      const luckyIdx = Math.floor(Math.random() * state.products.length);
      const luckyItem = state.products[luckyIdx];
      if (luckyItem.q > 0 && !luckyItem.onSale) {
        luckyItem.val = Math.round(
          luckyItem.originalVal * (1 - DISCOUNT.LIGHTNING_SALE_RATE)
        );
        luckyItem.onSale = true;
        alert('⚡번개세일! ' + luckyItem.name + '이(가) 20% 할인 중입니다!');
        onUpdateSelectOptions(productSelect, state.products);
        doUpdatePricesInCart(cartDisp, state.products, handleCalculateCartStuff);
      }
    }, TIMER.LIGHTNING_SALE_INTERVAL);
  }, lightningDelay);

  setTimeout(function () {
    setInterval(function () {
      if (cartDisp.children.length === 0) {
        return;
      }
      if (state.lastSelected) {
        let suggest = null;
        for (let k = 0; k < state.products.length; k++) {
          if (state.products[k].id !== state.lastSelected) {
            if (state.products[k].q > 0) {
              if (!state.products[k].suggestSale) {
                suggest = state.products[k];
                break;
              }
            }
          }
        }
        if (suggest) {
          alert(
            '💝 ' +
              suggest.name +
              '은(는) 어떠세요? 지금 구매하시면 5% 추가 할인!'
          );
          suggest.val = Math.round(
            suggest.val * (1 - DISCOUNT.RECOMMEND_SALE_RATE)
          );
          suggest.suggestSale = true;
          onUpdateSelectOptions(productSelect, state.products);
          doUpdatePricesInCart(cartDisp, state.products, handleCalculateCartStuff);
        }
      }
    }, TIMER.RECOMMEND_SALE_INTERVAL);
  }, Math.random() * 20000);
}