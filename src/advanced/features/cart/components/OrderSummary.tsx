import React from 'react';
import type { DiscountInfo, CartItem, Product } from '../../../shared/types';

interface OrderSummaryProps {
  totalAmount: number;
  subtotal: number;
  bonusPoints: number;
  pointsDetails?: string[];
  discountInfo: DiscountInfo[];
  isTuesdaySpecial: boolean;
  cartItems: CartItem[];
  totalQuantity: number;
  getProductById: (id: string) => Product | undefined;
}

export function OrderSummary({
  totalAmount,
  subtotal,
  bonusPoints,
  pointsDetails = [],
  discountInfo,
  isTuesdaySpecial,
  cartItems,
  totalQuantity,
  getProductById,
}: OrderSummaryProps) {
  // 총 할인율 계산
  const getTotalDiscountRate = (): number => {
    if (subtotal === 0) return 0;
    return ((subtotal - totalAmount) / subtotal) * 100;
  };

  const renderSummaryDetails = () => {
    if (!cartItems || cartItems.length === 0 || subtotal === 0) {
      return null;
    }

    return (
      <div className="space-y-3">
        {/* 아이템별 요약 */}
        {cartItems.map((item) => {
          const product = getProductById(item.id);
          if (!product) return null;

          const itemTotal = product.price * item.quantity;
          return (
            <div
              key={item.id}
              className="flex justify-between text-xs tracking-wide text-gray-400"
            >
              <span>
                {product.name} x {item.quantity}
              </span>
              <span>₩{itemTotal.toLocaleString()}</span>
            </div>
          );
        })}

        {/* 소계 */}
        <div className="border-t border-white/10 my-3"></div>
        <div className="flex justify-between text-sm tracking-wide">
          <span>Subtotal</span>
          <span>₩{subtotal.toLocaleString()}</span>
        </div>

        {/* 할인 정보 */}
        {totalQuantity >= 30 ? (
          <div className="flex justify-between text-sm tracking-wide text-green-400">
            <span className="text-xs">🎉 대량구매 할인 (30개 이상)</span>
            <span className="text-xs">-25%</span>
          </div>
        ) : (
          discountInfo.map((info, index) => (
            <div
              key={index}
              className="flex justify-between text-sm tracking-wide text-green-400"
            >
              <span className="text-xs">{info.name} (10개↑)</span>
              <span className="text-xs">
                -{info.discountPercent.toFixed(1)}%
              </span>
            </div>
          ))
        )}

        {/* 화요일 할인 */}
        {isTuesdaySpecial && (
          <div className="flex justify-between text-sm tracking-wide text-purple-400">
            <span className="text-xs">🌟 화요일 추가 할인</span>
            <span className="text-xs">-10%</span>
          </div>
        )}

        {/* 배송비 */}
        <div className="flex justify-between text-sm tracking-wide text-gray-400">
          <span>Shipping</span>
          <span>Free</span>
        </div>
      </div>
    );
  };

  // 할인 정보 렌더링 함수
  const renderDiscountInfo = () => {
    const totalDiscountRate = getTotalDiscountRate();

    if (totalDiscountRate === 0) {
      return null;
    }

    return (
      <div id="discount-info" className="mb-4">
        <div className="bg-green-500/20 rounded-lg p-3">
          <div className="flex justify-between items-center mb-1">
            <span className="text-xs uppercase tracking-wide text-green-400">
              총 할인율
            </span>
            <span className="text-sm font-medium text-green-400">
              {totalDiscountRate.toFixed(1)}%
            </span>
          </div>
          <div className="text-2xs text-gray-300">
            ₩{Math.round(subtotal - totalAmount).toLocaleString()}{' '}
            할인되었습니다
          </div>
        </div>
      </div>
    );
  };

  return (
    <section className="bg-black text-white p-8 flex flex-col">
      <h2 className="text-xs font-medium mb-5 tracking-extra-wide uppercase">
        Order Summary
      </h2>

      <div className="flex-1 flex flex-col">
        <div id="summary-details">{renderSummaryDetails()}</div>

        <div className="mt-auto">
          {/* 할인 정보 */}
          {renderDiscountInfo()}

          <div id="cart-total" className="pt-5 border-t border-white/10">
            <div className="flex justify-between items-baseline">
              <span className="text-sm uppercase tracking-wider">Total</span>
              <div className="text-2xl tracking-tight">
                ₩{totalAmount.toLocaleString()}
              </div>
            </div>
            <div
              id="loyalty-points"
              className="text-xs text-blue-400 mt-2 text-right"
            >
              <div>적립 포인트: {bonusPoints}p</div>
              {pointsDetails &&
                Array.isArray(pointsDetails) &&
                pointsDetails.length > 0 && (
                  <div className="text-2xs opacity-70 mt-1">
                    {pointsDetails.join(', ')}
                  </div>
                )}
            </div>
          </div>

          {isTuesdaySpecial && (
            <div
              id="tuesday-special"
              className="mt-4 p-3 bg-white/10 rounded-lg"
            >
              <div className="flex items-center gap-2">
                <span className="text-2xs">🎉</span>
                <span className="text-xs uppercase tracking-wide">
                  Tuesday Special 10% Applied
                </span>
              </div>
            </div>
          )}
        </div>
      </div>

      <button className="w-full py-4 bg-white text-black text-sm font-normal uppercase tracking-super-wide cursor-pointer mt-6 transition-all hover:-translate-y-0.5 hover:shadow-lg hover:shadow-black/30">
        Proceed to Checkout
      </button>

      <p className="mt-4 text-2xs text-white/60 text-center leading-relaxed">
        Free shipping on all orders.
        <br />
        <span id="points-notice">Earn loyalty points with purchase.</span>
      </p>
    </section>
  );
}
