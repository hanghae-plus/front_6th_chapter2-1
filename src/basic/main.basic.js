import { calculateBasePoint, getBulkBonusPoint, getSetBonusPoint } from './features/point/service';
import { productIds, productList } from './features/product/constants';
import { renderProductSelectOptions, renderStockInfo } from './features/product/render';
import { getDiscountRate, getSaleStatus } from './features/product/service';
import {
  DiscountInfo,
  Header,
  LoyaltyPoints,
  ManualColumn,
  ManualToggle,
  NewCartProduct,
  RightColumn,
} from './templates';
import { isTuesday } from './utils/date';

let itemCount;
let lastSelector;
let sum;
let totalAmount = 0;

const stockInfo = document.createElement('div');
stockInfo.id = 'stock-status';
stockInfo.className = `text-xs text-red-500 mt-3 whitespace-pre-line`;

const selector = document.createElement('select');
selector.id = 'product-select';
selector.className = 'w-full p-3 border border-gray-300 rounded-lg text-base mb-3';

const addButton = document.createElement('button');
addButton.id = 'add-to-cart';
addButton.className = `w-full py-3 bg-black text-white text-sm font-medium uppercase tracking-wider hover:bg-gray-800 transition-all`;
addButton.innerHTML = 'Add to Cart';

const cartContainerEl = document.createElement('div');
cartContainerEl.id = 'cart-items';

const header = document.createElement('div');
header.className = 'mb-8';
header.innerHTML = Header();

const rightColumn = document.createElement('div');
rightColumn.className = `bg-black text-white p-8 flex flex-col`;
rightColumn.innerHTML = RightColumn();

const selectorContainer = document.createElement('div');
selectorContainer.className = `mb-6 pb-6 border-b border-gray-200`;

const gridContainer = document.createElement('div');
gridContainer.className = `grid grid-cols-1 lg:grid-cols-[1fr_360px] gap-6 flex-1 overflow-hidden`;

const manualColumn = document.createElement('div');
manualColumn.className = `fixed right-0 top-0 h-full w-80 bg-white shadow-2xl p-6 overflow-y-auto z-50 transform translate-x-full transition-transform duration-300`;
manualColumn.innerHTML = ManualColumn();

const leftColumn = document.createElement('div');
leftColumn.className = `bg-white border border-gray-200 p-8 overflow-y-auto`;

const manualToggle = document.createElement('button');
manualToggle.className = `fixed top-4 right-4 bg-black text-white p-3 rounded-full hover:bg-gray-900 transition-colors z-50`;
manualToggle.innerHTML = ManualToggle();

const manualOverlay = document.createElement('div');
manualOverlay.className = `fixed inset-0 bg-black/50 z-40 hidden transition-opacity duration-300`;

function main() {
  const root = document.getElementById('app');
  const lightningDelay = Math.random() * 10000;

  totalAmount = 0;
  itemCount = 0;
  lastSelector = null;
  sum = rightColumn.querySelector('#cart-total');

  selectorContainer.appendChild(selector);
  selectorContainer.appendChild(addButton);
  selectorContainer.appendChild(stockInfo);
  leftColumn.appendChild(selectorContainer);
  leftColumn.appendChild(cartContainerEl);

  manualToggle.onclick = function () {
    manualOverlay.classList.toggle('hidden');
    manualColumn.classList.toggle('translate-x-full');
  };

  manualOverlay.onclick = function (e) {
    if (e.target === manualOverlay) {
      manualOverlay.classList.add('hidden');
      manualColumn.classList.add('translate-x-full');
    }
  };

  gridContainer.appendChild(leftColumn);
  gridContainer.appendChild(rightColumn);
  manualOverlay.appendChild(manualColumn);
  root.appendChild(header);
  root.appendChild(gridContainer);
  root.appendChild(manualToggle);
  root.appendChild(manualOverlay);

  renderProductSelectOptions(selector, productList);
  handleCalculateCartStuff();

  setTimeout(() => {
    setInterval(function () {
      const luckyIdx = Math.floor(Math.random() * productList.length);
      const luckyItem = productList[luckyIdx];
      if (luckyItem.quantity > 0 && !luckyItem.onSale) {
        luckyItem.value = Math.round((luckyItem.originalValue * 80) / 100);
        luckyItem.onSale = true;
        alert('⚡번개세일! ' + luckyItem.name + '이(가) 20% 할인 중입니다!');
        renderProductSelectOptions(selector, productList);
        renderPricesInCart();
      }
    }, 30000);
  }, lightningDelay);

  setTimeout(function () {
    setInterval(function () {
      if (lastSelector) {
        let suggest = null;
        for (let k = 0; k < productList.length; k++) {
          if (productList[k].id !== lastSelector) {
            if (productList[k].quantity > 0) {
              if (!productList[k].suggestSale) {
                suggest = productList[k];
                break;
              }
            }
          }
        }
        if (suggest) {
          alert('💝 ' + suggest.name + '은(는) 어떠세요? 지금 구매하시면 5% 추가 할인!');
          suggest.value = Math.round((suggest.value * (100 - 5)) / 100);
          suggest.suggestSale = true;
          renderProductSelectOptions(selector, productList);
          renderPricesInCart();
        }
      }
    }, 60000);
  }, Math.random() * 20000);
}

function handleCalculateCartStuff() {
  const cartItemsEl = Array.from(cartContainerEl.children);
  const itemDiscounts = [];

  let subTotal = 0;
  let originalTotal;
  let savedAmount;

  const summaryDetails = document.getElementById('summary-details');
  const discountInfoDiv = document.getElementById('discount-info');
  const itemCountEl = document.getElementById('item-count');
  const tuesdaySpecial = document.getElementById('tuesday-special');
  const totalDiv = sum.querySelector('.text-2xl');
  const previousCount = parseInt(itemCountEl.textContent.match(/\d+/) || 0);

  totalAmount = 0;
  itemCount = 0;
  originalTotal = totalAmount;

  cartItemsEl.forEach((cartItem) => {
    const product = productList.find((_product) => _product.id === cartItem.id);

    const quantityEl = cartItem.querySelector('.quantity-number');
    const quantity = parseInt(quantityEl.textContent);
    const itemTotal = product.value * quantity;

    let discount = 0;

    itemCount += quantity;
    subTotal += itemTotal;

    const priceEl = cartItem.querySelectorAll('.text-lg');

    priceEl.forEach((el) => {
      el.style.fontWeight = quantity >= 10 ? 'bold' : 'normal';
    });

    if (quantity >= 10) {
      discount = getDiscountRate(product);
    }

    if (discount > 0) {
      itemDiscounts.push({ name: product.name, discount: discount * 100 });
    }

    totalAmount += itemTotal * (1 - discount);
  });

  let discountRate = 0;
  originalTotal = subTotal;

  if (itemCount >= 30) {
    totalAmount = (subTotal * 75) / 100;
    discountRate = 25 / 100;
  } else {
    discountRate = (subTotal - totalAmount) / subTotal;
  }

  if (isTuesday() && totalAmount > 0) {
    totalAmount = (totalAmount * 90) / 100;
    discountRate = 1 - totalAmount / originalTotal;

    tuesdaySpecial.classList.remove('hidden');
  } else {
    tuesdaySpecial.classList.add('hidden');
  }

  itemCountEl.textContent = `🛍️ ${itemCount} items in cart`;
  summaryDetails.innerHTML = '';

  if (subTotal > 0) {
    cartItemsEl.forEach((cartItemEl) => {
      const product = productList.find((_product) => _product.id === cartItemEl.id);

      const quantityEl = cartItemEl.querySelector('.quantity-number');
      const quantity = parseInt(quantityEl.textContent);
      const itemTotal = product.value * quantity;

      summaryDetails.innerHTML += `
        <div class="flex justify-between text-xs tracking-wide text-gray-400">
          <span>${product.name} x ${quantity}</span>
          <span>₩${itemTotal.toLocaleString()}</span>
        </div>
      `;
    });

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
      itemDiscounts.forEach((itemDiscount) => {
        summaryDetails.innerHTML += `
          <div class="flex justify-between text-sm tracking-wide text-green-400">
            <span class="text-xs">${itemDiscount.name} (10개↑)</span>
            <span class="text-xs">-${itemDiscount.discount}%</span>
          </div>
        `;
      });
    }

    if (isTuesday() && totalAmount) {
      summaryDetails.innerHTML += `
        <div class="flex justify-between text-sm tracking-wide text-purple-400">
          <span class="text-xs">🌟 화요일 추가 할인</span>
          <span class="text-xs">-10%</span>
        </div>
      `;
    }

    summaryDetails.innerHTML += `
      <div class="flex justify-between text-sm tracking-wide text-gray-400">
        <span>Shipping</span>
        <span>Free</span>
      </div>
    `;
  }

  if (totalDiv) {
    totalDiv.textContent = '₩' + Math.round(totalAmount).toLocaleString();
  }

  discountInfoDiv.innerHTML = '';

  if (discountRate > 0 && totalAmount > 0) {
    savedAmount = originalTotal - totalAmount;

    discountInfoDiv.innerHTML = DiscountInfo({
      discountRate: (discountRate * 100).toFixed(1),
      savedAmount: Math.round(savedAmount).toLocaleString(),
    });
  }

  if (itemCountEl) {
    itemCountEl.textContent = `🛍️ ${itemCount} items in cart`;

    if (previousCount !== itemCount) {
      itemCountEl.setAttribute('data-changed', 'true');
    }
  }

  renderStockInfo(stockInfo, productList);
  renderBonusPoints();
}

const renderBonusPoints = () => {
  const loyaltyPointsEl = document.getElementById('loyalty-points');
  const cartProductEls = Array.from(cartContainerEl.children);
  const hasKeyboard = cartProductEls.some((el) => el.id === productIds.keyboard);
  const hasMouse = cartProductEls.some((el) => el.id === productIds.mouse);
  const hasMonitorArm = cartProductEls.some((el) => el.id === productIds.monitorArm);

  const basePoints = calculateBasePoint(totalAmount);
  const pointsDetailText = [];
  let finalPoints = 0;

  // 장바구니에 상품이 없으면 loyalty-points 요소 숨김
  if (cartProductEls.length === 0) {
    loyaltyPointsEl.style.display = 'none';

    return;
  }

  // 기본 포인트가 0보다 크면 기본 포인트 문구 추가, 최종 포인트 업데이트
  if (basePoints > 0) {
    finalPoints = basePoints;
    pointsDetailText.push('기본: ' + basePoints + 'p');
  }

  // 기본 포인트가 0보다 크고 화요일인 경우 문구 추가, 최종 포인트 2배로 업데이트
  if (isTuesday() && basePoints > 0) {
    finalPoints = basePoints * 2;
    pointsDetailText.push('화요일 2배');
  }

  const setBonusPoint = getSetBonusPoint({
    hasKeyboard,
    hasMouse,
    hasMonitorArm,
  });

  setBonusPoint.forEach(({ label, point }) => {
    finalPoints += point;
    pointsDetailText.push(label);
  });

  const bulkBonusPoint = getBulkBonusPoint(itemCount);

  if (bulkBonusPoint) {
    finalPoints += bulkBonusPoint.point;
    pointsDetailText.push(bulkBonusPoint.label);
  }

  if (loyaltyPointsEl && finalPoints > 0) {
    loyaltyPointsEl.innerHTML = LoyaltyPoints({ finalPoints, pointsDetail: pointsDetailText.join(', ') });
    loyaltyPointsEl.style.display = 'block';
  }
};

const renderPricesInCart = () => {
  const cartItemsEl = Array.from(cartContainerEl.children);

  cartItemsEl.forEach((cartItem) => {
    const product = productList.find((_product) => _product.id === cartItem.id);

    if (product) {
      const priceDiv = cartItem.querySelector('.text-lg');
      const nameDiv = cartItem.querySelector('h3');
      const status = getSaleStatus(product);

      const priceInnerHtml = (_product) => {
        return `
          <span class="line-through text-gray-400">₩${_product.originalValue.toLocaleString()}</span>
          <span class="text-purple-600">₩${_product.value.toLocaleString()}</span>
        `;
      };

      if (status === 'SUPER') {
        priceDiv.innerHTML = priceInnerHtml(product);
        nameDiv.textContent = `⚡💝${product.name}`;
      } else if (status === 'SALE') {
        priceDiv.innerHTML = priceInnerHtml(product);
        nameDiv.textContent = `⚡${product.name}`;
      } else if (status === 'SUGGEST') {
        priceDiv.innerHTML = priceInnerHtml(product);
        nameDiv.textContent = `💝${product.name}`;
      } else {
        priceDiv.textContent = `₩${product.value.toLocaleString()}`;
        nameDiv.textContent = product.name;
      }
    }
  });

  handleCalculateCartStuff();
};

main();

addButton.addEventListener('click', function () {
  const selectedProductId = selector.value;
  const selectedProduct = productList.find((product) => product.id === selectedProductId);

  if (!selectedProductId || !selectedProduct) {
    return;
  }

  if (selectedProduct && selectedProduct.quantity > 0) {
    const selectedProductEl = document.getElementById(selectedProduct.id);

    if (selectedProductEl) {
      const quantityEl = selectedProductEl.querySelector('.quantity-number');
      const quantity = parseInt(quantityEl.textContent);
      const newQuantity = quantity + 1;

      if (newQuantity <= selectedProduct.quantity + quantity) {
        quantityEl.textContent = newQuantity;
        selectedProduct['quantity']--;
      } else {
        alert('재고가 부족합니다.');
      }
    } else {
      const newItem = document.createElement('div');
      newItem.id = selectedProduct.id;
      newItem.className = `grid grid-cols-[80px_1fr_auto] gap-5 py-5 border-b border-gray-100 first:pt-0 last:border-b-0 last:pb-0`;
      newItem.innerHTML = NewCartProduct(selectedProduct);

      cartContainerEl.appendChild(newItem);
      selectedProduct.quantity--;
    }

    handleCalculateCartStuff();
    lastSelector = selectedProductId;
  }
});

cartContainerEl.addEventListener('click', function (event) {
  const target = event.target;

  if (target.classList.contains('quantity-change') || target.classList.contains('remove-item')) {
    const productId = target.dataset.productId;
    const productEl = document.getElementById(productId);
    const product = productList.find((el) => el.id === productId);
    const quantityEl = productEl.querySelector('.quantity-number');

    if (target.classList.contains('quantity-change')) {
      const quantityChange = parseInt(target.dataset.change);
      const currentQuantity = parseInt(quantityEl.textContent);
      const newQuantity = currentQuantity + quantityChange;

      if (newQuantity > 0 && newQuantity <= product.quantity + currentQuantity) {
        quantityEl.textContent = newQuantity;
        product.quantity -= quantityChange;
      } else if (newQuantity <= 0) {
        product.quantity += currentQuantity;
        productEl.remove();
      } else {
        alert('재고가 부족합니다.');
      }
    }

    if (target.classList.contains('remove-item')) {
      const remQuantity = parseInt(quantityEl.textContent);
      product.quantity += remQuantity;
      productEl.remove();
    }

    handleCalculateCartStuff();
    renderProductSelectOptions(selector, productList);
  }
});
