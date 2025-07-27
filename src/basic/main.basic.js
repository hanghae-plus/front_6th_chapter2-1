// Products 상수 import
import { getProductList } from './constants/Products.js';
// 할인 정책 import

// 포인트 정책 import
// UI 상수 import
import { ALERT_UI, formatMessage, generateManualHTML } from './constants/UIConstants.js';

// 가격 계산 엔진 import
import { PriceCalculator } from './calculations/PriceCalculator.js';
// 할인 엔진 import
import { DiscountEngine } from './calculations/DiscountEngine.js';
// 포인트 계산 엔진 import
import { PointsCalculator } from './calculations/PointsCalculator.js';
// 재고 계산 엔진 import
import { StockCalculator } from './calculations/StockCalculator.js';
// 상품 선택 컴포넌트 import
import { ProductSelector } from './components/ProductSelector.js';
// 장바구니 컴포넌트 import
import { CartEventHandler } from './components/CartEventHandler.js';
import { CartItem } from './components/CartItem.js';
import { OrderSummary } from './components/OrderSummary.js';

let prodList;
let bonusPts = 0;
let stockInfo;
let itemCnt;
let lastSel;
let sel;
let addBtn;
let totalAmt = 0;
let cartDisp;
function main() {
  var root;
  let header;
  let gridContainer;
  let leftColumn;
  let selectorContainer;
  let rightColumn;
  let manualToggle;
  let manualOverlay;
  let manualColumn;
  let lightningDelay;
  totalAmt = 0;
  itemCnt = 0;
  lastSel = null;
  // Products.js의 상수를 사용하여 초기화
  prodList = getProductList().map(product => ({
    id: product.id,
    name: product.name,
    val: product.price,
    originalVal: product.price,
    q: product.stock,
    onSale: false,
    suggestSale: false,
  }));
  var root = document.getElementById('app');
  header = document.createElement('div');
  header.className = 'mb-8';
  header.innerHTML = `
    <h1 class="text-xs font-medium tracking-extra-wide uppercase mb-2">🛒 Hanghae Online Store</h1>
    <div class="text-5xl tracking-tight leading-none">Shopping Cart</div>
    <p id="item-count" class="text-sm text-gray-500 font-normal mt-3">🛍️ 0 items in cart</p>
  `;
  sel = document.createElement('select');
  sel.id = 'product-select';
  gridContainer = document.createElement('div');
  leftColumn = document.createElement('div');
  leftColumn['className'] = 'bg-white border border-gray-200 p-8 overflow-y-auto';
  selectorContainer = document.createElement('div');
  selectorContainer.className = 'mb-6 pb-6 border-b border-gray-200';
  sel.className = 'w-full p-3 border border-gray-300 rounded-lg text-base mb-3';
  gridContainer.className =
    'grid grid-cols-1 lg:grid-cols-[1fr_360px] gap-6 flex-1 overflow-hidden';
  addBtn = document.createElement('button');
  stockInfo = document.createElement('div');
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
  cartDisp = document.createElement('div');
  leftColumn.appendChild(cartDisp);
  cartDisp.id = 'cart-items';
  rightColumn = document.createElement('div');
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
  sum = rightColumn.querySelector('#cart-total');
  manualToggle = document.createElement('button');
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
  manualOverlay = document.createElement('div');
  manualOverlay.className = 'fixed inset-0 bg-black/50 z-40 hidden transition-opacity duration-300';
  manualOverlay.onclick = function (e) {
    if (e.target === manualOverlay) {
      manualOverlay.classList.add('hidden');
      manualColumn.classList.add('translate-x-full');
    }
  };
  manualColumn = document.createElement('div');
  manualColumn.className =
    'fixed right-0 top-0 h-full w-80 bg-white shadow-2xl p-6 overflow-y-auto z-50 transform translate-x-full transition-transform duration-300';
  manualColumn.innerHTML = generateManualHTML();
  gridContainer.appendChild(leftColumn);
  gridContainer.appendChild(rightColumn);
  manualOverlay.appendChild(manualColumn);
  root.appendChild(header);
  root.appendChild(gridContainer);
  root.appendChild(manualToggle);
  root.appendChild(manualOverlay);
  let initStock = 0;
  for (let i = 0; i < prodList.length; i++) {
    initStock += prodList[i].q;
  }
  onUpdateSelectOptions();
  handleCalculateCartStuff();
  lightningDelay = Math.random() * 10000;
  setTimeout(() => {
    setInterval(function () {
      const luckyIdx = Math.floor(Math.random() * prodList.length);
      const luckyItem = prodList[luckyIdx];
      if (luckyItem.q > 0 && !luckyItem.onSale) {
        luckyItem.val = Math.round((luckyItem.originalVal * 80) / 100);
        luckyItem.onSale = true;
        alert(formatMessage(ALERT_UI.FLASH_SALE, { productName: luckyItem.name }));
        onUpdateSelectOptions();
        doUpdatePricesInCart();
      }
    }, 30000);
  }, lightningDelay);
  setTimeout(function () {
    setInterval(function () {
      if (cartDisp.children.length === 0) {
      }
      if (lastSel) {
        let suggest = null;
        for (let k = 0; k < prodList.length; k++) {
          if (prodList[k].id !== lastSel) {
            if (prodList[k].q > 0) {
              if (!prodList[k].suggestSale) {
                suggest = prodList[k];
                break;
              }
            }
          }
        }
        if (suggest) {
          alert(formatMessage(ALERT_UI.RECOMMEND_SALE, { productName: suggest.name }));
          suggest.val = Math.round((suggest.val * (100 - 5)) / 100);
          suggest.suggestSale = true;
          onUpdateSelectOptions();
          doUpdatePricesInCart();
        }
      }
    }, 60000);
  }, Math.random() * 20000);
}
let sum;
function onUpdateSelectOptions() {
  // ProductSelector 컴포넌트를 사용하여 드롭다운 렌더링 (placeholder 없이)
  const selectHTML = ProductSelector.render(prodList, {
    id: 'product-select',
    className: 'w-full p-3 border border-gray-300 rounded-lg text-base mb-3',
    placeholder: '', // 기존 로직과 동일하게 placeholder 없음
  });

  // 생성된 select HTML에서 innerHTML 부분만 추출
  const tempDiv = document.createElement('div');
  tempDiv.innerHTML = selectHTML;
  const newSelect = tempDiv.querySelector('select');

  // 기존 select의 innerHTML을 새로운 옵션들로 교체
  sel.innerHTML = newSelect.innerHTML;

  // ProductSelector에서 이미 처리된 스타일 적용
  // (전체 재고 50개 미만 시 주황색 테두리)
  const totalStock = prodList.reduce((sum, product) => sum + (product.q || 0), 0);
  if (totalStock < 50) {
    sel.style.borderColor = 'orange';
  } else {
    sel.style.borderColor = '';
  }
}
function handleCalculateCartStuff() {
  let cartItems;
  let subTot;
  let itemDiscounts;
  let lowStockItems;
  let idx;
  let originalTotal;
  let bulkDisc;
  let itemDisc;
  let savedAmount;
  let summaryDetails;
  let totalDiv;
  let loyaltyPointsDiv;
  let points;
  let discountInfoDiv;
  let itemCountElement;
  let previousCount;
  let stockMsg;
  let pts;
  let hasP1;
  let hasP2;
  let loyaltyDiv;
  let tuesdaySpecial; // OrderSummary 통합으로 추가

  // DOM에서 장바구니 데이터 추출 및 PriceCalculator 형식으로 변환
  cartItems = cartDisp.children;
  const priceCalculatorItems = [];

  // 전역 변수 초기화
  totalAmt = 0;
  itemCnt = 0;

  // 재고 부족 상품 체크 (기존 로직 유지)
  lowStockItems = [];
  for (idx = 0; idx < prodList.length; idx++) {
    if (prodList[idx].q < 5 && prodList[idx].q > 0) {
      lowStockItems.push(prodList[idx].name);
    }
  }

  // DOM에서 장바구니 아이템 추출하여 PriceCalculator 형식으로 변환
  for (let i = 0; i < cartItems.length; i++) {
    let curItem;
    for (let j = 0; j < prodList.length; j++) {
      if (prodList[j].id === cartItems[i].id) {
        curItem = prodList[j];
        break;
      }
    }

    const qtyElem = cartItems[i].querySelector('.quantity-number');
    const quantity = parseInt(qtyElem.textContent);

    // PriceCalculator용 아이템 추가
    priceCalculatorItems.push({
      id: curItem.id,
      quantity: quantity,
      price: curItem.val,
      product: curItem,
    });

    // 전역 변수 업데이트 (기존 코드에서 필요)
    itemCnt += quantity;

    // UI 업데이트 (할인 강조 표시)
    const itemDiv = cartItems[i];
    const priceElems = itemDiv.querySelectorAll('.text-lg, .text-xs');
    priceElems.forEach(function (elem) {
      if (elem.classList.contains('text-lg')) {
        elem.style.fontWeight = quantity >= 10 ? 'bold' : 'normal';
      }
    });
  }

  // PriceCalculator를 사용하여 기본 가격 및 할인 계산
  const priceResult = PriceCalculator.calculateFinalPrice(priceCalculatorItems, new Date());

  // 특별 할인 조합이 있는지 확인 (번개세일 + 추천할인)
  const hasFlashAndRecommend = priceCalculatorItems.some(
    item => item.product?.onSale && item.product?.suggestSale
  );

  let finalResult = priceResult;

  // 번개세일+추천할인 조합이 있을 때만 DiscountEngine 사용
  if (hasFlashAndRecommend) {
    // DiscountEngine을 사용하여 복잡한 할인 조합 계산 (번개세일+추천할인 등)
    const discountContext = {
      date: new Date(),
      isFlashSale: priceCalculatorItems.some(item => item.product?.onSale),
      recommendedProduct: priceCalculatorItems.find(item => item.product?.suggestSale)?.id,
    };
    const discountEngineResult = DiscountEngine.applyDiscountPolicies(
      priceCalculatorItems,
      discountContext
    );

    // DiscountEngine 결과가 더 유리한 경우에만 적용
    if (discountEngineResult.totalSavings > priceResult.totalSavings) {
      finalResult = {
        subtotal: priceResult.subtotal,
        finalAmount: discountEngineResult.finalAmount,
        totalSavings: discountEngineResult.totalSavings,
        appliedDiscounts: discountEngineResult.appliedDiscounts,
        // 기존 UI 호환성을 위한 변환
        individualDiscounts: priceResult.individualDiscounts, // 기존 개별 할인 유지
        bulkDiscount: priceResult.bulkDiscount, // 기존 대량 할인 유지
        tuesdayDiscount: priceResult.tuesdayDiscount, // 기존 화요일 할인 유지
        // 특별 할인 정보 추가
        specialDiscounts: discountEngineResult.appliedDiscounts.filter(d =>
          ['flash', 'recommend', 'combo'].includes(d.type)
        ),
      };
    } else {
      // PriceCalculator가 더 유리하거나 동일한 경우
      finalResult = {
        ...priceResult,
        appliedDiscounts: [],
        specialDiscounts: [],
      };
    }
  } else {
    // 특별 할인 조합이 없으면 PriceCalculator 결과 그대로 사용
    finalResult = {
      ...priceResult,
      appliedDiscounts: [],
      specialDiscounts: [],
    };
  }

  // 계산 결과를 기존 변수에 할당 (기존 UI 코드 호환성)
  subTot = finalResult.subtotal;
  totalAmt = finalResult.finalAmount;
  originalTotal = subTot;

  // 할인 정보 변환 (기존 UI에서 사용하는 형식으로)
  itemDiscounts = finalResult.individualDiscounts.map(discount => ({
    name: discount.productName,
    discount: Math.round(discount.discountRate * 100),
  }));

  const discRate = finalResult.totalSavings > 0 ? finalResult.totalSavings / subTot : 0;

  // 기존 UI 업데이트 로직 유지
  document.getElementById('item-count').textContent = '🛍️ ' + itemCnt + ' items in cart';

  // OrderSummary 컴포넌트를 사용하여 주문 요약 렌더링
  const cartItemsForSummary = [];
  if (subTot > 0) {
    for (let i = 0; i < cartItems.length; i++) {
      var curItem;
      for (let j = 0; j < prodList.length; j++) {
        if (prodList[j].id === cartItems[i].id) {
          curItem = prodList[j];
          break;
        }
      }
      const qtyElem = cartItems[i].querySelector('.quantity-number');
      const q = parseInt(qtyElem.textContent);

      cartItemsForSummary.push({
        id: curItem.id,
        product: curItem,
        quantity: q,
        price: curItem.val,
      });
    }
  }

  // PointsCalculator 결과 얻기 (doRenderBonusPoints에서 가져옴)
  const pointsResult = PointsCalculator.getTotalPoints(cartItemsForSummary, totalAmt, {
    date: new Date(),
  });

  // OrderSummary용 데이터 구성
  const orderData = OrderSummary.transformCalculationResults(
    {
      priceResult: finalResult,
      pointsResult: pointsResult,
      discountResult: { specialDiscounts: finalResult.specialDiscounts || [] },
      context: { isTuesday: new Date().getDay() === 2 },
    },
    cartItemsForSummary
  );

  // OrderSummary 렌더링
  summaryDetails = document.getElementById('summary-details');
  discountInfoDiv = document.getElementById('discount-info');
  loyaltyPointsDiv = document.getElementById('loyalty-points');
  tuesdaySpecial = document.getElementById('tuesday-special');

  if (subTot > 0) {
    // OrderSummary로 주문 상세 내역 생성
    const summaryHTML = OrderSummary.render(orderData, {
      showDetailedBreakdown: true,
      highlightSavings: false, // 별도 섹션에서 처리
      showPointsPreview: false, // 별도 섹션에서 처리
    });
    summaryDetails.innerHTML = summaryHTML;

    // 할인 정보 섹션 (기존 위치 유지)
    if (discRate > 0 && totalAmt > 0) {
      const savingsHTML = OrderSummary.generateSavingsInfo(orderData.pricing);
      discountInfoDiv.innerHTML = savingsHTML;
    } else {
      discountInfoDiv.innerHTML = '';
    }

    // 포인트 정보 섹션 (기존 위치 유지)
    const pointsHTML = OrderSummary.generatePointsInfo(orderData.points);
    if (pointsHTML) {
      loyaltyPointsDiv.innerHTML = pointsHTML;
      loyaltyPointsDiv.style.display = 'block';
    } else {
      loyaltyPointsDiv.textContent = '적립 포인트: 0p';
      loyaltyPointsDiv.style.display = 'block';
    }

    // 화요일 배너 (기존 위치 유지)
    if (finalResult.tuesdayDiscount.isTuesday && finalResult.tuesdayDiscount.discountAmount > 0) {
      tuesdaySpecial.classList.remove('hidden');
    } else {
      tuesdaySpecial.classList.add('hidden');
    }
  } else {
    // 빈 장바구니 상태
    summaryDetails.innerHTML = '';
    discountInfoDiv.innerHTML = '';
    loyaltyPointsDiv.textContent = '적립 포인트: 0p';
    loyaltyPointsDiv.style.display = 'block';
    tuesdaySpecial.classList.add('hidden');
  }

  // 최종 금액 표시 (기존 로직 유지)
  totalDiv = sum.querySelector('.text-2xl');
  if (totalDiv) {
    totalDiv.textContent = '₩' + Math.round(totalAmt).toLocaleString();
  }

  itemCountElement = document.getElementById('item-count');
  if (itemCountElement) {
    previousCount = parseInt(itemCountElement.textContent.match(/\d+/) || 0);
    itemCountElement.textContent = '🛍️ ' + itemCnt + ' items in cart';
    if (previousCount !== itemCnt) {
      itemCountElement.setAttribute('data-changed', 'true');
    }
  }

  // StockCalculator를 사용하여 재고 경고 메시지 생성
  const stockWarnings = StockCalculator.generateStockWarnings(prodList);
  stockInfo.textContent = stockWarnings.summary;
  doRenderBonusPoints();
}
var doRenderBonusPoints = function () {
  if (cartDisp.children.length === 0) {
    document.getElementById('loyalty-points').style.display = 'none';
    return;
  }

  // DOM에서 장바구니 데이터를 PointsCalculator 형식으로 변환
  const cartItemsForPoints = [];
  const cartNodes = cartDisp.children;

  for (const cartNode of cartNodes) {
    let cartProduct = null;
    for (let cIdx = 0; cIdx < prodList.length; cIdx++) {
      if (prodList[cIdx].id === cartNode.id) {
        cartProduct = prodList[cIdx];
        break;
      }
    }
    if (cartProduct) {
      const cartQuantity = parseInt(cartNode.querySelector('span').textContent) || 0;
      cartItemsForPoints.push({
        id: cartProduct.id,
        quantity: cartQuantity,
        price: cartProduct.val,
        product: cartProduct,
      });
    }
  }

  // PointsCalculator를 사용하여 모든 포인트 계산
  const pointsResult = PointsCalculator.getTotalPoints(cartItemsForPoints, totalAmt, {
    date: new Date(),
  });

  // 계산 결과를 전역 변수에 할당 (기존 코드 호환성)
  bonusPts = pointsResult.total;

  // UI 업데이트
  const ptsTag = document.getElementById('loyalty-points');
  if (ptsTag) {
    if (bonusPts > 0) {
      ptsTag.innerHTML =
        '<div>적립 포인트: <span class="font-bold">' +
        bonusPts +
        'p</span></div>' +
        '<div class="text-2xs opacity-70 mt-1">' +
        pointsResult.messages.join(', ') +
        '</div>';
      ptsTag.style.display = 'block';
    } else {
      ptsTag.textContent = '적립 포인트: 0p';
      ptsTag.style.display = 'block';
    }
  }
};
function onGetStockTotal() {
  // StockCalculator를 사용하여 전체 재고 통계 계산
  const stockSummary = StockCalculator.getStockSummary(prodList);
  return stockSummary.totalStock;
}
const handleStockInfoUpdate = function () {
  // StockCalculator를 사용하여 재고 경고 메시지 생성
  const stockWarnings = StockCalculator.generateStockWarnings(prodList);

  // DOM 업데이트 (UI 조작만 유지)
  stockInfo.textContent = stockWarnings.summary;
};
function doUpdatePricesInCart() {
  let totalCount = 0,
    j = 0;
  let cartItems;
  while (cartDisp.children[j]) {
    const qty = cartDisp.children[j].querySelector('.quantity-number');
    totalCount += qty ? parseInt(qty.textContent) : 0;
    j++;
  }
  totalCount = 0;
  for (j = 0; j < cartDisp.children.length; j++) {
    totalCount += parseInt(cartDisp.children[j].querySelector('.quantity-number').textContent);
  }
  cartItems = cartDisp.children;
  for (let i = 0; i < cartItems.length; i++) {
    const itemId = cartItems[i].id;
    let product = null;
    for (let productIdx = 0; productIdx < prodList.length; productIdx++) {
      if (prodList[productIdx].id === itemId) {
        product = prodList[productIdx];
        break;
      }
    }
    if (product) {
      const priceDiv = cartItems[i].querySelector('.text-lg');
      const nameDiv = cartItems[i].querySelector('h3');
      if (product.onSale && product.suggestSale) {
        priceDiv.innerHTML =
          '<span class="line-through text-gray-400">₩' +
          product.originalVal.toLocaleString() +
          '</span> <span class="text-purple-600">₩' +
          product.val.toLocaleString() +
          '</span>';
        nameDiv.textContent = '⚡💝' + product.name;
      } else if (product.onSale) {
        priceDiv.innerHTML =
          '<span class="line-through text-gray-400">₩' +
          product.originalVal.toLocaleString() +
          '</span> <span class="text-red-500">₩' +
          product.val.toLocaleString() +
          '</span>';
        nameDiv.textContent = '⚡' + product.name;
      } else if (product.suggestSale) {
        priceDiv.innerHTML =
          '<span class="line-through text-gray-400">₩' +
          product.originalVal.toLocaleString() +
          '</span> <span class="text-blue-500">₩' +
          product.val.toLocaleString() +
          '</span>';
        nameDiv.textContent = '💝' + product.name;
      } else {
        priceDiv.textContent = '₩' + product.val.toLocaleString();
        nameDiv.textContent = product.name;
      }
    }
  }
  handleCalculateCartStuff();
}
main();
addBtn.addEventListener('click', function () {
  const selItem = sel.value;
  let hasItem = false;
  for (let idx = 0; idx < prodList.length; idx++) {
    if (prodList[idx].id === selItem) {
      hasItem = true;
      break;
    }
  }
  if (!selItem || !hasItem) {
    return;
  }
  let itemToAdd = null;
  for (let j = 0; j < prodList.length; j++) {
    if (prodList[j].id === selItem) {
      itemToAdd = prodList[j];
      break;
    }
  }
  if (itemToAdd && itemToAdd.q > 0) {
    const item = document.getElementById(itemToAdd['id']);
    if (item) {
      const qtyElem = item.querySelector('.quantity-number');
      const newQty = parseInt(qtyElem['textContent']) + 1;
      if (newQty <= itemToAdd.q + parseInt(qtyElem.textContent)) {
        qtyElem.textContent = newQty;
        itemToAdd['q']--;
      } else {
        alert(ALERT_UI.STOCK_EXCEEDED);
      }
    } else {
      // CartItem 컴포넌트를 사용하여 새 아이템 생성
      const cartItemData = {
        product: itemToAdd,
        quantity: 1,
        discounts: {},
        subtotal: itemToAdd.val,
        stock: itemToAdd.q,
      };

      const newItemHTML = CartItem.render(cartItemData);
      cartDisp.insertAdjacentHTML('beforeend', newItemHTML);
      itemToAdd.q--;
    }
    handleCalculateCartStuff();
    lastSel = selItem;
  }
});

// CartEventHandler를 사용하여 장바구니 이벤트 처리
const cartEventCallbacks = CartEventHandler.createMainBasicCompatibleCallbacks(
  prodList,
  handleCalculateCartStuff,
  onUpdateSelectOptions
);

// 장바구니 이벤트 리스너 설정
CartEventHandler.setupEventListeners(cartDisp, cartEventCallbacks);
