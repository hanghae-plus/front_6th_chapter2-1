/**
 * 함수형 주문 서비스
 * 순수 함수와 선언적 접근으로 리팩터링
 */

import { productState } from '../../product/store/ProductStore.js';
import { renderOrderSummaryDetails } from '../components/OrderSummaryDetails.js';

/**
 * 주문 요약 업데이트 (선언적)
 * @param {object} cartResults - 카트 계산 결과
 */
export const updateOrderSummary = cartResults => {
  // 순수 함수로 주문 요약 렌더링
  renderOrderSummaryDetails(cartResults, productState.products);
};
