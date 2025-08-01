/**
 * 계산 서비스
 * 장바구니 총액, 할인, 포인트 등 모든 계산 통합
 */
import type { RootState } from '../core/combinedReducer';
import { calculateCart } from '../../features/cart/services/CartService';
import { calculateTotalPoints } from '../../features/order/services/PointService';
import { cartSelectors } from '../../features/cart/model/selectors';
import { productSelectors } from '../../features/product/model/selectors';

export interface CalculatedTotals {
  itemCount: number;
  totalAmount: number;
  subtotal: number;
  discountInfo: Array<{ name: string; discountPercent: number }>;
  isTuesdaySpecial: boolean;
  bonusPoints: number;
  pointsDetails: string[];
}

// 전체 주문 계산 (총액, 할인, 포인트)
export function calculateTotals(state: RootState): CalculatedTotals {
  const cartItems = cartSelectors.getItems(state.cart);
  const products = productSelectors.getProducts(state.product);

  const getProductById = (id: string) => products.find((p) => p.id === id);

  if (cartItems.length === 0) {
    return {
      itemCount: 0,
      totalAmount: 0,
      subtotal: 0,
      discountInfo: [],
      isTuesdaySpecial: false,
      bonusPoints: 0,
      pointsDetails: [],
    };
  }

  const cartResult = calculateCart(cartItems, getProductById);

  // 포인트 계산
  const pointsResult = calculateTotalPoints(
    cartResult.finalAmount,
    cartResult.totalQuantity,
    cartItems,
    getProductById
  );

  return {
    itemCount: cartResult.totalQuantity,
    totalAmount: cartResult.finalAmount,
    subtotal: cartResult.subtotal,
    discountInfo: cartResult.individualDiscountInfo,
    isTuesdaySpecial: cartResult.isTuesdayToday,
    bonusPoints: pointsResult.finalPoints,
    pointsDetails: pointsResult.pointsDetails || [],
  };
}
