import { PRODUCT_LIST } from '../../data/product.data.js';
import { TOTAL_STOCK_WARNING_THRESHOLD } from '../../data/quantity.data.js';
import Component from '../../lib/Component.js';
import { calculateTotalStock } from '../../utils/stockCalculator.util.js';

// ProductSelectOption 함수
function ProductSelectOption(product) {
  const { id, name, val, q } = product;
  let iconClass = '';

  // 상품별 아이콘 설정
  if (name.includes('⚡')) iconClass = ' lightning-sale';
  if (name.includes('💝')) iconClass = ' suggestion-sale';

  return `
    <option value="${id}" class="option${iconClass}" ${q === 0 ? 'disabled' : ''}>
      ${name} - ${val}원${q === 0 ? ' (품절)' : ''}
    </option>
  `;
}

export default class ProductSelect extends Component {
  mounted() {
    const totalStock = calculateTotalStock(PRODUCT_LIST);
    const $select = document.querySelector('#product-select');

    if (totalStock < TOTAL_STOCK_WARNING_THRESHOLD) {
      $select.style.borderColor = 'orange';
    } else {
      $select.style.borderColor = '';
    }
  }

  template() {
    return /* HTML */ `
      <select
        id="product-select"
        class="w-full p-3 border border-gray-300 rounded-lg text-base mb-3"
      >
        ${PRODUCT_LIST.map(product => ProductSelectOption(product)).join('')}
      </select>
    `;
  }
}
