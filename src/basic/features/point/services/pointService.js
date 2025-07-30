/**
 * 포인트 서비스
 * 포인트 관련 비즈니스 로직
 */

import { BUSINESS_CONSTANTS } from '../../../shared/constants/business.js';
import { findElement } from '../../../shared/core/domUtils.js';
import { PRODUCTS } from '../../product/constants/index.js';
import { productState } from '../../product/store/ProductStore.js';

import { calculateAndRenderPoints as calculatePointsFunction } from './PointsCalculator.js';

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

  // 순수 함수로 포인트 계산 및 렌더링
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
