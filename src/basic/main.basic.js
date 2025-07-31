let stockInfo;
let itemCnt;
let lastSel;
let sel;
let addBtn;
let totalAmt = 0;

import { BonusPoints } from './components/BonusPoints.js';
import { products } from './data/productList.js';
import { calculateBonusPoints } from './hooks/useBonusPoints.js';
import { CALCULATION_CONSTANTS, DISCOUNT_RATES, QUANTITY_THRESHOLDS, TIME_DELAYS } from './utils/constants.js';

let cartDisp;

import { CartItemDisplay } from './components/CartItemDisplay.js';
import { renderHeader } from './components/Header.js';
import { renderManualOverlay } from './components/ManualOverlay.js';
import { renderOrderSummary } from './components/OrderSummary.js';
import { createElement } from './utils/dom.js';
import { formatPrice } from './utils/format.js';
import { htmlToElement } from './utils/htmlToElement.js';
import { updateSelectOptions } from './utils/updateSelectOptions.js';

function main() {
  // Header 분리된 컴포넌트 사용 (문자열 반환)
  const headerHtml = renderHeader();
  const gridContainer = createElement('div');
  const leftColumn = createElement('div');
  const selectorContainer = createElement('div');
  // OrderSummary 분리된 컴포넌트 사용 (문자열 반환)
  const rightColumnHtml = renderOrderSummary();
  // ManualOverlay 분리된 컴포넌트 사용 (문자열 반환)
  const { manualToggleHtml, manualOverlayHtml } = renderManualOverlay();
  totalAmt = 0;
  itemCnt = 0;
  lastSel = null;

  const root = document.getElementById('app');
  sel = createElement('select');
  sel.id = 'product-select';
  leftColumn['className'] = 'bg-white border border-gray-200 p-8 overflow-y-auto';
  selectorContainer.className = 'mb-6 pb-6 border-b border-gray-200';
  sel.className = 'w-full p-3 border border-gray-300 rounded-lg text-base mb-3';
  gridContainer.className = 'grid grid-cols-1 lg:grid-cols-[1fr_360px] gap-6 flex-1 overflow-hidden';
  addBtn = createElement('button');
  stockInfo = createElement('div');
  addBtn.id = 'add-to-cart';
  stockInfo.id = 'stock-status';
  stockInfo.className = 'text-xs text-red-500 mt-3 whitespace-pre-line';
  addBtn.innerHTML = 'Add to Cart';
  addBtn.className =
    'w-full py-3 bg-black text-white text-sm font-medium uppercase tracking-wider hover:bg-gray-800 transition-all';
  selectorContainer.appendChild(sel);
  selectorContainer.appendChild(addBtn);
  selectorContainer.appendChild(stockInfo);
  leftColumn.appendChild(selectorContainer);
  cartDisp = createElement('div');
  cartDisp.id = 'cart-items';
  leftColumn.appendChild(cartDisp);
  // rightColumn 삽입 (유틸 사용)
  const rightColumnEl = htmlToElement(rightColumnHtml);
  sum = rightColumnEl.querySelector('#cart-total');
  gridContainer.appendChild(leftColumn);
  gridContainer.appendChild(rightColumnEl);
  // header 문자열을 DOM에 삽입 (유틸 사용)
  const headerEl = htmlToElement(headerHtml);
  root.appendChild(headerEl);
  root.appendChild(gridContainer);
  // ManualOverlay 삽입 (유틸 사용)
  const manualToggleBtn = htmlToElement(manualToggleHtml);
  root.appendChild(manualToggleBtn);
  const manualOverlayDiv = htmlToElement(manualOverlayHtml);
  root.appendChild(manualOverlayDiv);
  // ManualOverlay 이벤트 연결
  manualToggleBtn.addEventListener('click', () => {
    manualOverlayDiv.classList.toggle('hidden');
    const manualColumn = manualOverlayDiv.querySelector('#manual-column');
    manualColumn.classList.toggle('translate-x-full');
  });
  manualOverlayDiv.addEventListener('click', (e) => {
    if (e.target === manualOverlayDiv) {
      manualOverlayDiv.classList.add('hidden');
      const manualColumn = manualOverlayDiv.querySelector('#manual-column');
      manualColumn.classList.add('translate-x-full');
    }
  });
  const manualCloseBtn = manualOverlayDiv.querySelector('#manual-close');
  if (manualCloseBtn) {
    manualCloseBtn.addEventListener('click', () => {
      manualOverlayDiv.classList.add('hidden');
      const manualColumn = manualOverlayDiv.querySelector('#manual-column');
      manualColumn.classList.add('translate-x-full');
    });
  }
  updateSelectOptions(sel, products);
  handleCalculateCartStuff();

  const lightningDelay = Math.random() * TIME_DELAYS.LIGHTNING_SALE_MAX;
  setTimeout(() => {
    setInterval(function () {
      const luckyIdx = Math.floor(Math.random() * products.length);
      const luckyItem = products[luckyIdx];
      if (luckyItem.quantity > 0 && !luckyItem.onSale) {
        luckyItem.discountPrice = Math.round(luckyItem.price * (1 - DISCOUNT_RATES.LIGHTNING_SALE_RATE));
        luckyItem.onSale = true;
        alert('⚡번개세일! ' + luckyItem.name + `이(가) ${DISCOUNT_RATES.LIGHTNING_SALE_RATE * 100}% 할인 중입니다!`);
        updateSelectOptions(sel, products);
        doUpdatePricesInCart();
      }
    }, TIME_DELAYS.LIGHTNING_SALE_INTERVAL);
  }, lightningDelay);

  setTimeout(function () {
    setInterval(function () {
      if (lastSel) {
        let suggest = null;
        for (let k = 0; k < products.length; k++) {
          if (products[k].id !== lastSel) {
            if (products[k].quantity > 0) {
              if (!products[k].suggestSale) {
                suggest = products[k];
                break;
              }
            }
          }
        }
        if (suggest) {
          alert(
            '💝 ' +
              suggest.name +
              `은(는) 어떠세요? 지금 구매하시면 ${DISCOUNT_RATES.SUGGEST_SALE_RATE * 100}% 추가 할인!`
          );
          suggest.discountPrice = Math.round(suggest.discountPrice * (1 - DISCOUNT_RATES.SUGGEST_SALE_RATE));
          suggest.suggestSale = true;
          updateSelectOptions(sel, products);
          doUpdatePricesInCart();
        }
      }
    }, TIME_DELAYS.SUGGEST_SALE_INTERVAL);
  }, Math.random() * TIME_DELAYS.SUGGEST_SALE_MAX);
}

let sum;

function handleCalculateCartStuff() {
  const cartItems = cartDisp.children;
  let subTot = 0;
  const itemDiscounts = [];
  const lowStockItems = [];
  let savedAmount = 0;
  let stockMsg = '';
  let previousCount = 0;
  // let points = 0;
  let discRate = 0;
  totalAmt = 0;
  itemCnt = 0;

  // 재고 부족 상품 목록
  for (let idx = 0; idx < products.length; idx++) {
    if (products[idx].quantity < QUANTITY_THRESHOLDS.ITEM_DISCOUNT && products[idx].quantity > 0) {
      lowStockItems.push(products[idx].name);
    }
  }

  // 카트 내 각 상품별 합계 및 할인 계산
  for (let i = 0; i < cartItems.length; i++) {
    let curItem = null;
    for (let j = 0; j < products.length; j++) {
      if (products[j].id === cartItems[i].id) {
        curItem = products[j];
        break;
      }
    }
    if (!curItem) continue;
    const qtyElem = cartItems[i].querySelector('.quantity-number');
    const q = parseInt(qtyElem.textContent);
    const itemTot = curItem.discountPrice * q;
    let disc = 0;
    itemCnt += q;
    subTot += itemTot;
    const itemDiv = cartItems[i];
    const priceElems = itemDiv.querySelectorAll('.text-lg, .text-xs');
    priceElems.forEach(function (elem) {
      if (elem.classList.contains('text-lg')) {
        elem.style.fontWeight = q >= QUANTITY_THRESHOLDS.ITEM_DISCOUNT ? 'bold' : 'normal';
      }
    });
    // 할인율 적용
    if (q >= QUANTITY_THRESHOLDS.ITEM_DISCOUNT && curItem.discountRate) {
      disc = curItem.discountRate;
      if (disc > 0) {
        itemDiscounts.push({ name: curItem.name, discount: disc * CALCULATION_CONSTANTS.PERCENTAGE_MULTIPLIER });
      }
    }
    totalAmt += itemTot * (1 - disc);
  }

  // 대량구매 할인
  const originalTotal = subTot;
  if (itemCnt >= QUANTITY_THRESHOLDS.BULK_PURCHASE) {
    totalAmt = subTot * (1 - DISCOUNT_RATES.BULK_PURCHASE_RATE);
    discRate = DISCOUNT_RATES.BULK_PURCHASE_RATE;
  } else {
    discRate = subTot > 0 ? (subTot - totalAmt) / subTot : 0;
  }

  // 화요일 추가 할인
  const today = new Date();
  const isTuesday = today.getDay() === DISCOUNT_RATES.TUESDAY_DAY;
  const tuesdaySpecial = document.getElementById('tuesday-special');
  if (isTuesday) {
    if (totalAmt > 0) {
      totalAmt = totalAmt * (1 - DISCOUNT_RATES.TUESDAY_SPECIAL_RATE);
      discRate = 1 - totalAmt / originalTotal;
      tuesdaySpecial.classList.remove('hidden');
    } else {
      tuesdaySpecial.classList.add('hidden');
    }
  } else {
    tuesdaySpecial.classList.add('hidden');
  }

  document.getElementById('item-count').textContent = '🛍️ ' + itemCnt + ' items in cart';

  const summaryDetails = document.getElementById('summary-details');
  summaryDetails.innerHTML = '';
  if (subTot > 0) {
    for (let i = 0; i < cartItems.length; i++) {
      let curItem = null;
      for (let j = 0; j < products.length; j++) {
        if (products[j].id === cartItems[i].id) {
          curItem = products[j];
          break;
        }
      }
      if (!curItem) continue;
      const qtyElem = cartItems[i].querySelector('.quantity-number');
      const q = parseInt(qtyElem.textContent);
      const itemTotal = curItem.discountPrice * q;
      summaryDetails.innerHTML += `
      <div class="flex justify-between text-xs tracking-wide text-gray-400">
        <span>${curItem.name} x ${q}</span>
        <span>${formatPrice(itemTotal)}</span>
      </div>
    `;
    }
    summaryDetails.innerHTML += `
      <div class="border-t border-white/10 my-3"></div>
      <div class="flex justify-between text-sm tracking-wide">
        <span>Subtotal</span>
        <span>${formatPrice(subTot)}</span>
      </div>
    `;
    if (itemCnt >= 30) {
      summaryDetails.innerHTML += `
        <div class="flex justify-between text-sm tracking-wide text-green-400">
          <span class="text-xs">🎉 대량구매 할인 (30개 이상)</span>
          <span class="text-xs">-25%</span>
        </div>
      `;
    } else if (itemDiscounts.length > 0) {
      itemDiscounts.forEach(function (item) {
        summaryDetails.innerHTML += `
          <div class="flex justify-between text-sm tracking-wide text-green-400">
            <span class="text-xs">${item.name} (10개↑)</span>
            <span class="text-xs">-${item.discount}%</span>
          </div>
        `;
      });
    }
    if (isTuesday && totalAmt > 0) {
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

  const totalDiv = sum.querySelector('.text-2xl');
  if (totalDiv) {
    totalDiv.textContent = formatPrice(Math.round(totalAmt));
  }

  // 포인트 계산 및 표시(React 스타일 분리)

  const discountInfoDiv = document.getElementById('discount-info');
  discountInfoDiv.innerHTML = '';
  if (discRate > 0 && totalAmt > 0) {
    savedAmount = originalTotal - totalAmt;
    discountInfoDiv.innerHTML = `
      <div class="bg-green-500/20 rounded-lg p-3">
        <div class="flex justify-between items-center mb-1">
          <span class="text-xs uppercase tracking-wide text-green-400">총 할인율</span>
          <span class="text-sm font-medium text-green-400">${(discRate * 100).toFixed(1)}%</span>
        </div>
        <div class="text-2xs text-gray-300">${formatPrice(Math.round(savedAmount))} 할인되었습니다</div>
      </div>
    `;
  }

  const itemCountElement = document.getElementById('item-count');
  if (itemCountElement) {
    previousCount = parseInt(itemCountElement.textContent.match(/\d+/) || 0);
    itemCountElement.textContent = '🛍️ ' + itemCnt + ' items in cart';
    if (previousCount !== itemCnt) {
      itemCountElement.setAttribute('data-changed', 'true');
    }
  }

  // 재고 메시지
  for (let stockIdx = 0; stockIdx < products.length; stockIdx++) {
    const item = products[stockIdx];
    if (item.quantity < 5) {
      if (item.quantity > 0) {
        stockMsg += item.name + ': 재고 부족 (' + item.quantity + '개 남음)\n';
      } else {
        stockMsg += item.name + ': 품절\n';
      }
    }
  }
  stockInfo.textContent = stockMsg;

  handleStockInfoUpdate();

  // React 스타일: 포인트 계산 및 렌더링 분리 호출 (UI 문자열 반환)
  const { points, details } = calculateBonusPoints({
    cartItems: cartDisp.children,
    products,
    itemCnt,
    totalAmt,
  });
  const ptsTag = document.getElementById('loyalty-points');
  if (ptsTag) {
    const html = BonusPoints({ points, details });
    if (html === 'none') {
      ptsTag.style.display = 'none';
      ptsTag.innerHTML = '';
    } else {
      ptsTag.style.display = 'block';
      ptsTag.innerHTML = html;
    }
  }
}

function handleStockInfoUpdate() {
  let infoMsg;
  infoMsg = '';
  products.forEach(function (item) {
    if (item.quantity < 5) {
      if (item.quantity > 0) {
        infoMsg = infoMsg + item.name + ': 재고 부족 (' + item.quantity + '개 남음)\n';
      } else {
        infoMsg = infoMsg + item.name + ': 품절\n';
      }
    }
  });
  stockInfo.textContent = infoMsg;
}

function doUpdatePricesInCart() {
  const cartItems = cartDisp.children;
  const productMap = Object.fromEntries(products.map((p) => [p.id, p]));
  for (let i = 0; i < cartItems.length; i++) {
    const itemId = cartItems[i].id;
    const product = productMap[itemId];
    if (product) {
      CartItemDisplay(cartItems[i], product);
    }
  }
  handleCalculateCartStuff();
}

main();
addBtn.addEventListener('click', function () {
  const selItem = sel.value;
  let hasItem = false;
  for (let idx = 0; idx < products.length; idx++) {
    if (products[idx].id === selItem) {
      hasItem = true;
      break;
    }
  }
  if (!selItem || !hasItem) {
    return;
  }
  let itemToAdd = null;
  for (let j = 0; j < products.length; j++) {
    if (products[j].id === selItem) {
      itemToAdd = products[j];
      break;
    }
  }
  if (itemToAdd && itemToAdd.quantity > 0) {
    const item = document.getElementById(itemToAdd['id']);
    if (item) {
      const qtyElem = item.querySelector('.quantity-number');
      const newQty = parseInt(qtyElem['textContent']) + 1;
      if (newQty <= itemToAdd.quantity + parseInt(qtyElem.textContent)) {
        qtyElem.textContent = newQty;
        itemToAdd.quantity--;
      } else {
        alert('재고가 부족합니다.');
      }
    } else {
      const newItem = document.createElement('div');
      newItem.id = itemToAdd.id;
      newItem.className =
        'grid grid-cols-[80px_1fr_auto] gap-5 py-5 border-b border-gray-100 first:pt-0 last:border-b-0 last:pb-0';
      let priceHtml = '';
      if (itemToAdd.onSale || itemToAdd.suggestSale) {
        priceHtml = `<span class="line-through text-gray-400">${itemToAdd.price}원</span> <span class="${itemToAdd.onSale && itemToAdd.suggestSale ? 'text-purple-600' : itemToAdd.onSale ? 'text-red-500' : 'text-blue-500'}">${itemToAdd.discountPrice}원</span>`;
      } else {
        priceHtml = itemToAdd.discountPrice + '원';
      }
      const namePrefix =
        itemToAdd.onSale && itemToAdd.suggestSale
          ? '⚡💝'
          : itemToAdd.onSale
            ? '⚡'
            : itemToAdd.suggestSale
              ? '💝'
              : '';
      newItem.innerHTML =
        '<div class="w-20 h-20 bg-gradient-black relative overflow-hidden">' +
        '  <div class="absolute top-1/2 left-1/2 w-[60%] h-[60%] bg-white/10 -translate-x-1/2 -translate-y-1/2 rotate-45"></div>' +
        '</div>' +
        '<div>' +
        `  <h3 class="text-base font-normal mb-1 tracking-tight">${namePrefix}${itemToAdd.name}</h3>` +
        '  <p class="text-xs text-gray-500 mb-0.5 tracking-wide">PRODUCT</p>' +
        `  <p class="text-xs text-black mb-3">${priceHtml}</p>` +
        '  <div class="flex items-center gap-4">' +
        `    <button class="quantity-change w-6 h-6 border border-black bg-white text-sm flex items-center justify-center transition-all hover:bg-black hover:text-white" data-product-id="${itemToAdd.id}" data-change="-1">−</button>` +
        '    <span class="quantity-number text-sm font-normal min-w-[20px] text-center tabular-nums">1</span>' +
        `    <button class="quantity-change w-6 h-6 border border-black bg-white text-sm flex items-center justify-center transition-all hover:bg-black hover:text-white" data-product-id="${itemToAdd.id}" data-change="1">+</button>` +
        '  </div>' +
        '</div>' +
        '<div class="text-right">' +
        `  <div class="text-lg mb-2 tracking-tight tabular-nums">${priceHtml}</div>` +
        `  <a class="remove-item text-2xs text-gray-500 uppercase tracking-wider cursor-pointer transition-colors border-b border-transparent hover:text-black hover:border-black" data-product-id="${itemToAdd.id}">Remove</a>` +
        '</div>';
      cartDisp.appendChild(newItem);
      itemToAdd.quantity--;
    }
    handleCalculateCartStuff();
    lastSel = selItem;
  }
});
cartDisp.addEventListener('click', function (event) {
  const tgt = event.target;
  const prodId = tgt.dataset.productId;
  const itemElem = document.getElementById(prodId);
  const qtyElem = itemElem.querySelector('.quantity-number');
  if (tgt.classList.contains('quantity-change') || tgt.classList.contains('remove-item')) {
    let prod = null;
    for (let prdIdx = 0; prdIdx < products.length; prdIdx++) {
      if (products[prdIdx].id === prodId) {
        prod = products[prdIdx];
        break;
      }
    }
    if (tgt.classList.contains('quantity-change')) {
      const qtyChange = parseInt(tgt.dataset.change);
      const currentQty = parseInt(qtyElem.textContent);
      const newQty = currentQty + qtyChange;
      if (newQty > 0 && newQty <= prod.quantity + currentQty) {
        qtyElem.textContent = newQty;
        prod.quantity -= qtyChange;
      } else if (newQty <= 0) {
        prod.quantity += currentQty;
        itemElem.remove();
      } else {
        alert('재고가 부족합니다.');
      }
    } else if (tgt.classList.contains('remove-item')) {
      const remQty = parseInt(qtyElem.textContent);
      prod.quantity += remQty;
      itemElem.remove();
    }
    handleCalculateCartStuff();
    updateSelectOptions(sel, products);
  }
});
