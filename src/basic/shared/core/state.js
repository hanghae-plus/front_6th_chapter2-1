// 비즈니스 상태는 business-state.js로 이동
export {
  initializeBusinessState as initializeAppData,
  getProducts,
  getProductById,
  getBonusPoints,
  setBonusPoints,
  getItemCount,
  setItemCount,
  getTotalAmount,
  setTotalAmount,
  getLastSelectedProductId,
  setLastSelectedProductId,
} from './business-state.js';

// DOM 참조는 dom-refs.js로 이동
export {
  initializeDOMReferences,
  getStockInfoElement,
  getProductSelectElement,
  getAddButtonElement,
  getCartDisplayElement,
  getTotalDisplayElement,
} from './dom-refs.js';

// 기존 코드 호환성을 위한 임시 래퍼 (점진적 마이그레이션용)
import { domRefs } from './dom-refs.js';

// 기존 appState.elements 접근 패턴 지원 (단계적 제거 예정)
export function getElements() {
  return domRefs;
}
