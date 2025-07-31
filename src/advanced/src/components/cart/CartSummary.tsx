interface CartSummaryProps {
  total: number;
  loyaltyPoints: number;
  discountInfo: string;
  isTuesdaySpecial: boolean;
}

export const CartSummary = ({
  total,
  loyaltyPoints,
  discountInfo,
  isTuesdaySpecial,
}: CartSummaryProps) => {
  return (
    <div className="bg-black text-white p-8 flex flex-col">
      <h2 className="text-xs font-medium mb-5 tracking-extra-wide uppercase">
        Order Summary
      </h2>

      <div className="flex-1 flex flex-col">
        <div className="space-y-3">
          {/* 여기에 장바구니 아이템들이 들어갈 예정 */}
        </div>

        <div className="mt-auto">
          {discountInfo && (
            <div className="mb-4 text-sm text-blue-400">{discountInfo}</div>
          )}

          <div className="pt-5 border-t border-white/10">
            <div className="flex justify-between items-baseline">
              <span className="text-sm uppercase tracking-wider">Total</span>
              <div className="text-2xl tracking-tight">
                ₩{total.toLocaleString()}
              </div>
            </div>
            <div className="text-xs text-blue-400 mt-2 text-right">
              적립 포인트: {loyaltyPoints}p
            </div>
          </div>

          {isTuesdaySpecial && (
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
