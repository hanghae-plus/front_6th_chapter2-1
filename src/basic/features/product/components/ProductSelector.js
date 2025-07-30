import { setInnerHTML } from '../../../shared/core/domUtils.js';
import { htmlToElement } from '../../../shared/utils/dom.js';

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
  const renderOptions = () => {
    return products
      .map(product => {
        const baseText = `${product.name} - ${product.val}원`;
        const baseClass = '';

        const optionConfig =
          product.q === 0
            ? {
                text: `${product.name} - ${product.val}원 (품절)`,
                class: 'class="text-gray-400"',
              }
            : product.onSale && product.suggestSale
              ? {
                  text: `⚡💝${product.name} - ${product.originalVal}원 → ${product.val}원 (25% SUPER SALE!)`,
                  class: 'class="text-purple-600 font-bold"',
                }
              : product.onSale
                ? {
                    text: `⚡${product.name} - ${product.originalVal}원 → ${product.val}원 (20% SALE!)`,
                    class: 'class="text-red-500 font-bold"',
                  }
                : product.suggestSale
                  ? {
                      text: `💝${product.name} - ${product.originalVal}원 → ${product.val}원 (5% 추천할인!)`,
                      class: 'class="text-blue-500 font-bold"',
                    }
                  : {
                      text: baseText,
                      class: baseClass,
                    };

        const disabled = product.q === 0 ? 'disabled' : '';

        return /* html */ `
        <option value="${product.id}" ${optionConfig.class} ${disabled}>
          ${optionConfig.text}
        </option>
      `;
      })
      .join('');
  };

  const selectorHTML = /* html */ `
    <select 
      id="product-select" 
      class="w-full p-3 border border-gray-300 rounded-lg text-base mb-3"
    >
      ${renderOptions()}
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
    const newOptionsHTML = newProducts
      .map(product => {
        const baseText = `${product.name} - ${product.val}원`;
        const baseClass = '';

        const optionConfig =
          product.q === 0
            ? {
                text: `${product.name} - ${product.val}원 (품절)`,
                class: 'class="text-gray-400"',
              }
            : product.onSale && product.suggestSale
              ? {
                  text: `⚡💝${product.name} - ${product.originalVal}원 → ${product.val}원 (25% SUPER SALE!)`,
                  class: 'class="text-purple-600 font-bold"',
                }
              : product.onSale
                ? {
                    text: `⚡${product.name} - ${product.originalVal}원 → ${product.val}원 (20% SALE!)`,
                    class: 'class="text-red-500 font-bold"',
                  }
                : product.suggestSale
                  ? {
                      text: `💝${product.name} - ${product.originalVal}원 → ${product.val}원 (5% 추천할인!)`,
                      class: 'class="text-blue-500 font-bold"',
                    }
                  : {
                      text: baseText,
                      class: baseClass,
                    };

        const disabled = product.q === 0 ? 'disabled' : '';

        return /* html */ `
        <option value="${product.id}" ${optionConfig.class} ${disabled}>
          ${optionConfig.text}
        </option>
      `;
      })
      .join('');

    setInnerHTML(selector, newOptionsHTML);

    if (newSelectedId) {
      selector.value = newSelectedId;
    }
  };

  return selector;
};

export default ProductSelector;
