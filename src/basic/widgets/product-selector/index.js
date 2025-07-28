import { formatCurrency } from '../../shared/utils/index.js';
import { BUSINESS_CONSTANTS } from '../../shared/constants/index.js';

// 상품 선택기 위젯
export class ProductSelectorWidget {
  constructor(container, productRepository, onProductSelect, onAddToCart) {
    this.container = container;
    this.productRepo = productRepository;
    this.onProductSelect = onProductSelect;
    this.onAddToCart = onAddToCart;
    this.selectedProductId = null;
    
    this.render();
    this.bindEvents();
  }

  render() {
    const products = this.productRepo.findAll();
    const totalStock = this.productRepo.getTotalStock();
    
    this.container.innerHTML = `
      <div class="mb-6 pb-6 border-b border-gray-200">
        <select id="product-select" class="w-full p-3 border border-gray-300 rounded-lg text-base mb-3 ${totalStock < BUSINESS_CONSTANTS.STOCK_WARNING_THRESHOLD ? 'border-orange-500' : ''}">
          ${products.map(product => this._renderProductOption(product)).join('')}
        </select>
        <button id="add-to-cart" class="w-full py-3 bg-black text-white text-sm font-medium uppercase tracking-wider hover:bg-gray-800 transition-all">
          Add to Cart
        </button>
        <div id="stock-status" class="text-xs text-red-500 mt-3 whitespace-pre-line">
          ${this._getStockStatusMessage()}
        </div>
      </div>
    `;
  }

  _renderProductOption(product) {
    const isOutOfStock = product.isOutOfStock();
    const isOnSale = product.onSale;
    const isSuggestSale = product.suggestSale;
    
    let displayText = `${product.name} - ${formatCurrency(product.val)}`;
    let iconPrefix = '';
    
    if (isOutOfStock) {
      displayText += ' (품절)';
    } else if (isOnSale) {
      iconPrefix = '⚡ ';
      displayText += ' (번개세일!)';
    } else if (isSuggestSale) {
      iconPrefix = '💝 ';
      displayText += ' (추천!)';
    }
    
    return `
      <option value="${product.id}" ${isOutOfStock ? 'disabled' : ''}>
        ${iconPrefix}${displayText}
      </option>
    `;
  }

  _getStockStatusMessage() {
    const lowStockProducts = this.productRepo.getLowStockProducts();
    const outOfStockProducts = this.productRepo.getOutOfStockProducts();
    
    let message = '';
    
    lowStockProducts.forEach(product => {
      message += `${product.name}: 재고 부족 (${product.q}개 남음)\n`;
    });
    
    outOfStockProducts.forEach(product => {
      message += `${product.name}: 품절\n`;
    });
    
    return message;
  }

  bindEvents() {
    const selectElement = this.container.querySelector('#product-select');
    const addButton = this.container.querySelector('#add-to-cart');
    
    selectElement.addEventListener('change', (e) => {
      this.selectedProductId = e.target.value;
      if (this.onProductSelect) {
        this.onProductSelect(this.selectedProductId);
      }
    });
    
    addButton.addEventListener('click', () => {
      if (this.selectedProductId && this.onAddToCart) {
        this.onAddToCart(this.selectedProductId);
      }
    });
  }

  // 위젯 업데이트
  update() {
    this.render();
    this.bindEvents();
    
    // 선택된 상품 유지
    if (this.selectedProductId) {
      const selectElement = this.container.querySelector('#product-select');
      selectElement.value = this.selectedProductId;
    }
  }

  // 선택된 상품 ID 조회
  getSelectedProductId() {
    return this.selectedProductId;
  }

  // 프로모션 상태 업데이트
  updatePromotions(promotionStatus) {
    // 프로모션 상태에 따른 UI 업데이트
    this.update();
  }
}