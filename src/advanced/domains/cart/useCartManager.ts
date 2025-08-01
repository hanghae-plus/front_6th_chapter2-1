import { useState, useCallback } from "react";
import { ICartItem, IItemDiscount, ICartCalculation } from "./types";
import { DISCOUNT_RULES } from "../discounts/constants";
import { isSpecialDiscountDay } from "../../utils/dateUtils";

/**
 * Cart 도메인 - 장바구니 관리 훅
 *
 * 기존 useCartManager 객체를 React 훅으로 변환
 * - useState로 장바구니 상태 관리
 * - useCallback으로 메서드 최적화
 * - 불변성 업데이트 패턴 적용
 */
export function useCartManager() {
  const [cartItems, setCartItems] = useState<ICartItem[]>([]);
  const [totalAmount, setTotalAmount] = useState(0);
  const [itemCount, setItemCount] = useState(0);

  /**
   * 장바구니 총 금액 반환
   * @returns {number} 총 금액
   */
  const getTotalAmount = useCallback((): number => {
    return totalAmount;
  }, [totalAmount]);

  /**
   * 장바구니 총 상품 개수 반환
   * @returns {number} 상품 개수
   */
  const getItemCount = useCallback((): number => {
    return itemCount;
  }, [itemCount]);

  /**
   * 장바구니 상태 초기화
   */
  const resetCart = useCallback(() => {
    setCartItems([]);
    setTotalAmount(0);
    setItemCount(0);
  }, []);

  /**
   * 장바구니에 상품 추가
   * @param {ICartItem} item - 추가할 장바구니 아이템
   */
  const addToCart = useCallback((item: ICartItem) => {
    setCartItems((prev) => {
      const existingIndex = prev.findIndex((cartItem) => cartItem.id === item.id);

      if (existingIndex >= 0) {
        // 기존 아이템 수량 증가
        return prev.map((cartItem, index) =>
          index === existingIndex ? { ...cartItem, quantity: cartItem.quantity + item.quantity } : cartItem,
        );
      } else {
        // 새 아이템 추가
        return [...prev, item];
      }
    });
  }, []);

  /**
   * 장바구니에서 상품 제거
   * @param {string} productId - 제거할 상품 ID
   */
  const removeFromCart = useCallback((productId: string) => {
    setCartItems((prev) => prev.filter((item) => item.id !== productId));
  }, []);

  /**
   * 장바구니 아이템 수량 변경
   * @param {string} productId - 상품 ID
   * @param {number} newQuantity - 새로운 수량
   */
  const updateQuantity = useCallback(
    (productId: string, newQuantity: number) => {
      if (newQuantity <= 0) {
        removeFromCart(productId);
        return;
      }

      setCartItems((prev) => prev.map((item) => (item.id === productId ? { ...item, quantity: newQuantity } : item)));
    },
    [removeFromCart],
  );

  /**
   * 장바구니 아이템들로부터 총액과 개수 계산
   * @param {ICartItem[]} items - 장바구니 아이템들
   * @returns {Object} 계산 결과 {subtotal, itemCount, itemDiscounts}
   */
  const calculateCartTotals = useCallback((items: ICartItem[]) => {
    let subtotal = 0;
    let totalItemCount = 0;
    const itemDiscounts: IItemDiscount[] = [];

    items.forEach((cartItem) => {
      const itemTotal = cartItem.val * cartItem.quantity;
      totalItemCount += cartItem.quantity;
      subtotal += itemTotal;

      const isDiscountTarget = cartItem.quantity >= DISCOUNT_RULES.ITEM_DISCOUNT_THRESHOLD;
      const itemDiscountRate = DISCOUNT_RULES.ITEM_DISCOUNT_RATES[cartItem.id] || 0;
      const hasItemDiscount = isDiscountTarget && itemDiscountRate > 0;

      if (hasItemDiscount) {
        itemDiscounts.push({
          name: cartItem.name,
          discount: itemDiscountRate,
        });
      }
    });

    return {
      subtotal,
      itemCount: totalItemCount,
      itemDiscounts,
    };
  }, []);

  /**
   * 총 할인율 계산 (대량 구매 할인, 화요일 할인 포함)
   * @param {number} subtotal - 소계
   * @param {number} itemCount - 상품 개수
   * @param {IItemDiscount[]} itemDiscounts - 개별 상품 할인 목록
   * @returns {Object} {totalAmount, discountRate, originalTotal, isSpecialDiscount}
   */
  const calculateFinalAmount = useCallback((subtotal: number, itemCount: number, itemDiscounts: IItemDiscount[]) => {
    let finalAmount = subtotal;
    let discountRate = 0;
    const originalTotal = subtotal;

    if (itemCount < DISCOUNT_RULES.BULK_DISCOUNT_THRESHOLD) {
      itemDiscounts.forEach((item) => {
        const discountAmount = subtotal * (item.discount / 100);
        finalAmount -= discountAmount;
      });
      discountRate = (subtotal - finalAmount) / subtotal;
    }

    if (itemCount >= DISCOUNT_RULES.BULK_DISCOUNT_THRESHOLD) {
      finalAmount = subtotal * (1 - DISCOUNT_RULES.BULK_DISCOUNT_RATE / 100);
      discountRate = DISCOUNT_RULES.BULK_DISCOUNT_RATE / 100;
    }

    const today = new Date();
    const isSpecialDiscount = isSpecialDiscountDay(today);
    if (isSpecialDiscount && finalAmount > 0) {
      finalAmount *= 1 - DISCOUNT_RULES.SPECIAL_DISCOUNT_RATE / 100;
      discountRate = 1 - finalAmount / originalTotal;
    }

    return {
      totalAmount: Math.round(finalAmount),
      discountRate,
      originalTotal,
      isSpecialDiscount,
    };
  }, []);

  /**
   * 장바구니 전체 계산 실행 및 상태 업데이트
   * @returns {ICartCalculation} 계산 결과
   */
  const updateCartCalculation = useCallback((): ICartCalculation => {
    const basicCalculation = calculateCartTotals(cartItems);

    const finalCalculation = calculateFinalAmount(
      basicCalculation.subtotal,
      basicCalculation.itemCount,
      basicCalculation.itemDiscounts,
    );

    // 상태 업데이트
    setTotalAmount(finalCalculation.totalAmount);
    setItemCount(basicCalculation.itemCount);

    return {
      ...basicCalculation,
      ...finalCalculation,
    };
  }, [cartItems, calculateCartTotals, calculateFinalAmount]);

  return {
    cartItems,
    totalAmount,
    itemCount,
    getTotalAmount,
    getItemCount,
    resetCart,
    addToCart,
    removeFromCart,
    updateQuantity,
    calculateCartTotals,
    calculateFinalAmount,
    updateCartCalculation,
  };
}
