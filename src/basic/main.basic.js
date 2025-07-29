// 리팩토링 완료 후 파일 분리할 것

function isTuesday() {
  return new Date().getDay() === 2;
}

// header
function Header() {
  return `
    <div class="mb-8">
      <h1 class="text-xs font-medium tracking-extra-wide uppercase mb-2">🛒 Hanghae Online Store</h1>
      <div class="text-5xl tracking-tight leading-none">Shopping Cart</div>
      <p id="item-count" class="text-sm text-gray-500 font-normal mt-3">��️ 0 items in cart</p>
    </div>
  `;
}

function selectorContainer() {
  const selectorContainer = document.createElement('div');
  selectorContainer.className = 'mb-6 pb-6 border-b border-gray-200';
  const addButton = document.createElement('button');
  const stockInfo = document.createElement('div');
  addButton.id = 'add-to-cart';
  stockInfo.id = 'stock-status';
  stockInfo.className = 'text-xs text-red-500 mt-3 whitespace-pre-line';
  addButton.innerHTML = 'Add to Cart';
  addButton.className =
    'w-full py-3 bg-black text-white text-sm font-medium uppercase tracking-wider hover:bg-gray-800 transition-all';
  selectorContainer.appendChild(selector);
  selectorContainer.appendChild(addButton);
  selectorContainer.appendChild(stockInfo);
  return `
    <div class="mb-6 pb-6 border-b border-gray-200">
      <h1 class="text-xs font-medium tracking-extra-wide uppercase mb-2">🛒 Hanghae Online Store</h1>
      <div class="text-5xl tracking-tight leading-none">Shopping Cart</div>
      <p id="item-count" class="text-sm text-gray-500 font-normal mt-3">��️ 0 items in cart</p>
    </div>
  `;
}
function ProductSelect() {
  return `
    <select id="product-select" class="w-full p-3 border border-gray-300 rounded-lg text-base mb-3">
      <h1 class="text-xs font-medium tracking-extra-wide uppercase mb-2">🛒 Hanghae Online Store</h1>
      <div class="text-5xl tracking-tight leading-none">Shopping Cart</div>
      <p id="item-count" class="text-sm text-gray-500 font-normal mt-3">��️ 0 items in cart</p>
    </select>
  `;
}
function main() {
  const PRODUCT_1 = 'p1';
  const PRODUCT_2 = 'p2';
  const PRODUCT_3 = 'p3';
  const PRODUCT_4 = 'p4';
  const PRODUCT_5 = `p5`;
  let totalAmount = 0;
  let itemCount = 0;
  let lastSelector = null;

  const productList = [
    {
      id: PRODUCT_1,
      name: '버그 없애는 키보드',
      val: 10000,
      originalVal: 10000,
      quantity: 50,
      onSale: false,
      suggestSale: false,
    },
    {
      id: PRODUCT_2,
      name: '생산성 폭발 마우스',
      val: 20000,
      originalVal: 20000,
      quantity: 30,
      onSale: false,
      suggestSale: false,
    },
    {
      id: PRODUCT_3,
      name: '거북목 탈출 모니터암',
      val: 30000,
      originalVal: 30000,
      quantity: 20,
      onSale: false,
      suggestSale: false,
    },
    {
      id: PRODUCT_4,
      name: '에러 방지 노트북 파우치',
      val: 15000,
      originalVal: 15000,
      quantity: 0,
      onSale: false,
      suggestSale: false,
    },
    {
      id: PRODUCT_5,
      name: `코딩할 때 듣는 Lo-Fi 스피커`,
      val: 25000,
      originalVal: 25000,
      quantity: 10,
      onSale: false,
      suggestSale: false,
    },
  ];
  const header = new Header();

  // 변수 선언을 사용 지점으로 이동
  const root = document.getElementById('app');

  const gridContainer = document.createElement('div');
  const leftColumn = document.createElement('div');
  leftColumn['className'] = 'bg-white border border-gray-200 p-8 overflow-y-auto';

  gridContainer.className =
    'grid grid-cols-1 lg:grid-cols-[1fr_360px] gap-6 flex-1 overflow-hidden';

  leftColumn.appendChild(selectorContainer);
  const cartDisplay = document.createElement('div');
  leftColumn.appendChild(cartDisplay);
  cartDisplay.id = 'cart-items';
  const rightColumn = document.createElement('div');
  rightColumn.className = 'bg-black text-white p-8 flex flex-col';
  rightColumn.innerHTML = `
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
  const sum = rightColumn.querySelector('#cart-total');
  const manualToggle = document.createElement('button');
  manualToggle.onclick = function () {
    manualOverlay.classList.toggle('hidden');
    manualColumn.classList.toggle('translate-x-full');
  };
  manualToggle.className =
    'fixed top-4 right-4 bg-black text-white p-3 rounded-full hover:bg-gray-900 transition-colors z-50';
  manualToggle.innerHTML = `
    <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
    </svg>
  `;
  const manualOverlay = document.createElement('div');
  manualOverlay.className = 'fixed inset-0 bg-black/50 z-40 hidden transition-opacity duration-300';
  manualOverlay.onclick = function (e) {
    if (e.target === manualOverlay) {
      manualOverlay.classList.add('hidden');
      manualColumn.classList.add('translate-x-full');
    }
  };
  const manualColumn = document.createElement('div');
  manualColumn.className =
    'fixed right-0 top-0 h-full w-80 bg-white shadow-2xl p-6 overflow-y-auto z-50 transform translate-x-full transition-transform duration-300';
  manualColumn.innerHTML = `
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
  gridContainer.appendChild(leftColumn);
  gridContainer.appendChild(rightColumn);
  manualOverlay.appendChild(manualColumn);
  root.appendChild(header);
  root.appendChild(gridContainer);
  root.appendChild(manualToggle);
  root.appendChild(manualOverlay);
  let initStock = 0;
  for (let index = 0; index < productList.length; index++) {
    initStock += productList[index].quantity;
  }
  updateProductSelector();
  calculateCartTotal();
  const lightningDelay = Math.random() * 10000;
  setTimeout(() => {
    setInterval(() => {
      const luckyIdx = Math.floor(Math.random() * productList.length);
      const luckyItem = productList[luckyIdx];
      if (luckyItem.quantity > 0 && !luckyItem.onSale) {
        luckyItem.val = Math.round((luckyItem.originalVal * 80) / 100);
        luckyItem.onSale = true;
        alert(`⚡번개세일! ${luckyItem.name}이(가) 20% 할인 중입니다!`);
        updateProductSelector();
        updateCartItemPrices();
      }
    }, 30000);
  }, lightningDelay);
  setTimeout(() => {
    setInterval(() => {
      if (cartDisplay.children.length === 0) {
      }
      if (lastSelector) {
        let suggest = null;
        for (let index = 0; index < productList.length; index++) {
          if (productList[index].id !== lastSelector) {
            if (productList[index].quantity > 0) {
              if (!productList[index].suggestSale) {
                suggest = productList[index];
                break;
              }
            }
          }
        }
        if (suggest) {
          alert(`💝 ${suggest.name}은(는) 어떠세요? 지금 구매하시면 5% 추가 할인!`);
          suggest.val = Math.round((suggest.val * (100 - 5)) / 100);
          suggest.suggestSale = true;
          updateProductSelector();
          updateCartItemPrices();
        }
      }
    }, 60000);
  }, Math.random() * 20000);
  function updateProductSelector() {
    let totalStock = 0;
    selector.innerHTML = '';
    for (let index = 0; index < productList.length; index++) {
      const _p = productList[index];
      totalStock = totalStock + _p.quantity;
    }
    for (let index = 0; index < productList.length; index++) {
      (function () {
        const item = productList[index];
        const option = document.createElement('option');
        option.value = item.id;
        let discountText = '';
        if (item.onSale) discountText += ' ⚡SALE';
        if (item.suggestSale) discountText += ' 💝추천';
        if (item.quantity === 0) {
          option.textContent = `${item.name} - ${item.val}원 (품절)${discountText}`;
          option.disabled = true;
          option.className = 'text-gray-400';
        } else {
          if (item.onSale && item.suggestSale) {
            option.textContent = `⚡💝${item.name} - ${item.originalVal}원 → ${
              item.val
            }원 (25% SUPER SALE!)`;
            option.className = 'text-purple-600 font-bold';
          } else if (item.onSale) {
            option.textContent = `⚡${item.name} - ${item.originalVal}원 → ${item.val}원 (20% SALE!)`;
            option.className = 'text-red-500 font-bold';
          } else if (item.suggestSale) {
            option.textContent = `💝${item.name} - ${item.originalVal}원 → ${item.val}원 (5% 추천할인!)`;
            option.className = 'text-blue-500 font-bold';
          } else {
            option.textContent = `${item.name} - ${item.val}원${discountText}`;
          }
        }
        selector.appendChild(opt);
      })();
    }
    if (totalStock < 50) {
      selector.style.borderColor = 'orange';
    } else {
      selector.style.borderColor = '';
    }
  }
  function calculateCartTotal() {
    let subTotal = 0;
    const itemDiscounts = [];
    const lowStockItems = [];
    let savedAmount;
    let points;
    let previousCount;
    totalAmount = 0;
    itemCount = 0;
    let originalTotal = totalAmount;
    const cartItems = cartDisplay.children;
    const bulkDisc = subTotal;
    for (let index = 0; index < productList.length; index++) {
      if (productList[index].quantity < 5 && productList[index].quantity > 0) {
        lowStockItems.push(productList[index].name);
      }
    }
    for (let index = 0; index < cartItems.length; index++) {
      (function () {
        let currentItem;
        for (let productIndex = 0; productIndex < productList.length; productIndex++) {
          if (productList[productIndex].id === cartItems[index].id) {
            currentItem = productList[productIndex];
            break;
          }
        }
        const quantityElement = cartItems[index].querySelector('.quantity-number');
        const quantity = parseInt(quantityElement.textContent);
        const itemTot = currentItem.val * quantity;
        let discount = 0;
        itemCount += quantity;
        subTotal += itemTot;
        const itemDiv = cartItems[index];
        const priceElements = itemDiv.querySelectorAll('.text-lg, .text-xs');
        priceElements.forEach((elem) => {
          if (elem.classList.contains('text-lg')) {
            elem.style.fontWeight = quantity >= 10 ? 'bold' : 'normal';
          }
        });
        if (quantity >= 10) {
          if (currentItem.id === PRODUCT_1) {
            discount = 10 / 100;
          } else {
            if (currentItem.id === PRODUCT_2) {
              discount = 15 / 100;
            } else {
              if (currentItem.id === PRODUCT_3) {
                discount = 20 / 100;
              } else {
                if (currentItem.id === PRODUCT_4) {
                  discount = 5 / 100;
                } else {
                  if (currentItem.id === PRODUCT_5) {
                    discount = 25 / 100;
                  }
                }
              }
            }
          }
          if (discount > 0) {
            itemDiscounts.push({ name: currentItem.name, discount: discount * 100 });
          }
        }
        totalAmount += itemTot * (1 - discount);
      })();
    }
    let discRate = 0;
    originalTotal = subTotal;
    if (itemCount >= 30) {
      totalAmount = (subTotal * 75) / 100;
      discRate = 25 / 100;
    } else {
      discRate = (subTotal - totalAmount) / subTotal;
    }
    const tuesdaySpecial = document.getElementById('tuesday-special');
    if (isTuesday) {
      if (totalAmount > 0) {
        totalAmount = (totalAmount * 90) / 100;
        discRate = 1 - totalAmount / originalTotal;
        tuesdaySpecial.classList.remove('hidden');
      } else {
        tuesdaySpecial.classList.add('hidden');
      }
    } else {
      tuesdaySpecial.classList.add('hidden');
    }
    document.getElementById('item-count').textContent = `🛍️ ${itemCount} items in cart`;
    const summaryDetails = document.getElementById('summary-details');
    summaryDetails.innerHTML = '';
    if (subTotal > 0) {
      for (let index = 0; index < cartItems.length; index++) {
        let currentItem;
        for (let productIndex = 0; productIndex < productList.length; productIndex++) {
          if (productList[productIndex].id === cartItems[index].id) {
            currentItem = productList[productIndex];
            break;
          }
        }
        const quantityElement = cartItems[index].querySelector('.quantity-number');
        const quantity = parseInt(quantityElement.textContent);
        const itemTotal = currentItem.val * q;
        summaryDetails.innerHTML += `
          <div class="flex justify-between text-xs tracking-wide text-gray-400">
            <span>${currentItem.name} x ${quantity}</span>
            <span>₩${itemTotal.toLocaleString()}</span>
          </div>
        `;
      }
      summaryDetails.innerHTML += `
        <div class="border-t border-white/10 my-3"></div>
        <div class="flex justify-between text-sm tracking-wide">
          <span>Subtotal</span>
          <span>₩${subTotal.toLocaleString()}</span>
        </div>
      `;
      if (itemCount >= 30) {
        summaryDetails.innerHTML += `
          <div class="flex justify-between text-sm tracking-wide text-green-400">
            <span class="text-xs">🎉 대량구매 할인 (30개 이상)</span>
            <span class="text-xs">-25%</span>
          </div>
        `;
      } else if (itemDiscounts.length > 0) {
        itemDiscounts.forEach((item) => {
          summaryDetails.innerHTML += `
            <div class="flex justify-between text-sm tracking-wide text-green-400">
              <span class="text-xs">${item.name} (10개↑)</span>
              <span class="text-xs">-${item.discount}%</span>
            </div>
          `;
        });
      }
      if (isTuesday) {
        if (totalAmount > 0) {
          summaryDetails.innerHTML += `
            <div class="flex justify-between text-sm tracking-wide text-purple-400">
              <span class="text-xs">🌟 화요일 추가 할인</span>
              <span class="text-xs">-10%</span>
            </div>
          `;
        }
      }
      summaryDetails.innerHTML += `
        <div class="flex justify-between text-sm tracking-wide text-gray-400">
          <span>Shipping</span>
          <span>Free</span>
        </div>
      `;
    }
    const totalDiv = sum.querySelector('.text-2xl');
    if (totalDiv) {
      totalDiv.textContent = `₩${Math.round(totalAmount).toLocaleString()}`;
    }
    const loyaltyPointsDiv = document.getElementById('loyalty-points');
    if (loyaltyPointsDiv) {
      points = Math.floor(totalAmount / 1000);
      if (points > 0) {
        loyaltyPointsDiv.textContent = `적립 포인트: ${points}p`;
        loyaltyPointsDiv.style.display = 'block';
      } else {
        loyaltyPointsDiv.textContent = '적립 포인트: 0p';
        loyaltyPointsDiv.style.display = 'block';
      }
    }
    const discountInfoDiv = document.getElementById('discount-info');
    discountInfoDiv.innerHTML = '';
    if (discRate > 0 && totalAmount > 0) {
      savedAmount = originalTotal - totalAmount;
      discountInfoDiv.innerHTML = `
        <div class="bg-green-500/20 rounded-lg p-3">
          <div class="flex justify-between items-center mb-1">
            <span class="text-xs uppercase tracking-wide text-green-400">총 할인율</span>
            <span class="text-sm font-medium text-green-400">${(discRate * 100).toFixed(1)}%</span>
          </div>
          <div class="text-2xs text-gray-300">₩${Math.round(savedAmount).toLocaleString()} 할인되었습니다</div>
        </div>
      `;
    }
    const itemCountElement = document.getElementById('item-count');
    if (itemCountElement) {
      previousCount = parseInt(itemCountElement.textContent.match(/\d+/) || 0);
      itemCountElement.textContent = `🛍️ ${itemCount} items in cart`;
      if (previousCount !== itemCount) {
        itemCountElement.setAttribute('data-changed', 'true');
      }
    }
    const stockMsg = '';
    for (let index = 0; index < productList.length; index++) {
      const item = productList[index];
      if (item.quantity < 5) {
        if (item.quantity > 0) {
          stockMsg = `${stockMsg + item.name}: 재고 부족 (${item.quantity}개 남음)\n`;
        } else {
          stockMsg = `${stockMsg + item.name}: 품절\n`;
        }
      }
    }
    stockInfo.textContent = stockMsg;
    updateStockInfo();
    renderLoyaltyPoints();
  }
  function renderLoyaltyPoints() {
    if (cartDisplay.children.length === 0) {
      document.getElementById('loyalty-points').style.display = 'none';
      return;
    }
    const basePoints = Math.floor(totalAmount / 1000);
    let finalPoints = 0;
    const pointsDetail = [];
    if (basePoints > 0) {
      finalPoints = basePoints;
      pointsDetail.push(`기본: ${basePoints}p`);
    }
    if (isTuesday()) {
      if (basePoints > 0) {
        finalPoints = basePoints * 2;
        pointsDetail.push('화요일 2배');
      }
    }
    let hasKeyboard = false;
    let hasMouse = false;
    let hasMonitorArm = false;
    let bonusPts = 0;
    const nodes = cartDisplay.children;
    for (const node of nodes) {
      let product = null;
      for (let index = 0; index < productList.length; index++) {
        if (productList[index].id === node.id) {
          product = productList[index];
          break;
        }
      }
      if (!product) continue;
      if (product.id === PRODUCT_1) {
        hasKeyboard = true;
      } else if (product.id === PRODUCT_2) {
        hasMouse = true;
      } else if (product.id === PRODUCT_3) {
        hasMonitorArm = true;
      }
    }
    if (hasKeyboard && hasMouse) {
      finalPoints = finalPoints + 50;
      pointsDetail.push('키보드+마우스 세트 +50p');
    }
    if (hasKeyboard && hasMouse && hasMonitorArm) {
      finalPoints = finalPoints + 100;
      pointsDetail.push('풀세트 구매 +100p');
    }
    if (itemCount >= 30) {
      finalPoints = finalPoints + 100;
      pointsDetail.push('대량구매(30개+) +100p');
    } else {
      if (itemCount >= 20) {
        finalPoints = finalPoints + 50;
        pointsDetail.push('대량구매(20개+) +50p');
      } else {
        if (itemCount >= 10) {
          finalPoints = finalPoints + 20;
          pointsDetail.push('대량구매(10개+) +20p');
        }
      }
    }
    bonusPts = finalPoints;
    const ptsTag = document.getElementById('loyalty-points');
    if (ptsTag) {
      if (bonusPts > 0) {
        ptsTag.innerHTML =
          `<div>적립 포인트: <span class="font-bold">${bonusPts}p</span></div>` +
          `<div class="text-2xs opacity-70 mt-1">${pointsDetail.join(', ')}</div>`;
        ptsTag.style.display = 'block';
      } else {
        ptsTag.textContent = '적립 포인트: 0p';
        ptsTag.style.display = 'block';
      }
    }
  }
  function getTotalStock() {
    let sum;
    let i;
    let currentProduct;
    sum = 0;
    for (i = 0; i < productList.length; i++) {
      currentProduct = productList[i];
      sum += currentProduct.quantity;
    }
    return sum;
  }
  function updateStockInfo() {
    let infoMsg = '';
    const totalStock = getTotalStock();
    if (totalStock < 30) {
    }
    productList.forEach((item) => {
      if (item.quantity < 5) {
        if (item.quantity > 0) {
          infoMsg = `${infoMsg + item.name}: 재고 부족 (${item.quantity}개 남음)\n`;
        } else {
          infoMsg = `${infoMsg + item.name}: 품절\n`;
        }
      }
    });
    stockInfo.textContent = infoMsg;
  }
  function updateCartItemPrices() {
    let totalCount = 0,
      index = 0;
    let cartItems;
    while (cartDisplay.children[index]) {
      const qty = cartDisplay.children[index].querySelector('.quantity-number');
      totalCount += qty ? parseInt(qty.textContent) : 0;
      index++;
    }
    for (let index = 0; index < cartDisplay.children.length; index++) {
      totalCount += parseInt(
        cartDisplay.children[index].querySelector('.quantity-number').textContent,
      );
    }
    cartItems = cartDisplay.children;
    for (let index = 0; index < cartItems.length; index++) {
      const itemId = cartItems[index].id;
      let product = null;
      for (let productIndex = 0; productIndex < productList.length; productIndex++) {
        if (productList[productIndex].id === itemId) {
          product = productList[productIndex];
          break;
        }
      }
      if (product) {
        const priceDiv = cartItems[index].querySelector('.text-lg');
        const nameDiv = cartItems[index].querySelector('h3');
        if (product.onSale && product.suggestSale) {
          priceDiv.innerHTML = `<span class="line-through text-gray-400">₩${product.originalVal.toLocaleString()}</span> <span class="text-purple-600">₩${product.val.toLocaleString()}</span>`;
          nameDiv.textContent = `⚡💝${product.name}`;
        } else if (product.onSale) {
          priceDiv.innerHTML = `<span class="line-through text-gray-400">₩${product.originalVal.toLocaleString()}</span> <span class="text-red-500">₩${product.val.toLocaleString()}</span>`;
          nameDiv.textContent = `⚡${product.name}`;
        } else if (product.suggestSale) {
          priceDiv.innerHTML = `<span class="line-through text-gray-400">₩${product.originalVal.toLocaleString()}</span> <span class="text-blue-500">₩${product.val.toLocaleString()}</span>`;
          nameDiv.textContent = `💝${product.name}`;
        } else {
          priceDiv.textContent = `₩${product.val.toLocaleString()}`;
          nameDiv.textContent = product.name;
        }
      }
    }
    calculateCartTotal();
  }
  addButton.addEventListener('click', () => {
    const selItem = selector.value;
    let hasItem = false;
    for (let index = 0; index < productList.length; index++) {
      if (productList[index].id === selItem) {
        hasItem = true;
        break;
      }
    }
    if (!selItem || !hasItem) {
      return;
    }
    let itemToAdd = null;
    for (let index = 0; index < productList.length; index++) {
      if (productList[index].id === selItem) {
        itemToAdd = productList[index];
        break;
      }
    }
    if (itemToAdd && itemToAdd.quantity > 0) {
      const item = document.getElementById(itemToAdd['id']);
      if (item) {
        const quantityElement = item.querySelector('.quantity-number');
        const newQty = parseInt(quantityElement['textContent']) + 1;
        if (newQty <= itemToAdd.quantity + parseInt(quantityElement.textContent)) {
          quantityElement.textContent = newQty;
          itemToAdd['quantity']--;
        } else {
          alert('재고가 부족합니다.');
        }
      } else {
        const newItem = document.createElement('div');
        newItem.id = itemToAdd.id;
        newItem.className =
          'grid grid-cols-[80px_1fr_auto] gap-5 py-5 border-b border-gray-100 first:pt-0 last:border-b-0 last:pb-0';
        newItem.innerHTML = `
          <div class="w-20 h-20 bg-gradient-black relative overflow-hidden">
            <div class="absolute top-1/2 left-1/2 w-[60%] h-[60%] bg-white/10 -translate-x-1/2 -translate-y-1/2 rotate-45"></div>
          </div>
          <div>
            <h3 class="text-base font-normal mb-1 tracking-tight">${itemToAdd.onSale && itemToAdd.suggestSale ? '⚡💝' : itemToAdd.onSale ? '⚡' : itemToAdd.suggestSale ? '💝' : ''}${itemToAdd.name}</h3>
            <p class="text-xs text-gray-500 mb-0.5 tracking-wide">PRODUCT</p>
            <p class="text-xs text-black mb-3">${itemToAdd.onSale || itemToAdd.suggestSale ? `<span class="line-through text-gray-400">₩${itemToAdd.originalVal.toLocaleString()}</span> <span class="${itemToAdd.onSale && itemToAdd.suggestSale ? 'text-purple-600' : itemToAdd.onSale ? 'text-red-500' : 'text-blue-500'}">₩${itemToAdd.val.toLocaleString()}</span>` : `₩${itemToAdd.val.toLocaleString()}`}</p>
            <div class="flex items-center gap-4">
              <button class="quantity-change w-6 h-6 border border-black bg-white text-sm flex items-center justify-center transition-all hover:bg-black hover:text-white" data-product-id="${itemToAdd.id}" data-change="-1">−</button>
              <span class="quantity-number text-sm font-normal min-w-[20px] text-center tabular-nums">1</span>
              <button class="quantity-change w-6 h-6 border border-black bg-white text-sm flex items-center justify-center transition-all hover:bg-black hover:text-white" data-product-id="${itemToAdd.id}" data-change="1">+</button>
            </div>
          </div>
          <div class="text-right">
            <div class="text-lg mb-2 tracking-tight tabular-nums">${itemToAdd.onSale || itemToAdd.suggestSale ? `<span class="line-through text-gray-400">₩${itemToAdd.originalVal.toLocaleString()}</span> <span class="${itemToAdd.onSale && itemToAdd.suggestSale ? 'text-purple-600' : itemToAdd.onSale ? 'text-red-500' : 'text-blue-500'}">₩${itemToAdd.val.toLocaleString()}</span>` : `₩${itemToAdd.val.toLocaleString()}`}</div>
            <a class="remove-item text-2xs text-gray-500 uppercase tracking-wider cursor-pointer transition-colors border-b border-transparent hover:text-black hover:border-black" data-product-id="${itemToAdd.id}">Remove</a>
          </div>
        `;
        cartDisplay.appendChild(newItem);
        itemToAdd.quantity--;
      }
      calculateCartTotal();
      lastSelector = selItem;
    }
  });
  cartDisplay.addEventListener('click', (event) => {
    const tgt = event.target;
    if (tgt.classList.contains('quantity-change') || tgt.classList.contains('remove-item')) {
      const prodId = tgt.dataset.productId;
      const itemElem = document.getElementById(prodId);
      let prod = null;
      for (let index = 0; index < productList.length; index++) {
        if (productList[index].id === prodId) {
          prod = productList[index];
          break;
        }
      }
      if (tgt.classList.contains('quantity-change')) {
        const qtyChange = parseInt(tgt.dataset.change);
        const quantityElement = itemElem.querySelector('.quantity-number');
        const currentQty = parseInt(quantityElement.textContent);
        const newQty = currentQty + qtyChange;
        if (newQty > 0 && newQty <= prod.quantity + currentQty) {
          quantityElement.textContent = newQty;
          prod.quantity -= qtyChange;
        } else if (newQty <= 0) {
          prod.quantity += currentQty;
          itemElem.remove();
        } else {
          alert('재고가 부족합니다.');
        }
      } else if (tgt.classList.contains('remove-item')) {
        const quantityElement = itemElem.querySelector('.quantity-number');
        const remQty = parseInt(quantityElement.textContent);
        prod.quantity += remQty;
        itemElem.remove();
      }
      if (prod && prod.quantity < 5) {
      }
      calculateCartTotal();
      updateProductSelector();
    }
  });
}

main();
