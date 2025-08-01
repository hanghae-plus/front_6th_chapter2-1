import { BUSINESS_CONSTANTS } from '@/basic/shared/constants/business.js';
import { setInnerHTML } from '@/basic/shared/core/domUtils.js';
import { htmlToElement } from '@/basic/shared/utils/dom.js';

/**
 * ProductSelector Component
 * @param {object} props - Component props
 * @param {Array} props.products - Array of products
 * @param {string} props.selectedProductId - Currently selected product ID
 * @param {Function} props.onSelectionChange - Selection change callback
 * @returns {HTMLElement} Product selector element
 */
const ProductSelector = ({
  products = [],
  selectedProductId = '',
  onSelectionChange,
}) => {
  // 할인 표시 텍스트 생성 함수
  const createDiscountText = product => {
    const { DISCOUNT } = BUSINESS_CONSTANTS;

    if (product.q === 0) {
      return `${product.name} - ${product.val}원 (품절)`;
    }

    if (product.onSale && product.suggestSale) {
      const superSaleRate =
        (DISCOUNT.FLASH_SALE_DISCOUNT_RATE + DISCOUNT.SUGGEST_DISCOUNT_RATE) *
        100;
      return `⚡💝${product.name} - ${product.originalVal}원 → ${product.val}원 (${superSaleRate}% SUPER SALE!)`;
    }

    if (product.onSale) {
      const flashSaleRate = DISCOUNT.FLASH_SALE_DISCOUNT_RATE * 100;
      return `⚡${product.name} - ${product.originalVal}원 → ${product.val}원 (${flashSaleRate}% SALE!)`;
    }

    if (product.suggestSale) {
      const suggestRate = DISCOUNT.SUGGEST_DISCOUNT_RATE * 100;
      return `💝${product.name} - ${product.originalVal}원 → ${product.val}원 (${suggestRate}% 추천할인!)`;
    }

    return `${product.name} - ${product.val}원`;
  };

  // 할인 표시 클래스 생성 함수
  const createDiscountClass = product => {
    if (product.q === 0) {
      return 'class="text-gray-400"';
    }

    if (product.onSale && product.suggestSale) {
      return 'class="text-purple-600 font-bold"';
    }

    if (product.onSale) {
      return 'class="text-red-500 font-bold"';
    }

    if (product.suggestSale) {
      return 'class="text-blue-500 font-bold"';
    }

    return '';
  };

  // 공통 옵션 생성 함수 (중복 제거)
  const createOptionHTML = product => {
    const text = createDiscountText(product);
    const className = createDiscountClass(product);
    const disabled = product.q === 0 ? 'disabled' : '';

    return /* html */ `
      <option value="${product.id}" ${className} ${disabled}>
        ${text}
      </option>
    `;
  };

  // 옵션 HTML 생성 함수
  const generateOptionsHTML = productsToRender => {
    return productsToRender.map(createOptionHTML).join('');
  };

  const selectorHTML = /* html */ `
    <select 
      id="product-select" 
      class="w-full p-3 border border-gray-300 rounded-lg text-base mb-3"
    >
      ${generateOptionsHTML(products)}
    </select>
  `;

  const selector = htmlToElement(selectorHTML);

  if (selectedProductId) {
    selector.value = selectedProductId;
  }

  selector.addEventListener('change', e => {
    if (onSelectionChange) {
      onSelectionChange(e.target.value);
    }
  });

  selector.updateProducts = (newProducts, newSelectedId) => {
    const newOptionsHTML = generateOptionsHTML(newProducts);
    setInnerHTML(selector, newOptionsHTML);

    if (newSelectedId) {
      selector.value = newSelectedId;
    }
  };

  return selector;
};

export default ProductSelector;
