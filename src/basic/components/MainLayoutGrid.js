export function MainLayoutGrid(leftColumn, rightColumn) {
	const gridContainer = document.createElement("div");
	gridContainer.className =
		"grid grid-cols-1 lg:grid-cols-[1fr_360px] gap-6 flex-1 overflow-hidden";
	gridContainer.appendChild(leftColumn);
	gridContainer.appendChild(rightColumn);
	return gridContainer;
}
