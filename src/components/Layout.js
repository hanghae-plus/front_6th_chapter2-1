export function createGridContainer() {
  const container = document.createElement('div');
  container.className =
    'grid grid-cols-1 lg:grid-cols-[1fr_360px] gap-6 flex-1 overflow-hidden';
  return container;
}

export function createLeftColumn() {
  const column = document.createElement('div');
  column.className = 'bg-white border border-gray-200 p-8 overflow-y-auto';
  return column;
}

export function createRightColumn() {
  const column = document.createElement('div');
  column.className = 'right-column bg-black text-white p-8 flex flex-col';
  return column;
}
