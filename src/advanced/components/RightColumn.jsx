import { SummaryDetails } from "./SummaryDetails";
import { getCalculatePoints } from "../services/point";
import { isTuesday } from "../utils/day";

export const RightColumn = ({
  productList,
  cartItems = [],
  itemDiscounts,
  totalItemCount,
  totalDiscountRate = 0,
  totalOriginalPrice = 0,
  totalDiscountedPrice = 0,
}) => {
  const points = Math.floor(totalDiscountedPrice / 1000);

  const { bonusPoints, pointsDetail } = getCalculatePoints({
    totalItemCount,
    totalDiscountedPrice,
    cartItems,
  });

  return (
    <div className="bg-black text-white p-8 flex flex-col">
      <h2 className="text-xs font-medium mb-5 tracking-extra-wide uppercase">
        Order Summary
      </h2>
      <div className="flex-1 flex flex-col">
        <SummaryDetails
          productList={productList}
          cartItems={cartItems}
          itemDiscounts={itemDiscounts}
          totalItemCount={totalItemCount}
          totalOriginalPrice={totalOriginalPrice}
          totalDiscountedPrice={totalDiscountedPrice}
        />
        <div className="mt-auto">
          <div id="discount-info" className="mb-4">
            {totalDiscountRate > 0 && totalDiscountedPrice > 0 ? (
              <div className="bg-green-500/20 rounded-lg p-3">
                <div className="flex justify-between items-center mb-1">
                  <span className="text-xs uppercase tracking-wide text-green-400">
                    총 할인율
                  </span>
                  <span className="text-sm font-medium text-green-400">
                    {`${(totalDiscountRate * 100).toFixed(1)}%`}
                  </span>
                </div>
                <div className="text-2xs text-gray-300">
                  {`₩${Math.round(totalOriginalPrice - totalDiscountedPrice).toLocaleString()} 할인되었습니다`}
                </div>
              </div>
            ) : null}
          </div>
          <div id="cart-total" className="pt-5 border-t border-white/10">
            <div className="flex justify-between items-baseline">
              <span className="text-sm uppercase tracking-wider">Total</span>
              <div className="text-2xl tracking-tight">
                {`₩${Math.round(totalDiscountedPrice).toLocaleString()}`}
              </div>
            </div>
            {cartItems.length === 0 ? null : (
              <div
                id="loyalty-points"
                className="text-xs text-blue-400 mt-2 text-right"
              >
                {bonusPoints > 0 ? (
                  <>
                    <div>
                      적립 포인트:{" "}
                      <span className="font-bold">{bonusPoints}p</span>
                    </div>
                    <div className="text-2xs opacity-70 mt-1">
                      {pointsDetail.join(", ")}
                    </div>
                  </>
                ) : (
                  `적립 포인트: ${points > 0 ? points : 0}p`
                )}
              </div>
            )}
          </div>
          <div
            id="tuesday-special"
            className={`mt-4 p-3 bg-white/10 rounded-lg ${
              isTuesday() && totalDiscountedPrice > 0 ? "" : "hidden"
            }`}
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
    </div>
  );
};
