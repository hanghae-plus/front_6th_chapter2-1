import { TIMER_DELAYS, DISCOUNT_RATES } from '../constants/shopPolicy.js';

export function startSuggestSale(
  products,
  lastSelectedProduct,
  onUpdate,
  onPriceUpdate
) {
  setTimeout(function () {
    setInterval(function () {
      if (lastSelectedProduct) {
        let suggest = null;

        for (let k = 0; k < products.length; k++) {
          if (products[k].id !== lastSelectedProduct) {
            if (products[k].quantity > 0) {
              if (!products[k].isSuggestSale) {
                suggest = products[k];
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

          suggest.price = Math.round(
            suggest.price * (1 - DISCOUNT_RATES.SUGGEST)
          );
          suggest.isSuggestSale = true;

          onUpdate();
          onPriceUpdate();
        }
      }
    }, TIMER_DELAYS.SUGGEST.INTERVAL);
  }, Math.random() * TIMER_DELAYS.SUGGEST.DELAY_MAX);
}
