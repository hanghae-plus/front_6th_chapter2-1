import React from 'react';
import { CartState } from '../types';
import { isTuesday } from '../utils/dateUtils';
import { UI_CONSTANTS } from '../constants';
import { CartSummary } from './CartSummary';
import { DiscountDisplay } from './DiscountDisplay';
import { PointsDisplay } from './PointsDisplay';
import { TuesdaySpecial } from './TuesdaySpecial';

interface CartTotalProps {
  cartState: CartState;
}

/**
 * 장바구니 총계 컴포넌트 - basic 버전과 동일한 UI
 */
export const CartTotal: React.FC<CartTotalProps> = ({
  cartState,
}) => {
  const { items, totalAmount, discountInfo, pointsInfo } = cartState;
  const tuesdaySpecial = isTuesday();

  return (
    <>
      <h2 className="text-xs font-medium mb-5 tracking-extra-wide uppercase">
        {UI_CONSTANTS.TEXT.TOTAL}
      </h2>
      <div className="flex-1 flex flex-col">
        <div id="summary-details" className="space-y-3">
          <CartSummary
            items={items}
            discountInfo={discountInfo}
            totalAmount={totalAmount}
            tuesdaySpecial={tuesdaySpecial}
          />
        </div>
        <div className="mt-auto">
          <DiscountDisplay
            discountInfo={discountInfo}
            totalAmount={totalAmount}
          />
          <div id="cart-total" className="pt-5 border-t border-white/10">
            <div className="flex justify-between items-baseline">
              <span className="text-sm uppercase tracking-wider">{UI_CONSTANTS.TEXT.TOTAL}</span>
              <div id="total-price" className="text-2xl tracking-tight">
                ₩{totalAmount.toLocaleString()}
              </div>
            </div>
            <PointsDisplay
              pointsInfo={pointsInfo}
              itemsCount={items.length}
            />
          </div>
          <TuesdaySpecial
            isTuesday={tuesdaySpecial}
            totalAmount={totalAmount}
          />
        </div>
      </div>
      <button className="w-full py-4 bg-white text-black text-sm font-normal uppercase tracking-super-wide cursor-pointer mt-6 transition-all hover:-translate-y-0.5 hover:shadow-lg hover:shadow-black/30">
        {UI_CONSTANTS.TEXT.PROCEED_TO_CHECKOUT}
      </button>
      <p className="mt-4 text-2xs text-white/60 text-center leading-relaxed">
        {UI_CONSTANTS.TEXT.FREE_SHIPPING_NOTICE}<br />
        <span id="points-notice">{UI_CONSTANTS.TEXT.POINTS_NOTICE}</span>
      </p>
    </>
  );
};