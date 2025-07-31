import { DISCOUNT_RATE_TUESDAY } from '../data/discount.data.js';
import { PRODUCT_LIST } from '../data/product.data.js';
import { getValidCartItemsInfo } from '../utils/cart.util.js';
import { calculateProductDiscount } from '../utils/discount.util.js';
import { useDiscount } from './useDiscount.js';

/**
 * 주문 요약 관련 비즈니스 로직을 관리하는 hook
 */
export const useOrderSummary = cartItemsContainer => {
  if (!cartItemsContainer) {
    return {
      subTotal: 0,
      totalPrice: 0,
      totalDiscountRate: 0,
      totalSavedAmount: 0,
      orderList: [],
      itemDiscounts: [],
      originalTotalPrice: 0,
    };
  }

  const { isBulkDiscount, isTuesday } = useDiscount(cartItemsContainer);

  // 유효한 장바구니 아이템 정보들을 한 번에 추출 (중복 제거)
  const cartItemsInfo = getValidCartItemsInfo(cartItemsContainer, PRODUCT_LIST);

  // 원가 총액 계산
  const originalTotalPrice = cartItemsInfo.reduce((acc, info) => {
    return acc + info.itemTotalPrice;
  }, 0);

  // 소계 (개별 할인 전 가격)
  const subTotal = originalTotalPrice;

  // 개별 할인이 적용된 가격 계산
  const calculateIndividualDiscountedPrice = () => {
    return cartItemsInfo.reduce((acc, info) => {
      const discountRate = calculateProductDiscount(info.product.id, info.quantity);
      const finalPrice = info.itemTotalPrice * (1 - discountRate);
      return acc + finalPrice;
    }, 0);
  };

  // 최종 가격 계산
  let totalPrice;
  if (isBulkDiscount) {
    // 대량구매 할인이 적용되면 개별 할인 무시하고 원가에서 25% 할인
    totalPrice = subTotal * 0.75;
  } else {
    // 개별 할인 적용
    totalPrice = calculateIndividualDiscountedPrice();
  }

  // 화요일 할인 추가 적용
  if (isTuesday && totalPrice > 0) {
    totalPrice = totalPrice * (1 - DISCOUNT_RATE_TUESDAY / 100);
  }

  // 총 할인율 계산
  const totalDiscountRate = subTotal > 0 ? (subTotal - totalPrice) / subTotal : 0;

  // 총 절약 금액
  const totalSavedAmount = originalTotalPrice - totalPrice;

  // 주문 목록 생성 (중복 제거)
  const orderList = cartItemsInfo.map(info => ({
    id: info.product.id,
    name: info.product.name,
    quantity: info.quantity,
    totalPrice: info.itemTotalPrice,
  }));

  // 개별 상품 할인 정보 (중복 제거)
  const itemDiscounts = cartItemsInfo
    .map(info => {
      const discountRate = calculateProductDiscount(info.product.id, info.quantity);

      if (discountRate > 0 && !isBulkDiscount) {
        return {
          name: info.product.name,
          discount: discountRate * 100,
        };
      }

      return null;
    })
    .filter(item => item !== null);

  return {
    subTotal,
    totalPrice,
    totalDiscountRate,
    totalSavedAmount,
    orderList,
    itemDiscounts,
    originalTotalPrice,
  };
};
