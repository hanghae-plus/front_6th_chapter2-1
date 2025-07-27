// ===== IMPORTS =====
import { DiscountEngine } from './calculations/DiscountEngine.js';
import { PointsCalculator } from './calculations/PointsCalculator.js';
import { PriceCalculator } from './calculations/PriceCalculator.js';
import { StockCalculator } from './calculations/StockCalculator.js';
import { CartEventHandler } from './components/CartEventHandler.js';
import { CartItem } from './components/CartItem.js';
import { HelpModal } from './components/HelpModal.js';
import { NotificationBar } from './components/NotificationBar.js';
import { OrderSummary } from './components/OrderSummary.js';
import { ProductSelector } from './components/ProductSelector.js';
import { StockInfo } from './components/StockInfo.js';
import { getProductList } from './constants/Products.js';
import { ALERT_UI } from './constants/UIConstants.js';

// ===== APPLICATION STATE =====
class ShoppingCartState {
  constructor() {
    this.productList = [];
    this.totalAmount = 0;
    this.itemCount = 0;
    this.bonusPoints = 0;
    this.lastSelectedProduct = null;
  }

  initializeProducts() {
    this.productList = getProductList().map(product => ({
      id: product.id,
      name: product.name,
      val: product.price,
      originalVal: product.price,
      q: product.stock,
      onSale: false,
      suggestSale: false,
    }));
  }

  getProduct(id) {
    return this.productList.find(product => product.id === id);
  }

  getTotalStock() {
    const stockSummary = StockCalculator.getStockSummary(this.productList);
    return stockSummary.totalStock;
  }

  getLowStockItems() {
    return this.productList
      .filter(product => product.q < 5 && product.q > 0)
      .map(product => product.name);
  }
}

// ===== DOM MANAGER =====
class DOMManager {
  constructor() {
    this.elements = {};
    this.initializeElements();
  }

  initializeElements() {
    this.elements = {
      root: document.getElementById('app'),
      productSelect: null,
      addButton: null,
      cartDisplay: null,
      stockInfo: null,
      cartTotal: null,
      summaryDetails: null,
      discountInfo: null,
      loyaltyPoints: null,
      tuesdaySpecial: null,
      itemCount: null,
    };
  }

  createMainLayout() {
    const { header, gridContainer, helpComponents } = this.buildLayoutComponents();

    this.elements.root.appendChild(header);
    this.elements.root.appendChild(gridContainer);
    this.elements.root.appendChild(helpComponents.button);
    this.elements.root.appendChild(helpComponents.modal.overlay);

    this.findAndCacheElements();
    NotificationBar.render('top-right');
  }

  buildLayoutComponents() {
    const header = this.createHeader();
    const gridContainer = this.createGridContainer();
    const helpComponents = this.createHelpComponents();

    return { header, gridContainer, helpComponents };
  }

  createHeader() {
    const header = document.createElement('div');
    header.className = 'mb-8';
    header.innerHTML = `
      <h1 class="text-xs font-medium tracking-extra-wide uppercase mb-2">🛒 Hanghae Online Store</h1>
      <div class="text-5xl tracking-tight leading-none">Shopping Cart</div>
      <p id="item-count" class="text-sm text-gray-500 font-normal mt-3">🛍️ 0 items in cart</p>
    `;
    return header;
  }

  createGridContainer() {
    const gridContainer = document.createElement('div');
    gridContainer.className =
      'grid grid-cols-1 lg:grid-cols-[1fr_360px] gap-6 flex-1 overflow-hidden';

    const leftColumn = this.createLeftColumn();
    const rightColumn = this.createRightColumn();

    gridContainer.appendChild(leftColumn);
    gridContainer.appendChild(rightColumn);

    return gridContainer;
  }

  createLeftColumn() {
    const leftColumn = document.createElement('div');
    leftColumn.className = 'bg-white border border-gray-200 p-8 overflow-y-auto';

    const selectorContainer = this.createProductSelectorContainer();
    const cartDisplay = this.createCartDisplay();

    leftColumn.appendChild(selectorContainer);
    leftColumn.appendChild(cartDisplay);

    return leftColumn;
  }

  createProductSelectorContainer() {
    const container = document.createElement('div');
    container.className = 'mb-6 pb-6 border-b border-gray-200';

    const productSelect = this.createProductSelect();
    const addButton = this.createAddButton();
    const stockInfo = this.createStockInfo();

    container.appendChild(productSelect);
    container.appendChild(addButton);
    container.appendChild(stockInfo);

    // Cache elements for later use
    this.elements.productSelect = productSelect;
    this.elements.addButton = addButton;
    this.elements.stockInfo = stockInfo;

    return container;
  }

  createProductSelect() {
    const select = document.createElement('select');
    select.id = 'product-select';
    select.className = 'w-full p-3 border border-gray-300 rounded-lg text-base mb-3';
    return select;
  }

  createAddButton() {
    const button = document.createElement('button');
    button.id = 'add-to-cart';
    button.innerHTML = 'Add to Cart';
    button.className =
      'w-full py-3 bg-black text-white text-sm font-medium uppercase tracking-wider hover:bg-gray-800 transition-all';
    return button;
  }

  createStockInfo() {
    const div = document.createElement('div');
    div.id = 'stock-status';
    div.className = 'text-xs text-red-500 mt-3 whitespace-pre-line';
    return div;
  }

  createCartDisplay() {
    const div = document.createElement('div');
    div.id = 'cart-items';
    this.elements.cartDisplay = div;
    return div;
  }

  createRightColumn() {
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
    return rightColumn;
  }

  createHelpComponents() {
    const modal = HelpModal.createCompatibleModal();
    const button = document.createElement('button');

    button.onclick = () => modal.toggle();
    button.className =
      'fixed top-4 right-4 bg-black text-white p-3 rounded-full hover:bg-gray-900 transition-colors z-50';
    button.innerHTML = `
      <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
      </svg>
    `;

    return { button, modal };
  }

  findAndCacheElements() {
    this.elements.cartTotal = document.querySelector('#cart-total');
    this.elements.summaryDetails = document.getElementById('summary-details');
    this.elements.discountInfo = document.getElementById('discount-info');
    this.elements.loyaltyPoints = document.getElementById('loyalty-points');
    this.elements.tuesdaySpecial = document.getElementById('tuesday-special');
    this.elements.itemCount = document.getElementById('item-count');
  }

  getElement(name) {
    return this.elements[name];
  }
}

// ===== CALCULATION ENGINE =====
class CalculationEngine {
  constructor(state) {
    this.state = state;
  }

  extractCartItemsFromDOM(cartDisplay) {
    const cartItems = [];
    const cartElements = Array.from(cartDisplay.children);

    cartElements.forEach(element => {
      const product = this.state.getProduct(element.id);
      const quantityElement = element.querySelector('.quantity-number');
      const quantity = parseInt(quantityElement?.textContent || 0);

      if (product && quantity > 0) {
        cartItems.push({
          id: product.id,
          quantity: quantity,
          price: product.val,
          product: product,
        });
      }
    });

    return cartItems;
  }

  calculatePricing(cartItems) {
    if (cartItems.length === 0) {
      return {
        subtotal: 0,
        finalAmount: 0,
        totalSavings: 0,
        discountRate: 0,
        appliedDiscounts: [],
        specialDiscounts: [],
      };
    }

    // Base price calculation
    const priceResult = PriceCalculator.calculateFinalPrice(cartItems, new Date());

    // Check for special discount combinations
    const hasFlashAndRecommend = cartItems.some(
      item => item.product?.onSale && item.product?.suggestSale
    );

    let finalResult = priceResult;

    // Apply advanced discounts if applicable
    if (hasFlashAndRecommend) {
      const discountContext = {
        date: new Date(),
        isFlashSale: cartItems.some(item => item.product?.onSale),
        recommendedProduct: cartItems.find(item => item.product?.suggestSale)?.id,
      };

      const discountEngineResult = DiscountEngine.applyDiscountPolicies(cartItems, discountContext);

      if (discountEngineResult.totalSavings > priceResult.totalSavings) {
        finalResult = {
          subtotal: priceResult.subtotal,
          finalAmount: discountEngineResult.finalAmount,
          totalSavings: discountEngineResult.totalSavings,
          appliedDiscounts: discountEngineResult.appliedDiscounts,
          individualDiscounts: priceResult.individualDiscounts,
          bulkDiscount: priceResult.bulkDiscount,
          tuesdayDiscount: priceResult.tuesdayDiscount,
          specialDiscounts: discountEngineResult.appliedDiscounts.filter(d =>
            ['flash', 'recommend', 'combo'].includes(d.type)
          ),
        };
      }
    }

    // Add discount rate calculation
    finalResult.discountRate =
      finalResult.totalSavings > 0 ? finalResult.totalSavings / finalResult.subtotal : 0;

    return finalResult;
  }

  calculatePoints(cartItems, totalAmount) {
    if (cartItems.length === 0) {
      return { total: 0, messages: [] };
    }

    return PointsCalculator.getTotalPoints(cartItems, totalAmount, {
      date: new Date(),
    });
  }

  updateStateFromCalculations(cartItems, pricingResult, pointsResult) {
    this.state.itemCount = cartItems.reduce((sum, item) => sum + item.quantity, 0);
    this.state.totalAmount = pricingResult.finalAmount;
    this.state.bonusPoints = pointsResult.total;
  }
}

// ===== UI UPDATER =====
class UIUpdater {
  constructor(domManager, state) {
    this.dom = domManager;
    this.state = state;
  }

  updateProductSelector() {
    const productSelect = this.dom.getElement('productSelect');
    const currentValue = productSelect.value;

    const selectHTML = ProductSelector.render(this.state.productList, {
      id: 'product-select',
      className: 'w-full p-3 border border-gray-300 rounded-lg text-base mb-3',
      placeholder: '',
    });

    const tempDiv = document.createElement('div');
    tempDiv.innerHTML = selectHTML;
    const newSelect = tempDiv.querySelector('select');

    productSelect.innerHTML = newSelect.innerHTML;

    // Restore selection if still valid
    if (currentValue && productSelect.querySelector(`option[value="${currentValue}"]`)) {
      productSelect.value = currentValue;
    }

    // Apply stock warning style
    const totalStock = this.state.getTotalStock();
    productSelect.style.borderColor = totalStock < 50 ? 'orange' : '';
  }

  updateCartDisplay() {
    const cartDisplay = this.dom.getElement('cartDisplay');
    const cartItems = [];

    Array.from(cartDisplay.children).forEach(element => {
      const product = this.state.getProduct(element.id);
      const quantityElement = element.querySelector('.quantity-number');
      const quantity = parseInt(quantityElement?.textContent || 0);

      if (product && quantity > 0) {
        cartItems.push({
          id: product.id,
          product: product,
          quantity: quantity,
          price: product.val,
        });
      }
    });

    // Clear and rebuild cart display
    cartDisplay.innerHTML = '';

    cartItems.forEach(item => {
      const cartItemData = {
        product: item.product,
        quantity: item.quantity,
        discounts: {},
        subtotal: item.product.val * item.quantity,
        stock: item.product.q,
      };

      const newItemHTML = CartItem.render(cartItemData);
      cartDisplay.insertAdjacentHTML('beforeend', newItemHTML);
    });
  }

  updatePricesInCart() {
    const cartDisplay = this.dom.getElement('cartDisplay');

    Array.from(cartDisplay.children).forEach(itemElement => {
      const product = this.state.getProduct(itemElement.id);
      if (!product) return;

      const priceDiv = itemElement.querySelector('.text-lg');
      const nameDiv = itemElement.querySelector('h3');

      this.updateProductDisplayInCart(product, priceDiv, nameDiv);
    });
  }

  updateProductDisplayInCart(product, priceDiv, nameDiv) {
    const originalPrice = `<span class="line-through text-gray-400">₩${product.originalVal.toLocaleString()}</span>`;
    const currentPrice = `₩${product.val.toLocaleString()}`;

    if (product.onSale && product.suggestSale) {
      priceDiv.innerHTML = `${originalPrice} <span class="text-purple-600">${currentPrice}</span>`;
      nameDiv.textContent = `⚡💝${product.name}`;
    } else if (product.onSale) {
      priceDiv.innerHTML = `${originalPrice} <span class="text-red-500">${currentPrice}</span>`;
      nameDiv.textContent = `⚡${product.name}`;
    } else if (product.suggestSale) {
      priceDiv.innerHTML = `${originalPrice} <span class="text-blue-500">${currentPrice}</span>`;
      nameDiv.textContent = `💝${product.name}`;
    } else {
      priceDiv.textContent = currentPrice;
      nameDiv.textContent = product.name;
    }
  }

  updateOrderSummary(cartItems, pricingResult, pointsResult) {
    const summaryDetails = this.dom.getElement('summaryDetails');
    const discountInfo = this.dom.getElement('discountInfo');
    const loyaltyPoints = this.dom.getElement('loyaltyPoints');
    const tuesdaySpecial = this.dom.getElement('tuesdaySpecial');

    if (cartItems.length === 0) {
      this.clearOrderSummary();
      return;
    }

    // Prepare order data for OrderSummary component
    const orderData = OrderSummary.transformCalculationResults(
      {
        priceResult: pricingResult,
        pointsResult: pointsResult,
        discountResult: { specialDiscounts: pricingResult.specialDiscounts || [] },
        context: { isTuesday: new Date().getDay() === 2 },
      },
      cartItems
    );

    // Update summary details
    const summaryHTML = OrderSummary.render(orderData, {
      showDetailedBreakdown: true,
      highlightSavings: false,
      showPointsPreview: false,
    });
    summaryDetails.innerHTML = summaryHTML;

    // Update discount information
    if (pricingResult.discountRate > 0 && pricingResult.finalAmount > 0) {
      const savingsHTML = OrderSummary.generateSavingsInfo(orderData.pricing);
      discountInfo.innerHTML = savingsHTML;
    } else {
      discountInfo.innerHTML = '';
    }

    // Update points information
    const pointsHTML = OrderSummary.generatePointsInfo(orderData.points);
    if (pointsHTML) {
      loyaltyPoints.innerHTML = pointsHTML;
      loyaltyPoints.style.display = 'block';
    } else {
      loyaltyPoints.textContent = '적립 포인트: 0p';
      loyaltyPoints.style.display = 'block';
    }

    // Update Tuesday special banner
    const isTuesday = new Date().getDay() === 2;
    const hasTuesdayDiscount = pricingResult.tuesdayDiscount?.discountAmount > 0;

    if (isTuesday && hasTuesdayDiscount) {
      tuesdaySpecial.classList.remove('hidden');
    } else {
      tuesdaySpecial.classList.add('hidden');
    }
  }

  clearOrderSummary() {
    this.dom.getElement('summaryDetails').innerHTML = '';
    this.dom.getElement('discountInfo').innerHTML = '';
    this.dom.getElement('loyaltyPoints').textContent = '적립 포인트: 0p';
    this.dom.getElement('loyaltyPoints').style.display = 'none';
    this.dom.getElement('tuesdaySpecial').classList.add('hidden');
  }

  updateTotalAmount() {
    const cartTotal = this.dom.getElement('cartTotal');
    const totalDiv = cartTotal?.querySelector('.text-2xl');

    if (totalDiv) {
      totalDiv.textContent = '₩' + Math.round(this.state.totalAmount).toLocaleString();
    }
  }

  updateItemCount() {
    const itemCountElement = this.dom.getElement('itemCount');
    if (itemCountElement) {
      itemCountElement.textContent = `🛍️ ${this.state.itemCount} items in cart`;
    }
  }

  updateStockInfo() {
    const stockInfo = this.dom.getElement('stockInfo');
    StockInfo.updateStockInfoElement(this.state.productList, stockInfo);
  }

  highlightQuantityDiscounts() {
    const cartDisplay = this.dom.getElement('cartDisplay');

    Array.from(cartDisplay.children).forEach(itemElement => {
      const quantityElement = itemElement.querySelector('.quantity-number');
      const quantity = parseInt(quantityElement?.textContent || 0);

      const priceElements = itemElement.querySelectorAll('.text-lg, .text-xs');
      priceElements.forEach(element => {
        if (element.classList.contains('text-lg')) {
          element.style.fontWeight = quantity >= 10 ? 'bold' : 'normal';
        }
      });
    });
  }
}

// ===== EVENT MANAGER =====
class EventManager {
  constructor(state, domManager, calculationEngine, uiUpdater) {
    this.state = state;
    this.dom = domManager;
    this.calc = calculationEngine;
    this.ui = uiUpdater;
  }

  setupEventListeners() {
    this.setupAddToCartListener();
    this.setupCartEventHandlers();
  }

  setupAddToCartListener() {
    const addButton = this.dom.getElement('addButton');
    const productSelect = this.dom.getElement('productSelect');
    const cartDisplay = this.dom.getElement('cartDisplay');

    addButton.addEventListener('click', () => {
      const selectedValue = productSelect.value;
      if (!selectedValue) return;

      const itemToAdd = this.state.getProduct(selectedValue);
      if (!itemToAdd || itemToAdd.q <= 0) {
        NotificationBar.generateStockAlert(ALERT_UI.STOCK_EXCEEDED);
        return;
      }

      this.addItemToCart(itemToAdd, cartDisplay);
    });
  }

  addItemToCart(product, cartDisplay) {
    const existingItem = document.getElementById(product.id);

    if (existingItem) {
      // Update existing item quantity
      const quantityElement = existingItem.querySelector('.quantity-number');
      const currentQuantity = parseInt(quantityElement.textContent);
      const newQuantity = currentQuantity + 1;

      if (newQuantity <= product.q + currentQuantity) {
        quantityElement.textContent = newQuantity;
        product.q--;
        this.state.lastSelectedProduct = product.id;
        this.performFullUpdate();
      } else {
        NotificationBar.generateStockAlert(ALERT_UI.STOCK_EXCEEDED);
      }
    } else {
      // Create new cart item
      const cartItemData = {
        product: product,
        quantity: 1,
        discounts: {},
        subtotal: product.val,
        stock: product.q,
      };

      const newItemHTML = CartItem.render(cartItemData);
      cartDisplay.insertAdjacentHTML('beforeend', newItemHTML);
      product.q--;
      this.state.lastSelectedProduct = product.id;
      this.performFullUpdate();
    }
  }

  setupCartEventHandlers() {
    const cartDisplay = this.dom.getElement('cartDisplay');

    const callbacks = CartEventHandler.createMainBasicCompatibleCallbacks(
      this.state.productList,
      () => this.performFullUpdate(),
      () => this.ui.updateProductSelector()
    );

    CartEventHandler.setupEventListeners(cartDisplay, callbacks);
  }

  performFullUpdate() {
    const cartDisplay = this.dom.getElement('cartDisplay');
    const cartItems = this.calc.extractCartItemsFromDOM(cartDisplay);

    const pricingResult = this.calc.calculatePricing(cartItems);
    const pointsResult = this.calc.calculatePoints(cartItems, pricingResult.finalAmount);

    this.calc.updateStateFromCalculations(cartItems, pricingResult, pointsResult);

    this.ui.updateOrderSummary(cartItems, pricingResult, pointsResult);
    this.ui.updateTotalAmount();
    this.ui.updateItemCount();
    this.ui.updateStockInfo();
    this.ui.updateProductSelector();
    this.ui.highlightQuantityDiscounts();
  }
}

// ===== PROMOTION MANAGER =====
class PromotionManager {
  constructor(state, uiUpdater, eventManager) {
    this.state = state;
    this.ui = uiUpdater;
    this.events = eventManager;
  }

  startPromotionTimers() {
    this.startFlashSaleTimer();
    this.startRecommendationTimer();
  }

  startFlashSaleTimer() {
    const delay = Math.random() * 10000;

    setTimeout(() => {
      setInterval(() => {
        this.triggerFlashSale();
      }, 30000);
    }, delay);
  }

  startRecommendationTimer() {
    const delay = Math.random() * 20000;

    setTimeout(() => {
      setInterval(() => {
        this.triggerRecommendation();
      }, 60000);
    }, delay);
  }

  triggerFlashSale() {
    const availableProducts = this.state.productList.filter(
      product => product.q > 0 && !product.onSale
    );

    if (availableProducts.length === 0) return;

    const luckyItem = availableProducts[Math.floor(Math.random() * availableProducts.length)];
    luckyItem.val = Math.round((luckyItem.originalVal * 80) / 100);
    luckyItem.onSale = true;

    NotificationBar.generateFlashSaleAlert(luckyItem);
    this.ui.updateProductSelector();
    this.ui.updatePricesInCart();
    this.events.performFullUpdate();
  }

  triggerRecommendation() {
    if (!this.state.lastSelectedProduct) return;

    const availableProducts = this.state.productList.filter(
      product =>
        product.id !== this.state.lastSelectedProduct && product.q > 0 && !product.suggestSale
    );

    if (availableProducts.length === 0) return;

    const suggestedItem = availableProducts[0];
    suggestedItem.val = Math.round((suggestedItem.val * 95) / 100);
    suggestedItem.suggestSale = true;

    NotificationBar.generateRecommendAlert(suggestedItem);
    this.ui.updateProductSelector();
    this.ui.updatePricesInCart();
    this.events.performFullUpdate();
  }
}

// ===== MAIN APPLICATION CLASS =====
class ShoppingCartApplication {
  constructor() {
    this.state = new ShoppingCartState();
    this.domManager = new DOMManager();
    this.calculationEngine = new CalculationEngine(this.state);
    this.uiUpdater = new UIUpdater(this.domManager, this.state);
    this.eventManager = new EventManager(
      this.state,
      this.domManager,
      this.calculationEngine,
      this.uiUpdater
    );
    this.promotionManager = new PromotionManager(this.state, this.uiUpdater, this.eventManager);
  }

  initialize() {
    // Initialize application state
    this.state.initializeProducts();

    // Create DOM structure
    this.domManager.createMainLayout();

    // Setup event listeners
    this.eventManager.setupEventListeners();

    // Initial UI update
    this.uiUpdater.updateProductSelector();
    this.eventManager.performFullUpdate();

    // Start promotion timers
    this.promotionManager.startPromotionTimers();
  }
}

// ===== APPLICATION ENTRY POINT =====
const shoppingCartApp = new ShoppingCartApplication();
shoppingCartApp.initialize();
