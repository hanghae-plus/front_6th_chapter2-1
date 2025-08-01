import { useMemo } from "react";
import { ICartItem, IItemDiscount } from "./types";
import { DISCOUNT_RULES } from "../discounts/constants";
import { getKoreanDayName } from "../../utils/dateUtils";

interface OrderSummaryProps {
  cartItems: ICartItem[];
  subtotal: number;
  itemCount: number;
  itemDiscounts: IItemDiscount[];
  isSpecialDiscount: boolean;
  totalAmount: number;
}

interface OrderSummaryData {
  items: Array<{
    name: string;
    quantity: number;
    itemTotal: number;
  }>;
  subtotal: number;
  discounts: {
    hasBulkDiscount: boolean;
    bulkDiscountRate: number;
    bulkDiscountThreshold: number;
    itemDiscounts: IItemDiscount[];
    itemDiscountThreshold: number;
    hasSpecialDiscount: boolean;
    specialDiscountDays: string;
    specialDiscountRate: number;
  };
  shouldRender: boolean;
}

/**
 * Cart 도메인 - 주문 요약 컴포넌트
 *
 * 기존 OrderSummaryRenderer를 React 컴포넌트로 변환
 * - 장바구니 아이템별 소계 표시
 * - 대량구매 할인 표시
 * - 개별 상품 할인 표시
 * - 특별 할인 (화요일) 표시
 */
export function OrderSummary({
  cartItems,
  subtotal,
  itemCount,
  itemDiscounts,
  isSpecialDiscount,
  totalAmount,
}: OrderSummaryProps) {
  /**
   * 주문 요약 데이터 계산 (메모이제이션)
   */
  const orderSummaryData: OrderSummaryData = useMemo(() => {
    const items = cartItems.map((item) => ({
      name: item.name,
      quantity: item.quantity,
      itemTotal: item.val * item.quantity,
    }));

    const discounts = {
      hasBulkDiscount: itemCount >= DISCOUNT_RULES.BULK_DISCOUNT_THRESHOLD,
      bulkDiscountRate: DISCOUNT_RULES.BULK_DISCOUNT_RATE,
      bulkDiscountThreshold: DISCOUNT_RULES.BULK_DISCOUNT_THRESHOLD,
      itemDiscounts,
      itemDiscountThreshold: DISCOUNT_RULES.ITEM_DISCOUNT_THRESHOLD,
      hasSpecialDiscount: isSpecialDiscount && totalAmount > 0,
      specialDiscountDays: DISCOUNT_RULES.SPECIAL_DISCOUNT_DAYS.map(getKoreanDayName).join(", "),
      specialDiscountRate: DISCOUNT_RULES.SPECIAL_DISCOUNT_RATE,
    };

    return {
      items,
      subtotal,
      discounts,
      shouldRender: subtotal > 0,
    };
  }, [cartItems, subtotal, itemCount, itemDiscounts, isSpecialDiscount, totalAmount]);

  if (!orderSummaryData.shouldRender) {
    return null;
  }

  return (
    <div className="bg-black text-white p-6 rounded-lg">
      <h3 className="text-lg font-semibold mb-4">주문 요약</h3>

      <div id="summary-details">
        {/* 아이템별 소계 */}
        <div className="space-y-2 mb-4">
          {orderSummaryData.items.map((item, index) => (
            <div key={index} className="flex justify-between text-xs tracking-wide text-gray-400">
              <span>
                {item.name} x {item.quantity}
              </span>
              <span>₩{item.itemTotal.toLocaleString()}</span>
            </div>
          ))}
        </div>

        {/* 구분선 */}
        <div className="border-t border-white/10 my-3"></div>

        {/* 소계 */}
        <div className="flex justify-between text-sm tracking-wide mb-3">
          <span>Subtotal</span>
          <span>₩{orderSummaryData.subtotal.toLocaleString()}</span>
        </div>

        {/* 대량구매 할인 */}
        {orderSummaryData.discounts.hasBulkDiscount && (
          <div className="flex justify-between text-sm tracking-wide text-green-400 mb-2">
            <span className="text-xs">
              🎉 대량구매 할인 ({orderSummaryData.discounts.bulkDiscountThreshold}개 이상)
            </span>
            <span className="text-xs">-{orderSummaryData.discounts.bulkDiscountRate}%</span>
          </div>
        )}

        {/* 개별 상품 할인 */}
        {!orderSummaryData.discounts.hasBulkDiscount && orderSummaryData.discounts.itemDiscounts.length > 0 && (
          <div className="space-y-1 mb-2">
            {orderSummaryData.discounts.itemDiscounts.map((item, index) => (
              <div key={index} className="flex justify-between text-sm tracking-wide text-green-400">
                <span className="text-xs">
                  {item.name} ({orderSummaryData.discounts.itemDiscountThreshold}개↑)
                </span>
                <span className="text-xs">-{item.discount}%</span>
              </div>
            ))}
          </div>
        )}

        {/* 특별 할인 (화요일) */}
        {orderSummaryData.discounts.hasSpecialDiscount && (
          <div className="flex justify-between text-sm tracking-wide text-purple-400 mb-2">
            <span className="text-xs">🌟 {orderSummaryData.discounts.specialDiscountDays} 추가 할인</span>
            <span className="text-xs">-{orderSummaryData.discounts.specialDiscountRate}%</span>
          </div>
        )}

        {/* 구분선 */}
        <div className="border-t border-white/10 my-3"></div>

        {/* 총 금액 */}
        <div className="flex justify-between text-lg font-semibold">
          <span>Total</span>
          <span data-testid="cart-total">₩{totalAmount.toLocaleString()}</span>
        </div>
      </div>
    </div>
  );
}
