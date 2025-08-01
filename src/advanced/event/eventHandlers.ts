// event/eventHandlers.ts
import { addToCart, changeQuantity, removeFromCart } from '../services/cart.js';

// React에서는 컴포넌트에서 직접 이벤트를 처리하므로 
// 이 함수는 호환성을 위해 빈 함수로 유지
export function setupEventHandlers(): void {
  // React 컴포넌트에서 onClick, onChange 등으로 직접 처리
  // 더 이상 DOM 이벤트 리스너를 직접 등록하지 않음
}

// 기존 서비스 함수들은 여전히 export하여 다른 곳에서 사용 가능
export { addToCart, changeQuantity, removeFromCart };