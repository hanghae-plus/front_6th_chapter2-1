/**
 * TypeScript 타입 정의
 * React 마이그레이션을 위한 타입 시스템
 */

/**
 * 상품 타입
 */
export interface Product {
  readonly id: string;
  readonly name: string;
  readonly val: number; // 현재 가격 (양수)
  readonly originalVal: number; // 원래 가격 (양수)
  readonly q: number; // 재고 수량 (0 이상)
  readonly onSale: boolean; // 번개세일 여부
  readonly suggestSale: boolean; // 추천할인 여부
}

/**
 * 장바구니 아이템 타입
 */
export interface CartItem {
  readonly id: string;
  readonly name: string;
  readonly price: number; // 현재 가격 (양수)
  readonly originalPrice: number; // 원래 가격 (양수)
  readonly quantity: number; // 수량 (1 이상)
  readonly onSale: boolean; // 번개세일 여부
  readonly suggestSale: boolean; // 추천할인 여부
}

/**
 * 포인트 정보 타입
 */
export interface PointsInfo {
  base: number; // 기본 포인트
  setBonus: number; // 세트 보너스 포인트
  quantityBonus: number; // 수량 보너스 포인트
  total: number; // 총 포인트
}

/**
 * 계산 결과 타입
 */
export interface CalculationResult {
  subtotal: number; // 소계
  totalAmount: number; // 총 결제 금액
  itemCount: number; // 총 아이템 수
  discountRate: number; // 할인율
  itemDiscounts: Array<{
    productId: string;
    discountRate: number;
    savedAmount: number;
  }>;
  isTuesday: boolean; // 화요일 여부
  points: PointsInfo;
}

/**
 * UI 상태 타입
 */
export interface UIState {
  selectedProductId: string | null; // 선택된 상품 ID
  isTuesday: boolean; // 화요일 여부
  showTuesdayBanner: boolean; // 화요일 배너 표시 여부
  showDiscountInfo: boolean; // 할인 정보 표시 여부
  discountRate: number; // 할인율
  savedAmount: number; // 절약된 금액
  loyaltyPoints: number; // 적립 포인트
  pointsDetail: string[]; // 포인트 상세 정보
}

/**
 * 도움말 모달 상태 타입
 */
export interface HelpModalState {
  isOpen: boolean;
}

/**
 * 할인율 설정 타입
 */
export interface DiscountRates {
  p1: number; // 상품1 할인율
  p2: number; // 상품2 할인율
  p3: number; // 상품3 할인율
  p4: number; // 상품4 할인율
  p5: number; // 상품5 할인율
}

/**
 * 계산 옵션 타입
 */
export interface CalculationOptions {
  discountRates: DiscountRates; // 할인율 설정
  bulkThreshold: number; // 대량구매 임계값
  bulkDiscountRate: number; // 대량구매 할인율
  tuesdayDiscountRate: number; // 화요일 할인율
  basePointsRate: number; // 기본 포인트 적립률
  tuesdayMultiplier: number; // 화요일 포인트 배수
  setBonuses: Record<string, number>; // 세트 보너스 설정
  quantityBonuses: Record<string, number>; // 수량 보너스 설정
}

/**
 * 타입 검증 함수들
 */
export function isValidProduct(product: unknown): product is Product {
  if (!product || typeof product !== "object" || product === null) {
    return false;
  }

  const p = product as Record<string, unknown>;

  return (
    "id" in p &&
    "name" in p &&
    "val" in p &&
    "originalVal" in p &&
    "q" in p &&
    "onSale" in p &&
    "suggestSale" in p &&
    typeof p.id === "string" &&
    typeof p.name === "string" &&
    typeof p.val === "number" &&
    typeof p.originalVal === "number" &&
    typeof p.q === "number" &&
    typeof p.onSale === "boolean" &&
    typeof p.suggestSale === "boolean"
  );
}

export function isValidCartItem(item: unknown): item is CartItem {
  if (!item || typeof item !== "object" || item === null) {
    return false;
  }

  const i = item as Record<string, unknown>;

  return (
    "id" in i &&
    "name" in i &&
    "price" in i &&
    "originalPrice" in i &&
    "quantity" in i &&
    "onSale" in i &&
    "suggestSale" in i &&
    typeof i.id === "string" &&
    typeof i.name === "string" &&
    typeof i.price === "number" &&
    typeof i.originalPrice === "number" &&
    typeof i.quantity === "number" &&
    typeof i.onSale === "boolean" &&
    typeof i.suggestSale === "boolean"
  );
}

export function isValidCalculationResult(result: unknown): result is CalculationResult {
  if (!result || typeof result !== "object" || result === null) {
    return false;
  }

  const r = result as Record<string, unknown>;

  return (
    "subtotal" in r &&
    "totalAmount" in r &&
    "itemCount" in r &&
    "discountRate" in r &&
    "itemDiscounts" in r &&
    "isTuesday" in r &&
    "points" in r &&
    typeof r.subtotal === "number" &&
    typeof r.totalAmount === "number" &&
    typeof r.itemCount === "number" &&
    typeof r.discountRate === "number" &&
    Array.isArray(r.itemDiscounts) &&
    typeof r.isTuesday === "boolean" &&
    r.points &&
    typeof r.points === "object" &&
    r.points !== null &&
    "base" in r.points &&
    "setBonus" in r.points &&
    "quantityBonus" in r.points &&
    "total" in r.points &&
    typeof (r.points as PointsInfo).base === "number" &&
    typeof (r.points as PointsInfo).setBonus === "number" &&
    typeof (r.points as PointsInfo).quantityBonus === "number" &&
    typeof (r.points as PointsInfo).total === "number"
  );
}
