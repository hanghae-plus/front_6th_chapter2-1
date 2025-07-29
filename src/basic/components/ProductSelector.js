import { PRODUCT_LIST } from "../data/product.data";
import { TOTAL_STOCK_WARNING_THRESHOLD } from "../data/quantity.data";
import Component from "../lib/Component";
import { calculateTotalStock } from "../utils/stockCalculator.util";
import ProductSelectOption from "./ProductSelectOption";

export default class ProductSelector extends Component {
  mounted() {
    const totalStock = calculateTotalStock(PRODUCT_LIST);
    const $select = document.querySelector("#product-select");

    if (totalStock < TOTAL_STOCK_WARNING_THRESHOLD) {
      $select.style.borderColor = "orange";
    } else {
      $select.style.borderColor = "";
    }
  }

  template() {
    return /* HTML */ `
      <div id="leftColumn" class="bg-white border border-gray-200 p-8 overflow-y-auto">
        <div id="selectorContainer" class="mb-6 pb-6 border-b border-gray-200">
          <select
            id="product-select"
            class="w-full p-3 border border-gray-300 rounded-lg text-base mb-3"
          >
            ${PRODUCT_LIST.map(product => ProductSelectOption(product)).join("")}
          </select>

          <!-- Add to Cart Button -->
          <button
            id="add-to-cart"
            class="w-full py-3 bg-black text-white text-sm font-medium uppercase tracking-wider hover:bg-gray-800 transition-all"
          >
            Add to Cart
          </button>

          <!-- Stock Status -->
          <div id="stock-status" class="text-xs text-red-500 mt-3 whitespace-pre-line"></div>
        </div>
        <div id="cart-items"></div>
      </div>
    `;
  }
}
