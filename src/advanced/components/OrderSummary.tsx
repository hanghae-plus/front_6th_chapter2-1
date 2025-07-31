// ==========================================
// 주문 요약 컴포넌트 (React + TypeScript)
// ==========================================

import React from 'react';
import { THRESHOLDS, DISCOUNT_RATES } from '../constant/index';

/**
 * OrderSummary Props 타입
 */
interface OrderSummaryProps {
  cartItems?: Array<{
    id: string;
    name: string;
    quantity: number;
    price: number;
  }>;
  subTotal?: number;
  finalTotal?: number;
  discounts?: Array<{
    name: string;
    discount: number;
  }>;
  itemCount?: number;
  isTuesdayApplied?: boolean;
  totalItemCount?: number;
  loyaltyPoints?: number;
  bonusPointsDetail?: string[];
  discountRate?: number;
  onCheckout?: () => void;
}

/**
 * OrderSummary 컴포넌트
 *
 * @description 주문 요약 정보를 표시
 */
export const OrderSummary: React.FC<OrderSummaryProps> = ({
  cartItems = [],
  subTotal = 0,
  finalTotal = 0,
  discounts = [],
  itemCount = 0,
  isTuesdayApplied = false,
  loyaltyPoints = 0,
  bonusPointsDetail = [],
  totalItemCount = 0,
  discountRate = 0,
  onCheckout,
}) => {
  const handleCheckout = () => {
    onCheckout?.();
  };

  return (
    <div className="bg-black text-white p-8 flex flex-col">
      <h2 className="text-xs font-medium mb-5 tracking-extra-wide uppercase">
        Order Summary
      </h2>
      
      <div className="flex-1 flex flex-col">
        {/* Summary Details */}
        <div id="summary-details" className="space-y-3">
          {subTotal > 0 && (
            <>
              {/* Cart Items */}
              {cartItems.map((item) => (
                <div 
                  key={item.id}
                  className="flex justify-between text-xs tracking-wide text-gray-400"
                >
                  <span>{item.name} x {item.quantity}</span>
                  <span>{(item.price * item.quantity).toLocaleString()}원</span>
                </div>
              ))}
              
              <div className="border-t border-white/10 my-3"></div>
              
              {/* Subtotal */}
              <div className="flex justify-between text-sm tracking-wide">
                <span>Subtotal</span>
                <span>{subTotal.toLocaleString()}원</span>
              </div>
              
              {/* Discounts */}
              {itemCount >= THRESHOLDS.BULK_DISCOUNT_MIN && (
                <div className="flex justify-between text-sm tracking-wide text-green-400">
                  <span className="text-xs">🎉 대량구매 할인 ({THRESHOLDS.BULK_DISCOUNT_MIN}개 이상)</span>
                  <span className="text-xs">-25%</span>
                </div>
              )}
              
              {itemCount < THRESHOLDS.BULK_DISCOUNT_MIN && discounts.map((discount, index) => (
                <div 
                  key={index}
                  className="flex justify-between text-sm tracking-wide text-green-400"
                >
                  <span className="text-xs">{discount.name} ({THRESHOLDS.ITEM_DISCOUNT_MIN}개↑)</span>
                  <span className="text-xs">-{discount.discount}%</span>
                </div>
              ))}
              
              {isTuesdayApplied && (
                <div className="flex justify-between text-sm tracking-wide text-purple-400">
                  <span className="text-xs">🌟 화요일 추가 할인</span>
                  <span className="text-xs">-{DISCOUNT_RATES.TUESDAY_DISCOUNT * 100}%</span>
                </div>
              )}
              
              {/* Shipping */}
              <div className="flex justify-between text-sm tracking-wide text-gray-400">
                <span>Shipping</span>
                <span>Free</span>
              </div>
            </>
          )}
        </div>
        
        <div className="mt-auto">
          {/* 할인 정보 */}
          {discountRate > 0 && finalTotal > 0 && (
            <div id="discount-info" className="mb-4">
              <div className="bg-green-500/20 rounded-lg p-3">
                <div className="flex justify-between items-center mb-1">
                  <span className="text-xs uppercase tracking-wide text-green-400">
                    총 할인율
                  </span>
                  <span className="text-sm font-medium text-green-400">
                    {(discountRate * 100).toFixed(1)}%
                  </span>
                </div>
                <div className="text-2xs text-gray-300">
                  ₩{Math.round(subTotal - finalTotal).toLocaleString()} 할인되었습니다
                </div>
              </div>
            </div>
          )}
          
          {/* Cart Total */}
          <div id="cart-total" className="pt-5 border-t border-white/10">
            <div className="flex justify-between items-baseline">
              <span className="text-sm uppercase tracking-wider">Total</span>
              <div className="text-2xl tracking-tight">
                {finalTotal > 0 ? `${finalTotal.toLocaleString()}원` : '0원'}
              </div>
            </div>
            <div id="loyalty-points" className="text-xs text-blue-400 mt-2 text-right">
              {loyaltyPoints > 0 && (
                <>
                  <div>적립 포인트: <span className="font-bold">{loyaltyPoints}p</span></div>
                  {bonusPointsDetail.length > 0 && (
                    <div className="text-2xs opacity-70 mt-1">
                      {bonusPointsDetail.join(', ')}
                    </div>
                  )}
                </>
              )}
              {loyaltyPoints === 0 && <div>적립 포인트: 0p</div>}
            </div>
          </div>
          
          {/* Tuesday Special Badge */}
          {isTuesdayApplied && (
            <div id="tuesday-special" className="mt-4 p-3 bg-white/10 rounded-lg">
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
      
      {/* Checkout Button */}
      <button 
        className="w-full py-4 bg-white text-black text-sm font-normal uppercase tracking-super-wide cursor-pointer mt-6 transition-all hover:-translate-y-0.5 hover:shadow-lg hover:shadow-black/30"
        onClick={handleCheckout}
      >
        Proceed to Checkout
      </button>
      
      {/* Footer Notice */}
      <p className="mt-4 text-2xs text-white/60 text-center leading-relaxed">
        Free shipping on all orders.<br />
        <span id="points-notice">Earn loyalty points with purchase.</span>
      </p>
    </div>
  );
};

export default OrderSummary;