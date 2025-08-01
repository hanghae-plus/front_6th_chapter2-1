/**
 * 통합 타입 정의 파일
 * 모든 도메인의 타입들을 재export하여 중앙 집중식 접근 제공
 */

// ===== 기본 엔티티 =====
export * from './entities';

// ===== 계산 관련 =====  
export * from './calculations';

// ===== Hook 관련 =====
export * from './hooks';

// ===== 레거시 (하위 호환성) =====
export * from './legacy';

// ===== 도메인별 상태 타입 (재export) =====
export type { RootState, RootAction } from '../core/combinedReducer';
export type { CartState } from '../../features/cart/model/reducer';
export type { ProductState } from '../../features/product/model/reducer';
export type { PromotionState } from '../../features/promotion/model/reducer';

// ===== 도메인별 액션 타입 (재export) =====
export type { CartAction } from '../../features/cart/model/actions';
export type { ProductAction } from '../../features/product/model/actions';
export type { PromotionAction } from '../../features/promotion/model/actions';