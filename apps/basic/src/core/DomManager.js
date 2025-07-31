export class DOMElementManager {
  constructor() {
    this.cachedElements = {};
    this.initializeCachedElements();
  }

  initializeCachedElements() {
    this.cachedElements = {
      rootContainer: document.getElementById('app'),
      productSelectionDropdown: null,
      addToCartButton: null,
      cartItemsContainer: null,
      stockStatusDisplay: null,
      cartTotalAmount: null,
      orderSummaryDetails: null,
      discountInformation: null,
      loyaltyPointsDisplay: null,
      tuesdaySpecialBadge: null,
      itemCountDisplay: null
    };
  }

  createMainApplicationLayout() {
    const { applicationHeader, mainGridContainer, helpButton } =
      this.buildMainLayoutComponents();

    this.cachedElements.rootContainer.appendChild(applicationHeader);
    this.cachedElements.rootContainer.appendChild(mainGridContainer);
    this.cachedElements.rootContainer.appendChild(helpButton);

    this.findAndCacheAllElements();
  }

  buildMainLayoutComponents() {
    const applicationHeader = this.createApplicationHeader();
    const mainGridContainer = this.createMainGridContainer();
    const helpButton = this.createHelpButton();

    return { applicationHeader, mainGridContainer, helpButton };
  }

  createApplicationHeader() {
    const header = document.createElement('div');
    header.className = 'mb-8';
    header.innerHTML = `
      <h1 class="text-xs font-medium tracking-extra-wide uppercase mb-2">🛒 Hanghae Online Store</h1>
      <div class="text-5xl tracking-tight leading-none">Shopping Cart</div>
      <p id="item-count" class="text-sm text-gray-500 font-normal mt-3">🛍️ 0 items in cart</p>
    `;
    return header;
  }

  createMainGridContainer() {
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
    leftColumn.className =
      'bg-white border border-gray-200 p-8 overflow-y-auto';

    const productSelectorContainer = this.createProductSelectorContainer();
    const cartItemsContainer = this.createCartItemsContainer();

    leftColumn.appendChild(productSelectorContainer);
    leftColumn.appendChild(cartItemsContainer);

    return leftColumn;
  }

  createProductSelectorContainer() {
    const container = document.createElement('div');
    container.className = 'mb-6 pb-6 border-b border-gray-200';

    const productSelectionDropdown = this.createProductSelectionDropdown();
    const addToCartButton = this.createAddToCartButton();
    const stockStatusDisplay = this.createStockStatusDisplay();

    container.appendChild(productSelectionDropdown);
    container.appendChild(addToCartButton);
    container.appendChild(stockStatusDisplay);

    // Cache elements for later use
    this.cachedElements.productSelectionDropdown = productSelectionDropdown;
    this.cachedElements.addToCartButton = addToCartButton;
    this.cachedElements.stockStatusDisplay = stockStatusDisplay;

    return container;
  }

  createProductSelectionDropdown() {
    const select = document.createElement('select');
    select.id = 'product-select';
    select.className =
      'w-full p-3 border border-gray-300 rounded-lg text-base mb-3';
    return select;
  }

  createAddToCartButton() {
    const button = document.createElement('button');
    button.id = 'add-to-cart';
    button.innerHTML = 'Add to Cart';
    button.className =
      'w-full py-3 bg-black text-white text-sm font-medium uppercase tracking-wider hover:bg-gray-800 transition-all';
    return button;
  }

  createStockStatusDisplay() {
    const div = document.createElement('div');
    div.id = 'stock-status';
    div.className = 'text-xs text-red-500 mt-3 whitespace-pre-line';
    return div;
  }

  createCartItemsContainer() {
    const div = document.createElement('div');
    div.id = 'cart-items';
    this.cachedElements.cartItemsContainer = div;
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

  createHelpButton() {
    const button = document.createElement('button');
    button.id = 'help-button';
    button.className =
      'fixed top-4 right-4 bg-black text-white p-3 rounded-full hover:bg-gray-900 transition-colors z-50';
    button.innerHTML = `
      <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
      </svg>
    `;
    return button;
  }

  findAndCacheAllElements() {
    this.cachedElements.cartTotalAmount = document.querySelector('#cart-total');
    this.cachedElements.orderSummaryDetails =
      document.getElementById('summary-details');
    this.cachedElements.discountInformation =
      document.getElementById('discount-info');
    this.cachedElements.loyaltyPointsDisplay =
      document.getElementById('loyalty-points');
    this.cachedElements.tuesdaySpecialBadge =
      document.getElementById('tuesday-special');
    this.cachedElements.itemCountDisplay =
      document.getElementById('item-count');
    this.cachedElements.helpButton = document.getElementById('help-button');
  }

  getCachedElement(elementName) {
    return this.cachedElements[elementName];
  }

  // 순수한 DOM 조작 메서드들
  createDOMElement(elementTag, cssClassName = '', innerHTMLContent = '') {
    const element = document.createElement(elementTag);
    if (cssClassName) element.className = cssClassName;
    if (innerHTMLContent) element.innerHTML = innerHTMLContent;
    return element;
  }

  appendChildElement(parentElement, childElement) {
    parentElement.appendChild(childElement);
  }

  insertHTMLContent(element, position, htmlContent) {
    element.insertAdjacentHTML(position, htmlContent);
  }

  setElementInnerHTML(element, htmlContent) {
    element.innerHTML = htmlContent;
  }

  setElementTextContent(element, textContent) {
    element.textContent = textContent;
  }

  addCSSClass(element, cssClassName) {
    element.classList.add(cssClassName);
  }

  removeCSSClass(element, cssClassName) {
    element.classList.remove(cssClassName);
  }

  setElementAttribute(element, attributeName, attributeValue) {
    element.setAttribute(attributeName, attributeValue);
  }

  getElementAttribute(element, attributeName) {
    return element.getAttribute(attributeName);
  }

  findElementBySelector(selector) {
    return document.querySelector(selector);
  }

  findAllElementsBySelector(selector) {
    return document.querySelectorAll(selector);
  }
}
