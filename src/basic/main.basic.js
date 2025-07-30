// 🚀 클린코드 리팩토링 완료 - 모듈화된 쇼핑카트 애플리케이션
// FSD(Feature-Sliced Design) 아키텍처 기반으로 완전히 재구성됨

// 모듈 import
import { appState } from './entities/app-state/index.js';
import { calculateTotalStock } from './shared/utils/product-utils.js';
import { initializeApplication, initializeProductData } from './features/initialization/index.js';
import { createDOMElements } from './widgets/dom-creator/index.js';
import { setupPromotionTimers } from './features/promotion/index.js';
import { onUpdateSelectOptions, handleCalculateCartStuff } from './features/events/index.js';
import { setupCartEventHandlers } from './features/cart-management/index.js';

// AppState 참조
const AppState = appState;

// 애플리케이션 인스턴스
let app = null;

/**
 * UI 초기화 함수
 */
function initializeUI() {
  try {
    var initStock = calculateTotalStock(AppState.products);
    onUpdateSelectOptions(AppState);
    handleCalculateCartStuff(AppState);
    console.log('✅ UI 초기화 완료');
  } catch (error) {
    console.error('❌ UI 초기화 실패:', error);
    throw error;
  }
}

/**
 * 메인 함수 - 모듈화된 애플리케이션 초기화
 * 기존 스파게티 코드를 7개 모듈로 완전 분리
 */
function main() {
  try {
    console.log('🚀 모듈화된 쇼핑카트 애플리케이션 시작');

    // 애플리케이션 초기화
    initializeApplication(AppState);
    initializeProductData(AppState);
    createDOMElements(AppState);
    setupPromotionTimers(AppState);
    initializeUI();
    setupCartEventHandlers(AppState);

    app = AppState;

    console.log('✅ 애플리케이션 초기화 완료');
    console.log('📦 7개 모듈로 구성된 클린 아키텍처 로드됨');

    return app;
  } catch (error) {
    console.error('❌ 애플리케이션 초기화 실패:', error);
    showFallbackUI();
    throw error;
  }
}

/**
 * 폴백 UI 표시 - 에러 발생 시
 */
function showFallbackUI() {
  const appContainer = document.getElementById('app');
  if (appContainer && !appContainer.hasChildNodes()) {
    appContainer.innerHTML = `
      <div class="min-h-screen flex items-center justify-center bg-gray-50">
        <div class="text-center p-8">
          <h1 class="text-3xl font-bold text-gray-900 mb-4">🛒 Hanghae Online Store</h1>
          <p class="text-gray-600 mb-6">애플리케이션을 로딩하는 중 문제가 발생했습니다.</p>
          <button 
            onclick="location.reload()" 
            class="px-6 py-3 bg-black text-white rounded-lg hover:bg-gray-800 transition-colors"
          >
            새로고침
          </button>
        </div>
      </div>
    `;
  }
}

/**
 * DOM 로드 완료 시 자동 실행
 */
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', main);
} else {
  main();
}

/**
 * 전역 접근을 위한 export (디버깅용)
 * 프로덕션에서는 제거 가능
 */
if (typeof window !== 'undefined') {
  window.shoppingCartApp = app;
  window.main = main;
}

/**
 * ES 모듈 export
 */
export { main };
