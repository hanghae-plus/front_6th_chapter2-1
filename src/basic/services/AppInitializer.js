import { CartCalculationService } from './CartCalculationService.js';
import { LightningSaleService } from './LightningSaleService.js';
import { PointsCalculationService } from './PointsCalculationService.js';
import { PriceUpdateService } from './PriceUpdateService.js';
import { SuggestSaleService } from './SuggestSaleService.js';
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
 * AppInitializer 클래스
 * 애플리케이션의 초기화 로직을 담당합니다.
 */
export class AppInitializer {
  constructor() {
    this.root = null;
    this.elements = {};
    this.services = {};
    this.context = {};
  }

  /**
   * 애플리케이션을 초기화합니다.
   */
  initialize() {
    this.initializeElements();
    this.initializeServices();
    this.setupEventListeners();
    this.setupStateSubscription();
    this.startTimers();
    this.performInitialSetup();
  }

  /**
   * DOM 요소들을 초기화합니다.
   */
  initializeElements() {
    this.root = document.getElementById('app');

    this.elements = {
      sel: this.root.querySelector('#product-select'),
      addBtn: this.root.querySelector('#add-to-cart'),
      stockInfo: this.root.querySelector('#stock-status'),
      cartDisp: this.root.querySelector('#cart-items'),
      sum: this.root.querySelector('#cart-total'),
      manualToggle: this.root.querySelector('#manual-toggle'),
      manualOverlay: this.root.querySelector('#manual-overlay'),
    };
  }

  /**
   * 서비스들을 초기화합니다.
   */
  initializeServices() {
    this.services = {
      cartCalculation: new CartCalculationService(
        productList,
        this.elements.cartDisp,
        document.getElementById('summary-details'),
        this.elements.sum.querySelector('.text-2xl'),
        document.getElementById('discount-info'),
        document.getElementById('item-count')
      ),
      pointsCalculation: new PointsCalculationService(
        productList,
        this.elements.cartDisp,
        cartState
      ),
      priceUpdate: new PriceUpdateService(
        productList,
        this.elements.cartDisp,
        this.handleCalculateCartStuff.bind(this)
      ),
      lightningSale: new LightningSaleService(productList, this.doUpdatePricesInCart.bind(this)),
      suggestSale: new SuggestSaleService(
        productList,
        productState,
        this.doUpdatePricesInCart.bind(this)
      ),
    };
  }

  /**
   * 이벤트 리스너를 설정합니다.
   */
  setupEventListeners() {
    this.context = {
      productList,
      cartDisp: this.elements.cartDisp,
      sel: this.elements.sel,
      addBtn: this.elements.addBtn,
      manualToggle: this.elements.manualToggle,
      manualOverlay: this.elements.manualOverlay,
      stockInfo: this.elements.stockInfo,
      handleCalculateCartStuff: this.handleCalculateCartStuff.bind(this),
      stateActions,
      NewItem: this.getNewItemComponent(),
      ProductOption: this.getProductOptionComponent(),
      onUpdateSelectOptions: this.onUpdateSelectOptions.bind(this),
    };

    bindEventListeners(this.context);
  }

  /**
   * 상태 변경 구독을 설정합니다.
   */
  setupStateSubscription() {
    subscribeToState(() => {
      this.updateUIFromState();
    });
  }

  /**
   * 타이머들을 시작합니다.
   */
  startTimers() {
    this.services.lightningSale.startLightningSaleTimer();
    this.services.suggestSale.startSuggestSaleTimer();
  }

  /**
   * 초기 설정을 수행합니다.
   */
  performInitialSetup() {
    this.onUpdateSelectOptions();
    this.handleCalculateCartStuff();
  }

  /**
   * 장바구니 계산을 처리합니다.
   */
  handleCalculateCartStuff() {
    const result = this.services.cartCalculation.calculateCart();

    // 상태 업데이트
    stateActions.updateCartTotal(result.totalAmt);
    stateActions.updateCartItemCount(result.itemCnt);

    this.handleStockInfoUpdate();
    this.doRenderBonusPoints();
  }

  /**
   * 보너스 포인트 렌더링을 처리합니다.
   */
  doRenderBonusPoints() {
    const { bonusPoints, pointsDetail } = this.services.pointsCalculation.calculateBonusPoints();

    // 빈 장바구니가 아닐 때만 포인트 표시 업데이트
    if (this.elements.cartDisp.children.length > 0) {
      this.services.pointsCalculation.updateLoyaltyPointsDisplay(bonusPoints, pointsDetail);
    }
  }

  /**
   * UI 상태를 업데이트합니다.
   */
  updateUIFromState() {
    // 아이템 카운트 업데이트
    const itemCountElement = document.getElementById('item-count');
    if (itemCountElement) {
      itemCountElement.textContent = `🛍️  ${cartState.itemCount} items in cart`;
    }

    // 매뉴얼 오버레이 상태 업데이트
    if (
      this.elements.manualOverlay &&
      this.elements.manualOverlay.querySelector('#manual-column')
    ) {
      const manualColumn = this.elements.manualOverlay.querySelector('#manual-column');
      if (uiState.isManualOpen) {
        this.elements.manualOverlay.classList.remove('hidden');
        manualColumn.classList.remove('translate-x-full');
      } else {
        this.elements.manualOverlay.classList.add('hidden');
        manualColumn.classList.add('translate-x-full');
      }
    }
  }

  /**
   * 재고 정보 업데이트를 처리합니다.
   */
  handleStockInfoUpdate() {
    const lowStockProducts = getLowStockProducts(productList);
    this.elements.stockInfo.textContent = generateStockWarningMessage(lowStockProducts);
  }

  /**
   * 장바구니 내 가격 업데이트를 처리합니다.
   */
  doUpdatePricesInCart() {
    this.services.priceUpdate.updatePricesInCart();
  }

  /**
   * 상품 선택 옵션을 업데이트합니다.
   */
  onUpdateSelectOptions() {
    this.elements.sel.innerHTML = '';
    const totalStock = productList.reduce((acc, product) => acc + product.q, 0);

    const optionsHTML = productList
      .map((item) => this.getProductOptionComponent()({ item }))
      .join('');
    this.elements.sel.innerHTML = optionsHTML;

    if (totalStock < 100) {
      // TOTAL_STOCK_WARNING_THRESHOLD
      this.elements.sel.style.borderColor = 'orange';
    } else {
      this.elements.sel.style.borderColor = '';
    }
  }

  /**
   * NewItem 컴포넌트를 가져옵니다.
   */
  getNewItemComponent() {
    return NewItem;
  }

  /**
   * ProductOption 컴포넌트를 가져옵니다.
   */
  getProductOptionComponent() {
    return ProductOption;
  }
}
