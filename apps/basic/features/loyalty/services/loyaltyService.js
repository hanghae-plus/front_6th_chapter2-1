import { WEEKDAYS } from "../../../shared/constants";
import { PRODUCT_IDS, products } from "../../product";
import {
	BASE_POINT_POLICY,
	COMBO_BONUS_POINTS,
	QUANTITY_BONUS_POINTS,
	TUESDAY_POINT_BONUS
} from "../constants";

export const doRenderBonusPoints = function (state, uiElements) {
	// Calculate base points and initialize tracking variables
	const basePoints = Math.floor(state.totalAmt / BASE_POINT_POLICY.RATIO);
	const pointsDetail = [];
	const nodes = uiElements.cartDisp.children;

	let finalPoints = 0;
	let hasKeyboard = false;
	let hasMouse = false;
	let hasMonitorArm = false;

	// Hide points if cart is empty
	if (uiElements.cartDisp.children.length === 0) {
		document.getElementById("loyalty-points").style.display = "none";
		return;
	}

	// Add base points
	if (basePoints > 0) {
		finalPoints = basePoints;
		pointsDetail.push(`기본: ${basePoints}p`);
	}

	// Apply Tuesday bonus (2x points)
	if (new Date().getDay() === WEEKDAYS.TUESDAY) {
		if (basePoints > 0) {
			finalPoints = basePoints * 2;
			pointsDetail.push(`화요일 ${TUESDAY_POINT_BONUS.MULTIPLIER}배`);
		}
	}

	// Check for specific product combinations
	for (const node of nodes) {
		let product = null;

		for (let pIdx = 0; pIdx < products.length; pIdx++) {
			if (products[pIdx].id === node.id) {
				product = products[pIdx];
				break;
			}
		}

		if (!product) continue;

		switch (product.id) {
			case PRODUCT_IDS.KEYBOARD:
				hasKeyboard = true;
				break;
			case PRODUCT_IDS.MOUSE:
				hasMouse = true;
				break;
			case PRODUCT_IDS.MONITOR_ARM:
				hasMonitorArm = true;
				break;
		}
	}

	// Apply combo bonuses
	if (hasKeyboard && hasMouse) {
		finalPoints = finalPoints + COMBO_BONUS_POINTS.KEYBOARD_MOUSE_SET;
		pointsDetail.push(`키보드+마우스 세트 +${COMBO_BONUS_POINTS.KEYBOARD_MOUSE_SET}p`);
	}

	if (hasKeyboard && hasMouse && hasMonitorArm) {
		finalPoints = finalPoints + COMBO_BONUS_POINTS.FULL_SET;
		pointsDetail.push(`풀세트 구매 +${COMBO_BONUS_POINTS.FULL_SET}p`);
	}

	// Apply quantity-based bonuses
	if (state.itemCnt >= 30) {
		finalPoints = finalPoints + QUANTITY_BONUS_POINTS.BULK_30;
		pointsDetail.push(`대량구매(30개+) +${QUANTITY_BONUS_POINTS.BULK_30}p`);
	} else {
		if (state.itemCnt >= 20) {
			finalPoints = finalPoints + QUANTITY_BONUS_POINTS.BULK_20;
			pointsDetail.push(`대량구매(20개+) +${QUANTITY_BONUS_POINTS.BULK_20}p`);
		} else {
			if (state.itemCnt >= 10) {
				finalPoints = finalPoints + QUANTITY_BONUS_POINTS.BULK_10;
				pointsDetail.push(`대량구매(10개+) +${QUANTITY_BONUS_POINTS.BULK_10}p`);
			}
		}
	}

	// Update state and display points
	state.bonusPts = finalPoints;
	const ptsTag = document.getElementById("loyalty-points");

	if (ptsTag) {
		if (state.bonusPts > 0) {
			ptsTag.innerHTML =
				`<div>적립 포인트: <span class="font-bold">${state.bonusPts}p</span></div>` +
				`<div class="text-2xs opacity-70 mt-1">${pointsDetail.join(", ")}</div>`;
			ptsTag.style.display = "block";
		} else {
			ptsTag.textContent = "적립 포인트: 0p";
			ptsTag.style.display = "block";
		}
	}
};
