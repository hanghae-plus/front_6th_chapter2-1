// ==========================================
// 🎯 도움말 모달 컴포넌트
// ==========================================

import {
  DISCOUNT_RATES,
  THRESHOLDS,
  POINT_BONUSES,
} from '../constant/index.js';

// 🎨 UI 관련 상수들
const UI_SPACING = {
  PADDING_3: 'p-3',
  PADDING_4: 'p-4',
  PADDING_6: 'p-6',
  MARGIN_BOTTOM_4: 'mb-4',
  MARGIN_BOTTOM_6: 'mb-6',
  MARGIN_TOP_4: 'mt-4',
  MARGIN_TOP_6: 'mt-6',
};

const UI_TEXT_SIZES = {
  XS: 'text-xs',
  SM: 'text-sm',
  BASE: 'text-base',
  XL: 'text-xl',
  X2XS: 'text-2xs',
};

const UI_FONTS = {
  BOLD: 'font-bold',
  SEMIBOLD: 'font-semibold',
};

const UI_COLORS = {
  BLACK: 'bg-black',
  WHITE: 'bg-white',
  GRAY_100: 'bg-gray-100',
  GRAY_500: 'text-gray-500',
  GRAY_600: 'text-gray-600',
  GRAY_700: 'text-gray-700',
  WHITE_50: 'bg-black/50',
  WHITE_60: 'text-white/60',
};

const UI_LAYOUT = {
  FIXED: 'fixed',
  ABSOLUTE: 'absolute',
  RELATIVE: 'relative',
  Z_40: 'z-40',
  Z_50: 'z-50',
  INSET_0: 'inset-0',
  RIGHT_0: 'right-0',
  TOP_0: 'top-0',
  TOP_4: 'top-4',
  RIGHT_4: 'right-4',
  H_FULL: 'h-full',
  W_80: 'w-80',
  W_5: 'w-5',
  W_6: 'w-6',
  H_5: 'h-5',
  H_6: 'h-6',
  OVERFLOW_Y_AUTO: 'overflow-y-auto',
  TRANSFORM: 'transform',
  TRANSLATE_X_FULL: 'translate-x-full',
  TRANSITION_TRANSFORM: 'transition-transform',
  DURATION_300: 'duration-300',
  TRANSITION_OPACITY: 'transition-opacity',
  HIDDEN: 'hidden',
  ROUNDED_FULL: 'rounded-full',
  SHADOW_2XL: 'shadow-2xl',
  HOVER_BG_GRAY_900: 'hover:bg-gray-900',
  TRANSITION_COLORS: 'transition-colors',
  HOVER_TEXT_BLACK: 'hover:text-black',
};

/**
 * 🎯 HelpModal 컴포넌트
 *
 * @description 도움말 버튼과 모달을 포함한 컴포넌트를 생성
 *
 * @returns {Object} { toggle, overlay, column } - 모달 관련 DOM 요소들
 */
export const HelpModal = () => {
  // 💡 도움말 버튼 생성
  const toggle = document.createElement('button');
  toggle.className = `${UI_LAYOUT.FIXED} ${UI_LAYOUT.TOP_4} ${UI_LAYOUT.RIGHT_4} ${UI_COLORS.BLACK} text-white ${UI_SPACING.PADDING_3} ${UI_LAYOUT.ROUNDED_FULL} ${UI_LAYOUT.HOVER_BG_GRAY_900} ${UI_LAYOUT.TRANSITION_COLORS} ${UI_LAYOUT.Z_50}`;
  toggle.innerHTML = `
    <svg class="${UI_LAYOUT.W_5} ${UI_LAYOUT.H_5}" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
    </svg>
  `;

  // 🔲 모달 오버레이 생성
  const overlay = document.createElement('div');
  overlay.className = `${UI_LAYOUT.FIXED} ${UI_LAYOUT.INSET_0} ${UI_COLORS.WHITE_50} ${UI_LAYOUT.Z_40} ${UI_LAYOUT.HIDDEN} ${UI_LAYOUT.TRANSITION_OPACITY} ${UI_LAYOUT.DURATION_300}`;

  // 📋 모달 컬럼 생성
  const column = document.createElement('div');
  column.className = `${UI_LAYOUT.FIXED} ${UI_LAYOUT.RIGHT_0} ${UI_LAYOUT.TOP_0} ${UI_LAYOUT.H_FULL} ${UI_LAYOUT.W_80} ${UI_COLORS.WHITE} ${UI_LAYOUT.SHADOW_2XL} ${UI_SPACING.PADDING_6} ${UI_LAYOUT.OVERFLOW_Y_AUTO} ${UI_LAYOUT.Z_50} ${UI_LAYOUT.TRANSFORM} ${UI_LAYOUT.TRANSLATE_X_FULL} ${UI_LAYOUT.TRANSITION_TRANSFORM} ${UI_LAYOUT.DURATION_300}`;

  column.innerHTML = `
    <button class="${UI_LAYOUT.ABSOLUTE} ${UI_LAYOUT.TOP_4} ${UI_LAYOUT.RIGHT_4} ${UI_COLORS.GRAY_500} ${UI_LAYOUT.HOVER_TEXT_BLACK}" onclick="document.querySelector('.fixed.inset-0').classList.add('hidden'); this.parentElement.classList.add('translate-x-full')">
      <svg class="${UI_LAYOUT.W_6} ${UI_LAYOUT.H_6}" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path>
      </svg>
    </button>
    <h2 class="${UI_TEXT_SIZES.XL} ${UI_FONTS.BOLD} ${UI_SPACING.MARGIN_BOTTOM_4}">📖 이용 안내</h2>
    <div class="${UI_SPACING.MARGIN_BOTTOM_6}">
      <h3 class="${UI_TEXT_SIZES.BASE} ${UI_FONTS.BOLD} ${UI_SPACING.MARGIN_BOTTOM_3}">💰 할인 정책</h3>
      <div class="space-y-3">
        <div class="${UI_COLORS.GRAY_100} rounded-lg ${UI_SPACING.PADDING_3}">
          <p class="${UI_FONTS.SEMIBOLD} ${UI_TEXT_SIZES.SM} ${UI_SPACING.MARGIN_BOTTOM_1}">개별 상품</p>
          <p class="${UI_COLORS.GRAY_700} ${UI_TEXT_SIZES.XS} pl-2">
            • 키보드 ${THRESHOLDS.ITEM_DISCOUNT_MIN}개↑: ${DISCOUNT_RATES.KEYBOARD * 100}%<br>
            • 마우스 ${THRESHOLDS.ITEM_DISCOUNT_MIN}개↑: ${DISCOUNT_RATES.MOUSE * 100}%<br>
            • 모니터암 ${THRESHOLDS.ITEM_DISCOUNT_MIN}개↑: ${DISCOUNT_RATES.MONITOR_ARM * 100}%<br>
            • 스피커 ${THRESHOLDS.ITEM_DISCOUNT_MIN}개↑: ${DISCOUNT_RATES.SPEAKER * 100}%
          </p>
        </div>
        <div class="${UI_COLORS.GRAY_100} rounded-lg ${UI_SPACING.PADDING_3}">
          <p class="${UI_FONTS.SEMIBOLD} ${UI_TEXT_SIZES.SM} ${UI_SPACING.MARGIN_BOTTOM_1}">전체 수량</p>
          <p class="${UI_COLORS.GRAY_700} ${UI_TEXT_SIZES.XS} pl-2">• ${THRESHOLDS.BULK_DISCOUNT_MIN}개 이상: ${DISCOUNT_RATES.BULK_DISCOUNT * 100}%</p>
        </div>
        <div class="${UI_COLORS.GRAY_100} rounded-lg ${UI_SPACING.PADDING_3}">
          <p class="${UI_FONTS.SEMIBOLD} ${UI_TEXT_SIZES.SM} ${UI_SPACING.MARGIN_BOTTOM_1}">특별 할인</p>
          <p class="${UI_COLORS.GRAY_700} ${UI_TEXT_SIZES.XS} pl-2">
            • 화요일: +${DISCOUNT_RATES.TUESDAY_DISCOUNT * 100}%<br>
            • ⚡번개세일: ${DISCOUNT_RATES.LIGHTNING_SALE * 100}%<br>
            • 💝추천할인: ${DISCOUNT_RATES.SUGGEST_SALE * 100}%
          </p>
        </div>
      </div>
    </div>
    <div class="${UI_SPACING.MARGIN_BOTTOM_6}">
      <h3 class="${UI_TEXT_SIZES.BASE} ${UI_FONTS.BOLD} ${UI_SPACING.MARGIN_BOTTOM_3}">🎁 포인트 적립</h3>
      <div class="space-y-3">
        <div class="${UI_COLORS.GRAY_100} rounded-lg ${UI_SPACING.PADDING_3}">
          <p class="${UI_FONTS.SEMIBOLD} ${UI_TEXT_SIZES.SM} ${UI_SPACING.MARGIN_BOTTOM_1}">기본</p>
          <p class="${UI_COLORS.GRAY_700} ${UI_TEXT_SIZES.XS} pl-2">• 구매액의 ${((1 / THRESHOLDS.POINTS_PER_WON) * 100).toFixed(1)}%</p>
        </div>
        <div class="${UI_COLORS.GRAY_100} rounded-lg ${UI_SPACING.PADDING_3}">
          <p class="${UI_FONTS.SEMIBOLD} ${UI_TEXT_SIZES.SM} ${UI_SPACING.MARGIN_BOTTOM_1}">추가</p>
          <p class="${UI_COLORS.GRAY_700} ${UI_TEXT_SIZES.XS} pl-2">
            • 화요일: ${POINT_BONUSES.TUESDAY_MULTIPLIER}배<br>
            • 키보드+마우스: +${POINT_BONUSES.KEYBOARD_MOUSE_SET}p<br>
            • 풀세트: +${POINT_BONUSES.FULL_SET}p<br>
            • ${THRESHOLDS.ITEM_DISCOUNT_MIN}개↑: +${POINT_BONUSES.BULK_10}p / ${THRESHOLDS.BULK_20_MIN}개↑: +${POINT_BONUSES.BULK_20}p / ${THRESHOLDS.BULK_DISCOUNT_MIN}개↑: +${POINT_BONUSES.BULK_30}p
          </p>
        </div>
      </div>
    </div>
    <div class="border-t border-gray-200 pt-4 ${UI_SPACING.MARGIN_TOP_4}">
      <p class="${UI_TEXT_SIZES.XS} ${UI_FONTS.BOLD} ${UI_SPACING.MARGIN_BOTTOM_1}">💡 TIP</p>
      <p class="${UI_TEXT_SIZES.X2XS} ${UI_COLORS.GRAY_600} leading-relaxed">
        • 화요일 대량구매 = MAX 혜택<br>
        • ⚡+💝 중복 가능<br>
        • 상품4 = 품절
      </p>
    </div>
  `;

  // 🎯 이벤트 리스너 설정
  toggle.onclick = function () {
    overlay.classList.toggle(UI_LAYOUT.HIDDEN);
    column.classList.toggle(UI_LAYOUT.TRANSLATE_X_FULL);
  };

  overlay.onclick = function (event) {
    if (event.target === overlay) {
      overlay.classList.add(UI_LAYOUT.HIDDEN);
      column.classList.add(UI_LAYOUT.TRANSLATE_X_FULL);
    }
  };

  // 🔗 DOM 요소 연결
  overlay.appendChild(column);

  return { toggle, overlay };
};
