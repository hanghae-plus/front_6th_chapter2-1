import { htmlToElement } from '../../../shared/utils/dom.js';

/**
 * Pure ProductSelector Component - JSX-like Template
 * @param {object} props - Component props
 * @param {Array} props.products - Product list
 * @param {string} props.selectedProductId - Currently selected product ID
 * @param {Function} props.onSelectionChange - Callback when selection changes
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
        let optionText = `${product.name} - ${product.val}원`;
        let optionClass = '';

        if (product.q === 0) {
          optionText = `${product.name} - ${product.val}원 (품절)`;
          optionClass = 'class="text-gray-400"';
        } else {
          if (product.onSale && product.suggestSale) {
            optionText = `⚡💝${product.name} - ${product.originalVal}원 → ${product.val}원 (25% SUPER SALE!)`;
            optionClass = 'class="text-purple-600 font-bold"';
          } else if (product.onSale) {
            optionText = `⚡${product.name} - ${product.originalVal}원 → ${product.val}원 (20% SALE!)`;
            optionClass = 'class="text-red-500 font-bold"';
          } else if (product.suggestSale) {
            optionText = `💝${product.name} - ${product.originalVal}원 → ${product.val}원 (5% 추천할인!)`;
            optionClass = 'class="text-blue-500 font-bold"';
          }
        }

        const disabled = product.q === 0 ? 'disabled' : '';

        return /* html */ `
        <option value="${product.id}" ${optionClass} ${disabled}>
          ${optionText}
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

  // Set initial selection
  if (selectedProductId) {
    selector.value = selectedProductId;
  }

  // Add event listener
  selector.addEventListener('change', e => {
    if (onSelectionChange) {
      onSelectionChange(e.target.value);
    }
  });

  // Add update method for compatibility
  selector.updateProducts = (newProducts, newSelectedId) => {
    // Re-render options
    const newOptionsHTML = newProducts
      .map(product => {
        let optionText = `${product.name} - ${product.val}원`;
        let optionClass = '';

        if (product.q === 0) {
          optionText = `${product.name} - ${product.val}원 (품절)`;
          optionClass = 'class="text-gray-400"';
        } else {
          if (product.onSale && product.suggestSale) {
            optionText = `⚡💝${product.name} - ${product.originalVal}원 → ${product.val}원 (25% SUPER SALE!)`;
            optionClass = 'class="text-purple-600 font-bold"';
          } else if (product.onSale) {
            optionText = `⚡${product.name} - ${product.originalVal}원 → ${product.val}원 (20% SALE!)`;
            optionClass = 'class="text-red-500 font-bold"';
          } else if (product.suggestSale) {
            optionText = `💝${product.name} - ${product.originalVal}원 → ${product.val}원 (5% 추천할인!)`;
            optionClass = 'class="text-blue-500 font-bold"';
          }
        }

        const disabled = product.q === 0 ? 'disabled' : '';

        return /* html */ `
        <option value="${product.id}" ${optionClass} ${disabled}>
          ${optionText}
        </option>
      `;
      })
      .join('');

    selector.innerHTML = newOptionsHTML;

    if (newSelectedId) {
      selector.value = newSelectedId;
    }
  };

  return selector;
};

export { ProductSelector };
