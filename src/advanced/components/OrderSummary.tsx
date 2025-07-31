// src/advanced/components/OrderSummary.tsx
import React, { useMemo } from 'react';
import { useCart } from '../hooks/useCart';
import {
  calculateSubtotal,
  calculateDiscounts,
  calculateTotal,
  calculatePoints,
} from '../utils/calculator';
import { DISCOUNT } from '../../basic/constants';

export function OrderSummary() {
  const { state } = useCart();
  const { cart, products } = state;

  const summary = useMemo(() => {
    const today = new Date();
    const subtotal = calculateSubtotal(cart, products);
    const discounts = calculateDiscounts(cart, products);
    const totalAmount = calculateTotal(subtotal, discounts.totalDiscount, discounts.bulkDiscountRate, today);
    const points = calculatePoints(cart, totalAmount, products, today);
    const totalQuantity = cart.reduce((sum, item) => sum + item.quantity, 0);
    const savedAmount = subtotal - totalAmount;

    return {
      subtotal,
      discounts,
      totalAmount,
      points,
      totalQuantity,
      savedAmount,
      isTuesday: today.getDay() === 2,
    };
  }, [cart, products]);

  return (
    <div className="bg-black text-white p-8 flex flex-col h-full" data-testid="order-summary">
      <h2 className="text-xs font-medium mb-5 tracking-extra-wide uppercase">Order Summary</h2>
      <div className="flex-1 flex flex-col">
        <div id="summary-details" className="space-y-3">
          {summary.subtotal > 0 && (
            <>
              {cart.map(item => {
                const product = products.find(p => p.id === item.id);
                return (
                  <div key={item.id} className="flex justify-between text-xs tracking-wide text-gray-400">
                    <span>{product?.name} x {item.quantity}</span>
                    <span>₩{(product?.val || 0 * item.quantity).toLocaleString()}</span>
                  </div>
                );
              })}
              <div className="border-t border-white/10 my-3"></div>
              <div className="flex justify-between text-sm tracking-wide">
                <span>Subtotal</span>
                <span data-testid="subtotal">₩{summary.subtotal.toLocaleString()}</span>
              </div>
              {summary.discounts.bulkDiscountRate > 0 ? (
                <div className="flex justify-between text-sm tracking-wide text-green-400">
                  <span className="text-xs">🎉 대량구매 할인 ({DISCOUNT.BULK_DISCOUNT_THRESHOLD}개 이상)</span>
                  <span className="text-xs">-{summary.discounts.bulkDiscountRate * 100}%</span>
                </div>
              ) : (
                summary.discounts.itemDiscounts.map(d => (
                  <div key={d.name} className="flex justify-between text-sm tracking-wide text-green-400">
                    <span className="text-xs">{d.name} (10개↑)</span>
                    <span className="text-xs">-{d.discount}%</span>
                  </div>
                ))
              )}
              {summary.isTuesday && summary.totalAmount > 0 && (
                 <div className="flex justify-between text-sm tracking-wide text-purple-400">
                    <span className="text-xs">🌟 화요일 추가 할인</span>
                    <span className="text-xs">-{DISCOUNT.TUESDAY_DISCOUNT_RATE * 100}%</span>
                  </div>
              )}
            </>
          )}
        </div>
        <div className="mt-auto">
          {summary.savedAmount > 0 && (
            <div id="discount-info" className="mb-4">
              <div className="bg-green-500/20 rounded-lg p-3">
                <div className="flex justify-between items-center mb-1">
                  <span className="text-xs uppercase tracking-wide text-green-400">총 할인율</span>
                  <span className="text-sm font-medium text-green-400">
                    {(summary.savedAmount / summary.subtotal * 100).toFixed(1)}%
                  </span>
                </div>
                <div className="text-2xs text-gray-300">₩{Math.round(summary.savedAmount).toLocaleString()} 할인되었습니다</div>
              </div>
            </div>
          )}
          <div id="cart-total" className="pt-5 border-t border-white/10">
            <div className="flex justify-between items-baseline">
              <span className="text-sm uppercase tracking-wider">Total</span>
              <div className="text-2xl tracking-tight" data-testid="total">₩{Math.round(summary.totalAmount).toLocaleString()}</div>
            </div>
            {summary.points.finalPoints > 0 && (
              <div id="loyalty-points" className="text-xs text-blue-400 mt-2 text-right">
                <div>적립 포인트: <span className="font-bold">{summary.points.finalPoints}p</span></div>
                <div className="text-2xs opacity-70 mt-1">{summary.points.pointsDetail.join(', ')}</div>
              </div>
            )}
          </div>
          {summary.isTuesday && summary.totalAmount > 0 && (
            <div id="tuesday-special" className="mt-4 p-3 bg-white/10 rounded-lg">
              <div className="flex items-center gap-2">
                <span className="text-2xs">🎉</span>
                <span className="text-xs uppercase tracking-wide">Tuesday Special 10% Applied</span>
              </div>
            </div>
          )}
        </div>
      </div>
      <button className="w-full py-4 bg-white text-black text-sm font-normal uppercase tracking-super-wide cursor-pointer mt-6 transition-all hover:-translate-y-0.5 hover:shadow-lg hover:shadow-black/30">
        Proceed to Checkout
      </button>
      <p className="mt-4 text-2xs text-white/60 text-center leading-relaxed">
        Free shipping on all orders.<br />
        <span id="points-notice">Earn loyalty points with purchase.</span>
      </p>
    </div>
  );
}
