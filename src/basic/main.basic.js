import {
  KEYBOARD_ID,
  MOUSE_ID,
  MONITOR_ID,
  HEADPHONE_ID,
  SPEAKER_ID,
} from '../constants/productId.js';
import {
  QUANTITY_THRESHOLDS,
  DISCOUNT_RATES,
  POINT_RATES,
  STOCK_THRESHOLDS,
} from '../constants/shopPolicy.js';
import { createManual } from '../components/Manual/index.js';
import { createManualToggle } from '../components/ManualToggle.js';
import { createHeader } from '../components/Header.js';
import { createProductSelector } from '../components/ProductSelector.js';
import { createDiscountInfo } from '../components/DiscountInfo.js';
import {
  createGridContainer,
  createLeftColumn,
  createRightColumn,
} from '../components/Layout.js';
import { createCartDisplay } from '../components/CartDisplay/index.js';
import { formatPrice } from '../utils/format.js';
import { createPriceDisplay } from '../components/PriceDisplay.js';
import { createProductOptions } from '../components/ProductOptions.js';
import { createPointsDisplay } from '../components/PointsDisplay.js';
import { createOrderSummary } from '../components/OrderSummary/index.js';
import { startLightningSale } from '../services/lightningSale.js';
import { startSuggestSale } from '../services/suggestSale.js';

let prodList = [
  {
    id: KEYBOARD_ID,
    name: '버그 없애는 키보드',
    val: 10000,
    originalVal: 10000,
    q: 50,
    onSale: false,
    suggestSale: false,
  },
  {
    id: MOUSE_ID,
    name: '생산성 폭발 마우스',
    val: 20000,
    originalVal: 20000,
    q: 30,
    onSale: false,
    suggestSale: false,
  },
  {
    id: MONITOR_ID,
    name: '거북목 탈출 모니터암',
    val: 30000,
    originalVal: 30000,
    q: 20,
    onSale: false,
    suggestSale: false,
  },
  {
    id: HEADPHONE_ID,
    name: '에러 방지 노트북 파우치',
    val: 15000,
    originalVal: 15000,
    q: 0,
    onSale: false,
    suggestSale: false,
  },
  {
    id: SPEAKER_ID,
    name: `코딩할 때 듣는 Lo-Fi 스피커`,
    val: 25000,
    originalVal: 25000,
    q: 10,
    onSale: false,
    suggestSale: false,
  },
];
// 마지막 선택 상품 상태 관리
const lastSelectionState = {
  value: null,
  get: () => lastSelectionState.value,
  set: (newValue) => {
    lastSelectionState.value = newValue;
  },
};

// 모든 전역 변수 제거 완료!

const findProductById = (productId) =>
  prodList.find((product) => product.id === productId);

const getProductDiscount = (productId) => {
  const discountMap = {
    [KEYBOARD_ID]: DISCOUNT_RATES.PRODUCT.KEYBOARD,
    [MOUSE_ID]: DISCOUNT_RATES.PRODUCT.MOUSE,
    [MONITOR_ID]: DISCOUNT_RATES.PRODUCT.MONITOR_ARM,
    [HEADPHONE_ID]: DISCOUNT_RATES.PRODUCT.LAPTOP_POUCH,
    [SPEAKER_ID]: DISCOUNT_RATES.PRODUCT.SPEAKER,
  };
  return discountMap[productId] || 0;
};

const getBulkBonus = (itemCount) => {
  if (itemCount >= QUANTITY_THRESHOLDS.BONUS_LARGE) {
    return {
      points: POINT_RATES.BULK_BONUS.LARGE,
      threshold: QUANTITY_THRESHOLDS.BONUS_LARGE,
    };
  } else if (itemCount >= QUANTITY_THRESHOLDS.BONUS_MEDIUM) {
    return {
      points: POINT_RATES.BULK_BONUS.MEDIUM,
      threshold: QUANTITY_THRESHOLDS.BONUS_MEDIUM,
    };
  } else if (itemCount >= QUANTITY_THRESHOLDS.BONUS_SMALL) {
    return {
      points: POINT_RATES.BULK_BONUS.SMALL,
      threshold: QUANTITY_THRESHOLDS.BONUS_SMALL,
    };
  }
  return null;
};

const getQuantityFromElement = (element) => parseInt(element.textContent) || 0;

function main() {
  let root;
  let header;
  let gridContainer;
  let leftColumn;
  let selectorContainer;
  let rightColumn;

  root = document.getElementById('app');
  header = createHeader({ itemCount: 0 });
  gridContainer = createGridContainer();
  leftColumn = createLeftColumn();
  selectorContainer = createProductSelector();
  leftColumn.appendChild(selectorContainer);
  const cartDisp = createCartDisplay();
  leftColumn.appendChild(cartDisp);
  rightColumn = createRightColumn();

  const orderSummaryElement = createOrderSummary({
    subTot: 0,
    cartItems: [],
    itemCnt: 0,
    itemDiscounts: [],
    isTuesday: false,
    totalAmt: 0,
    findProductById,
    getQuantityFromElement,
  });

  rightColumn.appendChild(orderSummaryElement);

  // 매뉴얼 컴포넌트 생성
  const manual = createManual();
  const manualToggle = createManualToggle();

  // Manual 관련 이벤트 핸들러
  const manualCloseHandler = function () {
    manual.classList.add('hidden');
    manual.querySelector('.transform').classList.add('translate-x-full');
  };

  const manualToggleHandler = function () {
    manual.classList.toggle('hidden');
    manual.querySelector('.transform').classList.toggle('translate-x-full');
  };

  // setupEventListeners 패턴으로 통일
  manualToggle.setupEventListeners({ onToggle: manualToggleHandler });
  manual.setupEventListeners({ onClose: manualCloseHandler });
  selectorContainer.setupEventListeners({ onAddToCart: handleAddToCart });
  cartDisp.setupEventListeners({
    handleQuantityChange,
    handleRemoveItem,
  });

  gridContainer.appendChild(leftColumn);
  gridContainer.appendChild(rightColumn);
  root.appendChild(header);
  root.appendChild(gridContainer);
  root.appendChild(manualToggle);
  root.appendChild(manual);
  onUpdateSelectOptions();

  // 서비스 시작
  startLightningSale(prodList, onUpdateSelectOptions, handlePriceUpdate);
  startSuggestSale(
    prodList,
    lastSelectionState.get,
    onUpdateSelectOptions,
    handlePriceUpdate
  );
}
function onUpdateSelectOptions(
  productSelect = document.getElementById('product-select')
) {
  createProductOptions(productSelect, prodList, STOCK_THRESHOLDS);
}
function calculateCartTotals(cartItems) {
  const result = { subTot: 0, itemDiscounts: [], totalAmt: 0, itemCnt: 0 };

  for (const cartItem of cartItems) {
    const product = findProductById(cartItem.id);
    const quantity = getQuantityFromElement(
      cartItem.querySelector('.quantity-number')
    );
    const itemTotal = product.val * quantity;

    const discount =
      quantity >= QUANTITY_THRESHOLDS.INDIVIDUAL_DISCOUNT
        ? getProductDiscount(product.id)
        : 0;

    if (discount > 0) {
      result.itemDiscounts.push({
        name: product.name,
        discount: discount * 100,
      });
    }

    result.subTot += itemTotal;
    result.totalAmt += itemTotal * (1 - discount);
    result.itemCnt += quantity;
  }

  return result;
}

function calculateDiscounts(subTot, totalAmt, itemCnt) {
  const originalTotal = subTot;
  const isTuesday = new Date().getDay() === 2;

  // 대량구매 할인 적용
  const { finalTotal: bulkDiscountedTotal, discRate: bulkDiscRate } =
    itemCnt >= QUANTITY_THRESHOLDS.BONUS_LARGE
      ? {
          finalTotal: subTot * (1 - DISCOUNT_RATES.BULK),
          discRate: DISCOUNT_RATES.BULK,
        }
      : { finalTotal: totalAmt, discRate: (subTot - totalAmt) / subTot };

  // 화요일 특가 추가 적용
  const finalTotal =
    isTuesday && bulkDiscountedTotal > 0
      ? bulkDiscountedTotal * (1 - DISCOUNT_RATES.TUESDAY)
      : bulkDiscountedTotal;

  const discRate =
    isTuesday && finalTotal !== bulkDiscountedTotal
      ? 1 - finalTotal / originalTotal
      : bulkDiscRate;

  return { discRate, originalTotal, finalTotal, isTuesday };
}

function updateOrderSummary(cartData, discountData) {
  const { subTot, itemDiscounts, itemCnt, cartItems } = cartData;
  const { discRate, originalTotal, finalTotal, isTuesday } = discountData;

  // updateTuesdaySpecial(isTuesday, finalTotal)
  const tuesdaySpecial = document.getElementById('tuesday-special');
  tuesdaySpecial.classList.toggle('hidden', !(isTuesday && finalTotal > 0));

  // updateItemCount(itemCnt)
  const itemCountElement = document.getElementById('item-count');
  if (itemCountElement) {
    const previousCount = parseInt(
      itemCountElement.textContent.match(/\d+/) || 0
    );
    itemCountElement.textContent = `🛍️ ${itemCnt} items in cart`;
    if (previousCount !== itemCnt) {
      itemCountElement.setAttribute('data-changed', 'true');
    }
  }

  // replaceOrderSummary(cartData, discountData)
  const rightColumn = document.querySelector('.right-column');
  rightColumn.querySelector('.order-summary-section')?.remove();

  const newOrderSummary = createOrderSummary({
    subTot,
    cartItems,
    itemCnt,
    itemDiscounts,
    isTuesday,
    totalAmt: finalTotal,
    discRate,
    originalTotal,
    findProductById,
    getQuantityFromElement,
  });
  newOrderSummary.classList.add('order-summary-section');
  rightColumn.appendChild(newOrderSummary);

  // updateCartTotal(finalTotal)
  const totalDiv = rightColumn.querySelector('#cart-total .text-2xl');
  if (totalDiv) {
    totalDiv.textContent = formatPrice(finalTotal);
  }

  // updateDiscountInfo(discRate, finalTotal, originalTotal)
  const discountInfoDiv = document.getElementById('discount-info');
  discountInfoDiv.innerHTML = '';
  discountInfoDiv.appendChild(
    createDiscountInfo({
      discRate,
      totalAmt: finalTotal,
      originalTotal,
      formatPrice,
    })
  );

  return finalTotal;
}

let doRenderBonusPoints = function (totalAmt, itemCnt) {
  const cartDisp = document.getElementById('cart-items');
  const nodes = cartDisp.children;

  if (nodes.length === 0) {
    document.getElementById('loyalty-points').style.display = 'none';
    return;
  }

  let basePoints = Math.floor(totalAmt * POINT_RATES.BASE_RATE);
  let finalPoints = basePoints;
  let pointsDetail = [];

  let hasKeyboard = false;
  let hasMouse = false;
  let hasMonitorArm = false;

  if (basePoints > 0) {
    pointsDetail.push('기본: ' + basePoints + 'p');

    // 화요일 보너스 체크
    if (new Date().getDay() === 2) {
      finalPoints = basePoints * POINT_RATES.TUESDAY_MULTIPLIER;
      pointsDetail.push(`화요일 ${POINT_RATES.TUESDAY_MULTIPLIER}배`);
    }
  }
  // 세트 상품 체크를 한 번에 처리
  for (const node of nodes) {
    const product = findProductById(node.id);
    if (!product) continue;
    if (product.id === KEYBOARD_ID) {
      hasKeyboard = true;
    } else if (product.id === MOUSE_ID) {
      hasMouse = true;
    } else if (product.id === MONITOR_ID) {
      hasMonitorArm = true;
    }
  }
  // 세트 보너스 포인트 계산
  if (hasKeyboard && hasMouse) {
    finalPoints += POINT_RATES.SETS.KEYBOARD_MOUSE;
    pointsDetail.push(
      `키보드+마우스 세트 +${POINT_RATES.SETS.KEYBOARD_MOUSE}p`
    );
  }

  // 풀세트 보너스 포인트 계산 (키보드+마우스+모니터암)
  if (hasKeyboard && hasMouse && hasMonitorArm) {
    finalPoints += POINT_RATES.SETS.FULL_SET;
    pointsDetail.push(`풀세트 구매 +${POINT_RATES.SETS.FULL_SET}p`);
  }

  // 대량구매 보너스 포인트 계산
  const bulkBonus = getBulkBonus(itemCnt);
  if (bulkBonus) {
    finalPoints += bulkBonus.points;
    pointsDetail.push(
      `대량구매(${bulkBonus.threshold}개+) +${bulkBonus.points}p`
    );
  }
  const bonusPts = finalPoints;
  const ptsTag = document.getElementById('loyalty-points');

  // PointsDisplay 컴포넌트 생성 및 DOM에 추가
  const pointsDisplay = createPointsDisplay({
    bonusPoints: bonusPts,
    pointsDetail: pointsDetail,
  });

  // DOM 조작 최적화: 기존 내용이 있으면 교체, 없으면 추가
  if (ptsTag.firstChild) {
    ptsTag.replaceChild(pointsDisplay, ptsTag.firstChild);
  } else {
    ptsTag.appendChild(pointsDisplay);
  }
  ptsTag.style.display = 'block';
};
let handleStockInfoUpdate = function () {
  let infoMsg = '';
  prodList.forEach(function (item) {
    if (item.q < 5) {
      if (item.q > 0) {
        infoMsg = infoMsg + item.name + ': 재고 부족 (' + item.q + '개 남음)\n';
      } else {
        infoMsg = infoMsg + item.name + ': 품절\n';
      }
    }
  });
  const stockInfo = document.getElementById('stock-status');
  stockInfo.textContent = infoMsg;
};

main();
// 장바구니 추가 전용 핸들러
function handleAddToCart() {
  const sel = document.getElementById('product-select');
  const selItem = sel.value;
  const itemToAdd = findProductById(selItem);

  if (!selItem || !itemToAdd) {
    return;
  }

  if (itemToAdd && itemToAdd.q > 0) {
    let item = document.getElementById(itemToAdd.id);
    if (item) {
      const qtyElem = item.querySelector('.quantity-number');
      const currentQty = getQuantityFromElement(qtyElem);
      const newQty = currentQty + 1;
      if (newQty <= itemToAdd.q + currentQty) {
        qtyElem.textContent = newQty;
        itemToAdd.q--;
      } else {
        alert('재고가 부족합니다.');
        return;
      }
    } else {
      const cartDisp = document.getElementById('cart-items');
      cartDisp.addItem(itemToAdd);
      itemToAdd.q--;
    }

    // 장바구니 추가 후 필요한 업데이트들
    const cartDisp = document.getElementById('cart-items');
    const cartItems = cartDisp.children;
    const cartData = calculateCartTotals(cartItems);
    const discountData = calculateDiscounts(
      cartData.subTot,
      cartData.totalAmt,
      cartData.itemCnt
    );
    const finalTotal = updateOrderSummary(
      { ...cartData, cartItems },
      discountData
    );

    handleStockInfoUpdate();
    doRenderBonusPoints(finalTotal, cartData.itemCnt);
    lastSelectionState.set(selItem);
  }
}

// 수량 변경 전용 핸들러
function handleQuantityChange(prodId, change) {
  const itemElem = document.getElementById(prodId);
  const prod = findProductById(prodId);

  if (!itemElem || !prod) {
    return;
  }

  const qtyElem = itemElem.querySelector('.quantity-number');
  const currentQty = getQuantityFromElement(qtyElem);
  const newQty = currentQty + change;

  if (newQty > 0 && newQty <= prod.q + currentQty) {
    qtyElem.textContent = newQty;
    prod.q -= change;
  } else if (newQty <= 0) {
    prod.q += currentQty;
    itemElem.remove();
  } else {
    alert('재고가 부족합니다.');
    return;
  }

  // 수량 변경 후 필요한 업데이트들
  const cartDisp = document.getElementById('cart-items');
  const cartItems = cartDisp.children;
  const cartData = calculateCartTotals(cartItems);
  const discountData = calculateDiscounts(
    cartData.subTot,
    cartData.totalAmt,
    cartData.itemCnt
  );
  const finalTotal = updateOrderSummary(
    { ...cartData, cartItems },
    discountData
  );

  handleStockInfoUpdate();
  doRenderBonusPoints(finalTotal, cartData.itemCnt);
}

// 상품 제거 전용 핸들러
function handleRemoveItem(prodId) {
  const itemElem = document.getElementById(prodId);
  const prod = findProductById(prodId);

  if (!itemElem || !prod) {
    return;
  }

  const qtyElem = itemElem.querySelector('.quantity-number');
  const remQty = getQuantityFromElement(qtyElem);
  prod.q += remQty;
  itemElem.remove();

  // 상품 제거 후 필요한 업데이트들
  const cartDisp = document.getElementById('cart-items');
  const cartItems = cartDisp.children;
  const cartData = calculateCartTotals(cartItems);
  const discountData = calculateDiscounts(
    cartData.subTot,
    cartData.totalAmt,
    cartData.itemCnt
  );
  const finalTotal = updateOrderSummary(
    { ...cartData, cartItems },
    discountData
  );

  handleStockInfoUpdate();
  doRenderBonusPoints(finalTotal, cartData.itemCnt);
}

// 가격 업데이트 전용 핸들러
function handlePriceUpdate() {
  const cartDisp = document.getElementById('cart-items');
  const cartItems = cartDisp.children;
  for (let i = 0; i < cartItems.length; i++) {
    const itemId = cartItems[i].id;
    const product = findProductById(itemId);
    if (product) {
      const priceDiv = cartItems[i].querySelector('.text-lg');
      const nameDiv = cartItems[i].querySelector('h3');
      createPriceDisplay(priceDiv, product);
      nameDiv.textContent =
        (product.onSale && product.suggestSale
          ? '⚡💝'
          : product.onSale
            ? '⚡'
            : product.suggestSale
              ? '💝'
              : '') + product.name;
    }
  }
}
