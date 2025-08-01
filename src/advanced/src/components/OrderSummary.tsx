import React from 'react';
import { CartState } from '../types/cart';
import { Product } from '../types/product';
import { calcCartTotals, calcBonusPoints } from '../utils/calculation';

interface OrderSummaryProps {
  cartState: CartState;
  productList: Product[];
}

const OrderSummary: React.FC<OrderSummaryProps> = ({
  cartState,
  productList,
}) => {
  const totals = calcCartTotals(cartState.cartItems, productList, new Date());
  const bonus = calcBonusPoints(cartState.cartItems, productList, new Date());

  return (
    <>
      <h2 className="text-xs font-medium mb-5 tracking-extra-wide uppercase">
        Order Summary
      </h2>
      <div className="flex-1 flex flex-col">
        <div id="summary-details" className="space-y-3">
          {cartState.cartItems.map((item) => {
            const product = productList.find((p) => p.id === item.id);
            if (!product) return null;
            return (
              <div
                key={item.id}
                className="flex justify-between text-xs tracking-wide text-gray-400"
              >
                <span>
                  {product.name} x {item.quantity}
                </span>
                <span data-testid="item-total-price">
                  ₩{(product.val * item.quantity).toLocaleString()}
                </span>
              </div>
            );
          })}
          {cartState.cartItems.length > 0 && (
            <>
              <div className="border-t border-white/10 my-3"></div>
              <div className="flex justify-between text-sm tracking-wide">
                <span>Subtotal</span>
                <span data-testid="subtotal-price">
                  ₩{totals.subtotal.toLocaleString()}
                </span>
              </div>
            </>
          )}
          {totals.itemCnt >= 30 && (
            <div className="flex justify-between text-sm tracking-wide text-green-400">
              <span className="text-xs">🎉 대량구매 할인 (30개 이상)</span>
              <span className="text-xs">-25%</span>
            </div>
          )}
          {totals.itemDiscounts.length > 0 &&
            totals.itemCnt < 30 &&
            totals.itemDiscounts.map((disc, index) => (
              <div
                key={index}
                className="flex justify-between text-sm tracking-wide text-green-400"
              >
                <span className="text-xs">{disc.name} (10개↑)</span>
                <span className="text-xs">-{disc.discount}%</span>
              </div>
            ))}
          {totals.isTue && totals.amount > 0 && (
            <div className="flex justify-between text-sm tracking-wide text-purple-400">
              <span className="text-xs">🌟 화요일 추가 할인</span>
              <span className="text-xs">-10%</span>
            </div>
          )}
          <div className="flex justify-between text-sm tracking-wide text-gray-400">
            <span>Shipping</span>
            <span>Free</span>
          </div>
        </div>
        <div className="mt-auto">
          <div id="discount-info" className="mb-4">
            {totals.discountRate > 0 && totals.amount > 0 && (
              <div className="bg-green-500/20 rounded-lg p-3">
                <div className="flex justify-between items-center mb-1">
                  <span className="text-xs uppercase tracking-wide text-green-400">
                    총 할인율
                  </span>
                  <span className="text-sm font-medium text-green-400">
                    {(totals.discountRate * 100).toFixed(1)}%
                  </span>
                </div>
                <div className="text-2xs text-gray-300">
                  ₩
                  {Math.round(
                    totals.originalTotal - totals.amount
                  ).toLocaleString()}{' '}
                  할인되었습니다
                </div>
              </div>
            )}
          </div>
          <div id="cart-total" className="pt-5 border-t border-white/10">
            <div className="flex justify-between items-baseline">
              <span className="text-sm uppercase tracking-wider">Total</span>
              <div
                className="text-2xl tracking-tight"
                data-testid="total-price"
              >
                ₩{Math.round(totals.amount).toLocaleString()}
              </div>
            </div>
            <div
              id="loyalty-points"
              className="text-xs text-blue-400 mt-2 text-right"
            >
              {bonus.point > 0 ? (
                <>
                  적립 포인트: <span className="font-bold">{bonus.point}p</span>
                  <br />
                  <span className="text-2xs opacity-70">
                    {bonus.details.join(', ')}
                  </span>
                </>
              ) : (
                '적립 포인트: 0p'
              )}
            </div>
          </div>
          <div
            id="tuesday-special"
            className={`mt-4 p-3 bg-white/10 rounded-lg ${totals.isTue && totals.amount > 0 ? '' : 'hidden'}`}
          >
            <div className="flex items-center gap-2">
              <span className="text-2xs">🎉</span>
              <span className="text-xs uppercase tracking-wide">
                Tuesday Special 10% Applied
              </span>
            </div>
          </div>
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
    </>
  );
};

export default OrderSummary;
