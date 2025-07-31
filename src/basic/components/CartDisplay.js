// CartDisplay 컴포넌트
export function createCartDisplay() {
  const cartDisplay = document.createElement('div');
  cartDisplay.id = 'cart-items';

  return cartDisplay;
}

// 장바구니 아이템 생성 함수
export function createCartItem(product, quantity = 1) {
  const itemElement = document.createElement('div');
  itemElement.id = product.id;
  itemElement.className =
    'grid grid-cols-[80px_1fr_auto] gap-5 py-5 border-b border-gray-100 first:pt-0 last:border-b-0 last:pb-0';

  const priceDisplay =
    product.onSale || product.suggestSale
      ? `<span class="line-through text-gray-400">₩${product.originalVal.toLocaleString()}</span> <span class="${getPriceColorClass(product)}">₩${product.val.toLocaleString()}</span>`
      : `₩${product.val.toLocaleString()}`;

  const namePrefix = getProductNamePrefix(product);

  itemElement.innerHTML = `
    <div class="w-20 h-20 bg-gradient-black relative overflow-hidden">
      <div class="absolute top-1/2 left-1/2 w-[60%] h-[60%] bg-white/10 -translate-x-1/2 -translate-y-1/2 rotate-45"></div>
    </div>
    <div>
      <h3 class="text-base font-normal mb-1 tracking-tight">${namePrefix}${product.name}</h3>
      <p class="text-xs text-gray-500 mb-0.5 tracking-wide">PRODUCT</p>
      <p class="text-xs text-black mb-3">${priceDisplay}</p>
      <div class="flex items-center gap-4">
        <button class="quantity-change w-6 h-6 border border-black bg-white text-sm flex items-center justify-center transition-all hover:bg-black hover:text-white" data-product-id="${product.id}" data-change="-1">−</button>
        <span class="quantity-number text-sm font-normal min-w-[20px] text-center tabular-nums">${quantity}</span>
        <button class="quantity-change w-6 h-6 border border-black bg-white text-sm flex items-center justify-center transition-all hover:bg-black hover:text-white" data-product-id="${product.id}" data-change="1">+</button>
      </div>
    </div>
    <div class="text-right">
      <div class="text-lg mb-2 tracking-tight tabular-nums">${priceDisplay}</div>
      <a class="remove-item text-2xs text-gray-500 uppercase tracking-wider cursor-pointer transition-colors border-b border-transparent hover:text-black hover:border-black" data-product-id="${product.id}">Remove</a>
    </div>
  `;

  return itemElement;
}

// 상품 이름 접두사 생성
function getProductNamePrefix(product) {
  if (product.onSale && product.suggestSale) {
    return '⚡💝';
  } else if (product.onSale) {
    return '⚡';
  } else if (product.suggestSale) {
    return '💝';
  }
  return '';
}

// 가격 색상 클래스 결정
function getPriceColorClass(product) {
  if (product.onSale && product.suggestSale) {
    return 'text-purple-600';
  } else if (product.onSale) {
    return 'text-red-500';
  } else if (product.suggestSale) {
    return 'text-blue-500';
  }
  return '';
}
