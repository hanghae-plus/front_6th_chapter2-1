import { renderHeader } from "./renderHeader";

/**
 * 메인 레이아웃 HTML을 렌더링하는 함수
 * @returns {string} 메인 레이아웃 HTML
 */
export const renderMainLayout = () => {
  return /* HTML */ `
    ${renderHeader()}
    <div
      class="grid grid-cols-1 lg:grid-cols-[1fr_360px] gap-6 flex-1 overflow-hidden"
    >
      <!-- 왼쪽 컬럼: 상품 선택 및 장바구니 -->
      <div class="bg-white border border-gray-200 p-8 overflow-y-auto">
        <!-- 상품 선택 컨테이너 -->
        <div class="mb-6 pb-6 border-b border-gray-200">
          <select
            id="product-select"
            class="w-full p-3 border border-gray-300 rounded-lg text-base mb-3"
          >
            <option value="">상품을 선택하세요</option>
          </select>
          <button
            id="add-to-cart"
            class="w-full py-3 bg-black text-white text-sm font-medium uppercase tracking-wider hover:bg-gray-800 transition-all"
          >
            Add to Cart
          </button>
          <div
            id="stock-status"
            class="text-xs text-red-500 mt-3 whitespace-pre-line"
          ></div>
        </div>

        <!-- 장바구니 아이템 컨테이너 -->
        <div id="cart-items"></div>
      </div>

      <!-- 오른쪽 컬럼: 주문 요약 -->
      <div class="bg-black text-white p-8 flex flex-col">
        <h2 class="text-xs font-medium mb-5 tracking-extra-wide uppercase">
          Order Summary
        </h2>
        <div class="flex-1 flex flex-col">
          <div id="summary-details" class="space-y-3"></div>
          <div class="mt-auto">
            <div id="discount-info" class="mb-4"></div>
            <div id="cart-total" class="pt-5 border-t border-white/10">
              <div class="flex justify-between items-baseline">
                <span class="text-sm uppercase tracking-wider">Total</span>
                <div class="text-2xl tracking-tight">₩0</div>
              </div>
              <div
                id="loyalty-points"
                class="text-xs text-blue-400 mt-2 text-right"
              >
                적립 포인트: 0p
              </div>
            </div>
            <div
              id="tuesday-special"
              class="mt-4 p-3 bg-white/10 rounded-lg hidden"
            >
              <div class="flex items-center gap-2">
                <span class="text-2xs">🎉</span>
                <span class="text-xs uppercase tracking-wide"
                  >Tuesday Special 10% Applied</span
                >
              </div>
            </div>
          </div>
        </div>
        <button
          class="w-full py-4 bg-white text-black text-sm font-normal uppercase tracking-super-wide cursor-pointer mt-6 transition-all hover:-translate-y-0.5 hover:shadow-lg hover:shadow-black/30"
        >
          Proceed to Checkout
        </button>
        <p class="mt-4 text-2xs text-white/60 text-center leading-relaxed">
          Free shipping on all orders.<br />
          <span id="points-notice">Earn loyalty points with purchase.</span>
        </p>
      </div>
    </div>
  `;
};
