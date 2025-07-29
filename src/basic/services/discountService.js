import { discountStore } from "../store/discountStore.js";
import { DISCOUNT_RATES, QUANTITY_THRESHOLDS } from "../constants/index.js";
import { findProductById, calculateItemDiscount } from "../utils/productUtils.js";

export class DiscountService {
  constructor() {
    this.discountStore = discountStore;
  }

  /**
   * 개별 상품 할인을 계산합니다.
   */
  calculateIndividualDiscounts(cartItems, productList) {
    const individualDiscounts = [];

    cartItems.forEach(cartItem => {
      const product = findProductById(cartItem.id, productList);
      if (!product) return;

      // DOM 요소인지 데이터 객체인지 확인
      let quantity;
      if (cartItem.querySelector) {
        // DOM 요소인 경우
        const qtyElem = cartItem.querySelector(".quantity-number");
        quantity = parseInt(qtyElem.textContent);
      } else {
        // 데이터 객체인 경우
        quantity = cartItem.quantity || 1;
      }

      const discountRate = calculateItemDiscount(cartItem.id, quantity);

      if (discountRate > 0) {
        individualDiscounts.push({
          productId: cartItem.id,
          productName: product.name,
          quantity,
          rate: discountRate,
          amount: product.price * quantity * discountRate,
        });
      }
    });

    this.discountStore.updateIndividualDiscounts(individualDiscounts);
    return individualDiscounts;
  }

  /**
   * 대량구매 할인을 계산합니다.
   */
  calculateBulkDiscount(totalQuantity) {
    let bulkDiscountRate = 0;
    let bulkDiscountApplied = false;

    if (totalQuantity >= QUANTITY_THRESHOLDS.BULK_DISCOUNT) {
      bulkDiscountRate = DISCOUNT_RATES.BULK_PURCHASE;
      bulkDiscountApplied = true;
    }

    this.discountStore.updateBulkDiscount(bulkDiscountRate, bulkDiscountApplied);
    return { rate: bulkDiscountRate, applied: bulkDiscountApplied };
  }

  /**
   * 화요일 특별 할인을 계산합니다.
   */
  calculateTuesdayDiscount() {
    const today = new Date().getDay();
    const isTuesday = today === 2;
    const tuesdayDiscountRate = isTuesday ? DISCOUNT_RATES.TUESDAY_SPECIAL : 0;
    const tuesdayDiscountApplied = isTuesday;

    this.discountStore.updateTuesdayDiscount(tuesdayDiscountRate, tuesdayDiscountApplied);
    return { rate: tuesdayDiscountRate, applied: tuesdayDiscountApplied };
  }

  /**
   * 모든 할인을 적용하여 최종 금액을 계산합니다.
   */
  applyAllDiscounts(cartItems, productList) {
    // cartCalculations.js와 동일한 로직으로 계산
    let totalAmt = 0;
    let itemCnt = 0;
    let subtotal = 0;
    const itemDiscounts = [];

    // 1. 개별 상품 할인 계산
    for (let i = 0; i < cartItems.length; i++) {
      const curItem = findProductById(cartItems[i].id, productList);
      if (!curItem) continue;

      // DOM 요소인지 데이터 객체인지 확인
      let q;
      if (cartItems[i].querySelector) {
        // DOM 요소인 경우
        const qtyElem = cartItems[i].querySelector(".quantity-number");
        q = parseInt(qtyElem.textContent);
      } else {
        // 데이터 객체인 경우
        q = cartItems[i].quantity || 1;
      }

      const itemTot = curItem.price * q;
      itemCnt += q;
      subtotal += itemTot;

      const disc = calculateItemDiscount(curItem.id, q);
      if (disc > 0) {
        itemDiscounts.push({ name: curItem.name, discount: disc * 100 });
      }

      totalAmt += itemTot * (1 - disc);
    }

    // 2. 대량구매 및 화요일 할인 적용
    const originalTotal = subtotal;

    if (itemCnt >= QUANTITY_THRESHOLDS.BULK_PURCHASE) {
      totalAmt = subtotal * DISCOUNT_RATES.BULK_PURCHASE;
    }
    const today = new Date();
    const isTuesday = today.getDay() === 2;

    if (isTuesday && totalAmt > 0) {
      totalAmt = totalAmt * DISCOUNT_RATES.TUESDAY_SPECIAL;
    }

    // 3. DiscountStore 업데이트
    this.discountStore.updateIndividualDiscounts(itemDiscounts);
    this.discountStore.updateBulkDiscount(itemCnt >= QUANTITY_THRESHOLDS.BULK_PURCHASE ? DISCOUNT_RATES.BULK_PURCHASE : 0, itemCnt >= QUANTITY_THRESHOLDS.BULK_PURCHASE);
    this.discountStore.updateTuesdayDiscount(isTuesday ? DISCOUNT_RATES.TUESDAY_SPECIAL : 0, isTuesday);
    this.discountStore.updateSavedAmount(originalTotal - totalAmt);

    return {
      originalAmount: subtotal,
      finalAmount: totalAmt,
      savedAmount: originalTotal - totalAmt,
      individualDiscounts: itemDiscounts,
      bulkDiscount: {
        rate: itemCnt >= QUANTITY_THRESHOLDS.BULK_PURCHASE ? DISCOUNT_RATES.BULK_PURCHASE : 0,
        applied: itemCnt >= QUANTITY_THRESHOLDS.BULK_PURCHASE,
      },
      tuesdayDiscount: {
        rate: isTuesday ? DISCOUNT_RATES.TUESDAY_SPECIAL : 0,
        applied: isTuesday,
      },
    };
  }

  /**
   * 소계를 계산합니다.
   */
  calculateSubtotal(cartItems, productList) {
    return cartItems.reduce((sum, cartItem) => {
      const product = findProductById(cartItem.id, productList);
      if (!product) return sum;

      // DOM 요소인지 데이터 객체인지 확인
      let quantity;
      if (cartItem.querySelector) {
        // DOM 요소인 경우
        const qtyElem = cartItem.querySelector(".quantity-number");
        quantity = parseInt(qtyElem.textContent);
      } else {
        // 데이터 객체인 경우
        quantity = cartItem.quantity || 1;
      }

      return sum + product.price * quantity;
    }, 0);
  }

  /**
   * 상품의 할인율을 계산합니다.
   */
  calculateProductDiscountRate(product) {
    if (!product) return 0;

    const originalPrice = product.originalPrice || product.price;
    const currentPrice = product.price;

    if (originalPrice === currentPrice) return 0;

    return (originalPrice - currentPrice) / originalPrice;
  }

  /**
   * 상품의 할인 상태를 확인합니다.
   */
  getProductDiscountStatus(product) {
    if (!product) return null;

    const discountRate = this.calculateProductDiscountRate(product);

    if (discountRate === 0) return null;

    if (product.onSale && product.suggestSale) {
      return "SUPER SALE";
    } else if (product.onSale) {
      return "SALE";
    } else if (product.suggestSale) {
      return "추천할인";
    }

    return "할인";
  }

  /**
   * 할인 상태를 구독합니다.
   */
  subscribeToChanges(callback) {
    return this.discountStore.subscribe(callback);
  }

  /**
   * 현재 할인 상태를 반환합니다.
   */
  getDiscountState() {
    return this.discountStore.getState();
  }

  /**
   * 할인을 초기화합니다.
   */
  resetDiscounts() {
    this.discountStore.resetDiscounts();
  }
}

export const discountService = new DiscountService();
