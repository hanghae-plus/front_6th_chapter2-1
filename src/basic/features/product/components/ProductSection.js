import { ProductSelector } from "./ProductSelector.js";
import { ELEMENT_IDS } from "../../../shared/constants/element-ids.js";
import { htmlToElement } from "../../../shared/utils/dom.js";

export const ProductSection = () => {
  const productSelectorElement = ProductSelector({
    products: window.productStore.getProducts(),
    selectedProductId: window.productStore.getLastSelectedProduct(),
    onSelectionChange: (productId) => {
      window.productStore.setLastSelectedProduct(productId);
    },
  });

  const leftColumnHTML = /* html */ `
    <div class="bg-white border border-gray-200 p-8 overflow-y-auto">
      <div class="mb-6 pb-6 border-b border-gray-200">
        <!-- ProductSelector will be inserted here -->
        <button id="${ELEMENT_IDS.ADD_TO_CART}" class="w-full py-3 bg-black text-white text-sm font-medium uppercase tracking-wider hover:bg-gray-800 transition-all">
          Add to Cart
        </button>
        <div id="${ELEMENT_IDS.STOCK_STATUS}" class="text-xs text-red-500 mt-3 whitespace-pre-line"></div>
      </div>
      <div id="${ELEMENT_IDS.CART_ITEMS}" class="space-y-3"></div>
    </div>
  `;

  const leftColumn = htmlToElement(leftColumnHTML);
  const selectorContainer = leftColumn.querySelector(".border-b");
  selectorContainer.insertBefore(
    productSelectorElement,
    selectorContainer.firstChild
  );

  return {
    element: leftColumn,
    productSelector: productSelectorElement,
  };
};
