// 상품의 상태 아이콘을 생성합니다.
export function getProductDisplayName(product) {
  let prefix = "";
  if (product.onSale && product.suggestSale) {
    prefix = "⚡💝";
  } else if (product.onSale) {
    prefix = "⚡";
  } else if (product.suggestSale) {
    prefix = "💝";
  }
  return prefix + product.name;
}

// 상품의 가격 표시 HTML을 생성합니다.
export function getPriceDisplayHTML(product) {
  if (product.onSale || product.suggestSale) {
    let colorClass = "";
    if (product.onSale && product.suggestSale) {
      colorClass = "text-purple-600";
    } else if (product.onSale) {
      colorClass = "text-red-500";
    } else if (product.suggestSale) {
      colorClass = "text-blue-500";
    }

    return `<span class="line-through text-gray-400">₩${product.originalPrice.toLocaleString()}</span> <span class="${colorClass}">₩${product.price.toLocaleString()}</span>`;
  } else {
    return `₩${product.price.toLocaleString()}`;
  }
}
