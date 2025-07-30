// cartItems는 prodList 중에서 카드에 담긴 데이터 엔티티이며 얼마나 담았는지 수량을 추가로 갖고있다.
const SummaryDetails = ({
  totalOriginalPrice,
  cartItems,
  prodList,
  totalItemCount,
  itemDiscounts,
  isTuesday,
  totalDiscountedPrice,
}) => {
  if (totalOriginalPrice <= 0) {
    return <div id="summary-details" className="space-y-3"></div>;
  }

  return (
    <div id="summary-details" className="space-y-3">
      {cartItems.map((cartItem) => {
        const currentItem = prodList.find((x) => x.id === cartItem.id);
        const selectedQuantity = cartItem.selectedQuantity;
        const itemTotal = currentItem.price * selectedQuantity;

        return (
          <div className="flex justify-between text-xs tracking-wide text-gray-400">
            <span>
              ${currentItem.name} x ${selectedQuantity}
            </span>
            <span>₩${itemTotal.toLocaleString()}</span>
          </div>
        );
      })}

      <div className="border-t border-white/10 my-3"></div>
      <div className="flex justify-between text-sm tracking-wide">
        <span>Subtotal</span>
        <span>₩${totalOriginalPrice.toLocaleString()}</span>
      </div>

      {totalItemCount >= 30 ? (
        <div className="flex justify-between text-sm tracking-wide text-green-400">
          <span className="text-xs">🎉 대량구매 할인 (30개 이상)</span>
          <span className="text-xs">-25%</span>
        </div>
      ) : itemDiscounts.length > 0 ? (
        itemDiscounts.map((itemDiscount) => (
          <div className="flex justify-between text-sm tracking-wide text-green-400">
            <span className="text-xs">${itemDiscount.name} (10개↑)</span>
            <span className="text-xs">-${itemDiscount.discount}%</span>
          </div>
        ))
      ) : null}
      {isTuesday && totalDiscountedPrice > 0 ? (
        <div className="flex justify-between text-sm tracking-wide text-purple-400">
          <span className="text-xs">🌟 화요일 추가 할인</span>
          <span className="text-xs">-10%</span>
        </div>
      ) : null}
      <div className="flex justify-between text-sm tracking-wide text-gray-400">
        <span>Shipping</span>
        <span>Free</span>
      </div>
    </div>
  );
};

export const RightColumn = ({
  totalDiscountedPrice,
  totalOriginalPrice,
  totalDiscountRate,
  bonusPoints,
  pointsDetail,
  cartItems,
  prodList,
  totalItemCount,
  itemDiscounts,
  isTuesday,
}) => {
  const points = Math.floor(totalDiscountedPrice / 1000);

  return (
    <div className="bg-black text-white p-8 flex flex-col">
      <h2 className="text-xs font-medium mb-5 tracking-extra-wide uppercase">
        Order Summary
      </h2>
      <div className="flex-1 flex flex-col">
        <SummaryDetails
          totalOriginalPrice={totalOriginalPrice}
          cartItems={cartItems}
          prodList={prodList}
          totalItemCount={totalItemCount}
          itemDiscounts={itemDiscounts}
          isTuesday={isTuesday}
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
            className="mt-4 p-3 bg-white/10 rounded-lg hidden"
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
