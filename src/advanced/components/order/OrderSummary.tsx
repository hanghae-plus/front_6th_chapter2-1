import React from 'react';

import type { OrderSummaryProps } from '../../types/orderSummary';

function formatPrice(price: number) {
  return price.toLocaleString('ko-KR', { style: 'currency', currency: 'KRW' });
}

const OrderSummary: React.FC<OrderSummaryProps> = ({ summary }) => {
  const { itemCnt, subTot, totalAmt, discRate, savedAmount, isTuesday, points, products, cartItems } = summary;

  return (
    <aside className="bg-black text-white p-8 flex flex-col w-full min-w-0 max-w-none h-full">
      <h2 className="text-xs font-medium mb-5 tracking-extra-wide uppercase">Order Summary</h2>
      <div className="flex-1 flex flex-col">
        <div id="summary-details" className="space-y-3 mb-4">
          {subTot > 0 ? (
            <>
              {cartItems.map((item) => {
                const product = products.find((p) => p.id === item.productId);
                if (!product) return null;
                const itemTotal = product.discountPrice * item.quantity;
                return (
                  <div key={item.productId} className="flex justify-between text-xs tracking-wide text-gray-400">
                    <span>
                      {product.name} x {item.quantity}
                    </span>
                    <span>{formatPrice(itemTotal)}</span>
                  </div>
                );
              })}
              <div className="border-t border-white/10 my-3"></div>
              <div className="flex justify-between text-sm tracking-wide">
                <span>Subtotal</span>
                <span>{formatPrice(subTot)}</span>
              </div>
              {itemCnt >= 30 && (
                <div className="flex justify-between text-sm tracking-wide text-green-400">
                  <span className="text-xs">🎉 대량구매 할인 (30개 이상)</span>
                  <span className="text-xs">-25%</span>
                </div>
              )}
              {/* 30개 미만일 때만 개별상품 할인 노출 */}
              {itemCnt < 30 && summary.itemDiscounts.length > 0 && (
                <>
                  {summary.itemDiscounts.map((item) => (
                    <div key={item.name} className="flex justify-between text-sm tracking-wide text-green-400">
                      <span className="text-xs">{item.name} (10개↑)</span>
                      <span className="text-xs">-{item.discount}%</span>
                    </div>
                  ))}
                </>
              )}
              {isTuesday && totalAmt > 0 && (
                <div className="flex justify-between text-sm tracking-wide text-purple-400">
                  <span className="text-xs">🌟 화요일 추가 할인</span>
                  <span className="text-xs">-10%</span>
                </div>
              )}
              <div className="flex justify-between text-sm tracking-wide text-gray-400">
                <span>Shipping</span>
                <span>Free</span>
              </div>
            </>
          ) : null}
        </div>
        <div className="mt-auto">
          {/* 할인 정보 */}
          {discRate > 0 && totalAmt > 0 && (
            <div id="discount-info" className="bg-green-500/20 rounded-lg p-3 mb-4">
              <div className="flex justify-between items-center mb-1">
                <span className="text-xs uppercase tracking-wide text-green-400">총 할인율</span>
                <span className="text-sm font-medium text-green-400">{(discRate * 100).toFixed(1)}%</span>
              </div>
              <div className="text-2xs text-gray-300">{formatPrice(Math.round(savedAmount))} 할인되었습니다</div>
            </div>
          )}
          <div id="cart-total" className="pt-5 border-t border-white/10">
            <div className="flex justify-between items-baseline">
              <span className="text-sm uppercase tracking-wider">Total</span>
              <div className="text-2xl tracking-tight">{formatPrice(totalAmt)}</div>
            </div>
            {subTot > 0 && (
              <div id="loyalty-points" className="text-xs text-blue-400 mt-2 text-right">
                <div>
                  적립 포인트: <span className="font-bold">{points}p</span>
                </div>
                <div className="text-2xs opacity-70 mt-1">{summary.pointDetails}</div>
              </div>
            )}
          </div>
          {isTuesday && totalAmt > 0 && (
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
        Free shipping on all orders.
        <br />
        <span id="points-notice">Earn loyalty points with purchase.</span>
      </p>
    </aside>
  );
};

export default OrderSummary;
