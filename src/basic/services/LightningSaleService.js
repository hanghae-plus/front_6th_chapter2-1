import {
  LIGHTNING_SALE_DISCOUNT,
  LIGHTNING_SALE_INTERVAL,
  LIGHTNING_DELAY_RANGE,
} from '../constants.js';

export class LightningSaleService {
  constructor(productList, doUpdatePricesInCart) {
    this.productList = productList;
    this.doUpdatePricesInCart = doUpdatePricesInCart;
    this.lightningSaleInterval = null;
    this.lightningSaleTimeout = null;
  }

  startLightningSaleTimer() {
    const lightningDelay = Math.random() * LIGHTNING_DELAY_RANGE;

    this.lightningSaleTimeout = setTimeout(() => {
      this.lightningSaleInterval = setInterval(() => {
        this.triggerLightningSale();
      }, LIGHTNING_SALE_INTERVAL);
    }, lightningDelay);
  }

  triggerLightningSale() {
    const luckyIdx = Math.floor(Math.random() * this.productList.length);
    const luckyItem = this.productList[luckyIdx];

    if (luckyItem.q > 0 && !luckyItem.onSale) {
      luckyItem.val = Math.round((luckyItem.originalVal * (100 - LIGHTNING_SALE_DISCOUNT)) / 100);
      luckyItem.onSale = true;

      alert(`⚡번개세일! ${luckyItem.name} 이(가) ${LIGHTNING_SALE_DISCOUNT}% 할인 중입니다!`);

      this.doUpdatePricesInCart();
    }
  }

  stopLightningSaleTimer() {
    if (this.lightningSaleTimeout) {
      clearTimeout(this.lightningSaleTimeout);
      this.lightningSaleTimeout = null;
    }

    if (this.lightningSaleInterval) {
      clearInterval(this.lightningSaleInterval);
      this.lightningSaleInterval = null;
    }
  }

  // 번개세일 상태 초기화
  resetLightningSale() {
    this.productList.forEach((product) => {
      if (product.onSale) {
        product.val = product.originalVal;
        product.onSale = false;
      }
    });
  }
}
