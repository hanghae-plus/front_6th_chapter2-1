// 비즈니스 상태 관리
export {
  getProducts,
  setProducts,
  getProductById,
  getItemCount,
  setItemCount,
  getTotalAmount,
  setTotalAmount,
  getBonusPoints,
  setBonusPoints,
  getLastSelectedProductId,
  setLastSelectedProductId,
} from './business-state.js';

// DOM 참조 관리
export {
  getProductSelectElement,
  getAddButtonElement,
  getCartDisplayElement,
  getStockInfoElement,
  getTotalDisplayElement,
} from './dom-refs.js';

// DOM 구조 생성
export { createDOMStructure } from './dom.js';

// 이벤트 핸들러
export { initializeEvents, setupHelpManualEvents } from './events.js';

// 상태 초기화
export { initializeAppData } from './state.js';
