export function ProductSelectionPanel(selector, addButton, stockInfo) {
	const container = document.createElement("div");
	container.className = "mb-6 pb-6 border-b border-gray-200";
	
	container.appendChild(selector);
	container.appendChild(addButton);
	container.appendChild(stockInfo);
	
	return container;
}