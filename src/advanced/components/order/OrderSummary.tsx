import { useCart } from '../../contexts/CartContext';

const OrderSummary = () => {
  const { cartItems, getTotalAmount } = useCart();

  const calculateSubtotal = () => {
    return cartItems.reduce((total, item) => {
      return total + item.product.price * item.quantity;
    }, 0);
  };

  const calculateTotalWithDiscount = () => {
    return cartItems.reduce((total, item) => {
      const originalPrice = item.product.price * item.quantity;
      const discountedPrice = originalPrice * (1 - item.product.discount);
      return total + discountedPrice;
    }, 0);
  };

  const calculatePoints = () => {
    const subtotal = calculateSubtotal();
    const basePoints = Math.floor(subtotal / 1000);

    // 화요일 특별 포인트 (2배)
    const today = new Date();
    const isTuesday = today.getDay() === 2;
    const tuesdayBonus = isTuesday ? basePoints : 0;

    // 세트 구매 보너스 (키보드 + 마우스)
    const hasKeyboard = cartItems.some((item) => item.product.id === 'p1');
    const hasMouse = cartItems.some((item) => item.product.id === 'p2');
    const setBonus = hasKeyboard && hasMouse ? 50 : 0;

    // 풀세트 구매 보너스 (모든 상품)
    const fullSetBonus = cartItems.length >= 5 ? 100 : 0;

    return {
      base: basePoints,
      tuesday: tuesdayBonus,
      set: setBonus,
      fullSet: fullSetBonus,
      total: basePoints + tuesdayBonus + setBonus + fullSetBonus,
    };
  };

  const subtotal = calculateSubtotal();
  const total = calculateTotalWithDiscount();
  const points = calculatePoints();
  const isTuesday = new Date().getDay() === 2;

  return (
    <div className="bg-black text-white p-8 flex flex-col">
      <h2 className="text-xs font-medium mb-5 tracking-extra-wide uppercase">Order Summary</h2>
      <div className="flex-1 flex flex-col">
        <div id="summary-details" className="space-y-3">
          {cartItems.length === 0 ? (
            <div className="text-xs tracking-wide text-gray-400 text-center py-4">
              장바구니가 비어있습니다.
            </div>
          ) : (
            cartItems.map((item) => {
              const originalPrice = item.product.price * item.quantity;
              const discountedPrice = originalPrice * (1 - item.product.discount);
              return (
                <div
                  key={item.product.id}
                  className="flex justify-between text-xs tracking-wide text-gray-400"
                >
                  <span>
                    {item.product.name} x {item.quantity}
                  </span>
                  <span>₩{Math.round(discountedPrice).toLocaleString()}</span>
                </div>
              );
            })
          )}

          {cartItems.length > 0 && (
            <>
              <div className="border-t border-white/10 my-3"></div>
              <div className="flex justify-between text-sm tracking-wide">
                <span>Subtotal</span>
                <span>₩{subtotal.toLocaleString()}</span>
              </div>

              <div className="flex justify-between text-sm tracking-wide text-gray-400">
                <span>Shipping</span>
                <span>Free</span>
              </div>
            </>
          )}
        </div>
        <div className="mt-auto">
          <div id="discount-info" className="mb-4"></div>
          <div id="cart-total" className="pt-5 border-t border-white/10">
            <div className="flex justify-between items-baseline">
              <span className="text-sm uppercase tracking-wider">Total</span>
              <div className="text-2xl tracking-tight">₩{Math.round(total).toLocaleString()}</div>
            </div>
            {cartItems.length > 0 && (
              <div id="loyalty-points" className="text-xs text-blue-400 mt-2 text-right block">
                <div>
                  적립 포인트: <span className="font-bold">{points.total}p</span>
                </div>
                <div className="text-2xs opacity-70 mt-1">
                  기본: {points.base}p{points.set > 0 && `, 키보드+마우스 세트 +${points.set}p`}
                  {points.fullSet > 0 && `, 풀세트 구매 +${points.fullSet}p`}
                </div>
              </div>
            )}
          </div>
          {isTuesday && cartItems.length > 0 && (
            <div id="tuesday-special" className="mt-4 p-3 bg-white/10 rounded-lg">
              <div className="flex items-center gap-2">
                <span className="text-2xs">🎉</span>
                <span className="text-xs uppercase tracking-wide">Tuesday Special 10% Applied</span>
              </div>
            </div>
          )}
        </div>
      </div>
      <button
        className="w-full py-4 bg-white text-black text-sm font-normal uppercase tracking-super-wide cursor-pointer mt-6 transition-all hover:-translate-y-0.5 hover:shadow-lg hover:shadow-black/30 disabled:bg-gray-600 disabled:cursor-not-allowed"
        disabled={cartItems.length === 0}
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
