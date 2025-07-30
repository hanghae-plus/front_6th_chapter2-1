export function createStockWarningMessage() {
	const div = document.createElement("div");
	div.id = "stock-status";
	div.className = "text-xs text-red-500 mt-3 whitespace-pre-line";
	return div;
}