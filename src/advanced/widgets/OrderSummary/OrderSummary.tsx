/**
 * 주문 요약 컴포넌트 - 기본과제 DOM 구조 유지
 */

import React from 'react';
import { useCart } from '../../app/providers/CartProvider';
import { BUSINESS_CONSTANTS } from '../../shared/constants';

export const OrderSummary: React.FC = () => {
  const { cartItems, subtotal, totalAmount, discounts, bonusPoints, pointsDetails } = useCart();

  // 화요일 확인
  const today = new Date();
  const isTuesday = today.getDay() === BUSINESS_CONSTANTS.TUESDAY_DAY_OF_WEEK;

  // 할인 정보 텍스트 생성
  const getDiscountInfoText = () => {
    if (discounts.length === 0) return '';
    
    return discounts.map(discount => {
      return `${discount.name}: -₩${discount.amount.toLocaleString()}`;
    }).join('\n');
  };

  // 상품 요약 텍스트 생성
  const getSummaryDetailsText = () => {
    return cartItems.map(item => {
      const itemTotal = item.product.val * item.quantity;
      return `${item.product.name} × ${item.quantity}: ₩${itemTotal.toLocaleString()}`;
    }).join('\n');
  };

  return (
    <div className="bg-black text-white p-8 flex flex-col">
      <h2 className="text-xs font-medium mb-5 tracking-extra-wide uppercase">Order Summary</h2>
      <div className="flex-1 flex flex-col">
        <div id="summary-details" className="space-y-3">
          {getSummaryDetailsText().split('\n').map((line, index) => (
            <div key={index} className="text-sm">{line}</div>
          ))}
        </div>
        <div className="mt-auto">
          <div id="discount-info" className="mb-4">
            {getDiscountInfoText().split('\n').map((line, index) => (
              line && <div key={index} className="text-sm text-green-400">{line}</div>
            ))}
          </div>
          <div id="cart-total" className="pt-5 border-t border-white/10">
            <div className="flex justify-between items-baseline">
              <span className="text-sm uppercase tracking-wider">Total</span>
              <div className="text-2xl tracking-tight">₩{totalAmount.toLocaleString()}</div>
            </div>
            <div id="loyalty-points" className="text-xs text-blue-400 mt-2 text-right">
              적립 포인트: {bonusPoints}p
            </div>
          </div>
          <div 
            id="tuesday-special" 
            className={`mt-4 p-3 bg-white/10 rounded-lg ${isTuesday ? '' : 'hidden'}`}
          >
            <div className="flex items-center gap-2">
              <span className="text-2xs">🎉</span>
              <span className="text-xs uppercase tracking-wide">Tuesday Special 10% Applied</span>
            </div>
          </div>
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
};