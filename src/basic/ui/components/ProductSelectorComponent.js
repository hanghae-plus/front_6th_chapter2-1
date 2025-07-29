import { formatPrice } from '../../utils/PriceUtils.js';
import { UI_CONSTANTS } from '../../constants/UIConstants.js';

/**
 * 상품 선택 컴포넌트
 */
export class ProductSelectorComponent {
  constructor(productService, onProductSelect) {
    this.productService = productService;
    this.onProductSelect = onProductSelect;
    this.element = this.createElement();
    this.bindEvents();
  }

  /**
   * 상품 선택 요소 생성
   * @returns {HTMLElement} 상품 선택 컨테이너
   */
  createElement() {
    const container = document.createElement('div');
    container.className = 'mb-6 pb-6 border-b border-gray-200';

    const select = document.createElement('select');
    select.id = 'product-select';
    select.className = 'w-full p-3 border border-gray-300 rounded-lg text-base mb-3';

    const addButton = document.createElement('button');
    addButton.id = 'add-to-cart';
    addButton.innerHTML = 'Add to Cart';
    addButton.className =
      'w-full py-3 bg-black text-white text-sm font-medium uppercase tracking-wider hover:bg-gray-800 transition-all';

    const stockInfo = document.createElement('div');
    stockInfo.id = 'stock-status';
    stockInfo.className = 'text-xs text-red-500 mt-3 whitespace-pre-line';

    container.appendChild(select);
    container.appendChild(addButton);
    container.appendChild(stockInfo);

    return container;
  }

  /**
   * 이벤트 바인딩
   */
  bindEvents() {
    const addButton = this.element.querySelector('#add-to-cart');
    if (addButton) {
      addButton.addEventListener('click', () => {
        const select = this.element.querySelector('#product-select');
        const selectedProductId = select.value;

        if (selectedProductId && this.onProductSelect) {
          this.onProductSelect(selectedProductId);
        }
      });
    }
  }

  /**
   * 상품 옵션 업데이트
   */
  updateOptions() {
    const select = this.element.querySelector('#product-select');
    if (!select) return;

    select.innerHTML = '';
    const products = this.productService.getAllProducts();

    products.forEach((product) => {
      const option = this.createProductOption(product);
      select.appendChild(option);
    });

    this.updateStockWarning();
  }

  /**
   * 상품 옵션 생성
   * @param {Object} product - 상품 정보
   * @returns {HTMLElement} 옵션 요소
   */
  createProductOption(product) {
    const option = document.createElement('option');
    option.value = product.id;

    const discountText = this.getDiscountText(product);
    const stockText = product.isSoldOut() ? ' (품절)' : '';

    option.textContent = `${product.name} - ${formatPrice(product.val)}${stockText}${discountText}`;
    option.disabled = product.isSoldOut();

    if (product.isSoldOut()) {
      option.className = UI_CONSTANTS.CLASSES.SOLD_OUT_ITEM;
    } else if (product.onSale && product.suggestSale) {
      option.className = UI_CONSTANTS.CLASSES.SUPER_SALE_ITEM;
    } else if (product.onSale) {
      option.className = UI_CONSTANTS.CLASSES.SALE_ITEM;
    } else if (product.suggestSale) {
      option.className = UI_CONSTANTS.CLASSES.RECOMMENDATION_ITEM;
    }

    return option;
  }

  /**
   * 할인 텍스트 생성
   * @param {Object} product - 상품 정보
   * @returns {string} 할인 텍스트
   */
  getDiscountText(product) {
    let discountText = '';

    if (product.onSale) discountText += ' ⚡SALE';
    if (product.suggestSale) discountText += ' 💝추천';

    return discountText;
  }

  /**
   * 재고 경고 업데이트
   */
  updateStockWarning() {
    const select = this.element.querySelector('#product-select');
    const totalStock = this.productService.getTotalStock();

    if (totalStock < UI_CONSTANTS.TOTAL_STOCK_THRESHOLD) {
      select.style.borderColor = 'orange';
    } else {
      select.style.borderColor = '';
    }
  }

  /**
   * 재고 상태 메시지 업데이트
   */
  updateStockMessage() {
    const stockInfo = this.element.querySelector('#stock-status');
    if (stockInfo) {
      stockInfo.textContent = this.productService.generateLowStockMessage();
    }
  }

  /**
   * 컴포넌트 요소 반환
   * @returns {HTMLElement} 컴포넌트 요소
   */
  getElement() {
    return this.element;
  }
}
