import {
  TIMER_DELAYS,
  DISCOUNT_RATES,
  STOCK_THRESHOLDS,
} from '../constants/shopPolicy.js';
import { setProduct, getAllProducts } from '../managers/product.js';
import { getSelectedProduct } from '../managers/selectedProduct.js';
import { handlePriceUpdate } from '../handlers/cartHandlers.js';

function onUpdateSelectOptions() {
  const productSelect = document.getElementById('product-select');
  if (productSelect && productSelect.updateOptions) {
    productSelect.updateOptions(STOCK_THRESHOLDS);
  }
}

export function startLightningSale() {
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

        onUpdateSelectOptions();
        handlePriceUpdate();
      }
    }, TIMER_DELAYS.LIGHTNING.INTERVAL);
  }, lightningDelay);
}

export function startSuggestSale() {
  setTimeout(function () {
    setInterval(function () {
      const selectedProductId = getSelectedProduct();
      if (selectedProductId) {
        let suggest = null;

        const allProducts = getAllProducts();
        for (let k = 0; k < allProducts.length; k++) {
          if (allProducts[k].id !== selectedProductId) {
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

          onUpdateSelectOptions();
          handlePriceUpdate();
        }
      }
    }, TIMER_DELAYS.SUGGEST.INTERVAL);
  }, Math.random() * TIMER_DELAYS.SUGGEST.DELAY_MAX);
}
