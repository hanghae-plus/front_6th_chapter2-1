import { CartEventHandler } from '../components/CartEventHandler.js';
import { CartItem } from '../components/CartItem.js';
import { HelpModal } from '../components/HelpModal.js';
import { NotificationBar } from '../components/NotificationBar.js';
import { OrderSummary } from '../components/OrderSummary.js';
import { ProductSelector } from '../components/ProductSelector.js';
import { StockInfo } from '../components/StockInfo.js';
import { ALERT_UI } from '../constants/UIConstants.js';

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
    this.state.initializeProducts();

    this.createMainLayout();
    this.setupEventListeners();
    this.setupHelpModal();
    this.setupNotificationBar();

    // Initial UI update
    this.updateProductSelector();
    this.performFullUpdate();
  }

  createMainLayout() {
    this.dom.createMainLayout();
  }

  setupEventListeners() {
    this.setupAddToCartListener();
    this.setupCartEventHandlers();
  }

  setupAddToCartListener() {
    const addButton = this.dom.getElement('addButton');
    const productSelect = this.dom.getElement('productSelect');

    this.events.addEventListener(addButton, 'click', () => {
      const selectedValue = productSelect.value;
      if (!selectedValue) return;

      const itemToAdd = this.state.getProduct(selectedValue);
      if (!itemToAdd || itemToAdd.q <= 0) {
        NotificationBar.generateStockAlert(ALERT_UI.STOCK_EXCEEDED);
        return;
      }

      this.addItemToCart(itemToAdd);
    });
  }

  addItemToCart(product) {
    const cartDisplay = this.dom.getElement('cartDisplay');
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
      this.dom.insertAdjacentHTML(cartDisplay, 'beforeend', newItemHTML);
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
      this.events.addEventListener(helpButton, 'click', () => {
        this.helpModalObj.toggle();
      });
    }
  }

  setupNotificationBar() {
    NotificationBar.render('top-right');
  }

  performFullUpdate() {
    const cartDisplay = this.dom.getElement('cartDisplay');
    const cartItems = this.calculationEngine.extractCartItemsFromDOM(cartDisplay);

    const pricingResult = this.calculationEngine.calculatePricing(cartItems);
    const pointsResult = this.calculationEngine.calculatePoints(
      cartItems,
      pricingResult.finalAmount
    );

    this.calculationEngine.updateStateFromCalculations(cartItems, pricingResult, pointsResult);

    this.updateOrderSummary(cartItems, pricingResult, pointsResult);
    this.updateTotalAmount();
    this.updateItemCount();
    this.updateStockInfo();
    this.updateProductSelector();
    this.highlightQuantityDiscounts();
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

    this.dom.setInnerHTML(productSelect, newSelect.innerHTML);

    // Restore selection if still valid
    if (currentValue && productSelect.querySelector(`option[value="${currentValue}"]`)) {
      productSelect.value = currentValue;
    }

    // Apply stock warning style
    const totalStock = this.state.getTotalStock();
    this.ui.updateElementStyle(productSelect, 'borderColor', totalStock < 50 ? 'orange' : '');
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
    this.dom.setInnerHTML(summaryDetails, summaryHTML);

    // Update discount information
    if (pricingResult.discountRate > 0 && pricingResult.finalAmount > 0) {
      const savingsHTML = OrderSummary.generateSavingsInfo(orderData.pricing);
      this.dom.setInnerHTML(discountInfo, savingsHTML);
    } else {
      this.dom.setInnerHTML(discountInfo, '');
    }

    // Update points information
    const pointsHTML = OrderSummary.generatePointsInfo(orderData.points);
    if (pointsHTML) {
      this.dom.setInnerHTML(loyaltyPoints, pointsHTML);
      this.ui.updateElementStyle(loyaltyPoints, 'display', 'block');
    } else {
      this.dom.setTextContent(loyaltyPoints, '적립 포인트: 0p');
      this.ui.updateElementStyle(loyaltyPoints, 'display', 'block');
    }

    // Update Tuesday special banner
    const isTuesday = new Date().getDay() === 2;
    const hasTuesdayDiscount = pricingResult.tuesdayDiscount?.discountAmount > 0;

    if (isTuesday && hasTuesdayDiscount) {
      this.dom.removeClass(tuesdaySpecial, 'hidden');
    } else {
      this.dom.addClass(tuesdaySpecial, 'hidden');
    }
  }

  clearOrderSummary() {
    this.dom.setInnerHTML(this.dom.getElement('summaryDetails'), '');
    this.dom.setInnerHTML(this.dom.getElement('discountInfo'), '');
    this.dom.setTextContent(this.dom.getElement('loyaltyPoints'), '적립 포인트: 0p');
    this.ui.updateElementStyle(this.dom.getElement('loyaltyPoints'), 'display', 'none');
    this.dom.addClass(this.dom.getElement('tuesdaySpecial'), 'hidden');
  }

  updateTotalAmount() {
    const cartTotal = this.dom.getElement('cartTotal');
    const totalDiv = cartTotal?.querySelector('.text-2xl');

    if (totalDiv) {
      this.dom.setTextContent(totalDiv, '₩' + Math.round(this.state.totalAmount).toLocaleString());
    }
  }

  updateItemCount() {
    const itemCountElement = this.dom.getElement('itemCount');
    if (itemCountElement) {
      this.dom.setTextContent(itemCountElement, `🛍️ ${this.state.itemCount} items in cart`);
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
          this.ui.updateElementStyle(element, 'fontWeight', quantity >= 10 ? 'bold' : 'normal');
        }
      });
    });
  }
}
