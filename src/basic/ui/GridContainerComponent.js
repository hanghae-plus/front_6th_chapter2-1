export function GridContainer() {
  const gridContainer = document.createElement("div");
  gridContainer.className = "grid grid-cols-1 lg:grid-cols-[1fr_360px] gap-6 flex-1 overflow-hidden";
  return gridContainer;
}

export function LeftColumn() {
  const leftColumn = document.createElement("div");
  leftColumn.className = "bg-white border border-gray-200 p-8 overflow-y-auto";
  return leftColumn;
}