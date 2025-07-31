export const ProductSelector = ({ products = [], stockStatus = '' } = {}) => {
  const optionsHtml = products
    .map(product => {
      const priceDisplay =
        product.onSale || product.suggestSale
          ? `${product.name} - ₩${product.val.toLocaleString()} (할인가)`
          : `${product.name} - ₩${product.val.toLocaleString()}`;

      return `<option value="${product.id}" ${product.q <= 0 ? 'disabled' : ''}>${priceDisplay}</option>`;
    })
    .join('');

  return /* HTML */ `
    <div class="mb-6 pb-6 border-b border-gray-200">
      <select
        id="product-select"
        class="w-full p-3 border border-gray-300 rounded-lg text-base mb-3"
      >
        ${optionsHtml}
      </select>
      <button
        id="add-to-cart"
        class="w-full py-3 bg-black text-white text-sm font-medium uppercase tracking-wider hover:bg-gray-800 transition-all"
      >
        Add to Cart
      </button>
      <div
        id="stock-status"
        class="text-xs text-red-500 mt-3 whitespace-pre-line"
      >
        ${stockStatus}
      </div>
    </div>
  `;
};
