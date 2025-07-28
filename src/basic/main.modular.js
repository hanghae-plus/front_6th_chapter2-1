// 모듈화된 쇼핑카트 애플리케이션
import { ShoppingCartApp } from './pages/shopping-cart/index.js';

// 애플리케이션 시작점
console.log('🚀 모듈화된 쇼핑카트 애플리케이션 시작');

// 전역 접근을 위한 앱 인스턴스 (디버깅 및 테스트용)
window.ShoppingCartApp = ShoppingCartApp;

// 레거시 호환성을 위한 전역 함수들 (향후 제거 예정)
window.modernApp = null;

document.addEventListener('DOMContentLoaded', () => {
  try {
    window.modernApp = new ShoppingCartApp();
    console.log('✅ 애플리케이션 초기화 완료');
  } catch (error) {
    console.error('❌ 애플리케이션 초기화 실패:', error);
  }
});

// 모듈 정보 export
export { ShoppingCartApp };