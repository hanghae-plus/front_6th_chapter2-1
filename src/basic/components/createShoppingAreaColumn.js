export function createShoppingAreaColumn(selectorContainer, cartDisplay) {
	const leftColumn = document.createElement("div");
	leftColumn["className"] = "bg-white border border-gray-200 p-8 overflow-y-auto";
	leftColumn.appendChild(selectorContainer);
	leftColumn.appendChild(cartDisplay);
	return leftColumn;
}