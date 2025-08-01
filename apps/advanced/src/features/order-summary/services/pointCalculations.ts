import {
	POINT_BONUSES,
	PRODUCT_IDS,
	QUANTITY_THRESHOLDS,
	WEEKDAYS
} from "../../../shared/constants";
import type { CartItem, PointCalculationResult } from "../../../shared/types";

// 기본 포인트 계산
export const calculateBasePoints = (totalAmount: number): number => {
	return Math.floor(totalAmount / POINT_BONUSES.BASE_RATE);
};

// 화요일 포인트 배수 적용
export const applyTuesdayPointBonus = (basePoints: number): number => {
	const today = new Date();
	if (today.getDay() === WEEKDAYS.TUESDAY && basePoints > 0) {
		return basePoints * POINT_BONUSES.TUESDAY_MULTIPLIER;
	}
	return basePoints;
};

// 세트 구매 보너스 확인
export const hasKeyboardMouseSet = (cartItems: CartItem[]): boolean => {
	const hasKeyboard = cartItems.some((item) => item.id === PRODUCT_IDS.KEYBOARD);
	const hasMouse = cartItems.some((item) => item.id === PRODUCT_IDS.MOUSE);
	return hasKeyboard && hasMouse;
};

export const hasFullSet = (cartItems: CartItem[]): boolean => {
	const hasKeyboard = cartItems.some((item) => item.id === PRODUCT_IDS.KEYBOARD);
	const hasMouse = cartItems.some((item) => item.id === PRODUCT_IDS.MOUSE);
	const hasMonitorArm = cartItems.some((item) => item.id === PRODUCT_IDS.MONITOR_ARM);
	return hasKeyboard && hasMouse && hasMonitorArm;
};

// 수량별 보너스 계산
export const calculateQuantityBonus = (
	totalQuantity: number
): { bonus: number; description: string } => {
	if (totalQuantity >= QUANTITY_THRESHOLDS.BULK_30_BONUS) {
		return {
			bonus: POINT_BONUSES.BULK_30_ITEMS,
			description: "대량구매(30개+) +100p"
		};
	}

	if (totalQuantity >= QUANTITY_THRESHOLDS.BULK_20_BONUS) {
		return {
			bonus: POINT_BONUSES.BULK_20_ITEMS,
			description: "대량구매(20개+) +50p"
		};
	}

	if (totalQuantity >= QUANTITY_THRESHOLDS.BULK_10_BONUS) {
		return {
			bonus: POINT_BONUSES.BULK_10_ITEMS,
			description: "대량구매(10개+) +20p"
		};
	}

	return { bonus: 0, description: "" };
};

// 포인트 계산 메인 함수
export const calculatePoints = (
	totalAmount: number,
	cartItems: CartItem[],
	totalQuantity: number
): PointCalculationResult => {
	const basePoints = calculateBasePoints(totalAmount);
	let finalPoints = 0;
	const pointsDetail: string[] = [];

	// 기본 포인트
	if (basePoints > 0) {
		finalPoints = basePoints;
		pointsDetail.push(`기본: ${basePoints}p`);
	}

	// 화요일 2배
	const tuesdayPoints = applyTuesdayPointBonus(basePoints);
	if (tuesdayPoints !== basePoints) {
		finalPoints = tuesdayPoints;
		pointsDetail.push("화요일 2배");
	}

	// 키보드+마우스 세트 보너스
	if (hasKeyboardMouseSet(cartItems)) {
		finalPoints += POINT_BONUSES.KEYBOARD_MOUSE_SET;
		pointsDetail.push("키보드+마우스 세트 +50p");
	}

	// 풀세트 보너스
	if (hasFullSet(cartItems)) {
		finalPoints += POINT_BONUSES.FULL_SET;
		pointsDetail.push("풀세트 구매 +100p");
	}

	// 수량별 보너스
	const quantityBonus = calculateQuantityBonus(totalQuantity);
	if (quantityBonus.bonus > 0) {
		finalPoints += quantityBonus.bonus;
		pointsDetail.push(quantityBonus.description);
	}

	return {
		bonusPoints: finalPoints,
		pointsDetail
	};
};
