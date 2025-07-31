/**
 * 할인 엔진 - 할인 정책 적용 및 최적화
 * 복잡한 할인 조합 로직을 체계적으로 관리합니다.
 */

/**
 * @typedef {Object} CartItem
 * @property {string} id - 상품 ID
 * @property {number} quantity - 수량
 * @property {number} price - 단가
 * @property {Object} product - 상품 정보
 */

/**
 * @typedef {Object} DiscountContext
 * @property {Date} date - 할인 적용 날짜
 * @property {boolean} [isFlashSale] - 번개세일 여부
 * @property {string} [recommendedProduct] - 추천 상품 ID
 * @property {string} [luckyItem] - 번개세일 상품 ID
 */

/**
 * @typedef {Object} DiscountResult
 * @property {string} type - 할인 타입
 * @property {number} rate - 할인율 (0.1 = 10%)
 * @property {number} amount - 할인 금액
 * @property {string} description - 할인 설명
 * @property {boolean} eligible - 적용 가능 여부
 * @property {string} [reason] - 적용/불가능 사유
 */

/**
 * @typedef {Object} DiscountPolicy
 * @property {string} type - 할인 정책 타입
 * @property {number} rate - 할인율
 * @property {number} [threshold] - 적용 임계값
 * @property {Array<string>} canCombineWith - 결합 가능한 할인 타입들
 * @property {number} priority - 우선순위 (낮을수록 먼저 적용)
 * @property {Function} [eligibilityCheck] - 적용 가능성 검증 함수
 */

/**
 * @typedef {Object} OptimizedDiscountResult
 * @property {Array<DiscountResult>} appliedDiscounts - 적용된 할인들
 * @property {number} totalSavings - 총 할인 금액
 * @property {number} finalAmount - 최종 금액
 * @property {Array<DiscountResult>} availableDiscounts - 사용 가능한 다른 할인들
 */

/**
 * 할인 타입 상수
 */
export const DISCOUNT_TYPES = {
  INDIVIDUAL: 'individual', // 개별 상품 할인 (10개 이상)
  BULK: 'bulk', // 대량구매 할인 (30개 이상)
  TUESDAY: 'tuesday', // 화요일 특별 할인
  FLASH: 'flash', // 번개세일 (20%)
  RECOMMEND: 'recommend', // 추천할인 (5%)
  COMBO: 'combo' // 조합 할인 (번개세일+추천 = 25%)
};

/**
 * 할인 우선순위 상수 (낮을수록 먼저 적용)
 */
export const DISCOUNT_PRIORITY = {
  [DISCOUNT_TYPES.INDIVIDUAL]: 1, // 개별 할인이 최우선
  [DISCOUNT_TYPES.BULK]: 1, // 대량 할인은 개별과 동일 우선순위 (배타적)
  [DISCOUNT_TYPES.FLASH]: 2, // 특별 할인들
  [DISCOUNT_TYPES.RECOMMEND]: 2,
  [DISCOUNT_TYPES.COMBO]: 2,
  [DISCOUNT_TYPES.TUESDAY]: 3 // 화요일 할인은 최후 적용
};

/**
 * 할인 정책 설정
 */
export const DISCOUNT_POLICIES = {
  [DISCOUNT_TYPES.INDIVIDUAL]: {
    type: DISCOUNT_TYPES.INDIVIDUAL,
    rate: 0.15, // 15%
    threshold: 10,
    canCombineWith: [DISCOUNT_TYPES.TUESDAY],
    priority: DISCOUNT_PRIORITY[DISCOUNT_TYPES.INDIVIDUAL],
    description: '개별 상품 할인 (10개 이상)'
  },
  [DISCOUNT_TYPES.BULK]: {
    type: DISCOUNT_TYPES.BULK,
    rate: 0.25, // 25%
    threshold: 30,
    canCombineWith: [DISCOUNT_TYPES.TUESDAY],
    priority: DISCOUNT_PRIORITY[DISCOUNT_TYPES.BULK],
    description: '대량구매 할인 (30개 이상)'
  },
  [DISCOUNT_TYPES.TUESDAY]: {
    type: DISCOUNT_TYPES.TUESDAY,
    rate: 0.1, // 10%
    canCombineWith: [
      DISCOUNT_TYPES.INDIVIDUAL,
      DISCOUNT_TYPES.BULK,
      DISCOUNT_TYPES.FLASH,
      DISCOUNT_TYPES.RECOMMEND,
      DISCOUNT_TYPES.COMBO
    ],
    priority: DISCOUNT_PRIORITY[DISCOUNT_TYPES.TUESDAY],
    description: '화요일 추가 할인'
  },
  [DISCOUNT_TYPES.FLASH]: {
    type: DISCOUNT_TYPES.FLASH,
    rate: 0.2, // 20%
    canCombineWith: [DISCOUNT_TYPES.RECOMMEND, DISCOUNT_TYPES.TUESDAY],
    priority: DISCOUNT_PRIORITY[DISCOUNT_TYPES.FLASH],
    description: '번개세일'
  },
  [DISCOUNT_TYPES.RECOMMEND]: {
    type: DISCOUNT_TYPES.RECOMMEND,
    rate: 0.05, // 5%
    canCombineWith: [DISCOUNT_TYPES.FLASH, DISCOUNT_TYPES.TUESDAY],
    priority: DISCOUNT_PRIORITY[DISCOUNT_TYPES.RECOMMEND],
    description: '추천할인'
  },
  [DISCOUNT_TYPES.COMBO]: {
    type: DISCOUNT_TYPES.COMBO,
    rate: 0.25, // 25% (번개세일 20% + 추천할인 5%)
    canCombineWith: [DISCOUNT_TYPES.TUESDAY],
    priority: DISCOUNT_PRIORITY[DISCOUNT_TYPES.COMBO],
    description: '번개세일 + 추천할인'
  }
};

/**
 * 할인 엔진 클래스
 * 복잡한 할인 정책 적용 및 최적화를 담당합니다.
 */
export class DiscountEngine {
  /**
   * 메인 할인 정책 적용 엔진
   * @param {Array<CartItem>} cart - 장바구니 아이템들
   * @param {DiscountContext} context - 할인 적용 컨텍스트
   * @returns {OptimizedDiscountResult} 최적화된 할인 결과
   */
  static applyDiscountPolicies(cart, context) {
    if (!cart || !Array.isArray(cart) || cart.length === 0) {
      return {
        appliedDiscounts: [],
        totalSavings: 0,
        finalAmount: 0,
        availableDiscounts: []
      };
    }

    const { date = new Date() } = context || {};
    const subtotal = cart.reduce(
      (sum, item) => sum + item.price * item.quantity,
      0
    );
    let currentAmount = subtotal;

    // 1. 모든 가능한 할인 조사
    const availableDiscounts = this._getAllAvailableDiscounts(cart, context);

    // 2. 최적 할인 조합 찾기
    const bestDiscountCombination = this.findBestDiscount(availableDiscounts);

    // 3. 할인 적용 및 금액 계산
    const appliedDiscounts = [];
    let totalSavings = 0;

    for (const discount of bestDiscountCombination) {
      if (discount.eligible) {
        const discountAmount = currentAmount * discount.rate;
        discount.amount = discountAmount;
        appliedDiscounts.push(discount);
        totalSavings += discountAmount;
        currentAmount -= discountAmount;
      }
    }

    return {
      appliedDiscounts,
      totalSavings,
      finalAmount: currentAmount,
      availableDiscounts: availableDiscounts.filter(
        d => !appliedDiscounts.some(applied => applied.type === d.type)
      )
    };
  }

  /**
   * 최적 할인 조합 찾기
   * @param {Array<DiscountResult>} availableDiscounts - 사용 가능한 할인들
   * @returns {Array<DiscountResult>} 최적 할인 조합
   */
  static findBestDiscount(availableDiscounts) {
    if (!availableDiscounts || availableDiscounts.length === 0) {
      return [];
    }

    // 1. 우선순위 기반 정렬
    const prioritizedDiscounts = this.prioritizeDiscounts(availableDiscounts);

    // 2. 할인 조합 생성
    const combinations =
      this._generateDiscountCombinations(prioritizedDiscounts);

    // 3. 최대 절약 금액 조합 선택
    let bestCombination = [];
    let maxSavings = 0;

    for (const combination of combinations) {
      const totalRate = combination.reduce(
        (sum, discount) => sum + discount.rate,
        0
      );
      if (totalRate > maxSavings) {
        maxSavings = totalRate;
        bestCombination = combination;
      }
    }

    return bestCombination;
  }

  /**
   * 할인 적용 가능성 검증
   * @param {CartItem} item - 상품 아이템
   * @param {DiscountPolicy} rule - 할인 규칙
   * @returns {Object} 적용 가능성 결과 {eligible: boolean, reason: string}
   */
  static isEligibleForDiscount(item, rule) {
    if (!item || !rule) {
      return {
        eligible: false,
        reason: 'Invalid item or rule'
      };
    }

    const { type, threshold } = rule;

    switch (type) {
      case DISCOUNT_TYPES.INDIVIDUAL:
        if (item.quantity < threshold) {
          return {
            eligible: false,
            reason: `수량이 ${threshold}개 미만입니다 (현재: ${item.quantity}개)`
          };
        }
        break;

      case DISCOUNT_TYPES.FLASH:
        if (!item.product?.onSale) {
          return {
            eligible: false,
            reason: '번개세일 대상 상품이 아닙니다'
          };
        }
        break;

      case DISCOUNT_TYPES.RECOMMEND:
        if (!item.product?.suggestSale) {
          return {
            eligible: false,
            reason: '추천할인 대상 상품이 아닙니다'
          };
        }
        break;

      case DISCOUNT_TYPES.COMBO:
        if (!item.product?.onSale || !item.product?.suggestSale) {
          return {
            eligible: false,
            reason: '번개세일과 추천할인이 모두 적용된 상품이 아닙니다'
          };
        }
        break;

      case DISCOUNT_TYPES.TUESDAY:
        // 화요일 할인은 별도 검증 (날짜 기반)
        break;

      case DISCOUNT_TYPES.BULK:
        // 대량구매 할인은 전체 수량 기반으로 별도 검증
        break;
    }

    return {
      eligible: true,
      reason: '할인 적용 가능'
    };
  }

  /**
   * 할인 중복 적용 로직
   * @param {Array<DiscountResult>} discounts - 적용할 할인들
   * @param {Object} rules - 할인 중복 적용 규칙
   * @returns {DiscountResult} 최종 할인 결과
   */
  static combineDiscounts(discounts, rules = {}) {
    if (!discounts || discounts.length === 0) {
      return {
        type: 'none',
        rate: 0,
        amount: 0,
        description: '적용된 할인 없음',
        eligible: false
      };
    }

    if (discounts.length === 1) {
      return discounts[0];
    }

    // 번개세일 + 추천할인 조합 특별 처리
    const flashDiscount = discounts.find(d => d.type === DISCOUNT_TYPES.FLASH);
    const recommendDiscount = discounts.find(
      d => d.type === DISCOUNT_TYPES.RECOMMEND
    );

    if (flashDiscount && recommendDiscount) {
      return {
        type: DISCOUNT_TYPES.COMBO,
        rate: DISCOUNT_POLICIES[DISCOUNT_TYPES.COMBO].rate, // 25%
        amount: 0, // 나중에 계산
        description: DISCOUNT_POLICIES[DISCOUNT_TYPES.COMBO].description,
        eligible: true,
        combinedFrom: [DISCOUNT_TYPES.FLASH, DISCOUNT_TYPES.RECOMMEND]
      };
    }

    // 일반 할인 조합 (순차 적용)
    let combinedRate = 0;
    const combinedDescription = [];
    const combinedTypes = [];

    for (const discount of discounts) {
      combinedRate += discount.rate;
      combinedDescription.push(discount.description);
      combinedTypes.push(discount.type);
    }

    return {
      type: 'combined',
      rate: Math.min(combinedRate, 0.5), // 최대 50% 할인 제한
      amount: 0,
      description: combinedDescription.join(' + '),
      eligible: true,
      combinedFrom: combinedTypes
    };
  }

  /**
   * 할인 우선순위 정렬
   * @param {Array<DiscountResult>} discounts - 정렬할 할인들
   * @returns {Array<DiscountResult>} 우선순위 순으로 정렬된 할인들
   */
  static prioritizeDiscounts(discounts) {
    return discounts.sort((a, b) => {
      const priorityA = DISCOUNT_PRIORITY[a.type] || 999;
      const priorityB = DISCOUNT_PRIORITY[b.type] || 999;
      return priorityA - priorityB;
    });
  }

  // ========== 헬퍼 메서드들 ==========

  /**
   * 모든 사용 가능한 할인을 조사합니다
   * @param {Array<CartItem>} cart - 장바구니 아이템들
   * @param {DiscountContext} context - 할인 적용 컨텍스트
   * @returns {Array<DiscountResult>} 사용 가능한 할인들
   * @private
   */
  static _getAllAvailableDiscounts(cart, context) {
    const { date = new Date() } = context || {};
    const availableDiscounts = [];
    const totalQuantity = cart.reduce((sum, item) => sum + item.quantity, 0);

    // 1. 개별 상품 할인 검사
    for (const item of cart) {
      const eligibility = this.isEligibleForDiscount(
        item,
        DISCOUNT_POLICIES[DISCOUNT_TYPES.INDIVIDUAL]
      );
      if (eligibility.eligible) {
        availableDiscounts.push({
          type: DISCOUNT_TYPES.INDIVIDUAL,
          rate: DISCOUNT_POLICIES[DISCOUNT_TYPES.INDIVIDUAL].rate,
          amount: 0,
          description: `${item.product.name} ${DISCOUNT_POLICIES[DISCOUNT_TYPES.INDIVIDUAL].description}`,
          eligible: true,
          productId: item.id
        });
      }
    }

    // 2. 대량구매 할인 검사
    if (totalQuantity >= DISCOUNT_POLICIES[DISCOUNT_TYPES.BULK].threshold) {
      availableDiscounts.push({
        type: DISCOUNT_TYPES.BULK,
        rate: DISCOUNT_POLICIES[DISCOUNT_TYPES.BULK].rate,
        amount: 0,
        description: DISCOUNT_POLICIES[DISCOUNT_TYPES.BULK].description,
        eligible: true
      });
    }

    // 3. 화요일 할인 검사
    if (date.getDay() === 2) {
      availableDiscounts.push({
        type: DISCOUNT_TYPES.TUESDAY,
        rate: DISCOUNT_POLICIES[DISCOUNT_TYPES.TUESDAY].rate,
        amount: 0,
        description: DISCOUNT_POLICIES[DISCOUNT_TYPES.TUESDAY].description,
        eligible: true
      });
    }

    // 4. 번개세일 할인 검사
    const flashSaleItems = cart.filter(item => item.product?.onSale);
    if (flashSaleItems.length > 0) {
      availableDiscounts.push({
        type: DISCOUNT_TYPES.FLASH,
        rate: DISCOUNT_POLICIES[DISCOUNT_TYPES.FLASH].rate,
        amount: 0,
        description: DISCOUNT_POLICIES[DISCOUNT_TYPES.FLASH].description,
        eligible: true,
        items: flashSaleItems.map(item => item.id)
      });
    }

    // 5. 추천할인 검사
    const recommendItems = cart.filter(item => item.product?.suggestSale);
    if (recommendItems.length > 0) {
      availableDiscounts.push({
        type: DISCOUNT_TYPES.RECOMMEND,
        rate: DISCOUNT_POLICIES[DISCOUNT_TYPES.RECOMMEND].rate,
        amount: 0,
        description: DISCOUNT_POLICIES[DISCOUNT_TYPES.RECOMMEND].description,
        eligible: true,
        items: recommendItems.map(item => item.id)
      });
    }

    // 6. 번개세일 + 추천할인 조합 검사
    const comboItems = cart.filter(
      item => item.product?.onSale && item.product?.suggestSale
    );
    if (comboItems.length > 0) {
      availableDiscounts.push({
        type: DISCOUNT_TYPES.COMBO,
        rate: DISCOUNT_POLICIES[DISCOUNT_TYPES.COMBO].rate,
        amount: 0,
        description: DISCOUNT_POLICIES[DISCOUNT_TYPES.COMBO].description,
        eligible: true,
        items: comboItems.map(item => item.id)
      });
    }

    return availableDiscounts;
  }

  /**
   * 할인 조합을 생성합니다
   * @param {Array<DiscountResult>} discounts - 사용 가능한 할인들
   * @returns {Array<Array<DiscountResult>>} 가능한 할인 조합들
   * @private
   */
  static _generateDiscountCombinations(discounts) {
    if (!discounts || discounts.length === 0) {
      return [];
    }

    const combinations = [];
    const policies = DISCOUNT_POLICIES;

    // 1. 단일 할인들
    for (const discount of discounts) {
      combinations.push([discount]);
    }

    // 2. 조합 할인들 (번개세일 + 추천할인이 가장 중요)
    const flashDiscount = discounts.find(d => d.type === DISCOUNT_TYPES.FLASH);
    const recommendDiscount = discounts.find(
      d => d.type === DISCOUNT_TYPES.RECOMMEND
    );
    const comboDiscount = discounts.find(d => d.type === DISCOUNT_TYPES.COMBO);

    // 번개세일 + 추천할인 조합이 있으면 콤보로 대체
    if (comboDiscount) {
      combinations.push([comboDiscount]);
    }

    // 3. 화요일 할인과의 조합
    const tuesdayDiscount = discounts.find(
      d => d.type === DISCOUNT_TYPES.TUESDAY
    );
    if (tuesdayDiscount) {
      for (const discount of discounts) {
        if (
          discount.type !== DISCOUNT_TYPES.TUESDAY &&
          policies[discount.type]?.canCombineWith?.includes(
            DISCOUNT_TYPES.TUESDAY
          )
        ) {
          combinations.push([discount, tuesdayDiscount]);
        }
      }
    }

    // 4. 개별 할인과 대량 할인은 배타적 (둘 중 하나만)
    const individualDiscounts = discounts.filter(
      d => d.type === DISCOUNT_TYPES.INDIVIDUAL
    );
    const bulkDiscount = discounts.find(d => d.type === DISCOUNT_TYPES.BULK);

    // 대량할인이 있으면 개별할인과 결합하지 않음
    if (bulkDiscount && individualDiscounts.length > 0) {
      // 대량할인을 우선 선택
      combinations.push([bulkDiscount]);
    }

    return combinations;
  }
}
