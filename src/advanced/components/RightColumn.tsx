import { SPECIAL_DAY_DISCOUNT_RATE } from '../constants/discount';
import { useCartPaidPrice, useCartTotalPrice } from '../hooks/cart';
import { formatSpecialDay } from '../utils/day';
import { formatDiscountRate } from '../utils/discount';
import { formatPrice } from '../utils/price';
import { Point } from './Point';
import { SummaryDetails } from './SummaryDetails';

export function RightColumn() {
  const paidPrice = useCartPaidPrice();
  const totalPrice = useCartTotalPrice();
  const savePrice = totalPrice - paidPrice;
  const discountRate = 1 - paidPrice / totalPrice;

  return (
    <div className="bg-black text-white p-8 flex flex-col">
      <h2 className="text-xs font-medium mb-5 tracking-extra-wide uppercase">
        Order Summary
      </h2>
      <div className="flex-1 flex flex-col">
        <SummaryDetails />
        <div className="mt-auto">
          <div className="mb-4">
            {discountRate > 0 && (
              <div className="bg-green-500/20 rounded-lg p-3">
                <div className="flex justify-between items-center mb-1">
                  <span className="text-xs uppercase tracking-wide text-green-400">
                    총 할인율
                  </span>
                  <span className="text-sm font-medium text-green-400">
                    {formatDiscountRate({
                      rate: discountRate,
                      signDisplay: 'never',
                    })}
                  </span>
                </div>
                <div className="text-2xs text-gray-300">
                  {formatPrice({ price: Math.round(savePrice) })} 할인되었습니다
                </div>
              </div>
            )}
          </div>
          <div className="pt-5 border-t border-white/10">
            <div className="flex justify-between items-baseline">
              <span className="text-sm uppercase tracking-wider">Total</span>
              <div className="text-2xl tracking-tight">
                {formatPrice({ price: paidPrice })}
              </div>
            </div>
            <Point />
          </div>
          <div className="mt-4 p-3 bg-white/10 rounded-lg hidden">
            <div className="flex items-center gap-2">
              <span className="text-2xs">🎉</span>
              <span className="text-xs uppercase tracking-wide">
                {formatSpecialDay('en')} Special{' '}
                {formatDiscountRate({
                  rate: SPECIAL_DAY_DISCOUNT_RATE,
                  signDisplay: 'never',
                })}{' '}
                Applied
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
        <span id="${POINTS_NOTICE_ID}">Earn loyalty points with purchase.</span>
      </p>
    </div>
  );
}
