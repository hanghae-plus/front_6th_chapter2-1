/**
 * UI 메시지 및 템플릿 상수 정의
 * 모든 UI 관련 메시지와 템플릿을 중앙집중적으로 관리합니다.
 */

/**
 * @typedef {Object} MessageTemplate
 * @property {string} template - 메시지 템플릿
 * @property {string[]} variables - 템플릿 변수들
 */

/**
 * 포인트 관련 UI 메시지
 */
export const POINTS_UI = {
  EARNED_POINTS: '적립 포인트: {points}p',
  BASE_POINTS: '기본: {points}p',
  TUESDAY_DOUBLE: '화요일 2배',
  SET_BONUS: '키보드+마우스 세트 +{points}p',
  FULL_SET_BONUS: '풀세트 구매 +{points}p',
  BULK_BONUS: '대량구매({threshold}개+) +{points}p',
  NO_POINTS: '적립 포인트: 0p',
};

/**
 * 할인 관련 UI 메시지
 */
export const DISCOUNT_UI = {
  BULK_PURCHASE: '🎉 대량구매 할인 ({threshold}개 이상)',
  TUESDAY_SPECIAL: '🌟 화요일 추가 할인',
  INDIVIDUAL_DISCOUNT: '{productName} ({threshold}개↑)',
  FLASH_SALE: '⚡ 번개세일',
  RECOMMENDATION: '💝 추천할인',
  SUPER_SALE: 'SUPER SALE',
};

/**
 * 재고 관련 UI 메시지
 */
export const STOCK_UI = {
  LOW_STOCK: '재고 부족 ({count}개 남음)',
  OUT_OF_STOCK: '품절',
  STOCK_WARNING: '{productName}: 재고 부족 ({count}개 남음)\n',
  OUT_OF_STOCK_WARNING: '{productName}: 품절\n',
};

/**
 * 장바구니 관련 UI 메시지
 */
export const CART_UI = {
  ITEM_COUNT: '🛍️ {count} items in cart',
  EMPTY_CART: '장바구니가 비어있습니다',
  ADD_TO_CART: '장바구니에 추가',
  REMOVE_FROM_CART: '제거',
  QUANTITY_PLUS: '+',
  QUANTITY_MINUS: '-',
};

/**
 * 알림 관련 UI 메시지
 */
export const ALERT_UI = {
  STOCK_EXCEEDED: '재고가 부족합니다.',
  INVALID_QUANTITY: '올바른 수량을 입력해주세요.',
  ITEM_ADDED: '상품이 장바구니에 추가되었습니다.',
  ITEM_REMOVED: '상품이 장바구니에서 제거되었습니다.',
  FLASH_SALE: '⚡번개세일! {productName}이(가) 20% 할인 중입니다!',
  RECOMMEND_SALE: '💝 {productName}은(는) 어떠세요? 지금 구매하시면 5% 추가 할인!',
};

/**
 * 일반 UI 레이블
 */
export const GENERAL_UI = {
  TOTAL_AMOUNT: '총액',
  SUBTOTAL: '소계',
  DISCOUNT: '할인',
  FINAL_TOTAL: '최종 금액',
  PRICE: '가격',
  QUANTITY: '수량',
  PRODUCT_NAME: '상품명',
};

/**
 * 아이콘 및 이모지 상수
 */
export const UI_ICONS = {
  FLASH_SALE: '⚡',
  RECOMMENDATION: '💝',
  CART: '🛍️',
  CELEBRATION: '🎉',
  STAR: '🌟',
  GIFT: '🎁',
  TIP: '💡',
  MANUAL: '📖',
};

/**
 * CSS 클래스 상수
 */
export const CSS_CLASSES = {
  PRODUCT_SELECTOR: {
    BASE: 'w-full p-3 border border-gray-300 rounded-lg text-base mb-3',
    OUT_OF_STOCK: 'text-gray-400',
    FLASH_SALE: 'text-red-500 font-bold',
    RECOMMENDATION: 'text-blue-500 font-bold',
    SUPER_SALE: 'text-purple-600 font-bold',
  },
  CART_ITEM: {
    BASE: 'flex items-center justify-between p-4 border-b border-gray-200',
    HIGHLIGHT: 'bg-yellow-50',
  },
  BUTTON: {
    PRIMARY: 'bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600',
    SECONDARY: 'bg-gray-300 text-gray-700 px-4 py-2 rounded hover:bg-gray-400',
    DANGER: 'bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600',
  },
};

/**
 * 재고 관련 상수
 */
export const STOCK_CONSTANTS = {
  LOW_STOCK_THRESHOLD: 5,
  OUT_OF_STOCK_QUANTITY: 0,
  TOTAL_STOCK_WARNING_THRESHOLD: 50,
};

/**
 * 할인 관련 상수
 */
export const DISCOUNT_CONSTANTS = {
  FLASH_SALE_RATE: 0.2, // 20%
  RECOMMENDATION_RATE: 0.05, // 5%
  SUPER_SALE_RATE: 0.25, // 25%
  TUESDAY_DISCOUNT_RATE: 0.1, // 10%
};

/**
 * 포인트 관련 상수
 */
export const POINTS_CONSTANTS = {
  BASE_POINTS_RATE: 0.01, // 1%
  TUESDAY_MULTIPLIER: 2,
  SET_BONUS_POINTS: 1000,
  FULL_SET_BONUS_POINTS: 2000,
  BULK_PURCHASE_THRESHOLD: 10,
  BULK_PURCHASE_BONUS: 500,
};
export const UI_CLASSES = {
  DISCOUNT_TEXT: 'text-green-400',
  POINTS_TEXT: 'text-blue-400',
  WARNING_TEXT: 'text-red-400',
  SUCCESS_TEXT: 'text-green-500',
  DISABLED: 'opacity-50 cursor-not-allowed',
  HIDDEN: 'hidden',
  HIGHLIGHT: 'bg-yellow-100 border-yellow-300',
};

/**
 * 수치 포매팅 관련 상수
 */
export const FORMAT_CONFIG = {
  CURRENCY_UNIT: '원',
  POINTS_UNIT: 'p',
  PERCENTAGE_UNIT: '%',
  QUANTITY_UNIT: '개',
  DECIMAL_PLACES: 0,
};

/**
 * 메시지 템플릿 변수 치환 함수
 * @param {string} template - 치환할 템플릿
 * @param {Object} variables - 치환 변수 객체
 * @returns {string} 치환된 메시지
 */
export function formatMessage(template, variables = {}) {
  let message = template;
  Object.keys(variables).forEach(key => {
    const regex = new RegExp(`\\{${key}\\}`, 'g');
    message = message.replace(regex, variables[key]);
  });
  return message;
}

/**
 * 숫자를 천 단위 콤마 포함 문자열로 변환
 * @param {number} number - 변환할 숫자
 * @param {string} unit - 단위 (기본: 원)
 * @returns {string} 포매팅된 문자열
 */
export function formatCurrency(number, unit = FORMAT_CONFIG.CURRENCY_UNIT) {
  return `${number.toLocaleString()}${unit}`;
}

/**
 * 포인트를 포매팅된 문자열로 변환
 * @param {number} points - 포인트
 * @returns {string} 포매팅된 포인트 문자열
 */
export function formatPoints(points) {
  return `${points}${FORMAT_CONFIG.POINTS_UNIT}`;
}

/**
 * 할인율을 포매팅된 문자열로 변환
 * @param {number} rate - 할인율 (0.1 = 10%)
 * @returns {string} 포매팅된 할인율 문자열
 */
export function formatDiscountRate(rate) {
  return `${Math.round(rate * 100)}${FORMAT_CONFIG.PERCENTAGE_UNIT}`;
}

/**
 * 재고 메시지 생성
 * @param {string} productName - 상품명
 * @param {number} stock - 재고 수량
 * @returns {string} 재고 상태 메시지
 */
export function getStockMessage(productName, stock) {
  if (stock === 0) {
    return formatMessage(STOCK_UI.OUT_OF_STOCK_WARNING, { productName });
  } else if (stock < 5) {
    return formatMessage(STOCK_UI.STOCK_WARNING, { productName, count: stock });
  }
  return '';
}

/**
 * 장바구니 아이템 수 메시지 생성
 * @param {number} count - 아이템 수
 * @returns {string} 장바구니 메시지
 */
export function getCartCountMessage(count) {
  return formatMessage(CART_UI.ITEM_COUNT, { count });
}

/**
 * 매뉴얼 데이터 구조
 */
export const MANUAL_DATA = {
  title: '📖 이용 안내',
  sections: [
    {
      title: '💰 할인 정책',
      subsections: [
        {
          title: '개별 상품',
          items: [
            '키보드 10개↑: 10%',
            '마우스 10개↑: 15%',
            '모니터암 10개↑: 20%',
            '스피커 10개↑: 25%',
          ],
        },
        {
          title: '전체 수량',
          items: ['30개 이상: 25%'],
        },
        {
          title: '특별 할인',
          items: ['화요일: +10%', '⚡번개세일: 20%', '💝추천할인: 5%'],
        },
      ],
    },
    {
      title: '🎁 포인트 적립',
      subsections: [
        {
          title: '기본',
          items: ['구매액의 0.1%'],
        },
        {
          title: '추가',
          items: [
            '화요일: 2배',
            '키보드+마우스: +50p',
            '풀세트: +100p',
            '10개↑: +20p / 20개↑: +50p / 30개↑: +100p',
          ],
        },
      ],
    },
  ],
  tips: {
    title: '💡 TIP',
    items: ['화요일 대량구매 = MAX 혜택', '⚡+💝 중복 가능', '상품4 = 품절'],
  },
};

/**
 * 매뉴얼 HTML을 생성하는 함수
 */
export function generateManualHTML() {
  const sectionsHTML = MANUAL_DATA.sections
    .map(section => {
      const subsectionsHTML = section.subsections
        .map(
          subsection => `
      <div class="bg-gray-100 rounded-lg p-3">
        <p class="font-semibold text-sm mb-1">${subsection.title}</p>
        <p class="text-gray-700 text-xs pl-2">
          ${subsection.items.map(item => `• ${item}`).join('<br>\n          ')}
        </p>
      </div>
    `
        )
        .join('\n        ');

      return `
    <div class="mb-6">
      <h3 class="text-base font-bold mb-3">${section.title}</h3>
      <div class="space-y-3">
        ${subsectionsHTML}
      </div>
    </div>`;
    })
    .join('\n    ');

  const tipsHTML = `
    <div class="border-t border-gray-200 pt-4 mt-4">
      <p class="text-xs font-bold mb-1">${MANUAL_DATA.tips.title}</p>
      <p class="text-2xs text-gray-600 leading-relaxed">
        ${MANUAL_DATA.tips.items.map(tip => `• ${tip}`).join('<br>\n        ')}
      </p>
    </div>`;

  return `
    <button class="absolute top-4 right-4 text-gray-500 hover:text-black" onclick="document.querySelector('.fixed.inset-0').classList.add('hidden'); this.parentElement.classList.add('translate-x-full')">
      <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path>
      </svg>
    </button>
    <h2 class="text-xl font-bold mb-4">${MANUAL_DATA.title}</h2>
    ${sectionsHTML}
    ${tipsHTML}
  `;
}
