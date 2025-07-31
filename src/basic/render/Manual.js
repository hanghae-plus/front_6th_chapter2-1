import { DISCOUNT_POLICY, POINTS_POLICY } from '../data/constants.js';
import { UI_CONSTANTS } from "./constants.js";

export const ManualToggleButton = /*html*/ `
  <button id="manual-toggle-button" data-manual-toggle class="fixed top-4 right-4 bg-black text-white p-3 rounded-full hover:bg-gray-900 transition-colors z-50">
    <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
    </svg>
  </button>
`;

export const Manual = /*html*/ `
  <div id="manual-overlay" class="fixed inset-0 bg-black/50 z-40 hidden transition-opacity duration-300">
    <div id="manual-panel" class="fixed right-0 top-0 h-full w-80 bg-white shadow-2xl p-6 overflow-y-auto z-50 transform translate-x-full transition-transform duration-300">
      <!-- Close Button -->
      <button id="close-manual" class="absolute top-4 right-4 ${UI_CONSTANTS.COLORS.GRAY_TEXT} hover:${UI_CONSTANTS.COLORS.DEFAULT_TEXT}">
        <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path>
        </svg>
      </button>

      <!-- Manual Content -->
      <h2 class="text-xl font-bold mb-4">📖 이용 안내</h2>

      <!-- Discount Policy -->
      <div class="mb-6">
        <h3 class="text-base font-bold mb-3">💰 할인 정책</h3>
        <div class="space-y-3">
          <div class="bg-gray-100 rounded-lg p-3">
            <p class="font-semibold text-sm mb-1">개별 상품</p>
            <p class="${UI_CONSTANTS.COLORS.DARK_GRAY_TEXT} text-xs pl-2">
              • 키보드 10개↑: 10%<br>
              • 마우스 10개↑: 15%<br>
              • 모니터암 10개↑: 20%<br>
              • 스피커 10개↑: 25%
            </p>
          </div>
          <div class="bg-gray-100 rounded-lg p-3">
            <p class="font-semibold text-sm mb-1">전체 수량</p>
            <p class="${UI_CONSTANTS.COLORS.DARK_GRAY_TEXT} text-xs pl-2">• ${DISCOUNT_POLICY.BULK_PURCHASE_THRESHOLD}개 이상: ${(DISCOUNT_POLICY.BULK_PURCHASE_RATE * 100)}%</p>
          </div>
          <div class="bg-gray-100 rounded-lg p-3">
            <p class="font-semibold text-sm mb-1">특별 할인</p>
            <p class="${UI_CONSTANTS.COLORS.DARK_GRAY_TEXT} text-xs pl-2">
              • 화요일: +${(DISCOUNT_POLICY.TUESDAY_DISCOUNT_RATE * 100)}%<br>
              • ⚡번개세일: ${(DISCOUNT_POLICY.LIGHTNING_SALE_RATE * 100)}%<br>
              • 💝추천할인: ${(DISCOUNT_POLICY.SUGGESTED_SALE_RATE * 100)}%
            </p>
          </div>
        </div>
      </div>

      <!-- Point Policy -->
      <div class="mb-6">
        <h3 class="text-base font-bold mb-3">🎁 포인트 적립</h3>
        <div class="space-y-3">
          <div class="bg-gray-100 rounded-lg p-3">
            <p class="font-semibold text-sm mb-1">기본</p>
            <p class="${UI_CONSTANTS.COLORS.DARK_GRAY_TEXT} text-xs pl-2">• 구매액의 ${(POINTS_POLICY.BASE_RATE * 100)}%</p>
          </div>
          <div class="bg-gray-100 rounded-lg p-3">
            <p class="font-semibold text-sm mb-1">추가</p>
            <p class="${UI_CONSTANTS.COLORS.DARK_GRAY_TEXT} text-xs pl-2">
              • 화요일: ${POINTS_POLICY.TUESDAY_MULTIPLIER}배<br>
              • 키보드+마우스: +${POINTS_POLICY.KEYBOARD_MOUSE_BONUS}p<br>
              • 풀세트: +${POINTS_POLICY.FULL_SET_BONUS}p<br>
              • 10개↑: +${POINTS_POLICY.BULK_PURCHASE_BONUS[10]}p / 20개↑: +${POINTS_POLICY.BULK_PURCHASE_BONUS[20]}p / 30개↑: +${POINTS_POLICY.BULK_PURCHASE_BONUS[30]}p
            </p>
          </div>
        </div>
      </div>

      <!-- Tip -->
      <div class="border-t border-gray-200 pt-4 mt-4">
        <p class="text-xs font-bold mb-1">💡 TIP</p>
        <p class="text-2xs ${UI_CONSTANTS.COLORS.GRAY_TEXT} leading-relaxed">
          • 화요일 대량구매 = MAX 혜택<br>
          • ⚡+💝 중복 가능<br>
          • 상품4 = 품절
        </p>
      </div>
    </div>
  </div>
`;