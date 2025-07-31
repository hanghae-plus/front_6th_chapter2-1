// ProductSelector 컴포넌트
export function createProductSelector() {
  const selectorContainer = document.createElement('div');
  selectorContainer.className = 'mb-6 pb-6 border-b border-gray-200';

  const select = document.createElement('select');
  select.id = 'product-select';
  select.className = 'w-full p-3 border border-gray-300 rounded-lg text-base mb-3';

  const addButton = document.createElement('button');
  addButton.id = 'add-to-cart';
  addButton.innerHTML = 'Add to Cart';
  addButton.className =
    'w-full py-3 bg-black text-white text-sm font-medium uppercase tracking-wider hover:bg-gray-800 transition-all';

  const stockInfo = document.createElement('div');
  stockInfo.id = 'stock-status';
  stockInfo.className = 'text-xs text-red-500 mt-3 whitespace-pre-line';

  selectorContainer.appendChild(select);
  selectorContainer.appendChild(addButton);
  selectorContainer.appendChild(stockInfo);

  return {
    container: selectorContainer,
    select: select,
    addButton: addButton,
    stockInfo: stockInfo,
  };
}
