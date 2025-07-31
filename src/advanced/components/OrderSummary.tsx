import React from 'react';
import { CartItem, Product } from '../types';

interface OrderSummaryProps {
  cartItems: CartItem[];
  products: Product[];
  totalAmount: number;
  finalTotal: number;
  discountRate: number;
  savedAmount: number;
  loyaltyPoints: number;
  pointsDetail: string[];
}

export const OrderSummary: React.FC<OrderSummaryProps> = ({
  cartItems,
  products,
  totalAmount,
  finalTotal,
  discountRate,
  savedAmount,
  loyaltyPoints,
  pointsDetail
}) => {
  const today = new Date();
  const isTuesday = today.getDay() === 2;

  return (
    <div className="bg-black text-white p-8 flex flex-col">
      <h2 className="text-xs font-medium mb-5 tracking-extra-wide uppercase">
        Order Summary
      </h2>
      
      <div className="flex-1 flex flex-col">
        <div id="summary-details" className="space-y-3">
          {cartItems.map((item) => {
            const product = products.find(p => p.id === item.id);
            if (!product) return null;
            
            const itemTotal = product.val * item.quantity;
            return (
              <div key={item.id} className="flex justify-between text-xs tracking-wide text-gray-400">
                <span>{product.name} x {item.quantity}</span>
                <span>₩{itemTotal.toLocaleString()}</span>
              </div>
            );
          })}
          
          {totalAmount > 0 && (
            <>
              <div className="border-t border-white/10 my-3"></div>
              <div className="flex justify-between text-sm tracking-wide">
                <span>Subtotal</span>
                <span>₩{totalAmount.toLocaleString()}</span>
              </div>
              
              {/* Bulk discount */}
              {cartItems.reduce((sum, item) => sum + item.quantity, 0) >= 30 && (
                <div className="flex justify-between text-sm tracking-wide text-green-400">
                  <span className="text-xs">🎉 대량구매 할인 (30개 이상)</span>
                  <span className="text-xs">-25%</span>
                </div>
              )}
              
              {/* Tuesday special */}
              {isTuesday && finalTotal > 0 && (
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
          )}
        </div>
        
        <div className="mt-auto">
          {/* Discount info */}
          {discountRate > 0 && finalTotal > 0 && (
            <div id="discount-info" className="mb-4">
              <div className="bg-green-500/20 rounded-lg p-3">
                <div className="flex justify-between items-center mb-1">
                  <span className="text-xs uppercase tracking-wide text-green-400">총 할인율</span>
                  <span className="text-sm font-medium text-green-400">
                    {(discountRate * 100).toFixed(1)}%
                  </span>
                </div>
                <div className="text-2xs text-gray-300">
                  ₩{Math.round(savedAmount).toLocaleString()} 할인되었습니다
                </div>
              </div>
            </div>
          )}
          
          {/* Cart total */}
          <div id="cart-total" className="pt-5 border-t border-white/10">
            <div className="flex justify-between items-baseline">
              <span className="text-sm uppercase tracking-wider">Total</span>
              <div className="text-2xl tracking-tight">₩{Math.round(finalTotal).toLocaleString()}</div>
            </div>
            <div id="loyalty-points" className="text-xs text-blue-400 mt-2 text-right">
              {loyaltyPoints > 0 ? (
                <>
                  <div>적립 포인트: <span className="font-bold">{loyaltyPoints}p</span></div>
                  <div className="text-2xs opacity-70 mt-1">{pointsDetail.join(', ')}</div>
                </>
              ) : (
                '적립 포인트: 0p'
              )}
            </div>
          </div>
          
          {/* Tuesday special notice */}
          {isTuesday && finalTotal > 0 && (
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
        Free shipping on all orders.<br/>
        <span id="points-notice">Earn loyalty points with purchase.</span>
      </p>
    </div>
  );
}; 