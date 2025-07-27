import { CartEventHandler } from '../components/CartEventHandler.js';
import { CartItem } from '../components/CartItem.js';
import { HelpModal } from '../components/HelpModal.js';
import { NotificationBar } from '../components/NotificationBar.js';
import { OrderSummary } from '../components/OrderSummary.js';
import { ProductSelector } from '../components/ProductSelector.js';
import { StockInfo } from '../components/StockInfo.js';
import { ALERT_UI, POINTS_CONSTANTS, STOCK_CONSTANTS } from '../constants/UIConstants.js';

export class ApplicationService {
  constructor(domManager, eventManager, uiUpdater, state, calculationEngine) {
    this.dom = domManager;
    this.events = eventManager;
    this.ui = uiUpdater;
    this.state = state;
    this.calculationEngine = calculationEngine;
  }

  initialize() {
    // Initialize application state
    this.state.initializeAvailableProducts();

    this.createMainLayout();
    this.setupEventListeners();
    this.setupHelpModal();
    this.setupNotificationBar();

    // Initial UI update
    this.updateProductSelector();
    this.performFullUpdate();
  }

  createMainLayout() {
    this.dom.createMainApplicationLayout();
  }

  setupEventListeners() {
    this.setupAddToCartListener();
    this.setupCartEventHandlers();
  }

  setupAddToCartListener() {
    const addButton = this.dom.getCachedElement('addToCartButton');
    const productSelect = this.dom.getCachedElement('productSelectionDropdown');

    this.events.registerEventListener(addButton, 'click', () => {
      const selectedValue = productSelect.value;
      if (!selectedValue) return;

      const itemToAdd = this.state.getProductById(selectedValue);
      if (!itemToAdd || itemToAdd.q <= 0) {
        NotificationBar.generateStockAlert(ALERT_UI.STOCK_EXCEEDED);
        return;
      }

      this.addItemToCart(itemToAdd);
    });
  }

  addItemToCart(product) {
    const cartDisplay = this.dom.getCachedElement('cartItemsContainer');
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
      this.dom.insertHTMLContent(cartDisplay, 'beforeend', newItemHTML);
      product.q--;
      this.state.lastSelectedProduct = product.id;
      this.performFullUpdate();
    }
  }

  setupCartEventHandlers() {
    const cartDisplay = this.dom.getCachedElement('cartItemsContainer');

    const callbacks = CartEventHandler.createMainBasicCompatibleCallbacks(
      this.state.availableProducts,
      () => this.performFullUpdate(),
      () => this.updateProductSelector()
    );

    CartEventHandler.setupEventListeners(cartDisplay, callbacks);
  }

  setupHelpModal() {
    // DOM에서 직접 helpButton 찾기
    const helpButton = document.querySelector('.fixed.top-4.right-4');

    // 모달 객체 생성 및 DOM에 추가
    this.helpModalObj = HelpModal.createCompatibleModal();
    document.body.appendChild(this.helpModalObj.overlay);
    document.body.appendChild(this.helpModalObj.column);

    // helpButton이 존재하는 경우에만 이벤트 리스너 추가
    if (helpButton) {
      this.events.registerEventListener(helpButton, 'click', () => {
        this.helpModalObj.toggle();
      });
    }
  }

  setupNotificationBar() {
    NotificationBar.render('top-right');
  }

  performFullUpdate() {
    const cartDisplay = this.dom.getCachedElement('cartItemsContainer');
    const cartItems = this.calculationEngine.extractCartItemsFromDOM(cartDisplay);

    const pricingResult = this.calculationEngine.calculateCartPricing(cartItems);
    const pointsResult = this.calculationEngine.calculateLoyaltyPoints(
      cartItems,
      pricingResult.finalAmount
    );

    this.calculationEngine.updateCartStateFromCalculations(cartItems, pricingResult, pointsResult);

    this.updateOrderSummary(cartItems, pricingResult, pointsResult);
    this.updateTotalAmount();
    this.updateItemCount();
    this.updateStockInfo();
    this.updateProductSelector();
    this.highlightQuantityDiscounts();
  }

  updateProductSelector() {
    const productSelect = this.dom.getCachedElement('productSelectionDropdown');
    const currentValue = productSelect.value;

    const selectHTML = ProductSelector.render(this.state.availableProducts, {
      id: 'product-select',
      className: 'w-full p-3 border border-gray-300 rounded-lg text-base mb-3',
      placeholder: '',
    });

    const tempDiv = document.createElement('div');
    tempDiv.innerHTML = selectHTML;
    const newSelect = tempDiv.querySelector('select');

    this.dom.setElementInnerHTML(productSelect, newSelect.innerHTML);

    // Restore selection if still valid
    if (currentValue && productSelect.querySelector(`option[value="${currentValue}"]`)) {
      productSelect.value = currentValue;
    }

    // Apply stock warning style
    const totalStock = this.state.getTotalAvailableStock();
    this.ui.updateElementStyle(
      productSelect,
      'borderColor',
      totalStock < STOCK_CONSTANTS.TOTAL_STOCK_WARNING_THRESHOLD ? 'orange' : ''
    );
  }

  updateOrderSummary(cartItems, pricingResult, pointsResult) {
    const summaryDetails = this.dom.getCachedElement('orderSummaryDetails');
    const discountInfo = this.dom.getCachedElement('discountInformation');
    const loyaltyPoints = this.dom.getCachedElement('loyaltyPointsDisplay');
    const tuesdaySpecial = this.dom.getCachedElement('tuesdaySpecialBadge');

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
    this.dom.setElementInnerHTML(summaryDetails, summaryHTML);

    // Update discount information
    if (pricingResult.discountRate > 0 && pricingResult.finalAmount > 0) {
      const savingsHTML = OrderSummary.generateSavingsInfo(orderData.pricing);
      this.dom.setElementInnerHTML(discountInfo, savingsHTML);
    } else {
      this.dom.setElementInnerHTML(discountInfo, '');
    }

    // Update points information
    const pointsHTML = OrderSummary.generatePointsInfo(orderData.points);
    if (pointsHTML) {
      this.dom.setElementInnerHTML(loyaltyPoints, pointsHTML);
      this.ui.updateElementStyle(loyaltyPoints, 'display', 'block');
    } else {
      this.dom.setElementTextContent(loyaltyPoints, '적립 포인트: 0p');
      this.ui.updateElementStyle(loyaltyPoints, 'display', 'block');
    }

    // Update Tuesday special banner
    const isTuesday = new Date().getDay() === 2;
    const hasTuesdayDiscount = pricingResult.tuesdayDiscount?.discountAmount > 0;

    if (isTuesday && hasTuesdayDiscount) {
      this.dom.removeCSSClass(tuesdaySpecial, 'hidden');
    } else {
      this.dom.addCSSClass(tuesdaySpecial, 'hidden');
    }
  }

  clearOrderSummary() {
    this.dom.setElementInnerHTML(this.dom.getCachedElement('orderSummaryDetails'), '');
    this.dom.setElementInnerHTML(this.dom.getCachedElement('discountInformation'), '');
    this.dom.setElementTextContent(
      this.dom.getCachedElement('loyaltyPointsDisplay'),
      '적립 포인트: 0p'
    );
    this.ui.updateElementStyle(
      this.dom.getCachedElement('loyaltyPointsDisplay'),
      'display',
      'none'
    );
    this.dom.addCSSClass(this.dom.getCachedElement('tuesdaySpecialBadge'), 'hidden');
  }

  updateTotalAmount() {
    const cartTotal = this.dom.getCachedElement('cartTotalAmount');
    const totalDiv = cartTotal?.querySelector('.text-2xl');

    if (totalDiv) {
      this.dom.setElementTextContent(
        totalDiv,
        '₩' + Math.round(this.state.cartTotalAmount).toLocaleString()
      );
    }
  }

  updateItemCount() {
    const itemCountElement = this.dom.getCachedElement('itemCountDisplay');
    if (itemCountElement) {
      this.dom.setElementTextContent(
        itemCountElement,
        `🛍️ ${this.state.totalItemCount} items in cart`
      );
    }
  }

  updateStockInfo() {
    const stockInfo = this.dom.getCachedElement('stockStatusDisplay');
    StockInfo.updateStockInfoElement(this.state.availableProducts, stockInfo);
  }

  highlightQuantityDiscounts() {
    const cartDisplay = this.dom.getCachedElement('cartItemsContainer');

    Array.from(cartDisplay.children).forEach(itemElement => {
      const quantityElement = itemElement.querySelector('.quantity-number');
      const quantity = parseInt(quantityElement?.textContent || 0);

      const priceElements = itemElement.querySelectorAll('.text-lg, .text-xs');
      priceElements.forEach(element => {
        if (element.classList.contains('text-lg')) {
          this.ui.updateElementStyle(
            element,
            'fontWeight',
            quantity >= POINTS_CONSTANTS.BULK_PURCHASE_THRESHOLD ? 'bold' : 'normal'
          );
        }
      });
    });
  }
}
