/**
 * @fileoverview ProductSelector 컴포넌트
 * 상품 선택 드롭다운을 렌더링하는 순수 함수 기반 컴포넌트
 *
 * 기존 main.basic.js의 onUpdateSelectOptions() 로직을 분리하여
 * 테스트 가능하고 재사용 가능한 컴포넌트로 구현
 */

/**
 * @typedef {Object} Product
 * @property {string} id - 상품 ID
 * @property {string} name - 상품명
 * @property {number} val - 현재 가격
 * @property {number} originalVal - 원래 가격
 * @property {number} q - 재고 수량
 * @property {boolean} onSale - 번개세일 여부
 * @property {boolean} suggestSale - 추천할인 여부
 */

/**
 * @typedef {Object} ProductSelectorOptions
 * @property {string} [id] - select 요소의 ID
 * @property {string} [className] - 추가 CSS 클래스
 * @property {string} [placeholder] - placeholder 텍스트
 * @property {function} [onChange] - 변경 이벤트 핸들러
 */

/**
 * @typedef {Object} ProductOptionData
 * @property {string} value - option의 value 속성
 * @property {string} text - option에 표시할 텍스트
 * @property {boolean} disabled - disabled 여부
 * @property {string} className - CSS 클래스
 */

/**
 * 상품 선택 드롭다운 컴포넌트
 * 모든 상품 선택 관련 UI 로직을 담당하는 순수 함수 기반 클래스
 */
export class ProductSelector {
  /**
   * 상품 선택 드롭다운을 렌더링
   * @param {Array<Product>} products - 상품 목록
   * @param {ProductSelectorOptions} [options={}] - 렌더링 옵션
   * @returns {string} 완성된 select HTML 문자열
   */
  static render(products, options = {}) {
    // 기본 옵션 설정
    const { id = '', className = '', placeholder = '상품을 선택하세요' } = options;

    // 유효성 검사
    if (!Array.isArray(products)) {
      products = [];
    }

    // 전체 재고 계산 (기존 로직과 동일)
    let totalStock = 0;
    for (const product of products) {
      if (product && typeof product.q === 'number') {
        totalStock += product.q;
      }
    }

    // select 요소 속성 구성
    const idAttr = id ? ` id="${id}"` : '';
    const baseClassName = 'w-full p-3 border border-gray-300 rounded-lg text-base mb-3';
    const finalClassName = className ? `${baseClassName} ${className}` : baseClassName;

    // 재고 상태에 따른 스타일 (전체 재고 50개 미만 시 주황색 테두리)
    const borderStyle = totalStock < 50 ? ' style="border-color: orange;"' : '';

    // 옵션들 생성
    let optionsHTML = '';

    // placeholder 옵션 추가 (빈 문자열이 아닌 경우에만)
    if (placeholder && placeholder.trim() !== '') {
      optionsHTML += `<option value="">${placeholder}</option>`;
    }

    // 각 상품에 대한 옵션 생성
    for (const product of products) {
      const optionData = this.generateOption(product);
      const disabledAttr = optionData.disabled ? ' disabled' : '';
      const classAttr = optionData.className ? ` class="${optionData.className}"` : '';

      optionsHTML += `<option value="${optionData.value}"${disabledAttr}${classAttr}>${optionData.text}</option>`;
    }

    // 완성된 select HTML 반환
    return `<select${idAttr} class="${finalClassName}"${borderStyle}>${optionsHTML}</select>`;
  }

  /**
   * 개별 상품 옵션 HTML 생성
   * @param {Product} product - 상품 정보
   * @returns {ProductOptionData} 옵션 데이터
   */
  static generateOption(product) {
    if (!product) {
      return {
        value: '',
        text: '',
        disabled: true,
        className: 'text-gray-400',
      };
    }

    // 아이콘, 가격 정보, 재고 메시지 조합
    const icon = this.getProductIcon(product);
    const priceInfo = this.formatPrice(product);
    const stockMessage = this.getStockMessage(product);
    const style = this.getProductStyle(product);

    // 옵션 텍스트 구성: 아이콘 + 상품명 + 가격정보 + 재고메시지
    const optionText = `${icon}${product.name}${priceInfo}${stockMessage}`;

    return {
      value: product.id,
      text: optionText,
      disabled: product.q === 0, // 품절 상품은 비활성화
      className: style,
    };
  }

  /**
   * 상품 상태에 따른 아이콘 반환
   * @param {Product} product - 상품 정보
   * @returns {string} 아이콘 문자열
   */
  static getProductIcon(product) {
    if (!product) return '';

    // 번개세일과 추천할인 모두 적용된 경우
    if (product.onSale && product.suggestSale) {
      return '⚡💝';
    }

    // 번개세일만 적용된 경우
    if (product.onSale) {
      return '⚡';
    }

    // 추천할인만 적용된 경우
    if (product.suggestSale) {
      return '💝';
    }

    // 일반 상품 (아이콘 없음)
    return '';
  }

  /**
   * 재고 상태에 따른 메시지 반환
   * @param {Product} product - 상품 정보
   * @returns {string} 재고 메시지
   */
  static getStockMessage(product) {
    if (!product || typeof product.q !== 'number') {
      return '';
    }

    // 품절 상태 (재고 0개)
    if (product.q === 0) {
      return ' (품절)';
    }

    // 재고 부족 상태 (5개 미만) - 옵션으로 표시하지 않음 (기존 로직과 동일)
    // 기존 main.basic.js에서는 옵션에 재고 부족 메시지를 표시하지 않음

    // 정상 재고 (메시지 없음)
    return '';
  }

  /**
   * 가격 정보를 포맷팅하여 반환
   * @param {Product} product - 상품 정보
   * @returns {string} 포맷된 가격 문자열
   */
  static formatPrice(product) {
    if (!product) return '';

    // 번개세일과 추천할인 모두 적용된 경우 (25% SUPER SALE)
    if (product.onSale && product.suggestSale) {
      return ` - ${product.originalVal}원 → ${product.val}원 (25% SUPER SALE!)`;
    }

    // 번개세일만 적용된 경우 (20% SALE)
    if (product.onSale) {
      return ` - ${product.originalVal}원 → ${product.val}원 (20% SALE!)`;
    }

    // 추천할인만 적용된 경우 (5% 추천할인)
    if (product.suggestSale) {
      return ` - ${product.originalVal}원 → ${product.val}원 (5% 추천할인!)`;
    }

    // 일반 상품 (할인 없음)
    return ` - ${product.val}원`;
  }

  /**
   * 상품 상태에 따른 CSS 클래스 반환
   * @param {Product} product - 상품 정보
   * @returns {string} CSS 클래스 문자열
   */
  static getProductStyle(product) {
    if (!product) return '';

    // 품절 상품
    if (product.q === 0) {
      return 'text-gray-400';
    }

    // 번개세일과 추천할인 모두 적용된 경우
    if (product.onSale && product.suggestSale) {
      return 'text-purple-600 font-bold';
    }

    // 번개세일만 적용된 경우
    if (product.onSale) {
      return 'text-red-500 font-bold';
    }

    // 추천할인만 적용된 경우
    if (product.suggestSale) {
      return 'text-blue-500 font-bold';
    }

    // 일반 상품 (클래스 없음)
    return '';
  }
}
