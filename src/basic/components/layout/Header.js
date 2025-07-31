import Component from '../../lib/Component.js';

/**
 * 헤더 컴포넌트 생성 함수
 * @returns {HTMLElement} 생성된 헤더 요소
 */
export default class Header extends Component {
  template() {
    return /* HTML */ `
      <header class="bg-blue-600 text-white py-4 px-6 shadow-lg">
        <div class="container mx-auto">
          <div class="mb-8">
            <h1 class="text-xs font-medium tracking-extra-wide uppercase mb-2">
              🛒 Hanghae Online Store
            </h1>
            <div class="text-5xl tracking-tight leading-none">Shopping Cart</div>
            <div class="flex justify-between items-center mt-3">
              <p id="item-count" class="text-sm text-gray-300 font-normal">🛍️ 0 items in cart</p>
              <div id="timer-status" class="flex space-x-2 text-sm">
                <span
                  id="lightning-status"
                  class="bg-yellow-400 text-black px-2 py-1 rounded text-xs"
                  >⚡ 번개세일 대기중</span
                >
                <span
                  id="suggestion-status"
                  class="bg-purple-400 text-white px-2 py-1 rounded text-xs"
                  >💝 추천할인 대기중</span
                >
              </div>
            </div>
          </div>
        </div>
      </header>
    `;
  }
}
