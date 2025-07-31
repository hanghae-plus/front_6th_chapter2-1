import { CartItem, Product } from '@/types/index';

// App.tsx에서 OrderSummary로 전달될 props의 인터페이스 정의
interface OrderSummaryProps {
  cartItems: CartItem[];
  products: Product[];
  subtotal: number;
  totalAmt: number;
  discountRate: number;
  savedAmount: number;
  loyaltyPoints: number;
  itemDiscounts: { name: string; discount: number }[];
  isTuesday: boolean;
}

const OrderSummary = ({
  cartItems,
  products,
  subtotal,
  totalAmt,
  discountRate,
  savedAmount,
  loyaltyPoints,
  itemDiscounts,
  isTuesday,
}: OrderSummaryProps) => {
  return (
    <div className="bg-black text-white p-8 flex flex-col">
      <h2 className="text-xs font-medium mb-5 tracking-extra-wide uppercase">Order Summary</h2>
      <div className="flex-1 flex flex-col">
        <div id="summary-details" className="space-y-3">
          {/* 장바구니 아이템별 요약 동적 렌더링 */}
          {cartItems.length > 0 ? (
            cartItems.map((cartItem) => {
              const product = products.find((p) => p.id === cartItem.id);
              if (!product) return null; // 상품 정보를 찾을 수 없으면 렌더링하지 않음

              const itemTotal = product.val * cartItem.quantity;
              return (
                <div
                  key={`summary-${cartItem.id}`}
                  className="flex justify-between text-xs tracking-wide text-gray-400"
                >
                  <span>
                    {product.name} x {cartItem.quantity}
                  </span>
                  <span>₩{itemTotal.toLocaleString()}</span>
                </div>
              );
            })
          ) : (
            <p className="text-gray-400 text-sm">장바구니가 비어있습니다.</p>
          )}

          {/* 소계 (상품이 있을 때만 표시) */}
          {cartItems.length > 0 && (
            <>
              <div className="border-t border-white/10 my-3"></div>
              <div className="flex justify-between text-sm tracking-wide">
                <span>Subtotal</span>
                <span>₩{subtotal.toLocaleString()}</span>
              </div>
            </>
          )}

          {/* 개별 아이템 할인 정보 */}
          {itemDiscounts.length > 0 &&
            itemDiscounts.map((disc, index) => (
              <div
                key={`item-disc-${index}`}
                className="flex justify-between text-sm tracking-wide text-green-400"
              >
                <span className="text-xs">{disc.name} (개별 할인)</span>
                <span className="text-xs">-{disc.discount}%</span>
              </div>
            ))}

          {/* 배송비 (항상 Free) */}
          {cartItems.length > 0 && ( // 장바구니에 아이템이 있을 때만 표시
            <div className="flex justify-between text-sm tracking-wide text-gray-400">
              <span>Shipping</span>
              <span>Free</span>
            </div>
          )}
        </div>

        <div className="mt-auto">
          {/* 할인 정보 표시 (총 할인율 또는 절약 금액) */}
          {discountRate > 0 && totalAmt > 0 && (
            <div id="discount-info" className="bg-green-500/20 rounded-lg p-3 mb-4">
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
          )}

          <div id="cart-total" className="pt-5 border-t border-white/10">
            <div className="flex justify-between items-baseline">
              <span className="text-sm uppercase tracking-wider">Total</span>
              <div className="text-2xl tracking-tight">
                ₩{Math.round(totalAmt).toLocaleString()}
              </div>
            </div>
            {/* 적립 포인트 표시 */}
            <div id="loyalty-points" className="text-xs text-blue-400 mt-2 text-right">
              <div>
                적립 포인트: <span className="font-bold">{loyaltyPoints.toLocaleString()}p</span>
              </div>
              {/* 포인트 상세 내역은 App.tsx에서 계산된 총량만 전달되므로, 상세 내역은 일반적인 메시지로 대체 */}
              <div className="text-2xs opacity-70 mt-1">구매 시 로열티 포인트가 적립됩니다.</div>
            </div>
          </div>
          {/* 화요일 특별 할인 메시지 (isTuesday prop에 따라 동적 표시) */}
          {isTuesday &&
            totalAmt > 0 && ( // 화요일이고 총액이 0보다 클 때만 표시
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
      <button
        className="w-full py-4 bg-white text-black text-sm font-normal uppercase tracking-super-wide cursor-pointer mt-6 transition-all hover:-translate-y-0.5 hover:shadow-lg hover:shadow-black/30"
        // onClick 등 결제 처리 로직은 App.tsx에서 콜백으로 넘겨줄 수 있습니다.
      >
        Proceed to Checkout
      </button>
      <p className="mt-4 text-2xs text-white/60 text-center leading-relaxed">
        Free shipping on all orders.
        <br />
        <span id="points-notice">Earn loyalty points with purchase.</span>
      </p>
    </div>
  );
};

export default OrderSummary;
