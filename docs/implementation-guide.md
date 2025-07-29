# 클린 코드 리팩토링 구현 가이드

## 1. 단계별 리팩토링 과정

### Phase 1: 상수 정의 및 매직 넘버 제거

#### Step 1.1: 상수 그룹화

```javascript
// Before: 하드코딩된 값들
var PRODUCT_ONE = 'p1';
var p2 = 'p2';
var product_3 = 'p3';
var p4 = 'p4';
var PRODUCT_5 = `p5`;

// After: 일관된 상수 그룹
const PRODUCT_IDS = {
  KEYBOARD: 'p1',
  MOUSE: 'p2',
  MONITOR_ARM: 'p3',
  LAPTOP_CASE: 'p4',
  SPEAKER: 'p5',
};
```

#### Step 1.2: 매직 넘버 제거

```javascript
// Before: 매직 넘버
if (q >= 10) {
  if (curItem.id === PRODUCT_ONE) {
    disc = 10 / 100;
  } else if (curItem.id === p2) {
    disc = 15 / 100;
  }
}

// After: 명명된 상수
const DISCOUNT_THRESHOLDS = {
  INDIVIDUAL_ITEM: 10,
};

const INDIVIDUAL_DISCOUNT_RATES = {
  [PRODUCT_IDS.KEYBOARD]: 0.1,
  [PRODUCT_IDS.MOUSE]: 0.15,
  [PRODUCT_IDS.MONITOR_ARM]: 0.2,
  [PRODUCT_IDS.LAPTOP_CASE]: 0.05,
  [PRODUCT_IDS.SPEAKER]: 0.25,
};

if (quantity >= DISCOUNT_THRESHOLDS.INDIVIDUAL_ITEM) {
  discountRate = INDIVIDUAL_DISCOUNT_RATES[product.id] || 0;
}
```

### Phase 2: 함수 분리 및 단일 책임 원칙 적용

#### Step 2.1: 긴 함수 분리

```javascript
// Before: 100줄 이상의 복잡한 함수
function handleCalculateCartStuff() {
  // 할인 계산
  // 포인트 계산
  // UI 업데이트
  // DOM 조작
  // 100줄 이상의 코드...
}

// After: 단일 책임을 가진 작은 함수들
class DiscountCalculator {
  calculateItemDiscount(product, quantity) {
    if (quantity < DISCOUNT_THRESHOLDS.INDIVIDUAL_ITEM) return 0;
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
}

class PointCalculator {
  calculateBasePoints(totalAmount) {
    return Math.floor(totalAmount * POINT_RATES.BASE_RATE);
  }

  calculateBonusPoints(cartItems, totalQuantity) {
    let bonusPoints = 0;

    if (this.hasKeyboardAndMouse(cartItems)) {
      bonusPoints += POINT_RATES.SET_BONUS;
    }

    if (this.hasFullSet(cartItems)) {
      bonusPoints += POINT_RATES.FULL_SET_BONUS;
    }

    bonusPoints += this.calculateQuantityBonus(totalQuantity);

    return bonusPoints;
  }
}
```

#### Step 2.2: 전역 변수 제거

```javascript
// Before: 전역 변수 의존
var prodList = [...];
var totalAmt = 0;
var itemCnt = 0;

function handleCalculateCartStuff() {
  // 전역 변수 직접 조작
  totalAmt = 0;
  itemCnt = 0;
  // ...
}

// After: 클래스 기반 상태 관리
class CartService {
  constructor() {
    this.items = [];
  }

  getTotalAmount() {
    return this.items.reduce((total, item) => {
      return total + (item.product.price * item.quantity);
    }, 0);
  }

  getTotalQuantity() {
    return this.items.reduce((total, item) => total + item.quantity, 0);
  }

  addItem(product) {
    const existingItem = this.items.find(item => item.product.id === product.id);

    if (existingItem) {
      existingItem.quantity += 1;
    } else {
      this.items.push({ product, quantity: 1 });
    }
  }
}
```

### Phase 3: UI 컴포넌트 분리

#### Step 3.1: 컴포넌트 추출

```javascript
// Before: main() 함수 내에서 모든 UI 생성
function main() {
  var header = document.createElement('div');
  header.className = 'mb-8';
  header.innerHTML = `
    <h1 class="text-xs font-medium tracking-extra-wide uppercase mb-2">
      🛒 Hanghae Online Store
    </h1>
    <div class="text-5xl tracking-tight leading-none">Shopping Cart</div>
    <p id="item-count" class="text-sm text-gray-500 font-normal mt-3">
      🛍️ 0 items in cart
    </p>
  `;
  // 100줄 이상의 UI 생성 코드...
}

// After: 컴포넌트 클래스로 분리
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
      <h1 class="text-xs font-medium tracking-extra-wide uppercase mb-2">
        🛒 Hanghae Online Store
      </h1>
      <div class="text-5xl tracking-tight leading-none">Shopping Cart</div>
      <p id="item-count" class="text-sm text-gray-500 font-normal mt-3">
        🛍️ 0 items in cart
      </p>
    `;
  }

  updateItemCount(count) {
    const itemCountElement = this.element.querySelector('#item-count');
    itemCountElement.textContent = `🛍️ ${count} items in cart`;
  }
}
```

#### Step 3.2: 이벤트 핸들러 분리

```javascript
// Before: 복잡한 이벤트 핸들러
addBtn.addEventListener('click', function () {
  var selItem = sel.value;
  var hasItem = false;
  for (var idx = 0; idx < prodList.length; idx++) {
    if (prodList[idx].id === selItem) {
      hasItem = true;
      break;
    }
  }
  if (!selItem || !hasItem) {
    return;
  }
  // 50줄 이상의 복잡한 로직...
});

// After: 명확한 함수명과 단일 책임
class ShoppingCartApp {
  handleAddToCart(productId) {
    const product = this.productService.getProductById(productId);
    if (!product || product.stock <= 0) {
      return;
    }

    this.cartService.addItem(product);
    this.productService.updateProductStock(productId, 1);
    this.updateUI();
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
}
```

### Phase 4: 명명 규칙 적용

#### Step 4.1: 함수명 표준화

```javascript
// Before: 모호한 함수명
function handleCalculateCartStuff() {}
function doUpdatePricesInCart() {}
function onGetStockTotal() {}

// After: 표준 명명 규칙 적용
class ProductService {
  getProductById(productId) {}
  updateProductStock(productId, quantity) {}
  getTotalStock() {}
}

class DiscountCalculator {
  calculateItemDiscount(product, quantity) {}
  calculateBulkDiscount(totalQuantity) {}
  calculateTuesdayDiscount() {}
}

class CartService {
  addItem(product) {}
  removeItem(productId) {}
  getTotalAmount() {}
  getTotalQuantity() {}
}
```

#### Step 4.2: 변수명 표준화

```javascript
// Before: 모호한 변수명
var prodList;
var bonusPts = 0;
var stockInfo;
var itemCnt;
var lastSel;
var sel;
var addBtn;
var totalAmt = 0;

// After: 명확한 변수명
class ProductService {
  constructor() {
    this.products = this.initializeProducts();
  }

  getLowStockProducts() {
    return this.products.filter(
      (product) => product.stock < UI.LOW_STOCK_THRESHOLD && product.stock > 0,
    );
  }

  getOutOfStockProducts() {
    return this.products.filter((product) => product.stock === 0);
  }
}

class CartService {
  constructor() {
    this.items = [];
  }

  getTotalQuantity() {
    return this.items.reduce((total, item) => total + item.quantity, 0);
  }

  getTotalAmount() {
    return this.items.reduce((total, item) => {
      return total + item.product.price * item.quantity;
    }, 0);
  }
}
```

## 2. 테스트 가능한 구조 만들기

### Step 2.1: 순수 함수 분리

```javascript
// Before: DOM 조작과 비즈니스 로직이 섞여 있음
function handleCalculateCartStuff() {
  // DOM 조작
  var cartItems = cartDisp.children;
  // 비즈니스 로직
  for (let i = 0; i < cartItems.length; i++) {
    // 복잡한 계산 로직
  }
  // 다시 DOM 조작
  totalDiv.textContent = '₩' + Math.round(totalAmt).toLocaleString();
}

// After: 순수 함수로 분리
class DiscountCalculator {
  calculateItemDiscount(product, quantity) {
    if (quantity < DISCOUNT_THRESHOLDS.INDIVIDUAL_ITEM) return 0;
    return INDIVIDUAL_DISCOUNT_RATES[product.id] || 0;
  }

  calculateTotalDiscount(cartItems, totalQuantity) {
    const itemDiscounts = cartItems.map((item) =>
      this.calculateItemDiscount(item.product, item.quantity),
    );

    const maxItemDiscount = Math.max(...itemDiscounts, 0);
    const bulkDiscount = this.calculateBulkDiscount(totalQuantity);
    const tuesdayDiscount = this.calculateTuesdayDiscount();

    const baseDiscount = Math.max(maxItemDiscount, bulkDiscount);
    return baseDiscount + tuesdayDiscount;
  }
}

// 테스트 가능
describe('DiscountCalculator', () => {
  it('should calculate item discount correctly', () => {
    const calculator = new DiscountCalculator();
    const product = { id: 'p1', price: 10000 };

    expect(calculator.calculateItemDiscount(product, 5)).toBe(0);
    expect(calculator.calculateItemDiscount(product, 10)).toBe(0.1);
  });
});
```

### Step 2.2: 의존성 주입

```javascript
// Before: 전역 변수에 의존
var prodList = [...];
function getProductById(productId) {
  return prodList.find(product => product.id === productId);
}

// After: 의존성 주입
class ProductService {
  constructor() {
    this.products = this.initializeProducts();
  }

  getProductById(productId) {
    return this.products.find(product => product.id === productId);
  }
}

class ShoppingCartApp {
  constructor() {
    this.productService = new ProductService();
    this.cartService = new CartService();
    this.discountCalculator = new DiscountCalculator();
  }

  handleAddToCart(productId) {
    const product = this.productService.getProductById(productId);
    // ...
  }
}

// 테스트에서 모킹 가능
describe('ShoppingCartApp', () => {
  it('should add item to cart', () => {
    const mockProductService = {
      getProductById: jest.fn().mockReturnValue({ id: 'p1', stock: 10 })
    };

    const app = new ShoppingCartApp();
    app.productService = mockProductService;

    app.handleAddToCart('p1');

    expect(mockProductService.getProductById).toHaveBeenCalledWith('p1');
  });
});
```

## 3. 성능 최적화

### Step 3.1: 불필요한 계산 제거

```javascript
// Before: 매번 전체 계산
function handleCalculateCartStuff() {
  totalAmt = 0;
  itemCnt = 0;
  // 매번 전체 장바구니를 순회하며 계산
  for (let i = 0; i < cartItems.length; i++) {
    // 복잡한 계산...
  }
}

// After: 캐싱과 효율적인 계산
class CartService {
  constructor() {
    this.items = [];
    this._totalAmount = 0;
    this._totalQuantity = 0;
  }

  addItem(product) {
    const existingItem = this.items.find((item) => item.product.id === product.id);

    if (existingItem) {
      existingItem.quantity += 1;
    } else {
      this.items.push({ product, quantity: 1 });
    }

    this._updateTotals();
  }

  _updateTotals() {
    this._totalQuantity = this.items.reduce((total, item) => total + item.quantity, 0);
    this._totalAmount = this.items.reduce((total, item) => {
      return total + item.product.price * item.quantity;
    }, 0);
  }

  getTotalQuantity() {
    return this._totalQuantity;
  }

  getTotalAmount() {
    return this._totalAmount;
  }
}
```

### Step 3.2: 이벤트 리스너 최적화

```javascript
// Before: 매번 새로운 이벤트 리스너 추가
cartDisp.addEventListener('click', function (event) {
  // 복잡한 이벤트 처리...
});

// After: 이벤트 위임과 명확한 핸들러
class ShoppingCartApp {
  bindCartItemEvents(itemElement) {
    const quantityButtons = itemElement.querySelectorAll('.quantity-change');
    const removeButton = itemElement.querySelector('.remove-item');

    quantityButtons.forEach((button) => {
      button.addEventListener('click', (e) => {
        const productId = e.target.dataset.productId;
        const change = parseInt(e.target.dataset.change);
        this.handleQuantityChange(productId, change);
      });
    });

    removeButton.addEventListener('click', (e) => {
      const productId = e.target.dataset.productId;
      this.handleRemoveItem(productId);
    });
  }
}
```

## 4. 확장성 개선

### Step 4.1: 설정 기반 구조

```javascript
// Before: 하드코딩된 상품 정보
prodList = [
  {
    id: PRODUCT_ONE,
    name: '버그 없애는 키보드',
    val: 10000,
    originalVal: 10000,
    q: 50,
    onSale: false,
    suggestSale: false,
  },
  {
    id: p2,
    name: '생산성 폭발 마우스',
    val: 20000,
    originalVal: 20000,
    q: 30,
    onSale: false,
    suggestSale: false,
  },
  // ...
];

// After: 설정 기반 구조
const PRODUCT_CONFIG = {
  [PRODUCT_IDS.KEYBOARD]: {
    name: '버그 없애는 키보드',
    price: PRICES.KEYBOARD,
    initialStock: 50,
    discountRate: 0.1,
  },
  [PRODUCT_IDS.MOUSE]: {
    name: '생산성 폭발 마우스',
    price: PRICES.MOUSE,
    initialStock: 30,
    discountRate: 0.15,
  },
  // 새로운 상품을 쉽게 추가 가능
};

class ProductService {
  initializeProducts() {
    return Object.entries(PRODUCT_CONFIG).map(([id, config]) => {
      return this.createProduct(id, config.name, config.price, config.initialStock);
    });
  }
}
```

### Step 4.2: 플러그인 아키텍처

```javascript
// Before: 하드코딩된 할인 로직
if (q >= 10) {
  if (curItem.id === PRODUCT_ONE) {
    disc = 10 / 100;
  } else if (curItem.id === p2) {
    disc = 15 / 100;
  }
  // 복잡한 조건문...
}

// After: 플러그인 기반 할인 시스템
class DiscountPlugin {
  constructor(name, condition, rate) {
    this.name = name;
    this.condition = condition;
    this.rate = rate;
  }

  calculateDiscount(context) {
    return this.condition(context) ? this.rate : 0;
  }
}

class DiscountManager {
  constructor() {
    this.plugins = [
      new DiscountPlugin(
        'Individual Item Discount',
        (context) => context.quantity >= DISCOUNT_THRESHOLDS.INDIVIDUAL_ITEM,
        (context) => INDIVIDUAL_DISCOUNT_RATES[context.product.id] || 0,
      ),
      new DiscountPlugin(
        'Bulk Purchase Discount',
        (context) => context.totalQuantity >= DISCOUNT_RATES.BULK_PURCHASE_THRESHOLD,
        () => DISCOUNT_RATES.BULK_PURCHASE_RATE,
      ),
      new DiscountPlugin(
        'Tuesday Special',
        () => new Date().getDay() === 2,
        () => DISCOUNT_RATES.TUESDAY_RATE,
      ),
    ];
  }

  calculateTotalDiscount(context) {
    const discounts = this.plugins.map((plugin) => plugin.calculateDiscount(context));
    return discounts.reduce((total, discount) => total + discount, 0);
  }
}
```

## 5. 구현 체크리스트

### Phase 1: 기초 구조

- [ ] 상수 정의 및 매직 넘버 제거
- [ ] 기본 명명 규칙 적용
- [ ] 전역 변수 제거

### Phase 2: 모듈 분리

- [ ] 상품 관리 모듈 분리
- [ ] 할인 계산 모듈 분리
- [ ] 포인트 계산 모듈 분리
- [ ] 장바구니 관리 모듈 분리

### Phase 3: UI 컴포넌트

- [ ] 헤더 컴포넌트 분리
- [ ] 상품 선택 컴포넌트 분리
- [ ] 장바구니 표시 컴포넌트 분리
- [ ] 주문 요약 컴포넌트 분리

### Phase 4: 이벤트 처리

- [ ] 이벤트 핸들러 분리
- [ ] 에러 처리 개선
- [ ] 사용자 경험 개선

### Phase 5: 최적화

- [ ] 성능 최적화
- [ ] 메모리 사용량 최적화
- [ ] 코드 품질 검사

## 6. 테스트 전략

### 6.1 단위 테스트

```javascript
describe('ProductService', () => {
  let productService;

  beforeEach(() => {
    productService = new ProductService();
  });

  it('should return product by id', () => {
    const product = productService.getProductById('p1');
    expect(product.name).toBe('버그 없애는 키보드');
  });

  it('should update product stock', () => {
    const product = productService.getProductById('p1');
    const initialStock = product.stock;

    productService.updateProductStock('p1', 5);

    expect(product.stock).toBe(initialStock - 5);
  });
});
```

### 6.2 통합 테스트

```javascript
describe('ShoppingCartApp Integration', () => {
  let app;

  beforeEach(() => {
    document.body.innerHTML = '<div id="app"></div>';
    app = new ShoppingCartApp();
  });

  it('should add item to cart and update UI', () => {
    const select = document.getElementById('product-select');
    const addButton = document.getElementById('add-to-cart');

    select.value = 'p1';
    addButton.click();

    const cartItems = document.getElementById('cart-items');
    expect(cartItems.children.length).toBe(1);

    const itemCount = document.getElementById('item-count');
    expect(itemCount.textContent).toContain('1 items in cart');
  });
});
```

이 가이드를 따라 단계별로 리팩토링을 진행하면, 클린 코드 원칙에 부합하는 고품질의 코드를 작성할 수 있습니다.
