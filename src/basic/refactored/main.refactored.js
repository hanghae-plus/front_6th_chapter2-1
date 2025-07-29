// ============================================================================
// 상수 정의 (Phase 1)
// ============================================================================

// 상품 관련 상수
const PRODUCT_IDS = {
  KEYBOARD: 'p1',
  MOUSE: 'p2',
  MONITOR_ARM: 'p3',
  LAPTOP_CASE: 'p4',
  SPEAKER: 'p5',
};

// 가격 관련 상수
const PRICES = {
  KEYBOARD: 10000,
  MOUSE: 20000,
  MONITOR_ARM: 30000,
  LAPTOP_CASE: 15000,
  SPEAKER: 25000,
};

// 할인 정책 상수
const DISCOUNT_RATES = {
  BULK_PURCHASE_THRESHOLD: 30,
  BULK_PURCHASE_RATE: 0.25,
  TUESDAY_RATE: 0.1,
  LIGHTNING_SALE_RATE: 0.2,
  RECOMMENDATION_RATE: 0.05,
  INDIVIDUAL_THRESHOLD: 10,
};

// 개별 상품 할인율
const INDIVIDUAL_DISCOUNT_RATES = {
  [PRODUCT_IDS.KEYBOARD]: 0.1,
  [PRODUCT_IDS.MOUSE]: 0.15,
  [PRODUCT_IDS.MONITOR_ARM]: 0.2,
  [PRODUCT_IDS.LAPTOP_CASE]: 0.05,
  [PRODUCT_IDS.SPEAKER]: 0.25,
};

// 시간 관련 상수
const TIMING = {
  LIGHTNING_SALE_INTERVAL: 30000,
  RECOMMENDATION_INTERVAL: 60000,
  LIGHTNING_SALE_DELAY_MAX: 10000,
  RECOMMENDATION_DELAY_MAX: 20000,
};

// UI 관련 상수
const UI = {
  LOW_STOCK_THRESHOLD: 5,
  TOTAL_STOCK_WARNING_THRESHOLD: 50,
  BORDER_COLOR_WARNING: 'orange',
};

// 포인트 적립 기준
const POINT_RATES = {
  BASE_RATE: 0.001, // 0.1%
  TUESDAY_MULTIPLIER: 2,
  SET_BONUS: 50,
  FULL_SET_BONUS: 100,
  QUANTITY_BONUS_10: 20,
  QUANTITY_BONUS_20: 50,
  QUANTITY_BONUS_30: 100,
};

// ============================================================================
// 상품 관리 모듈 (Phase 2)
// ============================================================================

class ProductService {
  constructor() {
    this.products = this.initializeProducts();
  }

  initializeProducts() {
    return [
      this.createProduct(PRODUCT_IDS.KEYBOARD, '버그 없애는 키보드', PRICES.KEYBOARD, 50),
      this.createProduct(PRODUCT_IDS.MOUSE, '생산성 폭발 마우스', PRICES.MOUSE, 30),
      this.createProduct(PRODUCT_IDS.MONITOR_ARM, '거북목 탈출 모니터암', PRICES.MONITOR_ARM, 20),
      this.createProduct(PRODUCT_IDS.LAPTOP_CASE, '에러 방지 노트북 파우치', PRICES.LAPTOP_CASE, 0),
      this.createProduct(PRODUCT_IDS.SPEAKER, '코딩할 때 듣는 Lo-Fi 스피커', PRICES.SPEAKER, 10),
    ];
  }

  createProduct(id, name, originalPrice, initialStock) {
    return {
      id,
      name,
      price: originalPrice,
      originalPrice,
      stock: initialStock,
      isOnSale: false,
      isRecommended: false,
    };
  }

  getProductById(productId) {
    return this.products.find((product) => product.id === productId);
  }

  updateProductStock(productId, quantity) {
    const product = this.getProductById(productId);
    if (product) {
      product.stock -= quantity;
    }
  }

  getTotalStock() {
    return this.products.reduce((total, product) => total + product.stock, 0);
  }

  getLowStockProducts() {
    return this.products.filter(
      (product) => product.stock < UI.LOW_STOCK_THRESHOLD && product.stock > 0,
    );
  }

  getOutOfStockProducts() {
    return this.products.filter((product) => product.stock === 0);
  }

  applyLightningSale(productId) {
    const product = this.getProductById(productId);
    if (product && product.stock > 0 && !product.isOnSale) {
      product.price = Math.round(product.originalPrice * (1 - DISCOUNT_RATES.LIGHTNING_SALE_RATE));
      product.isOnSale = true;
      return true;
    }
    return false;
  }

  applyRecommendationSale(productId) {
    const product = this.getProductById(productId);
    if (product && product.stock > 0 && !product.isRecommended) {
      product.price = Math.round(product.originalPrice * (1 - DISCOUNT_RATES.RECOMMENDATION_RATE));
      product.isRecommended = true;
      return true;
    }
    return false;
  }
}

// ============================================================================
// 할인 계산 모듈 (Phase 2)
// ============================================================================

class DiscountCalculator {
  calculateItemDiscount(product, quantity) {
    if (quantity < DISCOUNT_RATES.INDIVIDUAL_THRESHOLD) return 0;
    return INDIVIDUAL_DISCOUNT_RATES[product.id] || 0;
  }

  calculateBulkDiscount(totalQuantity) {
    return totalQuantity >= DISCOUNT_RATES.BULK_PURCHASE_THRESHOLD
      ? DISCOUNT_RATES.BULK_PURCHASE_RATE
      : 0;
  }

  calculateTuesdayDiscount() {
    const today = new Date();
    return today.getDay() === 2 ? DISCOUNT_RATES.TUESDAY_RATE : 0;
  }

  calculateTotalDiscount(cartItems, totalQuantity) {
    const itemDiscounts = cartItems.map((item) =>
      this.calculateItemDiscount(item.product, item.quantity),
    );

    const maxItemDiscount = Math.max(...itemDiscounts, 0);
    const bulkDiscount = this.calculateBulkDiscount(totalQuantity);
    const tuesdayDiscount = this.calculateTuesdayDiscount();

    // 더 큰 할인율 적용 (개별 vs 전체)
    const baseDiscount = Math.max(maxItemDiscount, bulkDiscount);

    // 화요일 할인은 중복 적용
    return baseDiscount + tuesdayDiscount;
  }
}

// ============================================================================
// 포인트 계산 모듈 (Phase 2)
// ============================================================================

class PointCalculator {
  calculateBasePoints(totalAmount) {
    return Math.floor(totalAmount * POINT_RATES.BASE_RATE);
  }

  isTuesday() {
    return new Date().getDay() === 2;
  }

  hasKeyboardAndMouse(cartItems) {
    const hasKeyboard = cartItems.some((item) => item.product.id === PRODUCT_IDS.KEYBOARD);
    const hasMouse = cartItems.some((item) => item.product.id === PRODUCT_IDS.MOUSE);
    return hasKeyboard && hasMouse;
  }

  hasFullSet(cartItems) {
    const hasKeyboard = cartItems.some((item) => item.product.id === PRODUCT_IDS.KEYBOARD);
    const hasMouse = cartItems.some((item) => item.product.id === PRODUCT_IDS.MOUSE);
    const hasMonitorArm = cartItems.some((item) => item.product.id === PRODUCT_IDS.MONITOR_ARM);
    return hasKeyboard && hasMouse && hasMonitorArm;
  }

  calculateQuantityBonus(totalQuantity) {
    if (totalQuantity >= 30) return POINT_RATES.QUANTITY_BONUS_30;
    if (totalQuantity >= 20) return POINT_RATES.QUANTITY_BONUS_20;
    if (totalQuantity >= 10) return POINT_RATES.QUANTITY_BONUS_10;
    return 0;
  }

  calculateBonusPoints(cartItems, totalQuantity) {
    let bonusPoints = 0;

    // 세트 보너스
    if (this.hasKeyboardAndMouse(cartItems)) {
      bonusPoints += POINT_RATES.SET_BONUS;
    }

    if (this.hasFullSet(cartItems)) {
      bonusPoints += POINT_RATES.FULL_SET_BONUS;
    }

    // 수량 보너스
    bonusPoints += this.calculateQuantityBonus(totalQuantity);

    return bonusPoints;
  }

  calculateTotalPoints(totalAmount, cartItems, totalQuantity) {
    let basePoints = this.calculateBasePoints(totalAmount);

    // 화요일 2배
    if (this.isTuesday()) {
      basePoints *= POINT_RATES.TUESDAY_MULTIPLIER;
    }

    const bonusPoints = this.calculateBonusPoints(cartItems, totalQuantity);

    return basePoints + bonusPoints;
  }
}

// ============================================================================
// 장바구니 관리 모듈 (Phase 2)
// ============================================================================

class CartService {
  constructor() {
    this.items = [];
  }

  addItem(product) {
    const existingItem = this.items.find((item) => item.product.id === product.id);

    if (existingItem) {
      existingItem.quantity += 1;
    } else {
      this.items.push({
        product,
        quantity: 1,
      });
    }
  }

  removeItem(productId) {
    this.items = this.items.filter((item) => item.product.id !== productId);
  }

  updateItemQuantity(productId, newQuantity) {
    const item = this.items.find((item) => item.product.id === productId);
    if (item) {
      if (newQuantity <= 0) {
        this.removeItem(productId);
      } else {
        item.quantity = newQuantity;
      }
    }
  }

  getItemById(productId) {
    return this.items.find((item) => item.product.id === productId);
  }

  getTotalQuantity() {
    return this.items.reduce((total, item) => total + item.quantity, 0);
  }

  getTotalAmount() {
    return this.items.reduce((total, item) => {
      return total + item.product.price * item.quantity;
    }, 0);
  }

  clear() {
    this.items = [];
  }
}

// ============================================================================
// UI 컴포넌트 (Phase 3)
// ============================================================================

class HeaderComponent {
  constructor() {
    this.element = this.createElement();
  }

  createElement() {
    const header = document.createElement('div');
    header.className = 'mb-8';
    header.innerHTML = this.getHeaderTemplate();
    return header;
  }

  getHeaderTemplate() {
    return `
      <h1 class="text-xs font-medium tracking-extra-wide uppercase mb-2">🛒 Hanghae Online Store</h1>
      <div class="text-5xl tracking-tight leading-none">Shopping Cart</div>
      <p id="item-count" class="text-sm text-gray-500 font-normal mt-3">🛍️ 0 items in cart</p>
    `;
  }

  updateItemCount(count) {
    const itemCountElement = this.element.querySelector('#item-count');
    itemCountElement.textContent = `🛍️ ${count} items in cart`;
  }
}

class ProductSelectorComponent {
  constructor(productService, onAddToCart) {
    this.productService = productService;
    this.onAddToCart = onAddToCart;
    this.element = this.createElement();
    this.bindEvents();
  }

  createElement() {
    const container = document.createElement('div');
    container.className = 'mb-6 pb-6 border-b border-gray-200';

    const select = document.createElement('select');
    select.id = 'product-select';
    select.className = 'w-full p-3 border border-gray-300 rounded-lg text-base mb-3';

    const addButton = document.createElement('button');
    addButton.id = 'add-to-cart';
    addButton.innerHTML = 'Add to Cart';
    addButton.className =
      'w-full py-3 bg-black text-white text-sm font-medium uppercase tracking-wider hover:bg-gray-800 transition-all';

    const stockInfo = document.createElement('div');
    stockInfo.id = 'stock-status';
    stockInfo.className = 'text-xs text-red-500 mt-3 whitespace-pre-line';

    container.appendChild(select);
    container.appendChild(addButton);
    container.appendChild(stockInfo);

    return container;
  }

  bindEvents() {
    const addButton = this.element.querySelector('#add-to-cart');
    addButton.addEventListener('click', () => {
      const select = this.element.querySelector('#product-select');
      const selectedProductId = select.value;
      this.onAddToCart(selectedProductId);
    });
  }

  updateOptions() {
    const select = this.element.querySelector('#product-select');
    select.innerHTML = '';

    this.productService.products.forEach((product) => {
      const option = this.createProductOption(product);
      select.appendChild(option);
    });

    this.updateBorderColor();
  }

  createProductOption(product) {
    const option = document.createElement('option');
    option.value = product.id;

    const discountText = this.getDiscountText(product);
    const stockText = product.stock === 0 ? ' (품절)' : '';

    option.textContent = `${product.name} - ${product.price}원${stockText}${discountText}`;
    option.disabled = product.stock === 0;

    if (product.isOnSale && product.isRecommended) {
      option.className = 'text-purple-600 font-bold';
    } else if (product.isOnSale) {
      option.className = 'text-red-500 font-bold';
    } else if (product.isRecommended) {
      option.className = 'text-blue-500 font-bold';
    }

    return option;
  }

  getDiscountText(product) {
    let text = '';
    if (product.isOnSale) text += ' ⚡SALE';
    if (product.isRecommended) text += ' 💝추천';
    return text;
  }

  updateBorderColor() {
    const select = this.element.querySelector('#product-select');
    const totalStock = this.productService.getTotalStock();

    if (totalStock < UI.TOTAL_STOCK_WARNING_THRESHOLD) {
      select.style.borderColor = UI.BORDER_COLOR_WARNING;
    } else {
      select.style.borderColor = '';
    }
  }

  updateStockInfo() {
    const stockInfo = this.element.querySelector('#stock-status');
    const lowStockProducts = this.productService.getLowStockProducts();
    const outOfStockProducts = this.productService.getOutOfStockProducts();

    let message = '';

    lowStockProducts.forEach((product) => {
      message += `${product.name}: 재고 부족 (${product.stock}개 남음)\n`;
    });

    outOfStockProducts.forEach((product) => {
      message += `${product.name}: 품절\n`;
    });

    stockInfo.textContent = message;
  }
}

// ============================================================================
// 메인 애플리케이션 클래스
// ============================================================================

class ShoppingCartApp {
  constructor() {
    this.productService = new ProductService();
    this.cartService = new CartService();
    this.discountCalculator = new DiscountCalculator();
    this.pointCalculator = new PointCalculator();

    this.headerComponent = new HeaderComponent();
    this.productSelectorComponent = new ProductSelectorComponent(
      this.productService,
      this.handleAddToCart.bind(this),
    );

    this.initializeUI();
    this.startSpecialSales();
  }

  initializeUI() {
    const root = document.getElementById('app');

    // 헤더 추가
    root.appendChild(this.headerComponent.element);

    // 그리드 컨테이너 생성
    const gridContainer = this.createGridContainer();
    root.appendChild(gridContainer);

    // 상품 선택기 추가
    const leftColumn = gridContainer.querySelector('.left-column');
    leftColumn.appendChild(this.productSelectorComponent.element);

    // 장바구니 표시 영역 추가
    const cartDisplay = this.createCartDisplay();
    leftColumn.appendChild(cartDisplay);

    // 옵션 업데이트
    this.productSelectorComponent.updateOptions();
    this.productSelectorComponent.updateStockInfo();
  }

  createGridContainer() {
    const gridContainer = document.createElement('div');
    gridContainer.className =
      'grid grid-cols-1 lg:grid-cols-[1fr_360px] gap-6 flex-1 overflow-hidden';

    const leftColumn = document.createElement('div');
    leftColumn.className = 'bg-white border border-gray-200 p-8 overflow-y-auto';

    const rightColumn = this.createOrderSummary();

    gridContainer.appendChild(leftColumn);
    gridContainer.appendChild(rightColumn);

    return gridContainer;
  }

  createOrderSummary() {
    const rightColumn = document.createElement('div');
    rightColumn.className = 'bg-black text-white p-8 flex flex-col';
    rightColumn.innerHTML = this.getOrderSummaryTemplate();

    return rightColumn;
  }

  getOrderSummaryTemplate() {
    return `
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
  }

  createCartDisplay() {
    const cartDisplay = document.createElement('div');
    cartDisplay.id = 'cart-items';
    return cartDisplay;
  }

  handleAddToCart(productId) {
    const product = this.productService.getProductById(productId);
    if (!product || product.stock <= 0) {
      return;
    }

    this.cartService.addItem(product);
    this.productService.updateProductStock(productId, 1);
    this.updateUI();
  }

  updateUI() {
    this.updateHeader();
    this.updateCartDisplay();
    this.updateOrderSummary();
    this.updateProductSelector();
  }

  updateHeader() {
    const totalQuantity = this.cartService.getTotalQuantity();
    this.headerComponent.updateItemCount(totalQuantity);
  }

  updateCartDisplay() {
    const cartDisplay = document.getElementById('cart-items');
    cartDisplay.innerHTML = '';

    this.cartService.items.forEach((item) => {
      const cartItemElement = this.createCartItemElement(item);
      cartDisplay.appendChild(cartItemElement);
    });
  }

  createCartItemElement(item) {
    const itemElement = document.createElement('div');
    itemElement.id = item.product.id;
    itemElement.className =
      'grid grid-cols-[80px_1fr_auto] gap-5 py-5 border-b border-gray-100 first:pt-0 last:border-b-0 last:pb-0';

    const discountText = this.getProductDiscountText(item.product);

    itemElement.innerHTML = `
      <div class="w-20 h-20 bg-gradient-black relative overflow-hidden">
        <div class="absolute top-1/2 left-1/2 w-[60%] h-[60%] bg-white/10 -translate-x-1/2 -translate-y-1/2 rotate-45"></div>
      </div>
      <div>
        <h3 class="text-base font-normal mb-1 tracking-tight">${discountText}${
      item.product.name
    }</h3>
        <p class="text-xs text-gray-500 mb-0.5 tracking-wide">PRODUCT</p>
        <p class="text-xs text-black mb-3">${this.getPriceDisplayText(item.product)}</p>
        <div class="flex items-center gap-4">
          <button class="quantity-change w-6 h-6 border border-black bg-white text-sm flex items-center justify-center transition-all hover:bg-black hover:text-white" data-product-id="${
            item.product.id
          }" data-change="-1">−</button>
          <span class="quantity-number text-sm font-normal min-w-[20px] text-center tabular-nums">${
            item.quantity
          }</span>
          <button class="quantity-change w-6 h-6 border border-black bg-white text-sm flex items-center justify-center transition-all hover:bg-black hover:text-white" data-product-id="${
            item.product.id
          }" data-change="1">+</button>
        </div>
      </div>
      <div class="text-right">
        <div class="text-lg mb-2 tracking-tight tabular-nums">${this.getPriceDisplayText(
          item.product,
        )}</div>
        <a class="remove-item text-2xs text-gray-500 uppercase tracking-wider cursor-pointer transition-colors border-b border-transparent hover:text-black hover:border-black" data-product-id="${
          item.product.id
        }">Remove</a>
      </div>
    `;

    this.bindCartItemEvents(itemElement);

    return itemElement;
  }

  getProductDiscountText(product) {
    if (product.isOnSale && product.isRecommended) return '⚡💝';
    if (product.isOnSale) return '⚡';
    if (product.isRecommended) return '💝';
    return '';
  }

  getPriceDisplayText(product) {
    if (product.isOnSale || product.isRecommended) {
      const discountClass =
        product.isOnSale && product.isRecommended
          ? 'text-purple-600'
          : product.isOnSale
          ? 'text-red-500'
          : 'text-blue-500';
      return `<span class="line-through text-gray-400">₩${product.originalPrice.toLocaleString()}</span> <span class="${discountClass}">₩${product.price.toLocaleString()}</span>`;
    }
    return `₩${product.price.toLocaleString()}`;
  }

  bindCartItemEvents(itemElement) {
    const quantityButtons = itemElement.querySelectorAll('.quantity-change');
    const removeButton = itemElement.querySelector('.remove-item');

    quantityButtons.forEach((button) => {
      button.addEventListener('click', (e) => {
        const {productId} = e.target.dataset;
        const change = parseInt(e.target.dataset.change);
        this.handleQuantityChange(productId, change);
      });
    });

    removeButton.addEventListener('click', (e) => {
      const {productId} = e.target.dataset;
      this.handleRemoveItem(productId);
    });
  }

  handleQuantityChange(productId, change) {
    const cartItem = this.cartService.getItemById(productId);
    if (!cartItem) return;

    const newQuantity = cartItem.quantity + change;
    const product = this.productService.getProductById(productId);

    if (newQuantity <= 0) {
      this.cartService.removeItem(productId);
      this.productService.updateProductStock(productId, -cartItem.quantity);
    } else if (newQuantity <= product.stock + cartItem.quantity) {
      cartItem.quantity = newQuantity;
      this.productService.updateProductStock(productId, change);
    } else {
      alert('재고가 부족합니다.');
      return;
    }

    this.updateUI();
  }

  handleRemoveItem(productId) {
    const cartItem = this.cartService.getItemById(productId);
    if (cartItem) {
      this.productService.updateProductStock(productId, -cartItem.quantity);
      this.cartService.removeItem(productId);
      this.updateUI();
    }
  }

  updateOrderSummary() {
    this.updateSummaryDetails();
    this.updateTotalAmount();
    this.updateLoyaltyPoints();
    this.updateDiscountInfo();
    this.updateTuesdaySpecial();
  }

  updateSummaryDetails() {
    const summaryDetails = document.getElementById('summary-details');
    summaryDetails.innerHTML = '';

    if (this.cartService.items.length === 0) return;

    this.cartService.items.forEach((item) => {
      const itemTotal = item.product.price * item.quantity;
      summaryDetails.innerHTML += `
        <div class="flex justify-between text-xs tracking-wide text-gray-400">
          <span>${item.product.name} x ${item.quantity}</span>
          <span>₩${itemTotal.toLocaleString()}</span>
        </div>
      `;
    });

    const subtotal = this.cartService.getTotalAmount();
    summaryDetails.innerHTML += `
      <div class="border-t border-white/10 my-3"></div>
      <div class="flex justify-between text-sm tracking-wide">
        <span>Subtotal</span>
        <span>₩${subtotal.toLocaleString()}</span>
      </div>
    `;
  }

  updateTotalAmount() {
    const totalAmount = this.cartService.getTotalAmount();
    const totalQuantity = this.cartService.getTotalQuantity();

    const discountRate = this.discountCalculator.calculateTotalDiscount(
      this.cartService.items,
      totalQuantity,
    );

    const finalAmount = Math.round(totalAmount * (1 - discountRate));

    const totalElement = document.querySelector('#cart-total .text-2xl');
    if (totalElement) {
      totalElement.textContent = `₩${finalAmount.toLocaleString()}`;
    }
  }

  updateLoyaltyPoints() {
    const totalAmount = this.cartService.getTotalAmount();
    const totalQuantity = this.cartService.getTotalQuantity();

    const discountRate = this.discountCalculator.calculateTotalDiscount(
      this.cartService.items,
      totalQuantity,
    );
    const finalAmount = Math.round(totalAmount * (1 - discountRate));

    const totalPoints = this.pointCalculator.calculateTotalPoints(
      finalAmount,
      this.cartService.items,
      totalQuantity,
    );

    const loyaltyPointsElement = document.getElementById('loyalty-points');
    if (loyaltyPointsElement) {
      loyaltyPointsElement.textContent = `적립 포인트: ${totalPoints}p`;
    }
  }

  updateDiscountInfo() {
    const discountInfo = document.getElementById('discount-info');
    const totalAmount = this.cartService.getTotalAmount();
    const totalQuantity = this.cartService.getTotalQuantity();

    const discountRate = this.discountCalculator.calculateTotalDiscount(
      this.cartService.items,
      totalQuantity,
    );

    if (discountRate > 0 && totalAmount > 0) {
      const savedAmount = Math.round(totalAmount * discountRate);
      discountInfo.innerHTML = `
        <div class="bg-green-500/20 rounded-lg p-3">
          <div class="flex justify-between items-center mb-1">
            <span class="text-xs uppercase tracking-wide text-green-400">총 할인율</span>
            <span class="text-sm font-medium text-green-400">${(discountRate * 100).toFixed(
              1,
            )}%</span>
          </div>
          <div class="text-2xs text-gray-300">₩${savedAmount.toLocaleString()} 할인되었습니다</div>
        </div>
      `;
    } else {
      discountInfo.innerHTML = '';
    }
  }

  updateTuesdaySpecial() {
    const tuesdaySpecial = document.getElementById('tuesday-special');
    const isTuesday = new Date().getDay() === 2;
    const hasItems = this.cartService.items.length > 0;

    if (isTuesday && hasItems) {
      tuesdaySpecial.classList.remove('hidden');
    } else {
      tuesdaySpecial.classList.add('hidden');
    }
  }

  updateProductSelector() {
    this.productSelectorComponent.updateOptions();
    this.productSelectorComponent.updateStockInfo();
  }

  startSpecialSales() {
    // 번개세일 시작
    const lightningDelay = Math.random() * TIMING.LIGHTNING_SALE_DELAY_MAX;
    setTimeout(() => {
      setInterval(() => {
        const luckyIndex = Math.floor(Math.random() * this.productService.products.length);
        const luckyProduct = this.productService.products[luckyIndex];

        if (this.productService.applyLightningSale(luckyProduct.id)) {
          alert(`⚡번개세일! ${luckyProduct.name}이(가) 20% 할인 중입니다!`);
          this.updateUI();
        }
      }, TIMING.LIGHTNING_SALE_INTERVAL);
    }, lightningDelay);

    // 추천할인 시작
    const recommendationDelay = Math.random() * TIMING.RECOMMENDATION_DELAY_MAX;
    setTimeout(() => {
      setInterval(() => {
        if (this.cartService.items.length === 0) return;

        const lastSelectedProduct =
          this.cartService.items[this.cartService.items.length - 1].product;
        const availableProducts = this.productService.products.filter(
          (product) =>
            product.id !== lastSelectedProduct.id && product.stock > 0 && !product.isRecommended,
        );

        if (availableProducts.length > 0) {
          const recommendProduct = availableProducts[0];
          if (this.productService.applyRecommendationSale(recommendProduct.id)) {
            alert(`💝 ${recommendProduct.name}은(는) 어떠세요? 지금 구매하시면 5% 추가 할인!`);
            this.updateUI();
          }
        }
      }, TIMING.RECOMMENDATION_INTERVAL);
    }, recommendationDelay);
  }
}

// ============================================================================
// 애플리케이션 초기화
// ============================================================================

function initializeApp() {
  new ShoppingCartApp();
}

// DOM이 로드된 후 애플리케이션 시작
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', initializeApp);
} else {
  initializeApp();
}
