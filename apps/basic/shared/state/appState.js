// Application state management - Pure business state only
export function createAppState() {
	return {
		bonusPts: 0,
		itemCnt: 0,
		totalAmt: 0,
		lastSel: null
	};
}
