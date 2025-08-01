import ProductSelector from '@/basic/features/product/components/ProductSelector.js';
import {
  productState,
  setProductState,
} from '@/basic/features/product/store/productStore.js';
import { Header } from '@/basic/shared/components/Header.js';
import { HelpModal } from '@/basic/shared/components/HelpModal.js';
import { ELEMENT_IDS } from '@/basic/shared/constants/elementIds.js';
import { htmlToElement } from '@/basic/shared/utils/dom.js';

/**
 * Main App Component - JSX-like Template
 * @returns {object} App elements and references
 */
export const App = () => {
  const productSelectorElement = ProductSelector({
    products: productState.products,
    selectedProductId: productState.lastSelectedProduct,
    onSelectionChange: productId => {
      setProductState({
        ...productState,
        lastSelectedProduct: productId,
      });
    },
  });

  const header = Header({ itemCount: productState.itemCount });

  const helpModal = HelpModal();

  const appHTML = /* html */ `
    <!-- Main Grid Layout -->
    <div class="grid grid-cols-1 lg:grid-cols-[1fr_360px] gap-6 flex-1 overflow-hidden">
      <!-- Left Column -->
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

      <!-- Right Column -->
      <div class="bg-black text-white p-8 flex flex-col">
        <h2 class="text-xs font-medium mb-5 tracking-extra-wide uppercase">Order Summary</h2>
        <div class="flex-1 flex flex-col">
          <div id="summary-details" class="space-y-3"></div>
          <div class="mt-auto">
            <div id="discount-info" class="mb-4"></div>
            <div id="cart-total" class="pt-5 border-t border-white/10">
              <div class="flex justify-between items-baseline">
                <span class="text-sm uppercase tracking-wider">Total</span>
                <div id="total-amount" class="text-2xl tracking-tight">₩0</div>
              </div>
              <div id="loyalty-points" class="text-xs text-blue-400 mt-2 text-right">적립 포인트: 0p</div>
            </div>
            <div id="tuesday-special" class="mt-4 p-3 bg-white/10 rounded-lg hidden">
              <div class="flex items-center gap-2">
                <span class="text-2xs">🎉</span>
                <span class="text-xs uppercase tracking-wide">Tuesday Special 10% Applied</span>
              </div>
            </div>
          </div>
        </div>
        <button class="w-full py-4 bg-white text-black text-sm font-normal uppercase tracking-super-wide cursor-pointer mt-6 transition-all hover:-translate-y-0.5 hover:shadow-lg hover:shadow-black/30">
          Proceed to Checkout
        </button>
        <p class="mt-4 text-2xs text-white/60 text-center leading-relaxed">
          Free shipping on all orders.<br>
          <span id="points-notice">Earn loyalty points with purchase.</span>
        </p>
      </div>
    </div>
  `;

  const appElement = htmlToElement(appHTML);

  const selectorContainer = appElement.querySelector('.border-b');
  selectorContainer.insertBefore(
    productSelectorElement,
    selectorContainer.firstChild,
  );

  return {
    appElement,
    helpModal,
    productSelector: productSelectorElement,
    header, // header를 별도로 반환
  };
};
