/**
 * @fileoverview OrderSummary 컴포넌트
 * 주문 요약 정보를 렌더링하는 순수 함수 기반 컴포넌트
 *
 * 기존 main.basic.js의 복잡한 주문 요약 생성 로직을 분리하여
 * Epic 3 계산 엔진 결과를 사용자 친화적인 UI로 변환
 */

/**
 * @typedef {Object} PricingData
 * @property {number} subtotal - 소계
 * @property {number} finalAmount - 최종 결제 금액
 * @property {number} totalSavings - 총 절약 금액
 * @property {number} discountRate - 총 할인율 (0~1)
 * @property {Object} discounts - 할인 정보
 * @property {Array} discounts.individual - 개별 상품 할인
 * @property {Object} discounts.bulk - 대량 구매 할인
 * @property {Object} discounts.tuesday - 화요일 할인
 * @property {Array} discounts.special - 특별 할인 (번개세일, 추천할인)
 */

/**
 * @typedef {Object} PointsData
 * @property {number} total - 총 적립 예정 포인트
 * @property {Object} breakdown - 포인트 내역
 * @property {Array<string>} messages - 표시용 메시지 배열
 */

/**
 * @typedef {Object} CartItemSummary
 * @property {string} id - 상품 ID
 * @property {string} name - 상품명
 * @property {number} quantity - 수량
 * @property {number} unitPrice - 단가
 * @property {number} totalPrice - 총 가격
 */

/**
 * @typedef {Object} OrderData
 * @property {PricingData} pricing - 가격 정보
 * @property {PointsData} points - 포인트 정보
 * @property {Array<CartItemSummary>} items - 장바구니 아이템 요약
 * @property {Object} context - 컨텍스트 정보
 * @property {boolean} context.isTuesday - 화요일 여부
 * @property {boolean} context.hasSpecialDiscounts - 특별 할인 여부
 * @property {number} context.itemCount - 총 아이템 수
 */

/**
 * @typedef {Object} OrderSummaryOptions
 * @property {boolean} [showDetailedBreakdown=true] - 상세 내역 표시 여부
 * @property {boolean} [highlightSavings=true] - 절약 금액 강조 여부
 * @property {boolean} [showPointsPreview=true] - 포인트 미리보기 표시 여부
 * @property {string} [className] - 추가 CSS 클래스
 * @property {function} [onCheckout] - 체크아웃 버튼 클릭 핸들러
 */

/**
 * 주문 요약 컴포넌트
 * Epic 3 계산 엔진 결과를 사용자 친화적인 주문 요약 UI로 변환하는 순수 함수 기반 클래스
 */
export class OrderSummary {
  /**
   * 전체 주문 요약을 렌더링
   * @param {OrderData} orderData - 주문 데이터
   * @param {OrderSummaryOptions} [options={}] - 렌더링 옵션
   * @returns {string} 완성된 주문 요약 HTML 문자열
   */
  static render(orderData, options = {}) {
    // 기본 옵션 설정
    const {
      showDetailedBreakdown = true,
      highlightSavings = true,
      showPointsPreview = true,
      className = ''
    } = options;

    // 데이터 유효성 검사
    if (!orderData || !orderData.pricing) {
      throw new Error(
        'OrderSummary.render: orderData와 pricing 정보는 필수입니다.'
      );
    }

    // 빈 장바구니 처리
    if (!orderData.items || orderData.items.length === 0) {
      return OrderSummary.generateEmptyState(className);
    }

    // 주문 요약 섹션들 생성
    const itemsBreakdown = showDetailedBreakdown
      ? OrderSummary.generateItemsBreakdown(orderData.items)
      : '';

    const pricingDetails = OrderSummary.generatePricingDetails(
      orderData.pricing
    );

    const savingsInfo =
      highlightSavings && orderData.pricing.totalSavings > 0
        ? OrderSummary.generateSavingsInfo(orderData.pricing)
        : '';

    const pointsInfo =
      showPointsPreview && orderData.points && orderData.points.total > 0
        ? OrderSummary.generatePointsInfo(orderData.points)
        : '';

    const tuesdayBanner =
      orderData.context.isTuesday &&
      orderData.pricing.discounts.tuesday.discountAmount > 0
        ? OrderSummary.generateTuesdayBanner(
            orderData.pricing.discounts.tuesday
          )
        : '';

    // 컨테이너 CSS 클래스 구성
    const containerClasses = ['order-summary', 'space-y-3', className]
      .filter(Boolean)
      .join(' ');

    return `
      <div class="${containerClasses}">
        ${tuesdayBanner}
        ${itemsBreakdown}
        ${pricingDetails}
        ${savingsInfo}
        ${pointsInfo}
      </div>
    `;
  }

  /**
   * 빈 장바구니 상태를 생성
   * @param {string} [className=''] - 추가 CSS 클래스
   * @returns {string} 빈 상태 HTML
   */
  static generateEmptyState(className = '') {
    const containerClasses = [
      'order-summary-empty',
      'text-center',
      'py-8',
      className
    ]
      .filter(Boolean)
      .join(' ');

    return `
      <div class="${containerClasses}">
        <div class="text-gray-400 text-sm">
          장바구니가 비어있습니다
        </div>
      </div>
    `;
  }

  /**
   * 장바구니 아이템별 상세 내역을 생성
   * @param {Array<CartItemSummary>} items - 장바구니 아이템 요약
   * @returns {string} 아이템 내역 HTML
   */
  static generateItemsBreakdown(items) {
    if (!Array.isArray(items) || items.length === 0) {
      return '';
    }

    const itemsHTML = items
      .map(
        item => `
        <div class="flex justify-between text-xs tracking-wide text-gray-400">
          <span>${item.name} x ${item.quantity}</span>
          <span>₩${item.totalPrice.toLocaleString()}</span>
        </div>
      `
      )
      .join('');

    return `
      <div class="items-breakdown space-y-2">
        ${itemsHTML}
        <div class="border-t border-white/10 my-3"></div>
      </div>
    `;
  }

  /**
   * 가격 상세 정보를 생성 (소계, 할인, 최종 금액)
   * @param {PricingData} pricing - 가격 정보
   * @returns {string} 가격 상세 HTML
   */
  static generatePricingDetails(pricing) {
    if (!pricing) {
      return '';
    }

    const subtotalHTML = `
      <div class="flex justify-between text-sm tracking-wide">
        <span>Subtotal</span>
        <span>₩${pricing.subtotal.toLocaleString()}</span>
      </div>
    `;

    // 할인 내역 생성
    const discountsHTML = OrderSummary.generateDiscountItems(pricing.discounts);

    const shippingHTML = `
      <div class="flex justify-between text-sm tracking-wide text-gray-400">
        <span>Shipping</span>
        <span>Free</span>
      </div>
    `;

    return `
      <div class="pricing-details space-y-2">
        ${subtotalHTML}
        ${discountsHTML}
        ${shippingHTML}
      </div>
    `;
  }

  /**
   * 할인 항목들을 생성
   * @param {Object} discounts - 할인 정보
   * @returns {string} 할인 항목 HTML
   */
  static generateDiscountItems(discounts) {
    if (!discounts) {
      return '';
    }

    let discountHTML = '';

    // 대량 구매 할인
    if (discounts.bulk && discounts.bulk.discountRate > 0) {
      discountHTML += `
        <div class="flex justify-between text-sm tracking-wide text-green-400">
          <span class="text-xs">🎉 대량구매 할인 (30개 이상)</span>
          <span class="text-xs">-25%</span>
        </div>
      `;
    }
    // 개별 상품 할인
    else if (discounts.individual && Array.isArray(discounts.individual)) {
      discounts.individual.forEach(discount => {
        const discountRate = Math.round(discount.discountRate * 100);
        discountHTML += `
          <div class="flex justify-between text-sm tracking-wide text-green-400">
            <span class="text-xs">${discount.productName} (10개↑)</span>
            <span class="text-xs">-${discountRate}%</span>
          </div>
        `;
      });
    }

    // 특별 할인 (번개세일, 추천할인, 콤보)
    if (discounts.special && Array.isArray(discounts.special)) {
      discounts.special.forEach(discount => {
        const { icon, color } = OrderSummary.getDiscountStyle(discount.type);
        const discountRate = Math.round(discount.rate * 100);

        discountHTML += `
          <div class="flex justify-between text-sm tracking-wide ${color}">
            <span class="text-xs">${icon} ${discount.description}</span>
            <span class="text-xs">-${discountRate}%</span>
          </div>
        `;
      });
    }

    // 화요일 할인
    if (discounts.tuesday && discounts.tuesday.discountAmount > 0) {
      discountHTML += `
        <div class="flex justify-between text-sm tracking-wide text-purple-400">
          <span class="text-xs">🌟 화요일 추가 할인</span>
          <span class="text-xs">-10%</span>
        </div>
      `;
    }

    return discountHTML;
  }

  /**
   * 할인 타입에 따른 스타일 정보를 반환
   * @param {string} discountType - 할인 타입 (flash, recommend, combo)
   * @returns {Object} 아이콘과 색상 정보
   */
  static getDiscountStyle(discountType) {
    switch (discountType) {
      case 'flash':
        return { icon: '⚡', color: 'text-red-400' };
      case 'recommend':
        return { icon: '💝', color: 'text-blue-400' };
      case 'combo':
        return { icon: '⚡💝', color: 'text-purple-600' };
      default:
        return { icon: '🎁', color: 'text-purple-400' };
    }
  }

  /**
   * 총 절약 정보를 생성
   * @param {PricingData} pricing - 가격 정보
   * @returns {string} 절약 정보 HTML
   */
  static generateSavingsInfo(pricing) {
    if (!pricing || pricing.totalSavings <= 0) {
      return '';
    }

    const discountPercentage = (pricing.discountRate * 100).toFixed(1);

    return `
      <div class="savings-info bg-green-500/20 rounded-lg p-3">
        <div class="flex justify-between items-center mb-1">
          <span class="text-xs uppercase tracking-wide text-green-400">총 할인율</span>
          <span class="text-sm font-medium text-green-400">${discountPercentage}%</span>
        </div>
        <div class="text-2xs text-gray-300">₩${Math.round(pricing.totalSavings).toLocaleString()} 할인되었습니다</div>
      </div>
    `;
  }

  /**
   * 포인트 적립 정보를 생성
   * @param {PointsData} points - 포인트 정보
   * @returns {string} 포인트 정보 HTML
   */
  static generatePointsInfo(points) {
    if (!points || points.total <= 0) {
      return '';
    }

    const messagesText = points.messages.join(', ');

    return `
      <div class="points-info">
        <div>적립 포인트: <span class="font-bold">${points.total}p</span></div>
        <div class="text-2xs opacity-70 mt-1">${messagesText}</div>
      </div>
    `;
  }

  /**
   * 화요일 특별 할인 배너를 생성
   * @param {Object} tuesdayDiscount - 화요일 할인 정보
   * @returns {string} 화요일 배너 HTML
   */
  static generateTuesdayBanner(tuesdayDiscount) {
    if (!tuesdayDiscount || !tuesdayDiscount.discountAmount) {
      return '';
    }

    return `
      <div class="tuesday-banner mt-4 p-3 bg-white/10 rounded-lg">
        <div class="flex items-center gap-2">
          <span class="text-2xs">🎉</span>
          <span class="text-xs uppercase tracking-wide">Tuesday Special 10% Applied</span>
        </div>
      </div>
    `;
  }

  /**
   * 최종 주문 금액 요약을 생성
   * @param {PricingData} pricing - 가격 정보
   * @returns {string} 최종 요약 HTML
   */
  static generateFinalSummary(pricing) {
    if (!pricing) {
      return '';
    }

    return `
      <div class="final-summary pt-5 border-t border-white/10">
        <div class="flex justify-between items-baseline">
          <span class="text-sm uppercase tracking-wider">Total</span>
          <div class="text-2xl tracking-tight">₩${Math.round(pricing.finalAmount).toLocaleString()}</div>
        </div>
      </div>
    `;
  }

  /**
   * main.basic.js 호환 데이터 변환 유틸리티
   * Epic 3 계산 엔진 결과를 OrderSummary 형식으로 변환
   * @param {Object} calculationResults - 계산 엔진 결과들
   * @param {Array} cartItems - 장바구니 아이템들
   * @returns {OrderData} OrderSummary용 주문 데이터
   */
  static transformCalculationResults(calculationResults, cartItems = []) {
    const {
      priceResult,
      pointsResult,
      discountResult = {},
      context = {}
    } = calculationResults;

    // 장바구니 아이템 요약 생성
    const items = cartItems.map(item => ({
      id: item.id,
      name: item.product ? item.product.name : item.name,
      quantity: item.quantity,
      unitPrice: item.price || (item.product ? item.product.val : 0),
      totalPrice:
        (item.price || (item.product ? item.product.val : 0)) * item.quantity
    }));

    // 가격 정보 구성
    const pricing = {
      subtotal: priceResult.subtotal || 0,
      finalAmount: priceResult.finalAmount || 0,
      totalSavings: priceResult.totalSavings || 0,
      discountRate:
        priceResult.totalSavings > 0
          ? priceResult.totalSavings / priceResult.subtotal
          : 0,
      discounts: {
        individual: priceResult.individualDiscounts || [],
        bulk: priceResult.bulkDiscount || { discountRate: 0 },
        tuesday: priceResult.tuesdayDiscount || { discountAmount: 0 },
        special: discountResult.specialDiscounts || []
      }
    };

    // 포인트 정보 구성
    const points = pointsResult || { total: 0, messages: [] };

    return {
      pricing,
      points,
      items,
      context: {
        isTuesday: context.isTuesday || new Date().getDay() === 2,
        hasSpecialDiscounts: (discountResult.specialDiscounts || []).length > 0,
        itemCount: items.reduce((total, item) => total + item.quantity, 0)
      }
    };
  }
}
