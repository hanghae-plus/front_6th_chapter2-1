import type { CartItem } from "../../context/types";
import type { CartTotals } from "../../utils/cartUtils";

interface CartSummaryProps {
  items: CartItem[];
  cartTotals: CartTotals;
  loyaltyPoints: number;
  pointsDetail: string[];
}

export const CartSummary = ({
  items,
  cartTotals,
  loyaltyPoints,
  pointsDetail,
}: CartSummaryProps) => {
  const {
    subTotal,
    totalAmount,
    itemDiscounts,
    bulkDiscount,
    tuesdayDiscount,
    isTuesday,
    totalDiscountRate,
    savedAmount,
  } = cartTotals;

  return (
    <div className="bg-black text-white p-8 flex flex-col">
      <h2 className="text-xs font-medium mb-5 tracking-extra-wide uppercase">
        Order Summary
      </h2>

      <div className="flex-1 flex flex-col">
        <div className="space-y-3">
          {/* 아이템별 상세 정보 */}
          {subTotal > 0 && (
            <>
              {items.map((item) => {
                const itemTotal = item.val * item.quantity;
                return (
                  <div
                    key={item.id}
                    className="flex justify-between text-xs tracking-wide text-gray-400"
                  >
                    <span>
                      {item.name} x {item.quantity}
                    </span>
                    <span>₩{itemTotal.toLocaleString()}</span>
                  </div>
                );
              })}

              {/* 구분선과 소계 */}
              <div className="border-t border-white/10 my-3"></div>
              <div className="flex justify-between text-sm tracking-wide">
                <span>Subtotal</span>
                <span>₩{subTotal.toLocaleString()}</span>
              </div>

              {/* 할인 정보 */}
              {bulkDiscount > 0 && (
                <div className="flex justify-between text-sm tracking-wide text-green-400">
                  <span className="text-xs">🎉 대량구매 할인 (30개 이상)</span>
                  <span className="text-xs">-{bulkDiscount}%</span>
                </div>
              )}

              {/* 아이템별 할인 정보 (대량구매 할인이 없을 때만 표시) */}
              {bulkDiscount === 0 &&
                itemDiscounts.length > 0 &&
                itemDiscounts.map((item, index) => (
                  <div
                    key={index}
                    className="flex justify-between text-sm tracking-wide text-green-400"
                  >
                    <span className="text-xs">{item.name} (10개↑)</span>
                    <span className="text-xs">-{item.discount}%</span>
                  </div>
                ))}

              {/* 화요일 할인 정보 */}
              {isTuesday && tuesdayDiscount > 0 && (
                <div className="flex justify-between text-sm tracking-wide text-purple-400">
                  <span className="text-xs">🌟 화요일 추가 할인</span>
                  <span className="text-xs">-{tuesdayDiscount}%</span>
                </div>
              )}

              {/* 배송비 */}
              <div className="flex justify-between text-sm tracking-wide text-gray-400">
                <span>Shipping</span>
                <span>Free</span>
              </div>
            </>
          )}
        </div>

        <div className="mt-auto">
          {/* 할인 정보 카드 */}
          {totalDiscountRate > 0 && totalAmount > 0 && (
            <div className="bg-green-500/20 rounded-lg p-3 mb-4">
              <div className="flex justify-between items-center mb-1">
                <span className="text-xs uppercase tracking-wide text-green-400">
                  총 할인율
                </span>
                <span className="text-sm font-medium text-green-400">
                  {totalDiscountRate.toFixed(1)}%
                </span>
              </div>
              <div className="text-2xs text-gray-300">
                ₩{savedAmount.toLocaleString()} 할인되었습니다
              </div>
            </div>
          )}

          {/* 총액 */}
          <div className="pt-5 border-t border-white/10">
            <div className="flex justify-between items-baseline">
              <span className="text-sm uppercase tracking-wider">Total</span>
              <div className="text-2xl tracking-tight">
                ₩{totalAmount.toLocaleString()}
              </div>
            </div>
            <div className="text-xs text-blue-400 mt-2 text-right">
              적립 포인트: {loyaltyPoints}p
            </div>
          </div>

          {/* 화요일 특별 할인 배너 */}
          {isTuesday && (
            <div className="mt-4 p-3 bg-white/10 rounded-lg">
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

      <button className="w-full py-4 bg-white text-black text-sm font-normal uppercase tracking-super-wide cursor-pointer mt-6 transition-all hover:-translate-y-0.5 hover:shadow-lg hover:shadow-black/30">
        Proceed to Checkout
      </button>

      <p className="mt-4 text-2xs text-white/60 text-center leading-relaxed">
        Free shipping on all orders.
        <br />
        <span>Earn loyalty points with purchase.</span>
      </p>
    </div>
  );
};
