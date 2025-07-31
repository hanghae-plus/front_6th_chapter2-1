import React from 'react';
import { CartItem, Discount } from '../types';
import { calculateDiscountedTotal } from '../utils/discount';

interface OrderSummaryProps {
  cartItems: CartItem[];
}

export const OrderSummary: React.FC<OrderSummaryProps> = ({ cartItems }) => {
  const { subtotal, totalDiscount, finalTotal, discounts } = calculateDiscountedTotal(cartItems);

  const formatPrice = (price: number) => {
    return `₩${price.toLocaleString()}`;
  };

  const formatDiscountRate = (rate: number) => {
    return `${(rate * 100).toFixed(1)}%`;
  };

  return (
    <div className="space-y-4">
      <h3 className="text-lg font-semibold text-gray-900">주문 요약</h3>

      {/* 기본 정보 */}
      <div className="space-y-2">
        <div className="flex justify-between items-center">
          <span className="text-gray-600">총 상품 수:</span>
          <span className="font-semibold">
            {cartItems.reduce((sum, item) => sum + item.quantity, 0)}개
          </span>
        </div>
        <div className="flex justify-between items-center">
          <span className="text-gray-600">상품 종류:</span>
          <span className="font-semibold">{cartItems.length}종</span>
        </div>
      </div>

      {/* 할인 정보 */}
      {discounts.length > 0 && (
        <div className="border-t pt-4">
          <h4 className="font-medium text-gray-900 mb-2">적용된 할인</h4>
          <div className="space-y-2">
            {discounts.map((discount, index) => (
              <div key={index} className="flex justify-between items-center text-sm">
                <span className="text-green-600">{discount.description}</span>
                <span className="font-medium text-green-600">
                  -{formatDiscountRate(discount.rate)}
                </span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* 금액 정보 */}
      <div className="border-t pt-4 space-y-2">
        <div className="flex justify-between items-center">
          <span className="text-gray-600">상품 금액:</span>
          <span className="font-medium">{formatPrice(subtotal)}</span>
        </div>

        {totalDiscount > 0 && (
          <div className="flex justify-between items-center">
            <span className="text-gray-600">할인 금액:</span>
            <span className="font-medium text-green-600">-{formatPrice(totalDiscount)}</span>
          </div>
        )}

        <div className="flex justify-between items-center pt-2 border-t">
          <span className="text-lg font-semibold text-gray-900">최종 결제 금액:</span>
          <span className="text-2xl font-bold text-blue-600">{formatPrice(finalTotal)}</span>
        </div>
      </div>

      {/* 화요일 할인 배너 */}
      {discounts.some((d) => d.type === 'tuesday') && (
        <div className="mt-4 p-3 bg-yellow-50 border border-yellow-200 rounded-md">
          <div className="flex items-center space-x-2">
            <span className="text-yellow-600">🎉</span>
            <span className="text-sm font-medium text-yellow-800">
              화요일 특별 할인이 적용되었습니다!
            </span>
          </div>
        </div>
      )}
    </div>
  );
};
