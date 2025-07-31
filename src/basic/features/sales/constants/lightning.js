/**
 * 번개세일 관련 상수들
 */

// 번개세일 할인 정책
export const LIGHTNING_SALE_DISCOUNT = {
	RATE: 20, // 20% 할인율
	FINAL_RATE: 80 // 최종 가격 비율 (80% = 20% 할인)
};

// 번개세일 타이머 설정
export const LIGHTNING_SALE_TIMER = {
	INTERVAL: 30000, // 번개세일 실행 간격 (30초)
	MAX_DELAY: 10000 // 최초 번개세일 시작 최대 지연 시간 (10초)
};