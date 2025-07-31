// main.basic.ts
import { initializeState, setElements } from './store/state.js';
import { createElement, initializeDOMElements } from './utils/dom.js';
import { LeftColumn } from './components/LeftColumn.js';
import { updateProductOptions } from './services/product.js';
import { OrderSummary } from './components/OrderSummary.js';
import { HelpModal } from './components/HelpModal.js';
import { Header } from './components/Header.js';
import { setupEventHandlers } from './event/eventHandlers.js';
import { updateCart } from './services/discount.js';
import { setupSaleTimers } from './controllers/saleTimers.js';
import { Elements } from './types/index.ts';


// 메인 초기화 함수
function main(): void {
  try {
    // 전역 상태 초기화
    initializeState();

    // DOM 구조 생성
    const root = document.getElementById('app');
    if (!root) {
      throw new Error('App root element not found');
    }

    const header = Header();
    const gridContainer = createElement(
      'div',
      'grid grid-cols-1 lg:grid-cols-[1fr_360px] gap-6 flex-1 overflow-hidden',
    );
    const leftColumn = LeftColumn();
    const rightColumn = OrderSummary();
    const { toggleButton, overlay } = HelpModal();

    gridContainer.appendChild(leftColumn);
    gridContainer.appendChild(rightColumn);

    root.appendChild(header);
    root.appendChild(gridContainer);
    root.appendChild(toggleButton);
    root.appendChild(overlay);

    // DOM 요소 참조 저장
    const elements = initializeDOMElements();
    setElements(elements as Elements);

    // 초기화
    updateProductOptions();
    updateCart();
    setupEventHandlers();
    setupSaleTimers();

    console.log('🛒 Cart application initialized successfully');
  } catch (error) {
    console.error('Failed to initialize cart application:', error);
    
    // 에러 발생 시 사용자에게 알림
    const root = document.getElementById('app');
    if (root) {
      root.innerHTML = `
        <div class="min-h-screen flex items-center justify-center bg-gray-100">
          <div class="text-center p-8 bg-white rounded-lg shadow-lg">
            <h1 class="text-2xl font-bold text-red-600 mb-4">앱 초기화 실패</h1>
            <p class="text-gray-600 mb-4">장바구니 앱을 초기화하는 중 오류가 발생했습니다.</p>
            <button 
              onclick="location.reload()" 
              class="px-4 py-2 bg-black text-white rounded hover:bg-gray-800 transition-colors"
            >
              다시 시도
            </button>
          </div>
        </div>
      `;
    }
  }
}

// 앱 시작
main();