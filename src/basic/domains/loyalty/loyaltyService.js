import { PRODUCT_IDS, products } from "../product";

export const doRenderBonusPoints = function (state) {
	// Calculate base points and initialize tracking variables
	const basePoints = Math.floor(state.totalAmt / 1000);
	const pointsDetail = [];
	const nodes = state.cartDisp.children;

	let finalPoints = 0;
	let hasKeyboard = false;
	let hasMouse = false;
	let hasMonitorArm = false;

	// Hide points if cart is empty
	if (state.cartDisp.children.length === 0) {
		document.getElementById("loyalty-points").style.display = "none";
		return;
	}

	// Add base points
	if (basePoints > 0) {
		finalPoints = basePoints;
		pointsDetail.push(`기본: ${basePoints}p`);
	}

	// Apply Tuesday bonus (2x points)
	if (new Date().getDay() === 2) {
		if (basePoints > 0) {
			finalPoints = basePoints * 2;
			pointsDetail.push("화요일 2배");
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
		finalPoints = finalPoints + 50;
		pointsDetail.push("키보드+마우스 세트 +50p");
	}

	if (hasKeyboard && hasMouse && hasMonitorArm) {
		finalPoints = finalPoints + 100;
		pointsDetail.push("풀세트 구매 +100p");
	}

	// Apply quantity-based bonuses
	if (state.itemCnt >= 30) {
		finalPoints = finalPoints + 100;
		pointsDetail.push("대량구매(30개+) +100p");
	} else {
		if (state.itemCnt >= 20) {
			finalPoints = finalPoints + 50;
			pointsDetail.push("대량구매(20개+) +50p");
		} else {
			if (state.itemCnt >= 10) {
				finalPoints = finalPoints + 20;
				pointsDetail.push("대량구매(10개+) +20p");
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