/**
 * 커스텀 Hook 모음
 * 선언적 프로그래밍 패러다임을 적용한 Hook들
 */

// 계산 관련 Hook
export {
  useCalculations,
  useFinalAmountCalculation,
  useShippingCalculation,
  useTaxCalculation
} from './useCalculations';

// 상품 관리 Hook
export {
  useProductSearch,
  useProductSorting,
  useProductStats,
  useProducts
} from './useProducts';

// 프로모션 Hook
export {
  usePointsEarning,
  usePromotionStats,
  usePromotions,
  useSpecialDiscounts
} from './usePromotions';
