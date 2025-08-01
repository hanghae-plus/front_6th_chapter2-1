// 헤더 컴포넌트
function Header({ itemCount = 0 }) {
  const header = document.createElement('div');
  header.className = 'mb-8';
  header.innerHTML = `
    <h1 class="text-xs font-medium tracking-extra-wide uppercase mb-2">🛒 Hanghae Online Store</h1>
    <div class="text-5xl tracking-tight leading-none">Shopping Cart</div>
    <p id="item-count" class="text-sm text-gray-500 font-normal mt-3">🛍️ ${itemCount} items in cart</p>
  `;
  return header;
}

function GridContainer() {
  const gridContainer = document.createElement('div');
  gridContainer.className =
    'grid grid-cols-1 lg:grid-cols-[1fr_360px] gap-6 flex-1 overflow-hidden';
  return gridContainer;
}

function LeftColumn() {
  const column = document.createElement('div');
  column.className = 'bg-white border border-gray-200 p-8 overflow-y-auto';
  return column;
}

function RightColumn() {
  const column = document.createElement('div');
  column.className = 'bg-black text-white p-8 flex flex-col';
  return column;
}

export { Header, GridContainer, LeftColumn, RightColumn };
