/**
 * 함수형 주문 서비스
 * 순수 함수와 선언적 접근으로 리팩터링
 */

import { renderOrderSummaryDetails } from '@/basic/features/order/components/OrderSummaryDetails.js';
import { productState } from '@/basic/features/product/store/productStore.js';

/**
 * 주문 요약 업데이트 (선언적)
 * @param {object} cartResults - 카트 계산 결과
 */
export const updateOrderSummary = cartResults => {
  renderOrderSummaryDetails(cartResults, productState.products);
};
