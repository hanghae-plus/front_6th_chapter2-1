import React from 'react';

import { CartItem, Product } from '../types';
import { getProductById } from '../utils/productUtils';

interface OrderSummaryDetailsProps {
  cartItems: CartItem[];
  products: Product[];
  subtotal: number;
  itemDiscounts: Array<{ name: string; discount: number }>;
  bulkDiscountRate: number;
  itemCount: number;
  isTuesday: boolean;
  finalTotal: number;
}

export const OrderSummaryDetails: React.FC<OrderSummaryDetailsProps> = ({
  cartItems,
  products,
  subtotal,
  itemDiscounts,
  bulkDiscountRate,
  itemCount,
  isTuesday,
  finalTotal,
}) => {
  if (subtotal === 0) return null;

  return (
    <div id='summary-details' className='space-y-3'>
      {/* 개별 상품 목록 */}
      {cartItems.map((item) => {
        const product = getProductById(products, item.id);
        if (!product) return null;

        const itemTotal = product.val * item.quantity;
        return (
          <div
            key={item.id}
            className='flex justify-between text-xs tracking-wide text-gray-400'
          >
            <span>
              {product.name} x {item.quantity}
            </span>
            <span>₩{itemTotal.toLocaleString()}</span>
          </div>
        );
      })}

      <div className='border-t border-white/10 my-3'></div>

      {/* 소계 */}
      <div className='flex justify-between text-sm tracking-wide'>
        <span>Subtotal</span>
        <span>₩{subtotal.toLocaleString()}</span>
      </div>

      {/* 대량구매 할인 */}
      {itemCount >= 30 && (
        <div className='flex justify-between text-sm tracking-wide text-green-400'>
          <span className='text-xs'>🎉 대량구매 할인 (30개 이상)</span>
          <span className='text-xs'>-25%</span>
        </div>
      )}

      {/* 개별 상품 할인 */}
      {itemCount < 30 &&
        itemDiscounts.map((discount) => (
          <div
            key={discount.name}
            className='flex justify-between text-sm tracking-wide text-green-400'
          >
            <span className='text-xs'>{discount.name} (10개↑)</span>
            <span className='text-xs'>-{discount.discount}%</span>
          </div>
        ))}

      {/* 화요일 할인 */}
      {isTuesday && finalTotal > 0 && (
        <div className='flex justify-between text-sm tracking-wide text-purple-400'>
          <span className='text-xs'>🌟 화요일 추가 할인</span>
          <span className='text-xs'>-10%</span>
        </div>
      )}

      {/* 배송비 */}
      <div className='flex justify-between text-sm tracking-wide text-gray-400'>
        <span>Shipping</span>
        <span>Free</span>
      </div>
    </div>
  );
};
