/**
 * 이벤트 타이밍 및 임계값 상수 정의
 * 모든 이벤트 관련 설정을 중앙집중적으로 관리합니다.
 */

/**
 * @typedef {Object} EventConfig
 * @property {number} startTime - 이벤트 시작 시간 (밀리초)
 * @property {number} duration - 이벤트 지속 시간 (밀리초)
 * @property {boolean} enabled - 이벤트 활성화 여부
 */

/**
 * @typedef {Object} SpecialDayConfig
 * @property {number} dayOfWeek - 요일 (0=일요일, 1=월요일, ..., 6=토요일)
 * @property {string} name - 특별한 날 이름
 * @property {boolean} enabled - 활성화 여부
 */

/**
 * 특별 이벤트 타이밍 설정
 */
export const EVENT_TIMINGS = {
  FLASH_SALE: {
    startTime: 40000,        // 40초 후 시작
    duration: 40000,         // 40초 지속
    enabled: true,
    probability: 0.3         // 30% 확률로 발생
  },
  RECOMMENDATION: {
    startTime: 80000,        // 80초 후 시작
    duration: 40000,         // 40초 지속
    enabled: true,
    probability: 0.5         // 50% 확률로 발생
  },
  SUGGESTION: {
    startTime: 120000,       // 2분 후 시작
    duration: 60000,         // 1분 지속
    enabled: true,
    probability: 0.4         // 40% 확률로 발생
  }
};

/**
 * 특별한 날 설정
 */
export const SPECIAL_DAYS = {
  TUESDAY: {
    dayOfWeek: 2,           // 화요일
    name: '화요일',
    discountRate: 0.1,      // 10% 추가 할인
    pointsMultiplier: 2,    // 포인트 2배
    enabled: true
  },
  FRIDAY: {
    dayOfWeek: 5,           // 금요일 (향후 확장용)
    name: '금요일',
    discountRate: 0.05,     // 5% 할인
    pointsMultiplier: 1.5,  // 포인트 1.5배
    enabled: false          // 현재 비활성화
  }
};

/**
 * 재고 관련 임계값
 */
export const STOCK_THRESHOLDS = {
  LOW_STOCK_WARNING: 5,    // 재고 부족 경고 기준
  OUT_OF_STOCK: 0,         // 품절 기준
  CRITICAL_STOCK: 1,       // 위험 재고 기준
  REORDER_POINT: 10        // 재주문 기준
};

/**
 * 수량 관련 임계값
 */
export const QUANTITY_THRESHOLDS = {
  INDIVIDUAL_DISCOUNT: 10,  // 개별 상품 할인 기준
  BULK_DISCOUNT: 30,        // 대량구매 할인 기준
  BULK_BONUS_LEVELS: [10, 20, 30], // 대량구매 보너스 단계
  MAX_QUANTITY: 999,        // 최대 구매 수량
  MIN_QUANTITY: 1           // 최소 구매 수량
};

/**
 * UI 업데이트 타이밍
 */
export const UI_TIMINGS = {
  CART_UPDATE_DELAY: 100,   // 장바구니 업데이트 지연시간 (밀리초)
  ANIMATION_DURATION: 300,  // 애니메이션 지속시간
  DEBOUNCE_DELAY: 250,      // 디바운스 지연시간
  TOAST_DURATION: 3000      // 토스트 메시지 표시 시간
};

/**
 * 현재 시간 기준으로 특별한 날인지 확인
 * @param {Date} date - 확인할 날짜 (기본: 현재)
 * @returns {SpecialDayConfig|null} 특별한 날 설정 또는 null
 */
export function getCurrentSpecialDay(date = new Date()) {
  const dayOfWeek = date.getDay();
  
  for (const [key, config] of Object.entries(SPECIAL_DAYS)) {
    if (config.enabled && config.dayOfWeek === dayOfWeek) {
      return { ...config, key };
    }
  }
  
  return null;
}

/**
 * 특정 이벤트가 현재 활성화된 상태인지 확인
 * @param {string} eventName - 이벤트 이름 (FLASH_SALE, RECOMMENDATION 등)
 * @param {number} currentTime - 현재 시간 (밀리초, 기본: Date.now())
 * @returns {boolean} 이벤트 활성화 여부
 */
export function isEventActive(eventName, currentTime = Date.now()) {
  const event = EVENT_TIMINGS[eventName];
  if (!event || !event.enabled) {
    return false;
  }
  
  // 간단한 예: 페이지 로드 시간을 기준으로 계산
  // 실제 구현에서는 더 복잡한 로직이 필요할 수 있음
  const elapsed = currentTime % (event.startTime + event.duration);
  return elapsed >= event.startTime && elapsed < (event.startTime + event.duration);
}

/**
 * 재고 상태 확인
 * @param {number} currentStock - 현재 재고
 * @returns {string} 재고 상태 ('NORMAL', 'LOW', 'CRITICAL', 'OUT_OF_STOCK')
 */
export function getStockStatus(currentStock) {
  if (currentStock <= STOCK_THRESHOLDS.OUT_OF_STOCK) {
    return 'OUT_OF_STOCK';
  } else if (currentStock <= STOCK_THRESHOLDS.CRITICAL_STOCK) {
    return 'CRITICAL';
  } else if (currentStock <= STOCK_THRESHOLDS.LOW_STOCK_WARNING) {
    return 'LOW';
  }
  return 'NORMAL';
}

/**
 * 수량이 특정 임계값을 충족하는지 확인
 * @param {number} quantity - 확인할 수량
 * @param {string} thresholdType - 임계값 타입
 * @returns {boolean} 임계값 충족 여부
 */
export function meetsQuantityThreshold(quantity, thresholdType) {
  const threshold = QUANTITY_THRESHOLDS[thresholdType];
  if (typeof threshold === 'number') {
    return quantity >= threshold;
  } else if (Array.isArray(threshold)) {
    return threshold.some(t => quantity >= t);
  }
  return false;
}

/**
 * 대량구매 보너스 레벨 확인
 * @param {number} quantity - 구매 수량
 * @returns {number} 보너스 레벨 (0: 보너스 없음, 1-3: 보너스 레벨)
 */
export function getBulkBonusLevel(quantity) {
  const levels = QUANTITY_THRESHOLDS.BULK_BONUS_LEVELS;
  for (let i = levels.length - 1; i >= 0; i--) {
    if (quantity >= levels[i]) {
      return i + 1; // 1-based 레벨 반환
    }
  }
  return 0; // 보너스 없음
}

/**
 * 디바운스된 함수 생성
 * @param {Function} func - 디바운스할 함수
 * @param {number} delay - 지연시간 (기본: UI_TIMINGS.DEBOUNCE_DELAY)
 * @returns {Function} 디바운스된 함수
 */
export function createDebounced(func, delay = UI_TIMINGS.DEBOUNCE_DELAY) {
  let timeoutId;
  return function(...args) {
    clearTimeout(timeoutId);
    timeoutId = setTimeout(() => func.apply(this, args), delay);
  };
}
