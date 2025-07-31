import { LoyaltyPointsTag } from './LoyaltyPointsTag.js';
import { TUESDAY_SPECIAL_DISCOUNT } from '../../constants.js';

/**
 * RightColumn 컴포넌트
 * 주문 요약 정보를 표시하는 오른쪽 컬럼을 렌더링합니다.
 * @param {Object} props - 컴포넌트 props
 * @param {number} [props.total=0] - 총 금액
 * @param {number} [props.bonusPoints=0] - 보너스 포인트
 * @param {Array} [props.pointsDetail=[]] - 포인트 상세 내역
 * @returns {string} 오른쪽 컬럼 HTML
 */
export function RightColumn({ total = 0, bonusPoints = 0, pointsDetail = [] }) {
  return /* HTML */ `
    <div class="bg-gray-900 text-white p-8 overflow-y-auto">
      <div class="flex flex-col h-full">
        <div class="mb-6">
          <h2 class="text-lg font-medium mb-4">Order Summary</h2>
          <div id="summary-details" class="space-y-3"></div>
        </div>
        <div class="mt-auto">
          <div id="discount-info" class="mb-4"></div>
          <div id="cart-total" class="pt-5 border-t border-white/10">
            <div class="flex justify-between items-baseline">
              <span class="text-sm uppercase tracking-wider">Total</span>
              <div class="text-2xl tracking-tight">₩${total.toLocaleString()}</div>
            </div>
            <div id="loyalty-points" class="text-xs text-blue-400 mt-2 text-right">
              ${LoyaltyPointsTag({ bonusPoints, pointsDetail })}
            </div>
          </div>
          <div id="tuesday-special" class="mt-4 p-3 bg-white/10 rounded-lg hidden">
            <div class="flex items-center gap-2">
              <span class="text-2xs">🎉</span>
              <span class="text-xs uppercase tracking-wide"
                >Tuesday Special ${TUESDAY_SPECIAL_DISCOUNT}% Applied</span
              >
            </div>
          </div>
        </div>
      </div>
      <button
        class="w-full py-4 bg-white text-black text-sm font-normal uppercase tracking-super-wide cursor-pointer mt-6 transition-all hover:-translate-y-0.5 hover:shadow-lg hover:shadow-black/30"
      >
        Proceed to Checkout
      </button>
      <p class="mt-4 text-2xs text-white/60 text-center leading-relaxed">
        Free shipping on all orders.<br />
        <span id="points-notice">Earn loyalty points with purchase.</span>
      </p>
    </div>
  `;
}
