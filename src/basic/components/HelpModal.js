// ==========================================
// 도움말 모달 컴포넌트
// ==========================================

import {
  THRESHOLDS,
  DISCOUNT_RATES,
  POINT_BONUSES,
} from '../constant/index.js';

/**
 * 도움말 모달 생성
 */
export function HelpModal() {
  const manualToggle = document.createElement('button');
  const manualOverlay = document.createElement('div');
  const manualColumn = document.createElement('div');

  // 💡 도움말 버튼 생성
  manualToggle.className =
    'fixed top-4 right-4 bg-black text-white p-3 rounded-full hover:bg-gray-900 transition-colors z-50';
  manualToggle.innerHTML = `
    <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
    </svg>
  `;

  // 💡 도움말 모달 생성
  manualOverlay.className =
    'fixed inset-0 bg-black/50 z-40 hidden transition-opacity duration-300';
  manualColumn.className =
    'fixed right-0 top-0 h-full w-80 bg-white shadow-2xl p-6 overflow-y-auto z-50 transform translate-x-full transition-transform duration-300';
  manualColumn.innerHTML = `
    <button class="absolute top-4 right-4 text-gray-500 hover:text-black" onclick="document.querySelector('.fixed.inset-0').classList.add('hidden'); this.parentElement.classList.add('translate-x-full')">
      <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path>
      </svg>
    </button>
    <h2 class="text-xl font-bold mb-4">📖 이용 안내</h2>
    <div class="mb-6">
                      <h3 class="text-base font-bold mb-3">할인 정책</h3>
      <div class="space-y-3">
        <div class="bg-gray-100 rounded-lg p-3">
          <p class="font-semibold text-sm mb-1">개별 상품</p>
          <p class="text-gray-700 text-xs pl-2">
            • 키보드 ${THRESHOLDS.ITEM_DISCOUNT_MIN}개↑: ${DISCOUNT_RATES.KEYBOARD * 100}%<br>
            • 마우스 ${THRESHOLDS.ITEM_DISCOUNT_MIN}개↑: ${DISCOUNT_RATES.MOUSE * 100}%<br>
            • 모니터암 ${THRESHOLDS.ITEM_DISCOUNT_MIN}개↑: ${DISCOUNT_RATES.MONITOR_ARM * 100}%<br>
            • 스피커 ${THRESHOLDS.ITEM_DISCOUNT_MIN}개↑: ${DISCOUNT_RATES.SPEAKER * 100}%
          </p>
        </div>
        <div class="bg-gray-100 rounded-lg p-3">
          <p class="font-semibold text-sm mb-1">전체 수량</p>
          <p class="text-gray-700 text-xs pl-2">• ${THRESHOLDS.BULK_DISCOUNT_MIN}개 이상: ${DISCOUNT_RATES.BULK_DISCOUNT * 100}%</p>
        </div>
        <div class="bg-gray-100 rounded-lg p-3">
          <p class="font-semibold text-sm mb-1">특별 할인</p>
          <p class="text-gray-700 text-xs pl-2">
            • 화요일: +${DISCOUNT_RATES.TUESDAY_DISCOUNT * 100}%<br>
            • ⚡번개세일: ${DISCOUNT_RATES.LIGHTNING_SALE * 100}%<br>
            • 💝추천할인: ${DISCOUNT_RATES.SUGGEST_SALE * 100}%
          </p>
        </div>
      </div>
    </div>
    <div class="mb-6">
                      <h3 class="text-base font-bold mb-3">포인트 적립</h3>
      <div class="space-y-3">
        <div class="bg-gray-100 rounded-lg p-3">
          <p class="font-semibold text-sm mb-1">기본</p>
          <p class="text-gray-700 text-xs pl-2">• 구매액의 ${((1 / THRESHOLDS.POINTS_PER_WON) * 100).toFixed(1)}%</p>
        </div>
        <div class="bg-gray-100 rounded-lg p-3">
          <p class="font-semibold text-sm mb-1">추가</p>
          <p class="text-gray-700 text-xs pl-2">
            • 화요일: ${POINT_BONUSES.TUESDAY_MULTIPLIER}배<br>
            • 키보드+마우스: +${POINT_BONUSES.KEYBOARD_MOUSE_SET}p<br>
            • 풀세트: +${POINT_BONUSES.FULL_SET}p<br>
            • ${THRESHOLDS.ITEM_DISCOUNT_MIN}개↑: +${POINT_BONUSES.BULK_10}p / ${THRESHOLDS.BULK_20_MIN}개↑: +${POINT_BONUSES.BULK_20}p / ${THRESHOLDS.BULK_DISCOUNT_MIN}개↑: +${POINT_BONUSES.BULK_30}p
          </p>
        </div>
      </div>
    </div>
    <div class="border-t border-gray-200 pt-4 mt-4">
      <p class="text-xs font-bold mb-1">💡 TIP</p>
      <p class="text-2xs text-gray-600 leading-relaxed">
        • 화요일 대량구매 = MAX 혜택<br>
        • ⚡+💝 중복 가능<br>
        • 상품4 = 품절
      </p>
    </div>
  `;

  // 이벤트 리스너 설정
  manualToggle.onclick = function () {
    manualOverlay.classList.toggle('hidden');
    manualColumn.classList.toggle('translate-x-full');
  };

  manualOverlay.onclick = function (event) {
    if (event.target === manualOverlay) {
      manualOverlay.classList.add('hidden');
      manualColumn.classList.add('translate-x-full');
    }
  };

  // 🔗 DOM 요소 연결
  manualOverlay.appendChild(manualColumn);

  return {
    manualToggle,
    manualOverlay,
  };
}
