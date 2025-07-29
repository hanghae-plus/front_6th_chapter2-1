import { PRODUCT_LIST } from '../constants/products';
import ProductSelector from './ProductSelector';

class LeftColumn {
  constructor(parentElement) {
    this.parentElement = parentElement;
    this.container = null;
    this.productSelector = null;
  }

  template() {
    return `
      <div class="mb-6 pb-6 border-b border-gray-200">
        <!-- 상품 선택, 장바구니 담기 버튼, 재고 현황 -->
      </div>
      <div id="cart-items">
        <!-- 장바구니에 담은 상품 리스트 -->
      </div>
    `;
  }

  render() {
    this.container.innerHTML = this.template();
    this.parentElement.appendChild(this.parentElement);

    this.init();
  }

  init() {
    this.productSelector = new ProductSelector(this.container);
    this.productSelector.render();
    this.productSelector.updateOptions(PRODUCT_LIST);
  }
}

export default LeftColumn;
