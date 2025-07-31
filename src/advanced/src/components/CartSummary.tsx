import { useGlobalState } from '../providers/useGlobal';
import { DISCOUNT_THRESHOLD } from '../constants';
import { isTodayTuesday } from '../utils/isTodayTuesday';
import { findProductById } from '../libs/findProductById';

export const CartSummary = () => {
  const { productList, cartList, appState } = useGlobalState();
  const { totalBeforeDiscount, totalAfterDiscount, totalProductCount, discountedProductList } = appState;

  if (totalBeforeDiscount === 0) return null;

  const getDiscountSummary = () => {
    if (totalProductCount >= DISCOUNT_THRESHOLD.TOTAL) {
      return (
        <div className="flex justify-between text-sm tracking-wide text-green-400">
          <span className="text-xs">🎉 대량구매 할인 (30개 이상)</span>
          <span className="text-xs">-25%</span>
        </div>
      );
    } else if (discountedProductList.length > 0) {
      return (
        <>
          {discountedProductList.map((item) => (
            <div key={item.name} className="flex justify-between text-sm tracking-wide text-green-400">
              <span className="text-xs">{item.name} (10개↑)</span>
              <span className="text-xs">-{item.discount}%</span>
            </div>
          ))}
        </>
      );
    }
  };

  return (
    <div id="summary-details" className="space-y-3">
      {cartList.map((item) => {
        const product = findProductById(productList, item.id);
        if (!product) return null;

        const itemTotalPrice = product.changedPrice * item.count;

        return (
          <div key={item.id} className="flex justify-between text-xs tracking-wide text-gray-400">
            <span>
              {product.name} x {item.count}
            </span>
            <span>₩{itemTotalPrice.toLocaleString()}</span>
          </div>
        );
      })}

      {/* divider */}
      <div className="border-t border-white/10 my-3" />

      <div className="flex justify-between text-sm tracking-wide">
        <span>Subtotal</span>
        <span>₩{totalBeforeDiscount.toLocaleString()}</span>
      </div>

      {getDiscountSummary()}

      {isTodayTuesday() && totalAfterDiscount > 0 && (
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
  );
};

export default CartSummary;
