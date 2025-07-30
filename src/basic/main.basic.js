const PRODUCT_ONE = 'p1';
const PRODUCT_TWO = 'p2';
const PRODUCT_THREE = 'p3';
const PRODUCT_FOUR = 'p4';
const PRODUCT_FIVE = 'p5';

const PRODUCT_LIST = [
  {
    id: PRODUCT_ONE,
    name: '버그 없애는 키보드',
    value: 10000,
    originalVal: 10000,
    quantity: 50,
    onSale: false,
    suggestSale: false,
  },
  {
    id: PRODUCT_TWO,
    name: '생산성 폭발 마우스',
    value: 20000,
    originalVal: 20000,
    quantity: 30,
    onSale: false,
    suggestSale: false,
  },
  {
    id: PRODUCT_THREE,
    name: '거북목 탈출 모니터암',
    value: 30000,
    originalVal: 30000,
    quantity: 20,
    onSale: false,
    suggestSale: false,
  },
  {
    id: PRODUCT_FOUR,
    name: '에러 방지 노트북 파우치',
    value: 15000,
    originalVal: 15000,
    quantity: 0,
    onSale: false,
    suggestSale: false,
  },
  {
    id: PRODUCT_FIVE,
    name: '코딩할 때 듣는 Lo-Fi 스피커',
    value: 25000,
    originalVal: 25000,
    quantity: 10,
    onSale: false,
    suggestSale: false,
  },
];

let latestSelectedProduct = null;

// selector element
const $selector = document.createElement('select');
$selector.id = 'product-select';
$selector.className = 'w-full p-3 border border-gray-300 rounded-lg text-base mb-3';

// 'ADD TO CART' button element
const $addButton = document.createElement('button');
$addButton.id = 'add-to-cart';
$addButton.innerHTML = 'Add to Cart';
$addButton.className =
  'w-full py-3 bg-black text-white text-sm font-medium uppercase tracking-wider hover:bg-gray-800 transition-all';

// Cart items container
const $cartItems = document.createElement('div');
$cartItems.id = 'cart-items';

// Stock Status element
const $stockStatus = document.createElement('div');
$stockStatus.id = 'stock-status';
$stockStatus.className = 'text-xs text-red-500 mt-3 whitespace-pre-line';

// 재고 기준 미달 시 Selector border 색상 변경
function renderStockLimitWarning() {
  const totalStock = PRODUCT_LIST.reduce((acc, item) => acc + item.quantity, 0);

  if (totalStock < 50) {
    $selector.style.borderColor = 'orange';
  } else {
    $selector.style.borderColor = '';
  }
}

// Selector 내 Option element 생성 함수
function createOptionElement(product) {
  const $option = document.createElement('option');
  $option.value = product.id;

  let discountText = '';

  if (product.onSale) discountText += ' ⚡SALE';
  if (product.suggestSale) discountText += ' 💝추천';

  if (product.quantity === 0) {
    $option.className = 'text-gray-400';
    $option.disabled = true;
    $option.textContent = `${product.name} - ${product.value}원 (품절)${discountText}`;
    return $option;
  }

  if (product.onSale && product.suggestSale) {
    $option.className = 'text-purple-600 font-bold';
    $option.textContent = `⚡💝${product.name} - ${product.originalVal}원 → ${product.value}원 (25% SUPER SALE!)`;
    return $option;
  }

  if (product.onSale) {
    $option.className = 'text-red-500 font-bold';
    $option.textContent = `⚡${product.name} - ${product.originalVal}원 → ${product.value}원 (20% SALE!)`;
    return $option;
  }

  if (product.suggestSale) {
    $option.className = 'text-blue-500 font-bold';
    $option.textContent = `💝${product.name} - ${product.originalVal}원 → ${product.value}원 (5% 추천할인!)`;
    return $option;
  }

  $option.textContent = `${product.name} - ${product.value}원${discountText}`;
  return $option;
}

// Selector 내 상품 Option element 업데이트
function updateProductSelector() {
  renderStockLimitWarning();

  $selector.innerHTML = '';

  PRODUCT_LIST.forEach((product) => {
    const $option = createOptionElement(product);
    $selector.appendChild($option);
  });
}

function getStockInfo(productList = PRODUCT_LIST) {
  const infoMessage = productList.reduce((message, product) => {
    if (product.quantity < 5) {
      if (product.quantity > 0) {
        return message + `${product.name}: 재고 부족 (${product.quantity}개 남음)\n`;
      } else {
        return message + `${product.name}: 품절\n`;
      }
    }

    return message;
  }, '');

  return infoMessage;
}

function calBonusPoints(totalAmount, itemCount) {
  const basePoints = Math.floor(totalAmount / 1000);
  let finalPoints = 0;

  if (basePoints > 0) {
    finalPoints = basePoints;
  }

  const isTuesday = new Date().getDay() === 2; // 화요일

  if (isTuesday) {
    if (basePoints > 0) {
      finalPoints = basePoints * 2;
    }
  }

  const cartItemList = Array.from($cartItems.children);

  const hasKeyboard = !!cartItemList.find((node) => node.id === PRODUCT_ONE);
  const hasMouse = !!cartItemList.find((node) => node.id === PRODUCT_TWO);
  const hasMonitorArm = !!cartItemList.find((node) => node.id === PRODUCT_THREE);

  if (hasKeyboard && hasMouse) {
    finalPoints = finalPoints + 50;
  }

  if (hasKeyboard && hasMouse && hasMonitorArm) {
    finalPoints = finalPoints + 100;
  }

  if (itemCount >= 30) {
    finalPoints = finalPoints + 100;
  } else {
    if (itemCount >= 20) {
      finalPoints = finalPoints + 50;
    } else {
      if (itemCount >= 10) {
        finalPoints = finalPoints + 20;
      }
    }
  }

  return finalPoints;
}

function getBonusPointsDetail(totalAmount, itemCount) {
  const basePoints = Math.floor(totalAmount / 1000);
  const pointsDetail = [];

  if (basePoints > 0) {
    pointsDetail.push(`기본: ${basePoints}p`);
  }

  const isTuesday = new Date().getDay() === 2;

  if (isTuesday) {
    if (basePoints > 0) {
      pointsDetail.push('화요일 2배');
    }
  }

  const cartItemList = Array.from($cartItems.children);

  const hasKeyboard = !!cartItemList.find((node) => node.id === PRODUCT_ONE);
  const hasMouse = !!cartItemList.find((node) => node.id === PRODUCT_TWO);
  const hasMonitorArm = !!cartItemList.find((node) => node.id === PRODUCT_THREE);

  if (hasKeyboard && hasMouse) {
    pointsDetail.push('키보드+마우스 세트 +50p');
  }

  if (hasKeyboard && hasMouse && hasMonitorArm) {
    pointsDetail.push('풀세트 구매 +100p');
  }

  if (itemCount >= 30) {
    pointsDetail.push('대량구매(30개+) +100p');
  } else {
    if (itemCount >= 20) {
      pointsDetail.push('대량구매(20개+) +50p');
    } else {
      if (itemCount >= 10) {
        pointsDetail.push('대량구매(10개+) +20p');
      }
    }
  }

  return pointsDetail;
}

function renderBonusPoints(totalAmount, itemCount) {
  const $loyaltyPoints = document.getElementById('loyalty-points');

  if ($cartItems.children.length === 0) {
    $loyaltyPoints.style.display = 'none';
    return;
  }

  const bonusPts = calBonusPoints(totalAmount, itemCount);
  const pointsDetail = getBonusPointsDetail(totalAmount, itemCount);

  if (!$loyaltyPoints) return;

  if (bonusPts > 0) {
    $loyaltyPoints.innerHTML = `
        <div>적립 포인트: <span class="font-bold">${bonusPts}p</span></div>
        <div class="text-2xs opacity-70 mt-1">${pointsDetail.join(', ')}</div>
      `;
    $loyaltyPoints.style.display = 'block';
  } else {
    $loyaltyPoints.textContent = '적립 포인트: 0p';
    $loyaltyPoints.style.display = 'block';
  }
}

function calcCart() {
  let totalAmount = 0;
  let itemCount = 0;
  let subTotal = 0;

  const cartItemList = Array.from($cartItems.children);

  const itemDiscounts = [];

  cartItemList.forEach((cartItem) => {
    const product = PRODUCT_LIST.find((product) => product.id === cartItem.id);

    const $quantityNumber = cartItem.querySelector('.quantity-number');
    const quantity = parseInt($quantityNumber.textContent);
    const itemTotal = product.value * quantity;

    let discount = 0;

    itemCount += quantity;
    subTotal += itemTotal;

    const $price = cartItem.querySelectorAll('.text-lg, .text-xs');
    $price.forEach((element) => {
      if (element.classList.contains('text-lg')) {
        element.style.fontWeight = quantity >= 10 ? 'bold' : 'normal';
      }
    });

    if (quantity >= 10) {
      if (product.id === PRODUCT_ONE) {
        discount = 10 / 100;
      } else if (product.id === PRODUCT_TWO) {
        discount = 15 / 100;
      } else if (product.id === PRODUCT_THREE) {
        discount = 20 / 100;
      } else if (product.id === PRODUCT_FOUR) {
        discount = 5 / 100;
      } else if (product.id === PRODUCT_FIVE) {
        discount = 25 / 100;
      }

      if (discount > 0) {
        itemDiscounts.push({ name: product.name, discount: discount * 100 });
      }
    }

    totalAmount += itemTotal * (1 - discount);
  });

  let discountRate = 0;
  const originalTotal = subTotal;

  if (itemCount >= 30) {
    totalAmount = (subTotal * 75) / 100;
    discountRate = 25 / 100;
  } else {
    discountRate = (subTotal - totalAmount) / subTotal;
  }

  const today = new Date();
  const isTuesday = today.getDay() === 2; // TODO 화요일
  const $tuesdaySpecial = document.getElementById('tuesday-special');

  if (isTuesday) {
    if (totalAmount > 0) {
      totalAmount = (totalAmount * 90) / 100;

      discountRate = 1 - totalAmount / originalTotal;
      $tuesdaySpecial.classList.remove('hidden');
    } else {
      $tuesdaySpecial.classList.add('hidden');
    }
  } else {
    $tuesdaySpecial.classList.add('hidden');
  }

  const $itemCount = document.getElementById('item-count');
  $itemCount.textContent = `🛍️ ${itemCount} items in cart`;

  const $summaryDetails = document.getElementById('summary-details');
  $summaryDetails.innerHTML = '';

  if (subTotal > 0) {
    cartItemList.forEach((cartItem) => {
      const product = PRODUCT_LIST.find((product) => product.id === cartItem.id);

      const $quantityNumber = cartItem.querySelector('.quantity-number');
      const quantity = parseInt($quantityNumber.textContent);
      const itemTotal = product.value * quantity;

      $summaryDetails.innerHTML += `
      <div class="flex justify-between text-xs tracking-wide text-gray-400">
        <span>${product.name} x ${quantity}</span>
        <span>₩${itemTotal.toLocaleString()}</span>
      </div>
      `;
    });

    $summaryDetails.innerHTML += `
      <div class="border-t border-white/10 my-3"></div>
      <div class="flex justify-between text-sm tracking-wide">
        <span>Subtotal</span>
        <span>₩${subTotal.toLocaleString()}</span>
      </div>
    `;

    if (itemCount >= 30) {
      $summaryDetails.innerHTML += `
        <div class="flex justify-between text-sm tracking-wide text-green-400">
          <span class="text-xs">🎉 대량구매 할인 (30개 이상)</span>
          <span class="text-xs">-25%</span>
        </div>
      `;
    } else if (itemDiscounts.length > 0) {
      itemDiscounts.forEach(function (item) {
        $summaryDetails.innerHTML += `
          <div class="flex justify-between text-sm tracking-wide text-green-400">
            <span class="text-xs">${item.name} (10개↑)</span>
            <span class="text-xs">-${item.discount}%</span>
          </div>
        `;
      });
    }
    if (isTuesday) {
      if (totalAmount > 0) {
        $summaryDetails.innerHTML += `
          <div class="flex justify-between text-sm tracking-wide text-purple-400">
            <span class="text-xs">🌟 화요일 추가 할인</span>
            <span class="text-xs">-10%</span>
          </div>
        `;
      }
    }
    $summaryDetails.innerHTML += `
      <div class="flex justify-between text-sm tracking-wide text-gray-400">
        <span>Shipping</span>
        <span>Free</span>
      </div>
    `;
  }

  const $cartTotal = document.querySelector('#cart-total .text-2xl');

  if ($cartTotal) {
    $cartTotal.textContent = `₩${Math.round(totalAmount).toLocaleString()}`;
  }

  const $loyaltyPoints = document.getElementById('loyalty-points');

  if ($loyaltyPoints) {
    const points = Math.floor(totalAmount / 1000);

    if (points > 0) {
      $loyaltyPoints.textContent = `적립 포인트: ${points}p`;
      $loyaltyPoints.style.display = 'block';
    } else {
      $loyaltyPoints.textContent = '적립 포인트: 0p';
      $loyaltyPoints.style.display = 'block';
    }
  }

  const $discountInfo = document.getElementById('discount-info');
  $discountInfo.innerHTML = '';

  if (discountRate > 0 && totalAmount > 0) {
    const savedAmount = originalTotal - totalAmount;
    $discountInfo.innerHTML = `
      <div class="bg-green-500/20 rounded-lg p-3">
        <div class="flex justify-between items-center mb-1">
          <span class="text-xs uppercase tracking-wide text-green-400">총 할인율</span>
          <span class="text-sm font-medium text-green-400">${(discountRate * 100).toFixed(1)}%</span>
        </div>
        <div class="text-2xs text-gray-300">₩${Math.round(savedAmount).toLocaleString()} 할인되었습니다</div>
      </div>
    `;
  }

  if ($itemCount) {
    const previousCount = parseInt($itemCount.textContent.match(/\d+/) || 0);
    $itemCount.textContent = `🛍️ ${itemCount} items in cart`;
    if (previousCount !== itemCount) {
      $itemCount.setAttribute('data-changed', 'true');
    }
  }

  $stockStatus.textContent = getStockInfo(PRODUCT_LIST);

  renderBonusPoints(totalAmount, itemCount);
}

function updateDiscountPrices() {
  Array.from($cartItems.children).forEach((cartItem) => {
    const itemId = cartItem.id;
    const product = PRODUCT_LIST.find((product) => product.id === itemId);

    if (!product) return;

    const $productPrice = cartItem.querySelector('.text-lg');
    const $productName = cartItem.querySelector('h3');

    if (product.onSale && product.suggestSale) {
      $productPrice.innerHTML = `<span class="line-through text-gray-400">₩${product.originalVal.toLocaleString()}</span> <span class="text-purple-600">₩${product.value.toLocaleString()}</span>`;
      $productName.textContent = `⚡💝${product.name}`;
    } else if (product.onSale) {
      $productPrice.innerHTML = `<span class="line-through text-gray-400">₩${product.originalVal.toLocaleString()}</span> <span class="text-red-500">₩${product.value.toLocaleString()}</span>`;
      $productName.textContent = `⚡${product.name}`;
    } else if (product.suggestSale) {
      $productPrice.innerHTML = `<span class="line-through text-gray-400">₩${product.originalVal.toLocaleString()}</span> <span class="text-blue-500">₩${product.value.toLocaleString()}</span>`;
      $productName.textContent = `💝${product.name}`;
    } else {
      $productPrice.textContent = `₩${product.value.toLocaleString()}`;
      $productName.textContent = product.name;
    }
  });

  calcCart();
}

function setLightningDiscountAlert() {
  const lightningDelay = Math.random() * 10000;

  setTimeout(() => {
    setInterval(() => {
      const luckyIdx = Math.floor(Math.random() * PRODUCT_LIST.length);

      const luckyItem = PRODUCT_LIST[luckyIdx];

      if (luckyItem.quantity > 0 && !luckyItem.onSale) {
        luckyItem.value = Math.round((luckyItem.originalVal * 80) / 100);
        luckyItem.onSale = true;

        alert(`⚡번개세일! ${luckyItem.name}이(가) 20% 할인 중입니다!`);

        updateProductSelector();
        updateDiscountPrices();
      }
    }, 30000);
  }, lightningDelay);
}

function setDiscountAlert() {
  setTimeout(() => {
    setInterval(() => {
      if (latestSelectedProduct) {
        const suggest = PRODUCT_LIST.find(
          (product) =>
            product.id !== latestSelectedProduct && product.quantity > 0 && !product.suggestSale,
        );

        if (suggest) {
          alert(`💝 ${suggest.name}은(는) 어떠세요? 지금 구매하시면 5% 추가 할인!`);

          suggest.value = Math.round((suggest.value * (100 - 5)) / 100);
          suggest.suggestSale = true;

          updateProductSelector();
          updateDiscountPrices();
        }
      }
    }, 60000);
  }, Math.random() * 20000);
}

function handleClickAddButton() {
  const selectedItem = $selector.value;

  const itemToAdd = PRODUCT_LIST.find((product) => product.id === selectedItem);

  if (!selectedItem || !itemToAdd) return;

  if (!itemToAdd || itemToAdd.quantity <= 0) return;

  const item = document.getElementById(itemToAdd['id']);

  if (item) {
    const $quantityNumber = item.querySelector('.quantity-number');
    const newQuantity = parseInt($quantityNumber['textContent']) + 1;

    if (newQuantity <= itemToAdd.quantity + parseInt($quantityNumber.textContent)) {
      $quantityNumber.textContent = newQuantity;
      itemToAdd['quantity']--;
    } else {
      alert('재고가 부족합니다.');
    }
  } else {
    const $newItem = document.createElement('div');

    $newItem.id = itemToAdd.id;
    $newItem.className =
      'grid grid-cols-[80px_1fr_auto] gap-5 py-5 border-b border-gray-100 first:pt-0 last:border-b-0 last:pb-0';
    $newItem.innerHTML = `
        <div class="w-20 h-20 bg-gradient-black relative overflow-hidden">
          <div class="absolute top-1/2 left-1/2 w-[60%] h-[60%] bg-white/10 -translate-x-1/2 -translate-y-1/2 rotate-45"></div>
        </div>
        <div>
          <h3 class="text-base font-normal mb-1 tracking-tight">${itemToAdd.onSale && itemToAdd.suggestSale ? '⚡💝' : itemToAdd.onSale ? '⚡' : itemToAdd.suggestSale ? '💝' : ''}${itemToAdd.name}</h3>
          <p class="text-xs text-gray-500 mb-0.5 tracking-wide">PRODUCT</p>
          <p class="text-xs text-black mb-3">${itemToAdd.onSale || itemToAdd.suggestSale ? '<span class="line-through text-gray-400">₩' + itemToAdd.originalVal.toLocaleString() + '</span> <span class="' + (itemToAdd.onSale && itemToAdd.suggestSale ? 'text-purple-600' : itemToAdd.onSale ? 'text-red-500' : 'text-blue-500') + '">₩' + itemToAdd.value.toLocaleString() + '</span>' : '₩' + itemToAdd.value.toLocaleString()}</p>
          <div class="flex items-center gap-4">
            <button class="quantity-change w-6 h-6 border border-black bg-white text-sm flex items-center justify-center transition-all hover:bg-black hover:text-white" data-product-id="${itemToAdd.id}" data-change="-1">−</button>
            <span class="quantity-number text-sm font-normal min-w-[20px] text-center tabular-nums">1</span>
            <button class="quantity-change w-6 h-6 border border-black bg-white text-sm flex items-center justify-center transition-all hover:bg-black hover:text-white" data-product-id="${itemToAdd.id}" data-change="1">+</button>
          </div>
        </div>
        <div class="text-right">
          <div class="text-lg mb-2 tracking-tight tabular-nums">${itemToAdd.onSale || itemToAdd.suggestSale ? '<span class="line-through text-gray-400">₩' + itemToAdd.originalVal.toLocaleString() + '</span> <span class="' + (itemToAdd.onSale && itemToAdd.suggestSale ? 'text-purple-600' : itemToAdd.onSale ? 'text-red-500' : 'text-blue-500') + '">₩' + itemToAdd.value.toLocaleString() + '</span>' : '₩' + itemToAdd.value.toLocaleString()}</div>
          <a class="remove-item text-2xs text-gray-500 uppercase tracking-wider cursor-pointer transition-colors border-b border-transparent hover:text-black hover:border-black" data-product-id="${itemToAdd.id}">Remove</a>
        </div>
      `;

    $cartItems.appendChild($newItem);

    itemToAdd.quantity--;
  }

  calcCart();

  latestSelectedProduct = selectedItem;
}

function handleClickCartItem(event) {
  const target = event.target;

  if (!target.classList.contains('quantity-change') && !target.classList.contains('remove-item'))
    return;

  const productId = target.dataset.productId;
  const $product = document.getElementById(productId);

  const product = PRODUCT_LIST.find((product) => product.id === productId);

  if (target.classList.contains('quantity-change')) {
    const quantityChange = parseInt(target.dataset.change);
    const $quantityNumber = $product.querySelector('.quantity-number');
    const currentQuantity = parseInt($quantityNumber.textContent);

    const newQuantity = currentQuantity + quantityChange;

    if (newQuantity > 0 && newQuantity <= product.quantity + currentQuantity) {
      $quantityNumber.textContent = newQuantity;
      product.quantity -= quantityChange;
    } else if (newQuantity <= 0) {
      product.quantity += currentQuantity;
      $product.remove();
    } else {
      alert('재고가 부족합니다.');
    }
  } else if (target.classList.contains('remove-item')) {
    const $quantityNumber = $product.querySelector('.quantity-number');
    const removedQuantity = parseInt($quantityNumber.textContent);

    product.quantity += removedQuantity;
    $product.remove();
  }

  calcCart();
  updateProductSelector();
}

function main() {
  const $header = document.createElement('div');
  $header.className = 'mb-8';
  $header.innerHTML = `
    <h1 class="text-xs font-medium tracking-extra-wide uppercase mb-2">🛒 Hanghae Online Store</h1>
    <div class="text-5xl tracking-tight leading-none">Shopping Cart</div>
    <p id="item-count" class="text-sm text-gray-500 font-normal mt-3">🛍️ 0 items in cart</p>
  `;

  const $gridContainer = document.createElement('div');
  $gridContainer.className =
    'grid grid-cols-1 lg:grid-cols-[1fr_360px] gap-6 flex-1 overflow-hidden';

  const $selectorContainer = document.createElement('div');
  $selectorContainer.className = 'mb-6 pb-6 border-b border-gray-200';
  $selectorContainer.appendChild($selector);
  $selectorContainer.appendChild($addButton);
  $selectorContainer.appendChild($stockStatus);

  const $leftColumn = document.createElement('div');
  $leftColumn['className'] = 'bg-white border border-gray-200 p-8 overflow-y-auto';
  $leftColumn.appendChild($selectorContainer);
  $leftColumn.appendChild($cartItems);

  const $rightColumn = document.createElement('div');
  $rightColumn.className = 'bg-black text-white p-8 flex flex-col';
  $rightColumn.innerHTML = `
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

  const $manualColumn = document.createElement('div');
  $manualColumn.className =
    'fixed right-0 top-0 h-full w-80 bg-white shadow-2xl p-6 overflow-y-auto z-50 transform translate-x-full transition-transform duration-300';
  $manualColumn.innerHTML = `
    <button class="absolute top-4 right-4 text-gray-500 hover:text-black" onclick="document.querySelector('.fixed.inset-0').classList.add('hidden'); this.parentElement.classList.add('translate-x-full')">
      <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path>
      </svg>
    </button>
    <h2 class="text-xl font-bold mb-4">📖 이용 안내</h2>
    <div class="mb-6">
      <h3 class="text-base font-bold mb-3">💰 할인 정책</h3>
      <div class="space-y-3">
        <div class="bg-gray-100 rounded-lg p-3">
          <p class="font-semibold text-sm mb-1">개별 상품</p>
          <p class="text-gray-700 text-xs pl-2">
            • 키보드 10개↑: 10%<br>
            • 마우스 10개↑: 15%<br>
            • 모니터암 10개↑: 20%<br>
            • 스피커 10개↑: 25%
          </p>
        </div>
        <div class="bg-gray-100 rounded-lg p-3">
          <p class="font-semibold text-sm mb-1">전체 수량</p>
          <p class="text-gray-700 text-xs pl-2">• 30개 이상: 25%</p>
        </div>
        <div class="bg-gray-100 rounded-lg p-3">
          <p class="font-semibold text-sm mb-1">특별 할인</p>
          <p class="text-gray-700 text-xs pl-2">
            • 화요일: +10%<br>
            • ⚡번개세일: 20%<br>
            • 💝추천할인: 5%
          </p>
        </div>
      </div>
    </div>
    <div class="mb-6">
      <h3 class="text-base font-bold mb-3">🎁 포인트 적립</h3>
      <div class="space-y-3">
        <div class="bg-gray-100 rounded-lg p-3">
          <p class="font-semibold text-sm mb-1">기본</p>
          <p class="text-gray-700 text-xs pl-2">• 구매액의 0.1%</p>
        </div>
        <div class="bg-gray-100 rounded-lg p-3">
          <p class="font-semibold text-sm mb-1">추가</p>
          <p class="text-gray-700 text-xs pl-2">
            • 화요일: 2배<br>
            • 키보드+마우스: +50p<br>
            • 풀세트: +100p<br>
            • 10개↑: +20p / 20개↑: +50p / 30개↑: +100p
          </p>
        </div>
      </div>
    </div>
    <div class="border-t border-gray-200 pt-4 mt-4">
      <p class="text-xs font-bold mb-1">💡 TIP</p>
      <p class="text-2xs text-gray-600 leading-relaxed">
        • 화요일 대량구매 = MAX 혜택<br>
        • ⚡+💝 중복 가능<br>
        • 상품4 = 품절
      </p>
    </div>
  `;

  const $manualOverlay = document.createElement('div');
  $manualOverlay.className =
    'fixed inset-0 bg-black/50 z-40 hidden transition-opacity duration-300';
  $manualOverlay.onclick = function (e) {
    if (e.target === $manualOverlay) {
      $manualOverlay.classList.add('hidden');
      $manualColumn.classList.add('translate-x-full');
    }
  };

  const $manualToggle = document.createElement('button');
  $manualToggle.onclick = function () {
    $manualOverlay.classList.toggle('hidden');
    $manualColumn.classList.toggle('translate-x-full');
  };
  $manualToggle.className =
    'fixed top-4 right-4 bg-black text-white p-3 rounded-full hover:bg-gray-900 transition-colors z-50';
  $manualToggle.innerHTML = `
    <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
    </svg>
  `;

  $gridContainer.appendChild($leftColumn);
  $gridContainer.appendChild($rightColumn);
  $manualOverlay.appendChild($manualColumn);

  const $root = document.getElementById('app');
  $root.appendChild($header);
  $root.appendChild($gridContainer);
  $root.appendChild($manualToggle);
  $root.appendChild($manualOverlay);

  updateProductSelector();
  calcCart();
}

main();

$addButton.addEventListener('click', handleClickAddButton);
$cartItems.addEventListener('click', handleClickCartItem);

setLightningDiscountAlert();
setDiscountAlert();
