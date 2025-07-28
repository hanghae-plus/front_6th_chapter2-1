/**
 * @fileoverview CartItem 컴포넌트
 * 장바구니 개별 아이템을 렌더링하는 순수 함수 기반 컴포넌트
 *
 * 기존 main.basic.js의 복잡한 장바구니 아이템 생성 로직을 분리하여
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
 * @typedef {Object} DiscountInfo
 * @property {Object} individual - 개별 할인 정보
 * @property {number} individual.rate - 할인율
 * @property {number} individual.amount - 할인 금액
 * @property {Object} bulk - 대량 구매 할인 정보
 * @property {boolean} bulk.applied - 대량 할인 적용 여부
 * @property {Object} tuesday - 화요일 할인 정보
 * @property {boolean} tuesday.applied - 화요일 할인 적용 여부
 * @property {number} tuesday.rate - 화요일 할인율
 */

/**
 * @typedef {Object} CartItemData
 * @property {Product} product - 상품 정보
 * @property {number} quantity - 수량
 * @property {DiscountInfo} [discounts] - 할인 정보
 * @property {number} subtotal - 소계
 * @property {number} stock - 현재 재고
 */

/**
 * @typedef {Object} CartItemOptions
 * @property {boolean} [showDiscounts=true] - 할인 정보 표시 여부
 * @property {boolean} [allowQuantityChange=true] - 수량 변경 허용 여부
 * @property {string} [className] - 추가 CSS 클래스
 * @property {function} [onQuantityChange] - 수량 변경 이벤트 핸들러
 * @property {function} [onRemove] - 제거 이벤트 핸들러
 */

/**
 * 장바구니 개별 아이템 컴포넌트
 * 모든 장바구니 아이템 관련 UI 로직을 담당하는 순수 함수 기반 클래스
 */
export class CartItem {
  /**
   * 장바구니 아이템을 렌더링
   * @param {CartItemData} item - 장바구니 아이템 데이터
   * @param {CartItemOptions} [options={}] - 렌더링 옵션
   * @returns {string} 완성된 장바구니 아이템 HTML 문자열
   */
  static render(item, options = {}) {
    // 기본 옵션 설정
    const { showDiscounts = true, allowQuantityChange = true, className = '' } = options;

    // 데이터 유효성 검사
    if (!item || !item.product) {
      throw new Error('CartItem.render: item과 item.product는 필수입니다.');
    }

    const { product, quantity = 1 } = item;

    // 아이템 컨테이너 CSS 클래스 구성
    const containerClasses = [
      'grid',
      'grid-cols-[80px_1fr_auto]',
      'gap-5',
      'py-5',
      'border-b',
      'border-gray-100',
      'first:pt-0',
      'last:border-b-0',
      'last:pb-0',
      className,
    ]
      .filter(Boolean)
      .join(' ');

    // 아이템 HTML 조합
    const imageSection = CartItem.generateImageSection(product);
    const contentSection = CartItem.generateContentSection(product, quantity, {
      showDiscounts,
      allowQuantityChange,
    });
    const priceSection = CartItem.generatePriceSection(product, quantity, { showDiscounts });

    return `
      <div id="${product.id}" class="${containerClasses}">
        ${imageSection}
        ${contentSection}
        ${priceSection}
      </div>
    `;
  }

  /**
   * 상품 이미지 섹션을 생성
   * @param {Product} product - 상품 정보
   * @returns {string} 이미지 섹션 HTML
   */
  static generateImageSection(product) {
    return `
      <div class="w-20 h-20 bg-gradient-black relative overflow-hidden">
        <div class="absolute top-1/2 left-1/2 w-[60%] h-[60%] bg-white/10 -translate-x-1/2 -translate-y-1/2 rotate-45"></div>
      </div>
    `;
  }

  /**
   * 컨텐츠 섹션을 생성 (제품명, 가격, 수량 컨트롤)
   * @param {Product} product - 상품 정보
   * @param {number} quantity - 수량
   * @param {Object} options - 옵션
   * @returns {string} 컨텐츠 섹션 HTML
   */
  static generateContentSection(product, quantity, options = {}) {
    const { showDiscounts = true, allowQuantityChange = true } = options;

    // 제품명에 할인 아이콘 추가
    const discountIcons = CartItem.generateDiscountIcons(product);
    const priceDisplay = CartItem.generateInlinePriceDisplay(product, { showDiscounts });
    const quantityControls = CartItem.generateQuantityControls(product, quantity, {
      allowQuantityChange,
    });

    return `
      <div>
        <h3 class="text-base font-normal mb-1 tracking-tight">${discountIcons}${product.name}</h3>
        <p class="text-xs text-gray-500 mb-0.5 tracking-wide">PRODUCT</p>
        <p class="text-xs text-black mb-3">${priceDisplay}</p>
        ${quantityControls}
      </div>
    `;
  }

  /**
   * 가격 섹션을 생성 (우측 가격 표시 및 제거 버튼)
   * @param {Product} product - 상품 정보
   * @param {number} quantity - 수량
   * @param {Object} options - 옵션
   * @returns {string} 가격 섹션 HTML
   */
  static generatePriceSection(product, quantity, options = {}) {
    const { showDiscounts = true } = options;

    const totalPrice = product.val * quantity;
    const priceDisplay = CartItem.generateTotalPriceDisplay(product, totalPrice, { showDiscounts });
    const removeButton = CartItem.generateRemoveButton(product);

    return `
      <div class="text-right">
        <div class="text-lg mb-2 tracking-tight tabular-nums">${priceDisplay}</div>
        ${removeButton}
      </div>
    `;
  }

  /**
   * 할인 아이콘을 생성
   * @param {Product} product - 상품 정보
   * @returns {string} 할인 아이콘 문자열
   */
  static generateDiscountIcons(product) {
    if (product.onSale && product.suggestSale) {
      return '⚡💝';
    } else if (product.onSale) {
      return '⚡';
    } else if (product.suggestSale) {
      return '💝';
    }
    return '';
  }

  /**
   * 인라인 가격 표시를 생성 (컨텐츠 섹션용)
   * @param {Product} product - 상품 정보
   * @param {Object} options - 옵션
   * @returns {string} 인라인 가격 표시 HTML
   */
  static generateInlinePriceDisplay(product, options = {}) {
    const { showDiscounts = true } = options;

    if (showDiscounts && (product.onSale || product.suggestSale)) {
      const discountColor = CartItem.getDiscountColor(product);
      return `<span class="line-through text-gray-400">₩${product.originalVal.toLocaleString()}</span> <span class="${discountColor}">₩${product.val.toLocaleString()}</span>`;
    }

    return `₩${product.val.toLocaleString()}`;
  }

  /**
   * 총 가격 표시를 생성 (가격 섹션용)
   * @param {Product} product - 상품 정보
   * @param {number} totalPrice - 총 가격
   * @param {Object} options - 옵션
   * @returns {string} 총 가격 표시 HTML
   */
  static generateTotalPriceDisplay(product, totalPrice, options = {}) {
    const { showDiscounts = true } = options;

    if (showDiscounts && (product.onSale || product.suggestSale)) {
      const originalTotalPrice = product.originalVal * (totalPrice / product.val);
      const discountColor = CartItem.getDiscountColor(product);
      return `<span class="line-through text-gray-400">₩${originalTotalPrice.toLocaleString()}</span> <span class="${discountColor}">₩${totalPrice.toLocaleString()}</span>`;
    }

    return `₩${totalPrice.toLocaleString()}`;
  }

  /**
   * 할인 색상 클래스를 결정
   * @param {Product} product - 상품 정보
   * @returns {string} CSS 색상 클래스
   */
  static getDiscountColor(product) {
    if (product.onSale && product.suggestSale) {
      return 'text-purple-600';
    } else if (product.onSale) {
      return 'text-red-500';
    } else if (product.suggestSale) {
      return 'text-blue-500';
    }
    return '';
  }

  /**
   * 수량 조절 컨트롤을 생성
   * @param {Product} product - 상품 정보
   * @param {number} quantity - 현재 수량
   * @param {Object} options - 옵션
   * @returns {string} 수량 조절 컨트롤 HTML
   */
  static generateQuantityControls(product, quantity, options = {}) {
    const { allowQuantityChange = true } = options;

    if (!allowQuantityChange) {
      return `
        <div class="flex items-center gap-4">
          <span class="text-sm font-normal min-w-[20px] text-center tabular-nums">수량: ${quantity}</span>
        </div>
      `;
    }

    return `
      <div class="flex items-center gap-4">
        <button class="quantity-change w-6 h-6 border border-black bg-white text-sm flex items-center justify-center transition-all hover:bg-black hover:text-white" data-product-id="${product.id}" data-change="-1">−</button>
        <span class="quantity-number text-sm font-normal min-w-[20px] text-center tabular-nums">${quantity}</span>
        <button class="quantity-change w-6 h-6 border border-black bg-white text-sm flex items-center justify-center transition-all hover:bg-black hover:text-white" data-product-id="${product.id}" data-change="1">+</button>
      </div>
    `;
  }

  /**
   * 제거 버튼을 생성
   * @param {Product} product - 상품 정보
   * @returns {string} 제거 버튼 HTML
   */
  static generateRemoveButton(product) {
    return `
      <a class="remove-item text-2xs text-gray-500 uppercase tracking-wider cursor-pointer transition-colors border-b border-transparent hover:text-black hover:border-black" data-product-id="${product.id}">Remove</a>
    `;
  }
}
