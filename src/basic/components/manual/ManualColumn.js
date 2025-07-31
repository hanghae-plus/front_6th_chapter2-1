import {
  INDIVIDUAL_PRODUCT_DISCOUNT_THRESHOLD,
  PRODUCT_DISCOUNTS,
  KEYBOARD,
  MOUSE,
  MONITOR_ARM,
  SPEAKER,
  BULK_PURCHASE_THRESHOLD,
  BULK_PURCHASE_DISCOUNT,
  TUESDAY_SPECIAL_DISCOUNT,
  LIGHTNING_SALE_DISCOUNT,
  SUGGEST_SALE_DISCOUNT,
  TUESDAY_POINTS_MULTIPLIER,
  BONUS_POINTS,
  BONUS_POINTS_THRESHOLDS,
} from '../../constants.js';

/**
 * ManualColumn 컴포넌트
 * 매뉴얼 컬럼을 렌더링합니다. 할인 정책과 포인트 적립 정보를 포함합니다.
 * @returns {string} 매뉴얼 컬럼 HTML
 */
export function ManualColumn() {
  return /* HTML */ `
    <div
      id="manual-column"
      class="fixed right-0 top-0 h-full w-80 bg-white shadow-2xl p-6 overflow-y-auto z-50 transform translate-x-full transition-transform duration-300"
    >
      <button
        class="absolute top-4 right-4 text-gray-500 hover:text-black"
        onclick="document.querySelector('.fixed.inset-0').classList.add('hidden'); this.parentElement.classList.add('translate-x-full')"
      >
        <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path
            stroke-linecap="round"
            stroke-linejoin="round"
            stroke-width="2"
            d="M6 18L18 6M6 6l12 12"
          ></path>
        </svg>
      </button>
      <h2 class="text-xl font-bold mb-4">📖 이용 안내</h2>
      <div class="mb-6">
        <h3 class="text-base font-bold mb-3">💰 할인 정책</h3>
        <div class="space-y-3">
          <div class="bg-gray-100 rounded-lg p-3">
            <p class="font-semibold text-sm mb-1">개별 상품</p>
            <p class="text-gray-700 text-xs pl-2">
              • 키보드 ${INDIVIDUAL_PRODUCT_DISCOUNT_THRESHOLD}개↑:
              ${PRODUCT_DISCOUNTS[KEYBOARD]}%<br />
              • 마우스 ${INDIVIDUAL_PRODUCT_DISCOUNT_THRESHOLD}개↑: ${PRODUCT_DISCOUNTS[MOUSE]}%<br />
              • 모니터암 ${INDIVIDUAL_PRODUCT_DISCOUNT_THRESHOLD}개↑:
              ${PRODUCT_DISCOUNTS[MONITOR_ARM]}%<br />
              • 스피커 ${INDIVIDUAL_PRODUCT_DISCOUNT_THRESHOLD}개↑: ${PRODUCT_DISCOUNTS[SPEAKER]}%
            </p>
          </div>
          <div class="bg-gray-100 rounded-lg p-3">
            <p class="font-semibold text-sm mb-1">전체 수량</p>
            <p class="text-gray-700 text-xs pl-2">
              • ${BULK_PURCHASE_THRESHOLD}개 이상: ${BULK_PURCHASE_DISCOUNT}%
            </p>
          </div>
          <div class="bg-gray-100 rounded-lg p-3">
            <p class="font-semibold text-sm mb-1">특별 할인</p>
            <p class="text-gray-700 text-xs pl-2">
              • 화요일: +${TUESDAY_SPECIAL_DISCOUNT}%<br />
              • ⚡번개세일: ${LIGHTNING_SALE_DISCOUNT}%<br />
              • 💝추천할인: ${SUGGEST_SALE_DISCOUNT}%
            </p>
          </div>
        </div>
      </div>
      <div class="mb-6">
        <h3 class="text-base font-bold mb-3">🎁 포인트 적립</h3>
        <div class="space-y-3">
          <div class="bg-gray-100 rounded-lg p-3">
            <p class="font-semibold text-sm mb-1">기본</p>
            <p class="text-gray-700 text-xs pl-2">• 구매액의 0.1%</p>
          </div>
          <div class="bg-gray-100 rounded-lg p-3">
            <p class="font-semibold text-sm mb-1">추가</p>
            <p class="text-gray-700 text-xs pl-2">
              • 화요일: ${TUESDAY_POINTS_MULTIPLIER}배<br />
              • 키보드+마우스: +${BONUS_POINTS.KEYBOARD_MOUSE_SET}p<br />
              • 풀세트: +${BONUS_POINTS.FULL_SET}p<br />
              • ${BONUS_POINTS_THRESHOLDS.SMALL}개↑: +${BONUS_POINTS.BULK_PURCHASE.SMALL}p /
              ${BONUS_POINTS_THRESHOLDS.MEDIUM}개↑: +${BONUS_POINTS.BULK_PURCHASE.MEDIUM}p /
              ${BONUS_POINTS_THRESHOLDS.LARGE}개↑: +${BONUS_POINTS.BULK_PURCHASE.LARGE}p
            </p>
          </div>
        </div>
      </div>
      <div class="border-t border-gray-200 pt-4 mt-4">
        <p class="text-xs font-bold mb-1">💡 TIP</p>
        <p class="text-2xs text-gray-600 leading-relaxed">
          • 화요일 대량구매 = MAX 혜택<br />
          • ⚡+💝 중복 가능<br />
          • 상품4 = 품절
        </p>
      </div>
    </div>
  `;
}
