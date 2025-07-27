import { CartEventHandler } from '../components/CartEventHandler.js';
import { CartItem } from '../components/CartItem.js';
import { NotificationBar } from '../components/NotificationBar.js';
import { ALERT_UI } from '../constants/UIConstants.js';

export class EventManager {
  constructor(state, domManager, calculationEngine, uiUpdater) {
    this.state = state;
    this.domManager = domManager;
    this.calculationEngine = calculationEngine;
    this.uiUpdater = uiUpdater;
  }

  setupEventListeners() {
    this.setupAddToCartListener();
    this.setupCartEventHandlers();
  }

  setupAddToCartListener() {
    const addButton = this.domManager.getElement('addButton');
    const productSelect = this.domManager.getElement('productSelect');
    const cartDisplay = this.domManager.getElement('cartDisplay');

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
    const cartDisplay = this.domManager.getElement('cartDisplay');

    const callbacks = CartEventHandler.createMainBasicCompatibleCallbacks(
      this.state.productList,
      () => this.performFullUpdate(),
      () => this.uiUpdater.updateProductSelector()
    );

    CartEventHandler.setupEventListeners(cartDisplay, callbacks);
  }

  performFullUpdate() {
    const cartDisplay = this.domManager.getElement('cartDisplay');
    const cartItems = this.calculationEngine.extractCartItemsFromDOM(cartDisplay);

    const pricingResult = this.calculationEngine.calculatePricing(cartItems);
    const pointsResult = this.calculationEngine.calculatePoints(
      cartItems,
      pricingResult.finalAmount
    );

    this.calculationEngine.updateStateFromCalculations(cartItems, pricingResult, pointsResult);

    this.uiUpdater.updateOrderSummary(cartItems, pricingResult, pointsResult);
    this.uiUpdater.updateTotalAmount();
    this.uiUpdater.updateItemCount();
    this.uiUpdater.updateStockInfo();
    this.uiUpdater.updateProductSelector();
    this.uiUpdater.highlightQuantityDiscounts();
  }
}
