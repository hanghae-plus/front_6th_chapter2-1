import { LIGHTNING_DISCOUNT, LOW_TOTAL_STOCK_THRESHOLD, OUT_OF_STOCK, SUGGEST_DISCOUNT } from './domain/product';
import productManager from './domain/product';
import {
  createAddCartButton,
  createCartDisplay,
  createGridContainer,
  createHeader,
  createLeftColumn,
  createManualColumn,
  createManualOverlay,
  createManualToggle,
  createProductSelector,
  createProductSelectorOption,
  createRightColumn,
  createSelectorContainer,
  createStockInfo,
} from './elements';

let lastSelectedItem = null;

let stockInfo;
let itemCount;
let bonusPoints = 0;
let totalAmount = 0;

let productSelector;
let addCartButton;
let cartDisplay;

const PRODUCT_ONE = 'p1';
const PRODUCT_TWO = 'p2';
const PRODUCT_THREE = 'p3';
const PRODUCT_FOUR = 'p4';
const PRODUCT_FIVE = 'p5';

/**
 * 페이지 초기화. DOM 요소 생성 및 초기 렌더링, 버튼 및 이벤트 등록, 세일/추천 세일 주기적 발생 설정.
 * 전체 UI 구성
 * productList 초기화
 * onUpdateSelectOptions, handleCalculateCartStuff 호출
 * 번개세일/추천세일 setInterval 등록
 *  */

const initProducts = () => {
  productManager.setProducts([
    {
      id: PRODUCT_ONE,
      name: '버그 없애는 키보드',
      discountValue: 10000,
      originalValue: 10000,
      quantity: 50,
      onSale: false,
      suggestSale: false,
    },
    {
      id: PRODUCT_TWO,
      name: '생산성 폭발 마우스',
      discountValue: 20000,
      originalVal: 20000,
      quantity: 30,
      onSale: false,
      suggestSale: false,
    },
    {
      id: PRODUCT_THREE,
      name: '거북목 탈출 모니터암',
      discountValue: 30000,
      originalVal: 30000,
      quantity: 20,
      onSale: false,
      suggestSale: false,
    },
    {
      id: PRODUCT_FOUR,
      name: '에러 방지 노트북 파우치',
      discountValue: 15000,
      originalVal: 15000,
      quantity: 0,
      onSale: false,
      suggestSale: false,
    },
    {
      id: PRODUCT_FIVE,
      name: `코딩할 때 듣는 Lo-Fi 스피커`,
      discountValue: 25000,
      originalVal: 25000,
      quantity: 10,
      onSale: false,
      suggestSale: false,
    },
  ]);
};

function main() {
  /**  ==================== elements 시작 ================================ */
  const root = document.getElementById('app');

  const header = createHeader();
  const gridContainer = createGridContainer();
  const selectorContainer = createSelectorContainer();
  const leftColumn = createLeftColumn();
  const rightColumn = createRightColumn();

  const manualToggle = createManualToggle();
  manualToggle.onclick = function () {
    manualOverlay.classList.toggle('hidden');
    manualColumn.classList.toggle('translate-x-full');
  };

  const manualOverlay = createManualOverlay();
  manualOverlay.onclick = function (e) {
    if (e.target === manualOverlay) {
      manualOverlay.classList.add('hidden');
      manualColumn.classList.add('translate-x-full');
    }
  };

  const manualColumn = createManualColumn();

  /**  ==================== elements 끝 ================================ */

  const lightningDelay = Math.random() * 10000;
  totalAmount = 0;
  itemCount = 0;

  productSelector = createProductSelector();

  addCartButton = createAddCartButton();

  stockInfo = createStockInfo();

  cartDisplay = createCartDisplay();

  selectorContainer.appendChild(productSelector);
  selectorContainer.appendChild(addCartButton);
  selectorContainer.appendChild(stockInfo);

  leftColumn.appendChild(selectorContainer);
  leftColumn.appendChild(cartDisplay);

  sum = rightColumn.querySelector('#cart-total');

  gridContainer.appendChild(leftColumn);
  gridContainer.appendChild(rightColumn);
  manualOverlay.appendChild(manualColumn);

  root.appendChild(header);
  root.appendChild(gridContainer);
  root.appendChild(manualToggle);
  root.appendChild(manualOverlay);

  /* 데이터 준비 */
  initProducts();
  updateSelectOptions();
  calculateCart();

  /* 번개 세일 */
  setTimeout(() => {
    setInterval(() => {
      const randomIndex = Math.floor(Math.random() * productManager.getProductCount());

      const randomItem = productManager.getProductAt(randomIndex);

      if (randomItem.quantity > OUT_OF_STOCK && !randomItem.onSale) {
        randomItem.discountValue = Math.round(randomItem.originalVal * (1 - LIGHTNING_DISCOUNT));
        randomItem.onSale = true;
        alert(`⚡번개세일! ${randomItem.name}이(가) 20% 할인 중입니다!`);

        updateSelectOptions();
        doUpdatePricesInCart();
      }
    }, 30000);
  }, lightningDelay);

  /* 추천 세일 */
  setTimeout(() => {
    setInterval(() => {
      /** @todo lastSelectedItem <- 마지막 장바구니에 담긴 아이템인데 네이밍 애매. 다시 변경할 것. cart 도메인 함수 내부에서 관리 */
      if (lastSelectedItem) {
        const suggest = productManager
          .getProducts()
          .find((product) => product.id !== lastSelectedItem && product.quantity > OUT_OF_STOCK);

        if (suggest) {
          alert(`💝  ${suggest.name}은(는) 어떠세요? 지금 구매하시면 5% 추가 할인!`);
          suggest.discountValue = Math.round(suggest.discountValue * (1 - SUGGEST_DISCOUNT));
          suggest.suggestSale = true;

          updateSelectOptions();
          doUpdatePricesInCart();
        }
      }
    }, 60000);
  }, Math.random() * 20000);
}

let sum;

/* 상품 셀렉트 박스(selectedItem)의 옵션을 현재 상품 상태에 맞게 갱신 */
function updateSelectOptions() {
  productSelector.innerHTML = '';

  productManager.getProducts().map((product) => {
    const optionElement = createProductSelectorOption({
      value: product.id,
      message: productManager.getOptionMessage(product),
      disabled: product.quantity === OUT_OF_STOCK,
    });
    productSelector.appendChild(optionElement);
  });

  /** @todo style update 부분. 분리 필요 */
  if (productManager.getTotalStock() < LOW_TOTAL_STOCK_THRESHOLD) {
    productSelector.style.borderColor = 'orange';
  } else {
    productSelector.style.borderColor = '';
  }
}

/**
 * 총 상품 수량 및 가격 계산
 * 개별 할인 (10개 이상 구매), 대량 구매 할인(30개↑), 화요일 할인 적용
 * 총 할인율 및 적립 포인트 계산
 * 할인 정보 및 재고 경고 표시
 *
 * doRenderBonusPoints, handleStockInfoUpdate 호출 중
 */
function calculateCart() {
  const cartItems = cartDisplay.children;
  let subTot = 0;

  let idx;
  let originalTotal;

  let savedAmount;
  let summaryDetails;
  let totalDiv;
  let loyaltyPointsDiv;
  let points;
  let discountInfoDiv;
  let itemCountElement;
  let previousCount;
  let stockMsg;

  totalAmount = 0; //전역변수로 관리 중
  itemCount = 0; // 전역변수로 관리 중

  const itemDiscounts = [];
  const lowStockItems = [];

  for (idx = 0; idx < productManager.getProductCount(); idx++) {
    const product = productManager.getProductAt(idx);
    if (0 < product.quantity && product.quantity < 5) {
      lowStockItems.push(product.name);
    }
  }

  /** 1. 할인 적용된 가격 계산 - 번쩍 세일, 추천 세일 제외하고도 추가 할인항목 있음 */
  for (let i = 0; i < cartItems.length; i++) {
    (function () {
      let curItem;
      for (let j = 0; j < productManager.getProductCount(); j++) {
        const product = productManager.getProductAt(j);
        if (product.id === cartItems[i].id) {
          curItem = product;
          break;
        }
      }
      const qtyElem = cartItems[i].querySelector('.quantity-number');
      let q;
      let itemTot;
      let disc;
      q = parseInt(qtyElem.textContent);
      itemTot = curItem.discountValue * q;
      disc = 0;
      itemCount += q;
      subTot += itemTot;
      const itemDiv = cartItems[i];
      const priceElems = itemDiv.querySelectorAll('.text-lg, .text-xs');
      priceElems.forEach(function (elem) {
        if (elem.classList.contains('text-lg')) {
          elem.style.fontWeight = q >= 10 ? 'bold' : 'normal';
        }
      });
      if (q >= 10) {
        if (curItem.id === PRODUCT_ONE) {
          disc = 10 / 100;
        } else {
          if (curItem.id === PRODUCT_TWO) {
            disc = 15 / 100;
          } else {
            if (curItem.id === PRODUCT_THREE) {
              disc = 20 / 100;
            } else {
              if (curItem.id === PRODUCT_FOUR) {
                disc = 5 / 100;
              } else {
                if (curItem.id === PRODUCT_FIVE) {
                  disc = 25 / 100;
                }
              }
            }
          }
        }
        if (disc > 0) {
          itemDiscounts.push({ name: curItem.name, discount: disc * 100 });
        }
      }
      totalAmount += itemTot * (1 - disc);
    })();
  }

  /** 2. 총 할인율 및 적립 포인트 계산 */
  let discRate = 0;
  originalTotal = subTot;
  if (itemCount >= 30) {
    totalAmount = (subTot * 75) / 100;
    discRate = 25 / 100;
  } else {
    discRate = (subTot - totalAmount) / subTot;
  }
  const today = new Date();
  const isTuesday = today.getDay() === 2;
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

  document.getElementById('item-count').textContent = '🛍️ ' + itemCount + ' items in cart';

  /** 3. 할인 정보 및 재고 경고 표시 [view] */
  summaryDetails = document.getElementById('summary-details');
  summaryDetails.innerHTML = '';
  if (subTot > 0) {
    for (let i = 0; i < cartItems.length; i++) {
      var curItem;
      for (let j = 0; j < productManager.getProductCount(); j++) {
        const product = productManager.getProductAt(j);
        if (product.id === cartItems[i].id) {
          curItem = product;
          break;
        }
      }
      const qtyElem = cartItems[i].querySelector('.quantity-number');
      const q = parseInt(qtyElem.textContent);
      const itemTotal = curItem.discountValue * q;
      summaryDetails.innerHTML += `
        <div class="flex justify-between text-xs tracking-wide text-gray-400">
          <span>${curItem.name} x ${q}</span>
          <span>₩${itemTotal.toLocaleString()}</span>
        </div>
      `;
    }
    summaryDetails.innerHTML += `
      <div class="border-t border-white/10 my-3"></div>
      <div class="flex justify-between text-sm tracking-wide">
        <span>Subtotal</span>
        <span>₩${subTot.toLocaleString()}</span>
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
      itemDiscounts.forEach(function (item) {
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

  totalDiv = sum.querySelector('.text-2xl');
  if (totalDiv) {
    totalDiv.textContent = '₩' + Math.round(totalAmount).toLocaleString();
  }

  loyaltyPointsDiv = document.getElementById('loyalty-points');
  if (loyaltyPointsDiv) {
    points = Math.floor(totalAmount / 1000);
    if (points > 0) {
      loyaltyPointsDiv.textContent = '적립 포인트: ' + points + 'p';
      loyaltyPointsDiv.style.display = 'block';
    } else {
      loyaltyPointsDiv.textContent = '적립 포인트: 0p';
      loyaltyPointsDiv.style.display = 'block';
    }
  }

  discountInfoDiv = document.getElementById('discount-info');
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

  itemCountElement = document.getElementById('item-count');
  if (itemCountElement) {
    previousCount = parseInt(itemCountElement.textContent.match(/\d+/) || 0);
    itemCountElement.textContent = '🛍️ ' + itemCount + ' items in cart';
    if (previousCount !== itemCount) {
      itemCountElement.setAttribute('data-changed', 'true');
    }
  }

  stockMsg = '';
  for (let stockIdx = 0; stockIdx < productManager.getProductCount(); stockIdx++) {
    const item = productManager.getProductAt(stockIdx);
    if (item.quantity < 5) {
      if (item.quantity > 0) {
        stockMsg = stockMsg + item.name + ': 재고 부족 (' + item.quantity + '개 남음)\n';
      } else {
        stockMsg = stockMsg + item.name + ': 품절\n';
      }
    }
  }
  stockInfo.textContent = stockMsg;

  handleStockUpdate();
  doRenderBonusPoints();
}

/**
 * 역할: 적립 포인트 계산 및 렌더링
 * - 기본: 구매액의 0.1%
 * - 화요일이면 2배
 * - 키보드+마우스 → +50p
 * - 키보드+마우스+모니터암 → +100p
 * - 대량구매 보너스 (10/20/30개 기준)
 */
const doRenderBonusPoints = function () {
  let basePoints;
  let finalPoints;
  let pointsDetail;
  let hasKeyboard;
  let hasMouse;
  let hasMonitorArm;
  let nodes;
  if (cartDisplay.children.length === 0) {
    document.getElementById('loyalty-points').style.display = 'none';
    return;
  }
  basePoints = Math.floor(totalAmount / 1000);
  finalPoints = 0;
  pointsDetail = [];
  if (basePoints > 0) {
    finalPoints = basePoints;
    pointsDetail.push('기본: ' + basePoints + 'p');
  }
  if (new Date().getDay() === 2) {
    if (basePoints > 0) {
      finalPoints = basePoints * 2;
      pointsDetail.push('화요일 2배');
    }
  }
  hasKeyboard = false;
  hasMouse = false;
  hasMonitorArm = false;
  nodes = cartDisplay.children;
  for (const node of nodes) {
    let product = null;
    for (let pIdx = 0; pIdx < productManager.getProductCount(); pIdx++) {
      const currentProduct = productManager.getProductAt(pIdx);
      if (currentProduct.id === node.id) {
        product = currentProduct;
        break;
      }
    }
    if (!product) continue;
    if (product.id === PRODUCT_ONE) {
      hasKeyboard = true;
    } else if (product.id === PRODUCT_TWO) {
      hasMouse = true;
    } else if (product.id === PRODUCT_THREE) {
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
  bonusPoints = finalPoints;
  const ptsTag = document.getElementById('loyalty-points');
  if (ptsTag) {
    if (bonusPoints > 0) {
      ptsTag.innerHTML =
        '<div>적립 포인트: <span class="font-bold">' +
        bonusPoints +
        'p</span></div>' +
        '<div class="text-2xs opacity-70 mt-1">' +
        pointsDetail.join(', ') +
        '</div>';
      ptsTag.style.display = 'block';
    } else {
      ptsTag.textContent = '적립 포인트: 0p';
      ptsTag.style.display = 'block';
    }
  }
};

/**  재고 부족/품절 상품의 메시지를 stockInfo에 표시 */
const handleStockUpdate = () => {
  const totalStock = productManager.getTotalStock();

  if (totalStock < LOW_TOTAL_STOCK_THRESHOLD) {
    // @todo 전체 재고가 50개 미만일 경우 상품 선택 드롭다운 테두리 색상 orange로 변경
  }

  const infoMessage = productManager.getLowStockMessages();

  // @todo ui업데이트. 따로 분리
  stockInfo.textContent = infoMessage;
};

/** 장바구니 내 각 상품의 UI 가격 정보 업데이트 */
function doUpdatePricesInCart() {
  let totalCount = 0,
    j = 0;
  let cartItems;
  while (cartDisplay.children[j]) {
    const qty = cartDisplay.children[j].querySelector('.quantity-number');
    totalCount += qty ? parseInt(qty.textContent) : 0;
    j++;
  }
  totalCount = 0;
  for (j = 0; j < cartDisplay.children.length; j++) {
    totalCount += parseInt(cartDisplay.children[j].querySelector('.quantity-number').textContent);
  }
  cartItems = cartDisplay.children;
  for (let i = 0; i < cartItems.length; i++) {
    const itemId = cartItems[i].id;
    let product = null;
    for (let productIdx = 0; productIdx < productManager.getProductCount(); productIdx++) {
      const currentProduct = productManager.getProductAt(productIdx);
      if (currentProduct.id === itemId) {
        product = currentProduct;
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
          product.discountValue.toLocaleString() +
          '</span>';
        nameDiv.textContent = '⚡💝' + product.name;
      } else if (product.onSale) {
        priceDiv.innerHTML =
          '<span class="line-through text-gray-400">₩' +
          product.originalVal.toLocaleString() +
          '</span> <span class="text-red-500">₩' +
          product.discountValue.toLocaleString() +
          '</span>';
        nameDiv.textContent = '⚡' + product.name;
      } else if (product.suggestSale) {
        priceDiv.innerHTML =
          '<span class="line-through text-gray-400">₩' +
          product.originalVal.toLocaleString() +
          '</span> <span class="text-blue-500">₩' +
          product.discountValue.toLocaleString() +
          '</span>';
        nameDiv.textContent = '💝' + product.name;
      } else {
        priceDiv.textContent = '₩' + product.discountValue.toLocaleString();
        nameDiv.textContent = product.name;
      }
    }
  }
  calculateCart();
}

main();

/** 장바구니 담기 버튼 클릭 이벤트 핸들러 */
addCartButton.addEventListener('click', function () {
  const selItem = productSelector.value;
  let hasItem = false;
  for (let idx = 0; idx < productManager.getProductCount(); idx++) {
    const currentProduct = productManager.getProductAt(idx);
    if (currentProduct.id === selItem) {
      hasItem = true;
      break;
    }
  }
  if (!selItem || !hasItem) {
    return;
  }
  let itemToAdd = null;
  for (let j = 0; j < productManager.getProductCount(); j++) {
    const currentProduct = productManager.getProductAt(j);
    if (currentProduct.id === selItem) {
      itemToAdd = currentProduct;
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
          <p class="text-xs text-black mb-3">${itemToAdd.onSale || itemToAdd.suggestSale ? '<span class="line-through text-gray-400">₩' + itemToAdd.originalVal.toLocaleString() + '</span> <span class="' + (itemToAdd.onSale && itemToAdd.suggestSale ? 'text-purple-600' : itemToAdd.onSale ? 'text-red-500' : 'text-blue-500') + '">₩' + itemToAdd.discountValue.toLocaleString() + '</span>' : '₩' + itemToAdd.discountValue.toLocaleString()}</p>
          <div class="flex items-center gap-4">
            <button class="quantity-change w-6 h-6 border border-black bg-white text-sm flex items-center justify-center transition-all hover:bg-black hover:text-white" data-product-id="${itemToAdd.id}" data-change="-1">−</button>
            <span class="quantity-number text-sm font-normal min-w-[20px] text-center tabular-nums">1</span>
            <button class="quantity-change w-6 h-6 border border-black bg-white text-sm flex items-center justify-center transition-all hover:bg-black hover:text-white" data-product-id="${itemToAdd.id}" data-change="1">+</button>
          </div>
        </div>
        <div class="text-right">
          <div class="text-lg mb-2 tracking-tight tabular-nums">${itemToAdd.onSale || itemToAdd.suggestSale ? '<span class="line-through text-gray-400">₩' + itemToAdd.originalVal.toLocaleString() + '</span> <span class="' + (itemToAdd.onSale && itemToAdd.suggestSale ? 'text-purple-600' : itemToAdd.onSale ? 'text-red-500' : 'text-blue-500') + '">₩' + itemToAdd.discountValue.toLocaleString() + '</span>' : '₩' + itemToAdd.discountValue.toLocaleString()}</div>
          <a class="remove-item text-2xs text-gray-500 uppercase tracking-wider cursor-pointer transition-colors border-b border-transparent hover:text-black hover:border-black" data-product-id="${itemToAdd.id}">Remove</a>
        </div>
      `;
      cartDisplay.appendChild(newItem);
      itemToAdd.quantity--;
    }
    calculateCart();
    // 장바구니에 마지막으로 담은 아이템
    lastSelectedItem = selItem;
  }
});

/** 장바구니에서 수량 조절(±), 제거 이벤트 처리 */
cartDisplay.addEventListener('click', function (event) {
  const tgt = event.target;
  if (tgt.classList.contains('quantity-change') || tgt.classList.contains('remove-item')) {
    const prodId = tgt.dataset.productId;
    const itemElem = document.getElementById(prodId);
    let prod = null;
    for (let prdIdx = 0; prdIdx < productManager.getProductCount(); prdIdx++) {
      const currentProduct = productManager.getProductAt(prdIdx);
      if (currentProduct.id === prodId) {
        prod = currentProduct;
        break;
      }
    }
    if (tgt.classList.contains('quantity-change')) {
      const qtyChange = parseInt(tgt.dataset.change);
      var qtyElem = itemElem.querySelector('.quantity-number');
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
      var qtyElem = itemElem.querySelector('.quantity-number');
      const remQty = parseInt(qtyElem.textContent);
      prod.quantity += remQty;
      itemElem.remove();
    }
    if (prod && prod.quantity < 5) {
    }
    calculateCart();
    updateSelectOptions();
  }
});
