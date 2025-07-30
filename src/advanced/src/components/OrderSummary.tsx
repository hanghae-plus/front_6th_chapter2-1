import { useCart } from '../hooks/useCart';

export default function OrderSummary() {
  const { state } = useCart();
  return (
    <div className="bg-black text-white p-8 flex flex-col">
      <h2 className="text-xs font-medium mb-5 tracking-extra-wide uppercase">
        Order Summary
      </h2>
      <div className="flex-1 flex flex-col">
        <div id="summary-details" className="space-y-3">
          {state.items.map((item) => (
            <div key={item.id} className="flex justify-between text-xs tracking-wide text-gray-400">
              <span>{item.name} x {item.quantity}</span>
              <span>₩{(item.price * item.quantity).toLocaleString()}</span>
            </div>
          ))}

          <div className="border-t border-white/10 my-3"></div>
          <div className="flex justify-between text-sm tracking-wide">
            <span>Subtotal</span>
            <span>₩{state.originalAmount.toLocaleString()}</span>
          </div>

          {state.appliedDiscounts.length > 0 && (
            <div className="space-y-1 my-2">
              {state.appliedDiscounts.map((discount, index) => {
                // "상품명 X% 할인" 형태를 파싱
                const match = discount.match(/^(.+?)\s+(\d+)%\s+할인$/);
                if (match) {
                  const [, productName, percentage] = match;
                  return (
                    <div key={index} className="flex justify-between text-sm tracking-wide text-green-400">
                      <span className="text-xs">{productName} (10개↑)</span>
                      <span className="text-xs">-{percentage}%</span>
                    </div>
                  );
                }
                // 대량 구매나 화요일 특가 등 다른 할인
                return (
                  <div key={index} className="flex justify-between text-sm tracking-wide text-green-400">
                    <span className="text-xs">{discount}</span>
                    <span className="text-xs">적용</span>
                  </div>
                );
              })}
            </div>
          )}

          <div className="flex justify-between text-sm tracking-wide text-gray-400">
            <span>Shipping</span>
            <span>Free</span>
          </div>
        </div>
        <div className="mt-auto">
          {state.discountAmount > 0 && (
            <div className="bg-green-500/20 rounded-lg p-3 mb-4">
              <div className="flex justify-between items-center mb-1">
                <span className="text-xs uppercase tracking-wide text-green-400">총 할인율</span>
                <span className="text-sm font-medium text-green-400">
                  {((state.discountAmount / state.realOriginalAmount) * 100).toFixed(1)}%
                </span>
              </div>
              <div className="text-2xs text-gray-300">
                ₩{state.discountAmount.toLocaleString()} 할인되었습니다
              </div>
            </div>
          )}
          <div id="discount-info" className="mb-4"></div>
          <div id="cart-total" className="pt-5 border-t border-white/10">
            <div className="flex justify-between items-baseline">
              <span className="text-sm uppercase tracking-wider">Total</span>
              <div className="text-2xl tracking-tight">₩{state.totalAmount.toLocaleString()}</div>
            </div>
            {state.loyaltyPoints > 0 && (
              <div
                id="loyalty-points"
                className="text-xs text-blue-400 mt-2 text-right"
                style={{ display: 'block' }}
              >
                <div>
                  적립 포인트: <span className="font-bold">{state.loyaltyPoints}p</span>
                </div>
                <div className="text-2xs opacity-70 mt-1">
                  {state.pointsBreakdown.join(', ')}
                </div>
              </div>
            )}
          </div>
          {(() => {
            const isTuesday = new Date().getDay() === 2;
            const hasTuesdayDiscount = state.appliedDiscounts.some(discount => 
              discount.includes('화요일 특가')
            );
            const hasTuesdayPoints = state.pointsBreakdown.some(breakdown => 
              breakdown.includes('화요일')
            );
            
            return (isTuesday && (hasTuesdayDiscount || hasTuesdayPoints)) ? (
              <div
                id="tuesday-special"
                className="mt-4 p-3 bg-white/10 rounded-lg"
              >
                <div className="flex items-center gap-2">
                  <span className="text-2xs">🎉</span>
                  <span className="text-xs uppercase tracking-wide">
                    Tuesday Special Applied
                  </span>
                </div>
                <div className="text-2xs opacity-70 mt-1">
                  {hasTuesdayDiscount && "10% 추가 할인"}
                  {hasTuesdayDiscount && hasTuesdayPoints && " + "}
                  {hasTuesdayPoints && "포인트 2배 적립"}
                </div>
              </div>
            ) : null;
          })()}
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
    </div>
  );
}
