/**
 * 포인트 적립 관련 상수들
 */

// 기본 포인트 적립 정책
export const BASE_POINT_POLICY = {
	RATE: 0.001, // 기본 포인트 적립율 (0.1%)
	RATIO: 1000 // 1000원당 1포인트
};

// 화요일 포인트 혜택
export const TUESDAY_POINT_BONUS = {
	MULTIPLIER: 2 // 화요일 포인트 2배 적립
};

// 상품 조합별 보너스 포인트
export const COMBO_BONUS_POINTS = {
	KEYBOARD_MOUSE_SET: 50, // 키보드+마우스 세트 구매 시 +50p
	FULL_SET: 100 // 풀세트(키보드+마우스+모니터암) 구매 시 +100p
};

// 수량별 보너스 포인트
export const QUANTITY_BONUS_POINTS = {
	BULK_10: 20, // 10개 이상 구매 시 +20p
	BULK_20: 50, // 20개 이상 구매 시 +50p
	BULK_30: 100 // 30개 이상 구매 시 +100p
};
