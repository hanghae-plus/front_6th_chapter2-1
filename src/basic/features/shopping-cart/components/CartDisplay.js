const CartDisplay = ({ product, quantity = 1 }) => {
  const getPriceDisplay = (product) => {
    if (product.onSale || product.suggestSale) {
      const colorClass =
        product.onSale && product.suggestSale
          ? "text-purple-600"
          : product.onSale
          ? "text-red-500"
          : "text-blue-500";

      return `<span class="line-through text-gray-400">₩${product.originalVal.toLocaleString()}</span> <span class="${colorClass}">₩${product.val.toLocaleString()}</span>`;
    }
    return `₩${product.val.toLocaleString()}`;
  };

  const getProductNameDisplay = (product) => {
    let prefix = "";
    if (product.onSale && product.suggestSale) prefix = "⚡💝";
    else if (product.onSale) prefix = "⚡";
    else if (product.suggestSale) prefix = "💝";

    return `${prefix}${product.name}`;
  };

  const getRemoveButtonClass = (product) => {
    if (product.onSale && product.suggestSale) return "text-purple-600";
    if (product.onSale) return "text-red-500";
    if (product.suggestSale) return "text-blue-500";
    return "text-gray-600";
  };

  return /* html */ `
    <div id="${
      product.id
    }" class="flex justify-between items-center mb-2 first:pt-0 last:border-b-0 border-b border-gray-200 pb-2">
      <div class="flex items-center">
        <div class="bg-gradient-black w-12 h-12 rounded mr-3 flex items-center justify-center text-white text-xs">
          IMG
        </div>
        <div>
          <h3 class="font-semibold">${getProductNameDisplay(product)}</h3>
          <p class="text-sm text-gray-600">${getPriceDisplay(
            product
          )} x <span class="quantity-number">${quantity}</span></p>
        </div>
      </div>
      <div>
        <button class="quantity-change bg-blue-500 text-white px-2 py-1 rounded mr-1" data-product-id="${
          product.id
        }" data-change="-1">-</button>
        <button class="quantity-change bg-blue-500 text-white px-2 py-1 rounded mr-1" data-product-id="${
          product.id
        }" data-change="1">+</button>
        <button class="remove-item ${getRemoveButtonClass(
          product
        )} px-2 py-1 rounded" data-product-id="${product.id}">삭제</button>
      </div>
    </div>
  `;
};

export default CartDisplay;
