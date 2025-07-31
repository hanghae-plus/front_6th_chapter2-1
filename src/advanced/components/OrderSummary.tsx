import { useCart } from "../context/CartContext";
import { calculateTotalDiscount, calculateTuesdayDiscount } from "../services/discountService";
import { calculateTotalPoints } from "../services/pointService";

const OrderSummary = () => {
  const { state } = useCart();
  const { cartItems, totalAmount, bonusPoints } = state;

  // 실시간 상품 가격으로 계산
  const subtotal = cartItems.reduce((sum, item) => {
    const currentProduct = state.products.find(p => p.id === item.id);
    const currentPrice = currentProduct ? currentProduct.price : item.product.price;
    return sum + currentPrice * item.quantity;
  }, 0);

  const discounts = calculateTotalDiscount(cartItems, subtotal);
  const isTuesday = calculateTuesdayDiscount();
  const pointInfo = calculateTotalPoints(totalAmount, cartItems);

  const totalDiscountPercentage = discounts.reduce((sum, discount) => sum + discount.percentage, 0);

  const savedAmount = subtotal - totalAmount;

  return (
    <div className="flex-1 flex flex-col">
      <h2 className="text-xs font-medium mb-5 tracking-extra-wide uppercase">Order Summary</h2>

      <div className="flex-1 flex flex-col">
        <div className="space-y-3">
          {cartItems.map(item => {
            const currentProduct = state.products.find(p => p.id === item.id);
            const currentPrice = currentProduct ? currentProduct.price : item.product.price;
            const currentName = currentProduct ? currentProduct.name : item.product.name;

            return (
              <div key={item.id} className="flex justify-between text-xs tracking-wide text-gray-400">
                <span>
                  {currentName} x {item.quantity}
                </span>
                <span>₩{(currentPrice * item.quantity).toLocaleString()}</span>
              </div>
            );
          })}
        </div>

        {subtotal > 0 && (
          <>
            <div className="border-t border-white/10 my-3"></div>

            <div className="flex justify-between text-sm tracking-wide">
              <span>Subtotal</span>
              <span>₩{subtotal.toLocaleString()}</span>
            </div>

            {discounts.map((discount, index) => (
              <div key={index} className="flex justify-between text-sm tracking-wide text-green-400">
                <span className="text-xs">{discount.description}</span>
                <span className="text-xs">-{discount.percentage}%</span>
              </div>
            ))}

            <div className="flex justify-between text-sm tracking-wide text-gray-400">
              <span>Shipping</span>
              <span>Free</span>
            </div>
          </>
        )}
      </div>

      <div className="mt-auto">
        {totalDiscountPercentage > 0 && totalAmount > 0 && (
          <div className="bg-green-500/20 rounded-lg p-3 mb-4">
            <div className="flex justify-between items-center mb-1">
              <span className="text-xs uppercase tracking-wide text-green-400">총 할인율</span>
              <span className="text-sm font-medium text-green-400">{totalDiscountPercentage.toFixed(1)}%</span>
            </div>
            <div className="text-2xs text-gray-300">₩{Math.round(savedAmount).toLocaleString()} 할인되었습니다</div>
          </div>
        )}

        <div className="pt-5 border-t border-white/10">
          <div className="flex justify-between items-baseline">
            <span className="text-sm uppercase tracking-wider">Total</span>
            <div className="text-2xl tracking-tight">₩{Math.round(totalAmount).toLocaleString()}</div>
          </div>

          {bonusPoints > 0 ? (
            <div className="text-xs text-blue-400 mt-2 text-right">
              <div>
                적립 포인트: <span className="font-bold">{bonusPoints}p</span>
              </div>
              <div className="text-2xs opacity-70 mt-1">{pointInfo.details.join(", ")}</div>
            </div>
          ) : (
            <div className="text-xs text-blue-400 mt-2 text-right">적립 포인트: 0p</div>
          )}
        </div>

        {isTuesday && totalAmount > 0 && (
          <div className="mt-4 p-3 bg-white/10 rounded-lg">
            <div className="flex items-center gap-2">
              <span className="text-2xs">🎉</span>
              <span className="text-xs uppercase tracking-wide">Tuesday Special 10% Applied</span>
            </div>
          </div>
        )}
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

export default OrderSummary;
