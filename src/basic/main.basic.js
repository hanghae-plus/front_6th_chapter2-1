import { STOCK_THRESHOLDS } from '../constants/shopPolicy.js';
import { createManual } from '../components/Manual/index.js';
import { createManualToggle } from '../components/ManualToggle.js';
import { createHeader } from '../components/Header.js';
import { createProductSelector } from '../components/ProductSelector.js';
import {
  createGridContainer,
  createLeftColumn,
  createRightColumn,
} from '../components/Layout.js';
import { createCartDisplay } from '../components/CartDisplay/index.js';
import { getQuantityFromElement } from '../utils/global/index.js';
import { calculateDiscounts } from '../utils/discountUtils.js';
import {
  calculateCartTotals,
  addItemToCart,
  updateCartItemQuantity,
  removeCartItem,
} from '../utils/cartUtils.js';
import { createPriceDisplay } from '../components/PriceDisplay.js';
import { createProductOptions } from '../components/ProductOptions.js';
import { createOrderSummary } from '../components/OrderSummary/index.js';
import { startLightningSale } from '../services/lightningSale.js';
import { startSuggestSale } from '../services/suggestSale.js';
import { products, findProductById } from '../data/products.js';
import { updateUIAfterCartChange } from '../utils/uiUpdateUtils.js';

// 마지막 선택 상품 상태 관리
const lastSelectionState = {
  value: null,
  get: () => lastSelectionState.value,
  set: (newValue) => {
    lastSelectionState.value = newValue;
  },
};

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
  startLightningSale(products, onUpdateSelectOptions, handlePriceUpdate);
  startSuggestSale(
    products,
    lastSelectionState.get,
    onUpdateSelectOptions,
    handlePriceUpdate
  );
}
function onUpdateSelectOptions(
  productSelect = document.getElementById('product-select')
) {
  createProductOptions(productSelect, products, STOCK_THRESHOLDS);
}

let handleStockInfoUpdate = function () {
  let infoMsg = '';
  products.forEach(function (item) {
    if (item.quantity < 5) {
      if (item.quantity > 0) {
        infoMsg =
          infoMsg + item.name + ': 재고 부족 (' + item.quantity + '개 남음)\n';
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

  if (!selItem) {
    return;
  }

  // 현재 장바구니에 있는 수량 확인
  let currentCartQuantity = 0;
  const existingItem = document.getElementById(selItem);
  if (existingItem) {
    const qtyElem = existingItem.querySelector('.quantity-number');
    currentCartQuantity = getQuantityFromElement(qtyElem);
  }

  // 비즈니스 로직 처리
  const result = addItemToCart(selItem, currentCartQuantity);

  if (!result.success) {
    alert(result.error);
    return;
  }

  // DOM 업데이트
  if (existingItem) {
    const qtyElem = existingItem.querySelector('.quantity-number');
    qtyElem.textContent = result.newCartQuantity;
  } else {
    const cartDisp = document.getElementById('cart-items');
    cartDisp.addItem(result.product);
  }

  // 상품 재고 감소
  result.product.quantity--;

  // 장바구니 추가 후 필요한 업데이트들
  const cartDisp = document.getElementById('cart-items');
  const cartItems = cartDisp.children;
  const cartData = calculateCartTotals(cartItems);
  const discountData = calculateDiscounts(
    cartData.subTot,
    cartData.totalAmt,
    cartData.itemCnt
  );
  updateUIAfterCartChange({ ...cartData, cartItems }, discountData);

  handleStockInfoUpdate();
  lastSelectionState.set(selItem);
}

// 수량 변경 전용 핸들러
function handleQuantityChange(prodId, change) {
  const itemElem = document.getElementById(prodId);

  if (!itemElem) {
    return;
  }

  const qtyElem = itemElem.querySelector('.quantity-number');
  const currentQty = getQuantityFromElement(qtyElem);

  // 비즈니스 로직 처리
  const result = updateCartItemQuantity(prodId, change, currentQty);

  if (!result.success) {
    alert(result.error);
    return;
  }

  // DOM 업데이트
  if (result.shouldRemove) {
    result.product.quantity += result.stockToRestore;
    itemElem.remove();
  } else {
    qtyElem.textContent = result.newCartQuantity;
    result.product.quantity += result.stockChange;
  }

  // 수량 변경 후 필요한 업데이트들
  const cartDisp = document.getElementById('cart-items');
  const cartItems = cartDisp.children;
  const cartData = calculateCartTotals(cartItems, products);
  const discountData = calculateDiscounts(
    cartData.subTot,
    cartData.totalAmt,
    cartData.itemCnt
  );
  updateUIAfterCartChange({ ...cartData, cartItems }, discountData);

  handleStockInfoUpdate();
}

// 상품 제거 전용 핸들러
function handleRemoveItem(prodId) {
  const itemElem = document.getElementById(prodId);

  if (!itemElem) {
    return;
  }

  const qtyElem = itemElem.querySelector('.quantity-number');
  const currentQty = getQuantityFromElement(qtyElem);

  // 비즈니스 로직 처리
  const result = removeCartItem(prodId, currentQty);

  if (!result.success) {
    alert(result.error);
    return;
  }

  // DOM 업데이트
  result.product.quantity += result.stockToRestore;
  itemElem.remove();

  // 상품 제거 후 필요한 업데이트들
  const cartDisp = document.getElementById('cart-items');
  const cartItems = cartDisp.children;
  const cartData = calculateCartTotals(cartItems, products);
  const discountData = calculateDiscounts(
    cartData.subTot,
    cartData.totalAmt,
    cartData.itemCnt
  );
  updateUIAfterCartChange({ ...cartData, cartItems }, discountData);

  handleStockInfoUpdate();
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
        (product.isLightningSale && product.isSuggestSale
          ? '⚡💝'
          : product.isLightningSale
            ? '⚡'
            : product.isSuggestSale
              ? '💝'
              : '') + product.name;
    }
  }
}
