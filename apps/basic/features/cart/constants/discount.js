/**
 * 장바구니 할인 관련 상수들
 */

// 개별 상품 대량 구매 할인 정책
export const BULK_DISCOUNT = {
	KEYBOARD: 10, // 키보드 10% 할인
	MOUSE: 15, // 마우스 15% 할인
	MONITOR_ARM: 20, // 모니터암 20% 할인
	LAPTOP_POUCH: 5, // 노트북 파우치 5% 할인
	SPEAKER: 25, // 스피커 25% 할인
	MINIMUM_QUANTITY: 10 // 대량 구매 최소 수량
};

// 전체 상품 대량 구매 할인 정책 (개별 할인 무시)
export const GLOBAL_DISCOUNT = {
	RATE: 25, // 25% 할인율
	MINIMUM_QUANTITY: 30, // 전체 대량 구매 최소 수량 (30개 이상)
	FINAL_RATE: 75 // 최종 가격 비율 (75% = 25% 할인)
};

// 화요일 특별 할인 정책
export const TUESDAY_SPECIAL = {
	RATE: 10, // 10% 추가 할인율
	FINAL_RATE: 90 // 최종 가격 비율 (90% = 10% 할인)
};
