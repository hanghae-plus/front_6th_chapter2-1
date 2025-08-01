import React from 'react';

import { OrderSummaryDetails } from './OrderSummaryDetails';
import { CartItem, Product } from '../types';

interface OrderSummaryProps {
  cartItems: CartItem[];
  products: Product[];
  cartTotals: {
    subtotal: number;
    finalTotal: number;
    itemCount: number;
    totalDiscountRate: number;
    savedAmount: number;
    itemDiscounts: Array<{ name: string; discount: number }>;
    bulkDiscountRate: number;
    isTuesday: boolean;
  };
  bonusPoints: {
    points: number;
    details: string[];
  };
}

export const OrderSummary: React.FC<OrderSummaryProps> = ({
  cartItems,
  products,
  cartTotals,
  bonusPoints,
}) => (
  <>
    <h2 className='text-xs font-medium mb-5 tracking-extra-wide uppercase'>
      Order Summary
    </h2>
    <div className='flex-1 flex flex-col'>
      <OrderSummaryDetails
        cartItems={cartItems}
        products={products}
        subtotal={cartTotals.subtotal}
        itemDiscounts={cartTotals.itemDiscounts}
        bulkDiscountRate={cartTotals.bulkDiscountRate}
        itemCount={cartTotals.itemCount}
        isTuesday={cartTotals.isTuesday}
        finalTotal={cartTotals.finalTotal}
      />

      <div className='mt-auto'>
        {/* 할인 정보 */}
        {cartTotals.totalDiscountRate > 0 && cartTotals.finalTotal > 0 && (
          <div id='discount-info' className='mb-4'>
            <div className='bg-green-500/20 rounded-lg p-3'>
              <div className='flex justify-between items-center mb-1'>
                <span className='text-xs uppercase tracking-wide text-green-400'>
                  총 할인율
                </span>
                <span className='text-sm font-medium text-green-400'>
                  {(cartTotals.totalDiscountRate * 100).toFixed(1)}%
                </span>
              </div>
              <div className='text-2xs text-gray-300'>
                ₩{Math.round(cartTotals.savedAmount).toLocaleString()}{' '}
                할인되었습니다
              </div>
            </div>
          </div>
        )}

        {/* 총액 */}
        <div id='cart-total' className='pt-5 border-t border-white/10'>
          <div className='flex justify-between items-baseline'>
            <span className='text-sm uppercase tracking-wider'>Total</span>
            <div className='text-2xl tracking-tight'>
              ₩{Math.round(cartTotals.finalTotal).toLocaleString()}
            </div>
          </div>

          {/* 포인트 적립 */}
          <div
            id='loyalty-points'
            className='text-xs text-blue-400 mt-2 text-right'
          >
            {bonusPoints.points > 0 ? (
              <div>
                <div>
                  적립 포인트:{' '}
                  <span className='font-bold'>{bonusPoints.points}p</span>
                </div>
                <div className='text-2xs opacity-70 mt-1'>
                  {bonusPoints.details.join(', ')}
                </div>
              </div>
            ) : (
              '적립 포인트: 0p'
            )}
          </div>
        </div>

        {/* 화요일 특별 */}
        {cartTotals.isTuesday && cartTotals.finalTotal > 0 && (
          <div id='tuesday-special' className='mt-4 p-3 bg-white/10 rounded-lg'>
            <div className='flex items-center gap-2'>
              <span className='text-2xs'>🎉</span>
              <span className='text-xs uppercase tracking-wide'>
                Tuesday Special 10% Applied
              </span>
            </div>
          </div>
        )}
      </div>
    </div>

    <button className='w-full py-4 bg-white text-black text-sm font-normal uppercase tracking-super-wide cursor-pointer mt-6 transition-all hover:-translate-y-0.5 hover:shadow-lg hover:shadow-black/30'>
      Proceed to Checkout
    </button>

    <p className='mt-4 text-2xs text-white/60 text-center leading-relaxed'>
      Free shipping on all orders.
      <br />
      <span id='points-notice'>Earn loyalty points with purchase.</span>
    </p>
  </>
);
