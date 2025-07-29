import { TIMER_DELAYS, DISCOUNT_RATES } from '../constants/shopPolicy.js';
import { setProduct, getAllProducts } from '../managers/product.js';

export function startSuggestSale(
  lastSelectedProduct,
  onUpdate,
  onPriceUpdate
) {
  setTimeout(function () {
    setInterval(function () {
      if (lastSelectedProduct) {
        let suggest = null;

        const allProducts = getAllProducts();
        for (let k = 0; k < allProducts.length; k++) {
          if (allProducts[k].id !== lastSelectedProduct) {
            if (allProducts[k].quantity > 0) {
              if (!allProducts[k].isSuggestSale) {
                suggest = allProducts[k];
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

          const newPrice = Math.round(
            suggest.price * (1 - DISCOUNT_RATES.SUGGEST)
          );

          setProduct(suggest.id, {
            price: newPrice,
            isSuggestSale: true,
          });

          onUpdate();
          onPriceUpdate();
        }
      }
    }, TIMER_DELAYS.SUGGEST.INTERVAL);
  }, Math.random() * TIMER_DELAYS.SUGGEST.DELAY_MAX);
}
