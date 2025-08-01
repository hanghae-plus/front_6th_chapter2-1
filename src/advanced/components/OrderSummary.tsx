import React from 'react';
import { Product, CartItem, BonusPoints } from '../types';
import { formatPrice } from '../utils/price';

interface OrderSummaryProps {
  cartItems: CartItem[];
  productList: Product[];
  totalItemCount: number;
  subTotalBeforeDiscount: number;
  subTotalAfterDiscount: number;
  discountRate: number;
  isTuesday: boolean;
  bonusPoints: BonusPoints;
}

const OrderSummary: React.FC<OrderSummaryProps> = ({
  cartItems,
  productList,
  totalItemCount,
  subTotalBeforeDiscount,
  subTotalAfterDiscount,
  discountRate,
  isTuesday,
  bonusPoints,
}) => {
  const itemDiscounts: Array<{ name: string; discount: number }> = [];

  // 개별 상품 할인 계산 (cart.ts의 로직과 일치)
  cartItems.forEach((cartItem) => {
    const product = productList.find((p) => p.id === cartItem.productId);
    if (!product) return;

    if (cartItem.quantity >= 10) {
      // PRODUCT_DISCOUNT_RATES_BY_PRODUCT_ID와 일치하는 할인율 사용
      const discountRate =
        product.id === 'p1'
          ? 0.1
          : product.id === 'p2'
            ? 0.15
            : product.id === 'p3'
              ? 0.2
              : product.id === 'p5'
                ? 0.25
                : 0;
      if (discountRate > 0) {
        itemDiscounts.push({ name: product.name, discount: discountRate * 100 });
      }
    }
  });

  return (
    <div className='bg-black text-white p-8 flex flex-col'>
      <h2 className='text-xs font-medium mb-5 tracking-extra-wide uppercase'>Order Summary</h2>

      <div className='flex-1 flex flex-col'>
        <div className='space-y-3'>
          {/* 상품별 요약 */}
          {cartItems.map((cartItem) => {
            const product = productList.find((p) => p.id === cartItem.productId);
            if (!product) return null;

            const total = product.price * cartItem.quantity;
            return (
              <div
                key={cartItem.productId}
                className='flex justify-between text-xs tracking-wide text-gray-400'
              >
                <span>
                  {product.name} x {cartItem.quantity}
                </span>
                <span>{formatPrice(total)}</span>
              </div>
            );
          })}

          {/* 구분선 */}
          <div className='border-t border-white/10 my-3'></div>

          {/* Subtotal */}
          <div className='flex justify-between text-sm tracking-wide'>
            <span>Subtotal</span>
            <span>{formatPrice(subTotalBeforeDiscount)}</span>
          </div>

          {/* 할인 정보 */}
          {totalItemCount >= 30 ? (
            <div className='flex justify-between text-sm tracking-wide text-green-400'>
              <span className='text-xs'>🎉 대량구매 할인 (30개 이상)</span>
              <span className='text-xs'>-25%</span>
            </div>
          ) : (
            itemDiscounts.map(({ name, discount }) => (
              <div key={name} className='flex justify-between text-sm tracking-wide text-green-400'>
                <span className='text-xs'>{name} (10개↑)</span>
                <span className='text-xs'>-{discount}%</span>
              </div>
            ))
          )}

          {/* 화요일 할인 */}
          {isTuesday && subTotalAfterDiscount > 0 && (
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

        <div className='mt-auto'>
          {/* 할인 정보 표시 */}
          {discountRate > 0 && (
            <div className='mb-4'>
              <div className='bg-green-500/20 rounded-lg p-3'>
                <div className='flex justify-between items-center mb-1'>
                  <span className='text-xs uppercase tracking-wide text-green-400'>총 할인율</span>
                  <span className='text-sm font-medium text-green-400'>
                    {(discountRate * 100).toFixed(1)}%
                  </span>
                </div>
                <div className='text-2xs text-gray-300'>
                  {formatPrice(Math.round(subTotalBeforeDiscount - subTotalAfterDiscount))}{' '}
                  할인되었습니다
                </div>
              </div>
            </div>
          )}

          {/* Total */}
          <div className='pt-5 border-t border-white/10'>
            <div className='flex justify-between items-baseline'>
              <span className='text-sm uppercase tracking-wider'>Total</span>
              <div className='text-2xl tracking-tight'>
                {formatPrice(Math.round(subTotalAfterDiscount))}
              </div>
            </div>

            {/* 포인트 정보 */}
            {cartItems.length > 0 && (
              <div className='text-xs text-blue-400 mt-2 text-right'>
                <div>
                  적립 포인트: <span className='font-bold'>{bonusPoints.finalPoints}p</span>
                </div>
                {bonusPoints.pointsDetail.length > 0 && (
                  <div className='text-2xs opacity-70 mt-1'>
                    {bonusPoints.pointsDetail.join(', ')}
                  </div>
                )}
              </div>
            )}
          </div>

          {/* 화요일 특별 할인 배너 */}
          {isTuesday && subTotalAfterDiscount > 0 && (
            <div className='mt-4 p-3 bg-white/10 rounded-lg'>
              <div className='flex items-center gap-2'>
                <span className='text-2xs'>🎉</span>
                <span className='text-xs uppercase tracking-wide'>Tuesday Special 10% Applied</span>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* 체크아웃 버튼 */}
      <button className='w-full py-4 bg-white text-black text-sm font-normal uppercase tracking-super-wide cursor-pointer mt-6 transition-all hover:-translate-y-0.5 hover:shadow-lg hover:shadow-black/30'>
        Proceed to Checkout
      </button>

      <p className='mt-4 text-2xs text-white/60 text-center leading-relaxed'>
        Free shipping on all orders.
        <br />
        <span>Earn loyalty points with purchase.</span>
      </p>
    </div>
  );
};

export default OrderSummary;
