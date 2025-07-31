import { SUGGEST_SALE_DISCOUNT, SUGGEST_SALE_INTERVAL, SUGGEST_DELAY_RANGE } from '../constants.js';

export class SuggestSaleService {
  constructor(productList, productState, doUpdatePricesInCart) {
    this.productList = productList;
    this.productState = productState;
    this.doUpdatePricesInCart = doUpdatePricesInCart;
    this.suggestSaleInterval = null;
    this.suggestSaleTimeout = null;
  }

  startSuggestSaleTimer() {
    this.suggestSaleTimeout = setTimeout(() => {
      this.suggestSaleInterval = setInterval(() => {
        this.triggerSuggestSale();
      }, SUGGEST_SALE_INTERVAL);
    }, Math.random() * SUGGEST_DELAY_RANGE);
  }

  triggerSuggestSale() {
    if (this.productState.selectedProduct) {
      const suggest = this.productList.find(
        (product) =>
          product.id !== this.productState.selectedProduct && product.q > 0 && !product.suggestSale
      );

      if (suggest) {
        alert(
          `💝 ${suggest.name} 은(는) 어떠세요? 지금 구매하시면 ${SUGGEST_SALE_DISCOUNT}% 추가 할인!`
        );
        suggest.val = Math.round((suggest.val * (100 - SUGGEST_SALE_DISCOUNT)) / 100);
        suggest.suggestSale = true;
        this.doUpdatePricesInCart();
      }
    }
  }

  stopSuggestSaleTimer() {
    if (this.suggestSaleTimeout) {
      clearTimeout(this.suggestSaleTimeout);
      this.suggestSaleTimeout = null;
    }

    if (this.suggestSaleInterval) {
      clearInterval(this.suggestSaleInterval);
      this.suggestSaleInterval = null;
    }
  }

  // 추천할인 상태 초기화
  resetSuggestSale() {
    this.productList.forEach((product) => {
      if (product.suggestSale) {
        product.val = product.originalVal;
        product.suggestSale = false;
      }
    });
  }
}
