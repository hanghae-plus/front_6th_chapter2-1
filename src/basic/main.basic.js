import { initializeData } from './data/index.js';
import { initializeRender } from './render/index.js';
import { setupAllEventListeners } from './event/index.js';

/**
 * 애플리케이션 초기화 함수
 * main.original.js와 동일한 순서로 초기화
 */
function initializeApp() {
  console.log('🛒 Hanghae Online Store 초기화 완료!');
  
  // 1. 데이터 초기화
  initializeData();
  
  // 2. UI 렌더링
  initializeRender();
  
  // 3. 이벤트 설정
  setupAllEventListeners();
}

// DOM이 로드되면 앱 초기화
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', initializeApp);
} else {
  initializeApp();
}