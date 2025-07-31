import { NewItem } from './components/cart/NewItem.js';
import { GridContainer } from './components/layout/GridContainer.js';
import { Header } from './components/layout/Header.js';
import { ManualOverlay } from './components/manual/ManualOverlay.js';
import { ManualToggle } from './components/manual/ManualToggle.js';
import { ProductOption } from './components/product/ProductOption.js';
import {
  KEYBOARD,
  MOUSE,
  MONITOR_ARM,
  NOTEBOOK_CASE,
  SPEAKER,
  TOTAL_STOCK_WARNING_THRESHOLD,
} from './constants.js';
import { bindEventListeners } from './events/bindings.js';
import { CartCalculationService } from './services/CartCalculationService.js';
import { LightningSaleService } from './services/LightningSaleService.js';
import { PointsCalculationService } from './services/PointsCalculationService.js';
import { PriceUpdateService } from './services/PriceUpdateService.js';
import { SuggestSaleService } from './services/SuggestSaleService.js';
import { cartState } from './states/cartState.js';
import { productState } from './states/productState.js';
import { stateActions, subscribeToState } from './states/state.js';
import { uiState } from './states/uiState.js';
import { generateStockWarningMessage, getLowStockProducts } from './utils/stock.js';

// ================================================
// 상품 데이터
// ================================================
const productList = [
  {
    id: KEYBOARD,
    name: '버그 없애는 키보드',
    val: 10000,
    originalVal: 10000,
    q: 50,
    onSale: false,
    suggestSale: false,
  },
  {
    id: MOUSE,
    name: '생산성 폭발 마우스',
    val: 20000,
    originalVal: 20000,
    q: 30,
    onSale: false,
    suggestSale: false,
  },
  {
    id: MONITOR_ARM,
    name: '거북목 탈출 모니터암',
    val: 30000,
    originalVal: 30000,
    q: 20,
    onSale: false,
    suggestSale: false,
  },
  {
    id: NOTEBOOK_CASE,
    name: '에러 방지 노트북 파우치',
    val: 15000,
    originalVal: 15000,
    q: 0,
    onSale: false,
    suggestSale: false,
  },
  {
    id: SPEAKER,
    name: `코딩할 때 듣는 Lo-Fi 스피커`,
    val: 25000,
    originalVal: 25000,
    q: 10,
    onSale: false,
    suggestSale: false,
  },
];

function main() {
  const root = document.getElementById('app');

  root.innerHTML += Header({ itemCount: cartState.itemCount });
  root.innerHTML += GridContainer({
    total: cartState.total,
    bonusPoints: 0,
    pointsDetail: [],
  });
  root.innerHTML += ManualToggle();
  root.innerHTML += ManualOverlay();

  const sel = root.querySelector('#product-select');
  const addBtn = root.querySelector('#add-to-cart');
  const stockInfo = root.querySelector('#stock-status');
  const cartDisp = root.querySelector('#cart-items');
  const sum = root.querySelector('#cart-total');
  const manualToggle = root.querySelector('#manual-toggle');
  const manualOverlay = root.querySelector('#manual-overlay');

  // 이벤트 핸들러는 bindEventListeners에서 처리됨

  onUpdateSelectOptions();
  handleCalculateCartStuff();

  // 상태 변경 구독 설정
  subscribeToState(() => {
    // 상태 변경 시 UI 업데이트
    updateUIFromState();
  });

  // 번개세일 타이머 시작
  const lightningSaleService = new LightningSaleService(productList, doUpdatePricesInCart);
  lightningSaleService.startLightningSaleTimer();

  // 추천할인 타이머 시작
  const suggestSaleService = new SuggestSaleService(
    productList,
    productState,
    doUpdatePricesInCart
  );
  suggestSaleService.startSuggestSaleTimer();

  function onUpdateSelectOptions() {
    sel.innerHTML = '';
    const totalStock = productList.reduce((acc, product) => acc + product.q, 0);

    const optionsHTML = productList.map((item) => ProductOption({ item })).join('');
    sel.innerHTML = optionsHTML;

    if (totalStock < TOTAL_STOCK_WARNING_THRESHOLD) {
      sel.style.borderColor = 'orange';
    } else {
      sel.style.borderColor = '';
    }
  }

  function handleCalculateCartStuff() {
    const cartCalculationService = new CartCalculationService(
      productList,
      cartDisp,
      document.getElementById('summary-details'),
      sum.querySelector('.text-2xl'),
      document.getElementById('discount-info'),
      document.getElementById('item-count')
    );

    const result = cartCalculationService.calculateCart();

    // 상태 업데이트
    stateActions.updateCartTotal(result.totalAmt);
    stateActions.updateCartItemCount(result.itemCnt);

    handleStockInfoUpdate();
    doRenderBonusPoints();
  }

  function doRenderBonusPoints() {
    const pointsCalculationService = new PointsCalculationService(productList, cartDisp, cartState);

    const { bonusPoints, pointsDetail } = pointsCalculationService.calculateBonusPoints();

    // 빈 장바구니가 아닐 때만 포인트 표시 업데이트
    if (cartDisp.children.length > 0) {
      pointsCalculationService.updateLoyaltyPointsDisplay(bonusPoints, pointsDetail);
    }
  }

  function updateUIFromState() {
    // 아이템 카운트 업데이트
    const itemCountElement = document.getElementById('item-count');
    if (itemCountElement) {
      itemCountElement.textContent = `🛍️  ${cartState.itemCount} items in cart`;
    }

    // 매뉴얼 오버레이 상태 업데이트
    const manualOverlay = document.getElementById('manual-overlay');
    const manualColumn = document.getElementById('manual-column');
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

  function handleStockInfoUpdate() {
    const lowStockProducts = getLowStockProducts(productList);
    stockInfo.textContent = generateStockWarningMessage(lowStockProducts);
  }

  function doUpdatePricesInCart() {
    const priceUpdateService = new PriceUpdateService(
      productList,
      cartDisp,
      handleCalculateCartStuff
    );

    priceUpdateService.updatePricesInCart();
  }

  // 컨텍스트 객체 생성
  const context = {
    productList,
    cartDisp,
    sel,
    addBtn,
    manualToggle,
    manualOverlay,
    stockInfo,
    handleCalculateCartStuff,
    stateActions,
    NewItem,
    ProductOption,
    onUpdateSelectOptions,
  };

  // 이벤트 리스너 바인딩
  bindEventListeners(context);
}

main();
