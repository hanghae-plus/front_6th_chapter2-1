import type { RightColumnProps } from '../../types';
import { LoyaltyPointsTag } from './LoyaltyPointsTag';
import { TUESDAY_SPECIAL_DISCOUNT } from '../../constants';
import { isTuesday } from '../../utils/date';

export const RightColumn = ({ total, bonusPoints, pointsDetail }: RightColumnProps) => {
  const isTuesdayToday = isTuesday();

  return (
    <div className="bg-gray-900 text-white p-8 overflow-y-auto">
      <div className="flex flex-col h-full">
        <div className="mb-6">
          <h2 className="text-lg font-medium mb-4">Order Summary</h2>
          <div id="summary-details" className="space-y-3"></div>
        </div>
        <div className="mt-auto">
          <div id="discount-info" className="mb-4"></div>
          <div id="cart-total" className="pt-5 border-t border-white/10">
            <div className="flex justify-between items-baseline">
              <span className="text-sm uppercase tracking-wider">Total</span>
              <div className="text-2xl tracking-tight">₩{total.toLocaleString()}</div>
            </div>
            <div id="loyalty-points" className="text-xs text-blue-400 mt-2 text-right">
              <LoyaltyPointsTag bonusPoints={bonusPoints} pointsDetail={pointsDetail} />
            </div>
          </div>
          {isTuesdayToday && total > 0 && (
            <div id="tuesday-special" className="mt-4 p-3 bg-white/10 rounded-lg">
              <div className="flex items-center gap-2">
                <span className="text-2xs">🎉</span>
                <span className="text-xs uppercase tracking-wide">
                  Tuesday Special {TUESDAY_SPECIAL_DISCOUNT}% Applied
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
        Free shipping on all orders.<br />
        <span id="points-notice">Earn loyalty points with purchase.</span>
      </p>
    </div>
  );
}; 