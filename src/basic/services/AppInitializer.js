import { calculateCart } from './CartCalculationService.js';
import { createLightningSaleService } from './LightningSaleService.js';
import { createPointsCalculationService } from './PointsCalculationService.js';
import { createPriceUpdateService } from './PriceUpdateService.js';
import { createSuggestSaleService } from './SuggestSaleService.js';
import { NewItem } from '../components/cart/NewItem.js';
import { ProductOption } from '../components/product/ProductOption.js';
import { productList } from '../data/products.js';
import { bindEventListeners } from '../events/bindings.js';
import { cartState } from '../states/cartState.js';
import { productState } from '../states/productState.js';
import { stateActions, subscribeToState } from '../states/state.js';
import { uiState } from '../states/uiState.js';
import { generateStockWarningMessage, getLowStockProducts } from '../utils/stock.js';

/**
 * 애플리케이션을 초기화하는 메인 함수
 */
export function initializeApp() {
  const elements = initializeElements();
  const services = initializeServices(elements);
  const context = createContext(elements, services);

  setupEventListeners(context);
  setupStateSubscription(services);
  startTimers(services);
  performInitialSetup(elements, services);
}

/**
 * DOM 요소들을 초기화합니다.
 */
function initializeElements() {
  const root = document.getElementById('app');

  if (!root) {
    throw new Error('Root element #app not found');
  }

  const elements = {
    sel: root.querySelector('#product-select'),
    addBtn: root.querySelector('#add-to-cart'),
    stockInfo: root.querySelector('#stock-status'),
    cartDisp: root.querySelector('#cart-items'),
    sum: root.querySelector('#cart-total'),
    manualToggle: root.querySelector('#manual-toggle'),
    manualOverlay: root.querySelector('#manual-overlay'),
  };

  // 필수 요소 검증
  validateRequiredElements(elements);

  return elements;
}

/**
 * 필수 DOM 요소들이 존재하는지 검증합니다.
 */
function validateRequiredElements(elements) {
  const requiredElements = {
    sel: '#product-select',
    addBtn: '#add-to-cart',
    cartDisp: '#cart-items',
    sum: '#cart-total',
  };

  for (const [key, selector] of Object.entries(requiredElements)) {
    if (!elements[key]) {
      throw new Error(`Required element ${selector} not found`);
    }
  }
}

/**
 * 서비스들을 초기화합니다.
 */
function initializeServices(elements) {
  return {
    cartCalculation: {
      calculateCart: () =>
        calculateCart({
          productList,
          cartDisp: elements.cartDisp,
          summaryDetails: document.getElementById('summary-details'),
          totalDiv: elements.sum.querySelector('.text-2xl'),
          discountInfoDiv: document.getElementById('discount-info'),
          itemCountElement: document.getElementById('item-count'),
        }),
    },
    pointsCalculation: createPointsCalculationService(productList, elements.cartDisp, cartState),
    priceUpdate: createPriceUpdateService(productList, elements.cartDisp, () =>
      handleCalculateCartStuff(elements, services)
    ),
    lightningSale: createLightningSaleService(productList, () =>
      doUpdatePricesInCart(elements, services)
    ),
    suggestSale: createSuggestSaleService(productList, productState, () =>
      doUpdatePricesInCart(elements, services)
    ),
  };
}

/**
 * 컨텍스트 객체를 생성합니다.
 */
function createContext(elements, services) {
  return {
    productList,
    cartDisp: elements.cartDisp,
    sel: elements.sel,
    addBtn: elements.addBtn,
    manualToggle: elements.manualToggle,
    manualOverlay: elements.manualOverlay,
    stockInfo: elements.stockInfo,
    handleCalculateCartStuff: () => handleCalculateCartStuff(elements, services),
    stateActions,
    NewItem: getNewItemComponent(),
    ProductOption: getProductOptionComponent(),
    onUpdateSelectOptions: () => onUpdateSelectOptions(elements),
  };
}

/**
 * 이벤트 리스너를 설정합니다.
 */
function setupEventListeners(context) {
  bindEventListeners(context);
}

/**
 * 상태 변경 구독을 설정합니다.
 */
function setupStateSubscription() {
  subscribeToState(() => {
    updateUIFromState();
  });
}

/**
 * 타이머들을 시작합니다.
 */
function startTimers(services) {
  services.lightningSale.startLightningSaleTimer();
  services.suggestSale.startSuggestSaleTimer();
}

/**
 * 초기 설정을 수행합니다.
 */
function performInitialSetup(elements, services) {
  onUpdateSelectOptions(elements);
  handleCalculateCartStuff(elements, services);
}

/**
 * 장바구니 계산을 처리합니다.
 */
function handleCalculateCartStuff(elements, services) {
  const result = services.cartCalculation.calculateCart();

  // 상태 업데이트
  stateActions.updateCartTotal(result.totalAmt);
  stateActions.updateCartItemCount(result.itemCnt);

  handleStockInfoUpdate(elements);
  doRenderBonusPoints(elements, services);
}

/**
 * 보너스 포인트 렌더링을 처리합니다.
 */
function doRenderBonusPoints(elements, services) {
  const { bonusPoints, pointsDetail } = services.pointsCalculation.calculateBonusPoints();

  // 빈 장바구니가 아닐 때만 포인트 표시 업데이트
  if (elements.cartDisp.children.length > 0) {
    services.pointsCalculation.updateLoyaltyPointsDisplay(bonusPoints, pointsDetail);
  }
}

/**
 * UI 상태를 업데이트합니다.
 */
function updateUIFromState() {
  // 아이템 카운트 업데이트
  const itemCountElement = document.getElementById('item-count');
  if (itemCountElement) {
    itemCountElement.textContent = `��️  ${cartState.itemCount} items in cart`;
  }

  // 매뉴얼 오버레이 상태 업데이트
  const manualOverlay = document.querySelector('#manual-overlay');
  const manualColumn = manualOverlay?.querySelector('#manual-column');

  if (manualOverlay && manualColumn) {
    if (uiState.isManualOpen) {
      manualOverlay.classList.remove('hidden');
      manualColumn.classList.remove('translate-x-full');
    } else {
      manualOverlay.classList.add('hidden');
      manualColumn.classList.add('translate-x-full');
    }
  }
}

/**
 * 재고 정보 업데이트를 처리합니다.
 */
function handleStockInfoUpdate(elements) {
  const lowStockProducts = getLowStockProducts(productList);
  elements.stockInfo.textContent = generateStockWarningMessage(lowStockProducts);
}

/**
 * 장바구니 내 가격 업데이트를 처리합니다.
 */
function doUpdatePricesInCart(elements, services) {
  services.priceUpdate.updatePricesInCart();
}

/**
 * 상품 선택 옵션을 업데이트합니다.
 */
function onUpdateSelectOptions(elements) {
  elements.sel.innerHTML = '';
  const totalStock = productList.reduce((acc, product) => acc + product.q, 0);

  const optionsHTML = productList.map((item) => getProductOptionComponent()({ item })).join('');
  elements.sel.innerHTML = optionsHTML;

  if (totalStock < 100) {
    elements.sel.style.borderColor = 'orange';
  } else {
    elements.sel.style.borderColor = '';
  }
}

/**
 * NewItem 컴포넌트를 가져옵니다.
 */
function getNewItemComponent() {
  return NewItem;
}

/**
 * ProductOption 컴포넌트를 가져옵니다.
 */
function getProductOptionComponent() {
  return ProductOption;
}
