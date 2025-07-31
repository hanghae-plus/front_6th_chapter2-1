function ProductSelector({ onAddToCart }) {
  const container = document.createElement('div');
  container.className = 'mb-6 pb-6 border-b border-gray-200';
  container.innerHTML = `
    <select id="product-select" class="w-full p-3 border border-gray-300 rounded-lg text-base mb-3"></select>
    <button id="add-to-cart" class="w-full py-3 bg-black text-white text-sm font-medium uppercase tracking-wider hover:bg-gray-800 transition-all">Add to Cart</button>
    <div id="stock-status" class="text-xs text-red-500 mt-3 whitespace-pre-line"></div>
  `;

  // 이벤트 핸들러 설정
  const addButton = container.querySelector('#add-to-cart');
  addButton.onclick = onAddToCart;

  return container;
}

function generateProductOptions({ selectElement, productList }) {
  if (!selectElement) return;
  selectElement.innerHTML = '';
  let totalStock = 0;

  // 전체 재고 계산
  for (let idx = 0; idx < productList.length; idx++) {
    const _product = productList[idx];
    totalStock = totalStock + _product.availableStock;
  }
  // 각 상품별 옵션 생성
  for (let i = 0; i < productList.length; i++) {
    const item = productList[i];
    const optionElement = document.createElement('option');
    optionElement.value = item.id;
    let discountText = '';

    // 할인 상태 표시
    if (item.onSale) discountText += ' ⚡SALE';
    if (item.suggestSale) discountText += ' 💝추천';

    // 품절 상품 처리
    if (item.availableStock === 0) {
      optionElement.textContent = `${item.name} - ${item.val}원 (품절)${discountText}`;
      optionElement.disabled = true;
      optionElement.className = 'text-gray-400';
    } else {
      // 할인 조합별 표시
      if (item.onSale && item.suggestSale) {
        optionElement.textContent = `⚡💝${item.name} - ${item.originalVal}원 → ${
          item.val
        }원 (25% SUPER SALE!)`;
        optionElement.className = 'text-purple-600 font-bold';
      } else if (item.onSale) {
        optionElement.textContent = `⚡${item.name} - ${item.originalVal}원 → ${item.val}원 (20% SALE!)`;
        optionElement.className = 'text-red-500 font-bold';
      } else if (item.suggestSale) {
        optionElement.textContent = `💝${item.name} - ${item.originalVal}원 → ${item.val}원 (5% 추천할인!)`;
        optionElement.className = 'text-blue-500 font-bold';
      } else {
        optionElement.textContent = `${item.name} - ${item.val}원${discountText}`;
      }
    }
    selectElement.appendChild(optionElement);
  }

  // 재고 부족 경고 표시
  if (totalStock < 50) {
    selectElement.style.borderColor = 'orange';
  } else {
    selectElement.style.borderColor = '';
  }
}

function CartContainer() {
  const cartContainer = document.createElement('div');
  cartContainer.id = 'cart-items';
  return cartContainer;
}

function CartItem(product) {
  const newItem = document.createElement('div');
  newItem.id = product.id;
  newItem.className =
    'grid grid-cols-[80px_1fr_auto] gap-5 py-5 border-b border-gray-100 first:pt-0 last:border-b-0 last:pb-0';

  const discountIcon =
    product.onSale && product.suggestSale
      ? '⚡💝'
      : product.onSale
        ? '⚡'
        : product.suggestSale
          ? '💝'
          : '';

  const priceClass =
    product.onSale && product.suggestSale
      ? 'text-purple-600'
      : product.onSale
        ? 'text-red-500'
        : product.suggestSale
          ? 'text-blue-500'
          : '';

  const priceDisplay =
    product.onSale || product.suggestSale
      ? `<span class="line-through text-gray-400">₩${product.originalVal.toLocaleString()}</span> <span class="${priceClass}">₩${product.val.toLocaleString()}</span>`
      : `₩${product.val.toLocaleString()}`;

  newItem.innerHTML = `
      <div class="w-20 h-20 bg-gradient-black relative overflow-hidden">
        <div class="absolute top-1/2 left-1/2 w-[60%] h-[60%] bg-white/10 -translate-x-1/2 -translate-y-1/2 rotate-45"></div>
      </div>
      <div>
        <h3 class="text-base font-normal mb-1 tracking-tight">${discountIcon}${product.name}</h3>
        <p class="text-xs text-gray-500 mb-0.5 tracking-wide">PRODUCT</p>
        <p class="text-xs text-black mb-3">${priceDisplay}</p>
        <div class="flex items-center gap-4">
          <button class="quantity-change w-6 h-6 border border-black bg-white text-sm flex items-center justify-center transition-all hover:bg-black hover:text-white" data-product-id="${product.id}" data-change="-1">−</button>
          <span class="quantity-number text-sm font-normal min-w-[20px] text-center tabular-nums">1</span>
          <button class="quantity-change w-6 h-6 border border-black bg-white text-sm flex items-center justify-center transition-all hover:bg-black hover:text-white" data-product-id="${product.id}" data-change="1">+</button>
        </div>
      </div>
      <div class="text-right">
        <div class="text-lg mb-2 tracking-tight tabular-nums">${priceDisplay}</div>
        <a class="remove-item text-2xs text-gray-500 uppercase tracking-wider cursor-pointer transition-colors border-b border-transparent hover:text-black hover:border-black" data-product-id="${product.id}">Remove</a>
      </div>
    `;

  return newItem;
}

function PointSummary(targetElement, bonusPoints, pointsDetail) {
  if (!targetElement) return;

  const container = document.createElement('div');

  if (bonusPoints > 0) {
    container.innerHTML = `
      <div>적립 포인트: <span class="font-bold">${bonusPoints}p</span></div>
      <div class="text-2xs opacity-70 mt-1">${pointsDetail.join(', ')}</div>
    `;
  } else {
    container.textContent = '적립 포인트: 0p';
  }

  targetElement.innerHTML = '';
  targetElement.appendChild(container);
  targetElement.style.display = 'block';
}

function DiscountSummary(discountRate = 0, totalAmount = 0, originalTotal = 0) {
  const container = document.createElement('div');
  if (discountRate > 0 && totalAmount > 0) {
    const savedAmount = originalTotal - totalAmount;
    container.innerHTML = `
      <div class="bg-green-500/20 rounded-lg p-3">
        <div class="flex justify-between items-center mb-1">
          <span class="text-xs uppercase tracking-wide text-green-400">총 할인율</span>
          <span class="text-sm font-medium text-green-400">${(discountRate * 100).toFixed(1)}%</span>
        </div>
        <div class="text-2xs text-gray-300">₩${Math.round(savedAmount).toLocaleString()} 할인되었습니다</div>
      </div>
    `;
  }

  return container;
}

function OrderSummary() {
  const container = document.createElement('div');
  container.innerHTML = `
   <h2 class="text-xs font-medium mb-5 tracking-extra-wide uppercase">Order Summary</h2>
    <div class="flex-1 flex flex-col">
      <div id="summary-details" class="space-y-3"></div>
      <div class="mt-auto">
        <div id="discount-info" class="mb-4"></div>
        <div id="cart-total" class="pt-5 border-t border-white/10">
          <div class="flex justify-between items-baseline">
            <span class="text-sm uppercase tracking-wider">Total</span>
            <div class="text-2xl tracking-tight">₩0</div>
          </div>
          <div id="loyalty-points" class="text-xs text-blue-400 mt-2 text-right">적립 포인트: 0p</div>
        </div>
        <div id="tuesday-special" class="mt-4 p-3 bg-white/10 rounded-lg hidden">
          <div class="flex items-center gap-2">
            <span class="text-2xs">🎉</span>
            <span class="text-xs uppercase tracking-wide">Tuesday Special 10% Applied</span>
          </div>
        </div>
      </div>
    </div>
    <button class="w-full py-4 bg-white text-black text-sm font-normal uppercase tracking-super-wide cursor-pointer mt-6 transition-all hover:-translate-y-0.5 hover:shadow-lg hover:shadow-black/30">
      Proceed to Checkout
    </button>
    <p class="mt-4 text-2xs text-white/60 text-center leading-relaxed">
      Free shipping on all orders.<br>
      <span id="points-notice">Earn loyalty points with purchase.</span>
    </p>
  `;
  return container;
}

function PriceSummary(targetElement, product) {
  if (!targetElement) return;
  const container = document.createElement('span');

  if (product.onSale && product.suggestSale) {
    priceDiv.innerHTML = `<span class="line-through text-gray-400">₩${product.originalVal.toLocaleString()}</span> <span class="text-purple-600">₩${product.val.toLocaleString()}</span>`;
  } else if (product.onSale) {
    priceDiv.innerHTML = `<span class="line-through text-gray-400">₩${product.originalVal.toLocaleString()}</span> <span class="text-red-500">₩${product.val.toLocaleString()}</span>`;
  } else if (product.suggestSale) {
    priceDiv.innerHTML = `<span class="line-through text-gray-400">₩${product.originalVal.toLocaleString()}</span> <span class="text-blue-500">₩${product.val.toLocaleString()}</span>`;
  } else {
    priceDiv.textContent = `₩${product.val.toLocaleString()}`;
  }

  targetElement.innerHTML = '';
  targetElement.appendChild(container);
}

export {
  ProductSelector,
  generateProductOptions,
  CartContainer,
  CartItem,
  PointSummary,
  OrderSummary,
  DiscountSummary,
  PriceSummary,
};
