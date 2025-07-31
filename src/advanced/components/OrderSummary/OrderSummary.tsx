import React, { memo, useMemo } from "react";
import { useCart } from "../../hooks/useCart";
import { useOrder } from "../../hooks/useOrder";
import { useProduct } from "../../hooks/useProduct";
import type { Product } from "../../types";
import BulkDiscount from "./BulkDiscount";
import CartItemSummary from "./CartItemSummary";
import CheckoutButton from "./CheckoutButton";
import DiscountInfo from "./DiscountInfo";
import OrderSummaryMessage from "./OrderSummaryMessage";
import ProductDiscount from "./ProductDiscount";
import ShippingInfo from "./ShippingInfo";
import SubtotalInfo from "./SubtotalInfo";
import TuesdayDiscount from "./TuesdayDiscount";

const OrderSummary: React.FC = () => {
  const { totalAmount, discountRate, loyaltyPoints, isTuesday, itemCount, subtotal } = useOrder();
  const { cartItems } = useCart();
  const { products } = useProduct();

  // 개별 상품 할인율 계산 함수
  const getProductDiscountRate = (productId: string): number => {
    switch (productId) {
      case "p1":
        return 10;
      case "p2":
        return 15;
      case "p3":
        return 20;
      case "p4":
        return 5;
      case "p5":
        return 25;
      default:
        return 0;
    }
  };

  // 할인 정보 계산
  const discountInfo = useMemo(() => {
    if (discountRate > 0 && totalAmount > 0) {
      const savedAmount = subtotal - totalAmount;
      return { discountRate, savedAmount };
    }
    return null;
  }, [discountRate, totalAmount, subtotal]);

  // 개별 상품 할인 목록
  const productDiscounts = useMemo(() => {
    if (itemCount >= 30) return []; // 대량구매 할인이 적용되면 개별 할인 무시

    return cartItems
      .map((cartItem) => {
        const product = products.find((p) => p.id === cartItem.id);
        if (product && cartItem.quantity >= 10) {
          const discountRate = getProductDiscountRate(product.id);
          return discountRate > 0 ? { product, discountRate } : null;
        }
        return null;
      })
      .filter(
        (discount): discount is { product: Product; discountRate: number } => discount !== null,
      );
  }, [cartItems, products, itemCount]);

  return (
    <>
      <h2 className="tracking-extra-wide mb-5 text-xs font-medium uppercase">Order Summary</h2>

      <div className="flex flex-1 flex-col">
        {/* 요약 세부사항 */}
        <div id="summary-details" className="space-y-3">
          {subtotal > 0 && (
            <>
              {/* 각 아이템 정보 */}
              {cartItems.map((cartItem) => {
                const product = products.find((p) => p.id === cartItem.id);
                return product ? (
                  <CartItemSummary key={cartItem.id} cartItem={cartItem} product={product} />
                ) : null;
              })}

              {/* 구분선 */}
              <div className="my-3 border-t border-white/10" />

              {/* 소계 */}
              <SubtotalInfo subtotal={subtotal} />

              {/* 대량구매 할인 (30개 이상) */}
              {itemCount >= 30 && <BulkDiscount />}

              {/* 개별 상품 할인 (10개 이상) */}
              {productDiscounts.map((discount, index) => (
                <ProductDiscount
                  key={`${discount.product.id}-${index}`}
                  product={discount.product}
                  discountRate={discount.discountRate}
                />
              ))}

              {/* 화요일 할인 */}
              {isTuesday && totalAmount > 0 && <TuesdayDiscount />}

              {/* 배송 정보 */}
              <ShippingInfo />
            </>
          )}
        </div>

        {/* 하단 영역 */}
        <div className="mt-auto">
          {/* 할인 정보 */}
          <div id="discount-info" data-testid="discount-info" className="mb-4">
            {discountInfo && (
              <DiscountInfo
                discountRate={discountInfo.discountRate}
                savedAmount={discountInfo.savedAmount}
              />
            )}
          </div>

          {/* 총액 */}
          <div id="cart-total" data-testid="cart-total" className="border-t border-white/10 pt-5">
            <div className="flex items-baseline justify-between">
              <span className="text-sm uppercase tracking-wider">Total</span>
              <div className="text-2xl tracking-tight">₩{totalAmount.toLocaleString()}</div>
            </div>
            <div
              id="loyalty-points"
              data-testid="loyalty-points"
              className="mt-2 text-right text-xs text-blue-400"
            >
              적립 포인트: {loyaltyPoints}p
            </div>
          </div>

          {/* 화요일 특별 할인 */}
          {isTuesday && (
            <div
              id="tuesday-special"
              data-testid="tuesday-special"
              className="mt-4 rounded-lg bg-white/10 p-3"
            >
              <div className="flex items-center gap-2">
                <span className="text-2xs">🎉</span>
                <span className="text-xs uppercase tracking-wide">Tuesday Special 10% Applied</span>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* 체크아웃 버튼 */}
      <CheckoutButton />

      {/* 하단 메시지 */}
      <OrderSummaryMessage />
    </>
  );
};

export default memo(OrderSummary);
