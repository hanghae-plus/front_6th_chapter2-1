/**
 * 포인트 서비스
 * 포인트 관련 비즈니스 로직
 */

import { calculateAndRenderPoints as calculatePointsFunction } from '@/basic/features/point/services/pointsCalculator.js';
import { PRODUCTS } from '@/basic/features/product/constants/index.js';
import { productState } from '@/basic/features/product/store/productStore.js';
import { BUSINESS_CONSTANTS } from '@/basic/shared/constants/business.js';
import { findElement } from '@/basic/shared/core/domUtils.js';

/**
 * 포인트 계산 및 렌더링 (순수 함수)
 * @param {object} cartResults - 카트 계산 결과
 * @returns {object} 포인트 계산 결과
 */
export const calculateAndRenderPoints = cartResults => {
  const cartDisplayElement = findElement('#cart-items');
  if (!cartDisplayElement) return { points: 0, details: [] };

  const cartElements = cartDisplayElement.children;
  const { totalAmount, totalItemCount } = cartResults;

  const pointsResults = calculatePointsFunction(
    totalAmount,
    totalItemCount,
    cartElements,
    productState.products,
    BUSINESS_CONSTANTS,
    PRODUCTS,
  );

  return pointsResults;
};
