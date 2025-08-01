import { IItemDiscount, ICartCalculation } from "../../types";
import { DISCOUNT_RULES } from "../../constants";
import { useProductData } from "../products/productData";
import { isSpecialDiscountDay } from "../../utils/dateUtils";

export const useCartManager = {
  totalAmount: 0,
  itemCount: 0,

  /**
   * 장바구니 총 금액 반환
   * @returns {number} 총 금액
   */
  getTotalAmount() {
    return this.totalAmount;
  },

  /**
   * 장바구니 총 상품 개수 반환
   * @returns {number} 상품 개수
   */
  getItemCount() {
    return this.itemCount;
  },

  /**
   * 장바구니 상태 초기화
   */
  resetCart() {
    this.totalAmount = 0;
    this.itemCount = 0;
  },

  /**
   * 장바구니 총액과 개수 설정 (내부용)
   * @param {number} amount - 총 금액
   * @param {number} count - 상품 개수
   */
  setCartTotals(amount: number, count: number) {
    this.totalAmount = amount;
    this.itemCount = count;
  },

  /**
   * 장바구니 아이템들로부터 총액과 개수 계산
   * @param {HTMLCollection} cartItems - 장바구니 DOM 아이템들
   * @returns {Object} 계산 결과 {subtotal, itemCount, itemDiscounts}
   */
  calculateCartTotals(cartItems: HTMLCollection) {
    let subtotal = 0;
    let itemCount = 0;
    const itemDiscounts: IItemDiscount[] = [];

    for (let i = 0; i < cartItems.length; i += 1) {
      const cartItemElem = cartItems[i] as HTMLElement;
      const product = useProductData.findProductById(cartItemElem.id);

      if (!product) continue;

      const quantityElem = cartItemElem.querySelector(".quantity-number") as HTMLElement;
      const hasQuantityText = !!quantityElem?.textContent;
      if (!hasQuantityText) continue;

      if (!quantityElem.textContent) continue;
      const quantity = parseInt(quantityElem.textContent, 10);
      const itemTotal = product.val * quantity;

      itemCount += quantity;
      subtotal += itemTotal;

      const isDiscountTarget = quantity >= DISCOUNT_RULES.ITEM_DISCOUNT_THRESHOLD;
      const itemDiscountRate = DISCOUNT_RULES.ITEM_DISCOUNT_RATES[product.id] || 0;
      const hasItemDiscount = isDiscountTarget && itemDiscountRate > 0;

      if (hasItemDiscount) {
        itemDiscounts.push({
          name: product.name,
          discount: itemDiscountRate,
        });
      }
    }

    return {
      subtotal,
      itemCount,
      itemDiscounts,
    };
  },

  /**
   * 총 할인율 계산 (대량 구매 할인, 화요일 할인 포함)
   * @param {number} subtotal - 소계
   * @param {number} itemCount - 상품 개수
   * @param {Array} itemDiscounts - 개별 상품 할인 목록
   * @returns {Object} {totalAmount, discountRate, originalTotal}
   */
  calculateFinalAmount(subtotal: number, itemCount: number, itemDiscounts: IItemDiscount[]) {
    let totalAmount = subtotal;
    let discountRate = 0;
    const originalTotal = subtotal;

    if (itemCount < DISCOUNT_RULES.BULK_DISCOUNT_THRESHOLD) {
      itemDiscounts.forEach((item) => {
        const discountAmount = subtotal * (item.discount / 100);
        totalAmount -= discountAmount;
      });
      discountRate = (subtotal - totalAmount) / subtotal;
    }

    if (itemCount >= DISCOUNT_RULES.BULK_DISCOUNT_THRESHOLD) {
      totalAmount = subtotal * (1 - DISCOUNT_RULES.BULK_DISCOUNT_RATE / 100);
      discountRate = DISCOUNT_RULES.BULK_DISCOUNT_RATE / 100;
    }

    const today = new Date();
    const isSpecialDiscount = isSpecialDiscountDay(today);
    if (isSpecialDiscount && totalAmount > 0) {
      totalAmount *= 1 - DISCOUNT_RULES.SPECIAL_DISCOUNT_RATE / 100;
      discountRate = 1 - totalAmount / originalTotal;
    }

    return {
      totalAmount: Math.round(totalAmount),
      discountRate,
      originalTotal,
      isSpecialDiscount,
    };
  },

  /**
   * 장바구니 전체 계산 실행 및 상태 업데이트
   * @param {HTMLCollection} cartItems - 장바구니 DOM 아이템들
   * @returns {Object} 계산 결과
   */
  updateCartCalculation(cartItems: HTMLCollection): ICartCalculation {
    const basicCalculation = this.calculateCartTotals(cartItems);

    const finalCalculation = this.calculateFinalAmount(
      basicCalculation.subtotal,
      basicCalculation.itemCount,
      basicCalculation.itemDiscounts,
    );

    this.setCartTotals(finalCalculation.totalAmount, basicCalculation.itemCount);

    return {
      ...basicCalculation,
      ...finalCalculation,
    };
  },
};
