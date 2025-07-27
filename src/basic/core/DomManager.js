import { HelpModal } from '../components/HelpModal.js';
import { NotificationBar } from '../components/NotificationBar.js';

export class DOMManager {
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
