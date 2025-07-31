import React from 'react';
import Button from './button';
import { CartItem } from '../../types';
import {
  QUANTITY_THRESHOLDS,
  DISCOUNT_RATES,
  WEEKDAYS,
} from '../../constants/config';
import { CartTotals } from '../../services/discountService';

interface OrderSummaryProps {
  total?: number;
  loyaltyPoints?: number;
  discountInfo?: string;
  showTuesdaySpecial?: boolean;
  onCheckout?: () => void;
  cartItems?: CartItem[];
  cartTotals?: CartTotals;
}

export default function OrderSummary({
  total = 0,
  loyaltyPoints = 0,
  discountInfo = '',
  showTuesdaySpecial = false,
  onCheckout,
  cartItems = [],
  cartTotals,
}: OrderSummaryProps) {
  return (
    <div className="bg-black text-white p-8 flex flex-col">
      <h2 className="text-xs font-medium mb-5 tracking-extra-wide uppercase">
        Order Summary
      </h2>
      <div className="flex-1 flex flex-col">
        <div id="summary-details" className="space-y-3">
          {cartTotals && cartTotals.subtotal > 0 && (
            <>
              {/* 상품별 라인 아이템 */}
              {cartTotals.items.map((item, index) => (
                <div
                  key={index}
                  className="flex justify-between text-xs tracking-wide text-gray-400"
                >
                  <span>
                    {item.product.name} x {item.quantity}
                  </span>
                  <span>₩{item.subtotal.toLocaleString()}</span>
                </div>
              ))}

              {/* 소계 */}
              <div className="border-t border-white/10 my-3"></div>
              <div className="flex justify-between text-sm tracking-wide">
                <span>Subtotal</span>
                <span>₩{cartTotals.subtotal.toLocaleString()}</span>
              </div>

              {/* 할인 내역 */}
              {cartTotals.itemCount >=
              QUANTITY_THRESHOLDS.BULK_DISCOUNT_MINIMUM ? (
                <div className="flex justify-between text-sm tracking-wide text-green-400">
                  <span className="text-xs">
                    🎉 대량구매 할인 (
                    {QUANTITY_THRESHOLDS.BULK_DISCOUNT_MINIMUM}개 이상)
                  </span>
                  <span className="text-xs">
                    -{DISCOUNT_RATES.BULK_DISCOUNT_30_PLUS * 100}%
                  </span>
                </div>
              ) : (
                cartTotals.itemDiscounts.map((item, index) => (
                  <div
                    key={index}
                    className="flex justify-between text-sm tracking-wide text-green-400"
                  >
                    <span className="text-xs">
                      {item.name} (
                      {QUANTITY_THRESHOLDS.INDIVIDUAL_DISCOUNT_MINIMUM}개↑)
                    </span>
                    <span className="text-xs">-{item.discount}%</span>
                  </div>
                ))
              )}

              {/* 화요일 할인 */}
              {showTuesdaySpecial && (
                <div className="flex justify-between text-sm tracking-wide text-purple-400">
                  <span className="text-xs">🌟 화요일 추가 할인</span>
                  <span className="text-xs">
                    -{DISCOUNT_RATES.TUESDAY_SPECIAL * 100}%
                  </span>
                </div>
              )}

              {/* 배송비 */}
              <div className="flex justify-between text-sm tracking-wide text-gray-400">
                <span>Shipping</span>
                <span>Free</span>
              </div>
            </>
          )}
        </div>
        <div className="mt-auto">
          <div id="discount-info" className="mb-4"></div>
          <div id="cart-total" className="pt-5 border-t border-white/10">
            <div className="flex justify-between items-baseline">
              <span className="text-sm uppercase tracking-wider">Total</span>
              <div className="text-2xl tracking-tight">
                ₩{total.toLocaleString()}
              </div>
            </div>
            <div
              id="loyalty-points"
              className="text-xs text-blue-400 mt-2 text-right"
            >
              적립 포인트: {loyaltyPoints}p
            </div>
          </div>
          {showTuesdaySpecial && (
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
      <Button
        className="w-full py-4 bg-white text-black text-sm font-normal uppercase tracking-super-wide cursor-pointer mt-6 transition-all hover:-translate-y-0.5 hover:shadow-lg hover:shadow-black/30"
        text="Proceed to Checkout"
        id="checkout-button"
        handleClick={onCheckout}
        type="button"
      />
      <p className="mt-4 text-2xs text-white/60 text-center leading-relaxed">
        Free shipping on all orders.
        <br />
        <span id="points-notice">Earn loyalty points with purchase.</span>
      </p>
    </div>
  );
}
