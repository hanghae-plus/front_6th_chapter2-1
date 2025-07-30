/**
 * 추천 세일 관련 상수들
 */

// 추천 세일 할인 정책
export const SUGGEST_SALE_DISCOUNT = {
	RATE: 5, // 5% 할인율
	FINAL_RATE: 95 // 최종 가격 비율 (95% = 5% 할인)
};

// 추천 세일 타이머 설정
export const SUGGEST_SALE_TIMER = {
	INTERVAL: 60000, // 추천 세일 실행 간격 (60초)
	MAX_DELAY: 20000 // 최초 추천 세일 시작 최대 지연 시간 (20초)
};
