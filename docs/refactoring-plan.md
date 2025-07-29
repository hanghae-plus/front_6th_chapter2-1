# `src/basic/main.basic.js` 클린 코드 리팩토링 계획

## 1. 개요

이 문서는 `src/basic/main.basic.js` 파일의 현재 코드 상태를 진단하고, 제공된 **"클린 코드 작성 규칙"** 및 **"장바구니 기능 상세 요구사항 명세서 (PRD)"**, 그리고 **기존 테스트 코드**를 기반으로 클린 코드 원칙을 적용하기 위한 리팩토링 계획을 제시합니다.

## 2. 현재 코드 문제점 진단

### 2.1 주요 문제점들

#### A. 명명 규칙 위반

- **예측 불가능한 변수명**: `prodList`, `sel`, `addBtn`, `cartDisp` 등
- **일관성 없는 상수명**: `PRODUCT_ONE`, `p2`, `product_3`, `p4`, `PRODUCT_5`
- **매직 넘버**: `10000`, `20000`, `30000` 등이 하드코딩됨
- **모호한 함수명**: `handleCalculateCartStuff()`, `doUpdatePricesInCart()`

#### B. 단일 책임 원칙 위반

- `main()` 함수가 200줄 이상으로 UI 생성, 이벤트 처리, 비즈니스 로직을 모두 담당
- `handleCalculateCartStuff()` 함수가 할인 계산, 포인트 계산, UI 업데이트를 모두 처리

#### C. 응집도 문제

- 관련된 로직이 여러 함수에 분산됨
- 할인 정책 관련 로직이 여러 곳에 흩어져 있음

#### D. 결합도 문제

- 전역 변수에 과도하게 의존
- DOM 조작과 비즈니스 로직이 강하게 결합됨

#### E. 가독성 문제

- 복잡한 삼항 연산자와 중첩된 조건문
- 매직 넘버와 하드코딩된 값들
- 긴 함수들로 인한 이해 어려움

## 3. 리팩토링 목표

### 3.1 핵심 목표

1. **가독성 향상**: 코드의 의도가 명확히 드러나도록 개선
2. **예측 가능성 확보**: 함수명과 변수명으로 동작을 예측할 수 있도록 개선
3. **응집도 향상**: 관련된 로직을 함께 그룹화
4. **결합도 감소**: 모듈 간 의존성을 최소화
5. **단일 책임 원칙 준수**: 각 함수가 하나의 명확한 책임만 가지도록 개선

### 3.2 구체적 개선 사항

- 함수 길이를 20줄 이하로 제한
- 표준 명명 패턴 적용
- 매직 넘버를 명명된 상수로 대체
- 도메인별 모듈 분리
- 테스트 가능한 구조로 개선

## 4. 리팩토링 전략

### 4.1 단계별 접근

#### Phase 1: 상수 및 타입 정의

```javascript
// 상품 관련 상수
const PRODUCT_IDS = {
  KEYBOARD: 'p1',
  MOUSE: 'p2',
  MONITOR_ARM: 'p3',
  LAPTOP_CASE: 'p4',
  SPEAKER: 'p5'
} as const;

// 가격 관련 상수
const PRICES = {
  KEYBOARD: 10000,
  MOUSE: 20000,
  MONITOR_ARM: 30000,
  LAPTOP_CASE: 15000,
  SPEAKER: 25000
} as const;

// 할인 정책 상수
const DISCOUNT_RATES = {
  BULK_PURCHASE_THRESHOLD: 30,
  BULK_PURCHASE_RATE: 0.25,
  TUESDAY_RATE: 0.10,
  LIGHTNING_SALE_RATE: 0.20,
  RECOMMENDATION_RATE: 0.05
} as const;
```

#### Phase 2: 도메인별 모듈 분리

##### A. 상품 관리 모듈 (`ProductService`)

```javascript
class ProductService {
  constructor() {
    this.products = this.initializeProducts();
  }

  initializeProducts() {
    return [
      this.createProduct(PRODUCT_IDS.KEYBOARD, '버그 없애는 키보드', PRICES.KEYBOARD, 50),
      this.createProduct(PRODUCT_IDS.MOUSE, '생산성 폭발 마우스', PRICES.MOUSE, 30),
      // ...
    ];
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
}
```

##### B. 할인 계산 모듈 (`DiscountCalculator`)

```javascript
class DiscountCalculator {
  calculateItemDiscount(product, quantity) {
    if (quantity < 10) return 0;

    const discountRates = {
      [PRODUCT_IDS.KEYBOARD]: 0.1,
      [PRODUCT_IDS.MOUSE]: 0.15,
      [PRODUCT_IDS.MONITOR_ARM]: 0.2,
      [PRODUCT_IDS.LAPTOP_CASE]: 0.05,
      [PRODUCT_IDS.SPEAKER]: 0.25,
    };

    return discountRates[product.id] || 0;
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
```

##### C. 포인트 계산 모듈 (`PointCalculator`)

```javascript
class PointCalculator {
  calculateBasePoints(totalAmount) {
    return Math.floor(totalAmount / 1000);
  }

  calculateBonusPoints(cartItems, totalQuantity) {
    let bonusPoints = 0;

    // 화요일 2배
    if (this.isTuesday()) {
      bonusPoints *= 2;
    }

    // 세트 보너스
    if (this.hasKeyboardAndMouse(cartItems)) {
      bonusPoints += 50;
    }

    if (this.hasFullSet(cartItems)) {
      bonusPoints += 100;
    }

    // 수량 보너스
    bonusPoints += this.calculateQuantityBonus(totalQuantity);

    return bonusPoints;
  }
}
```

#### Phase 3: UI 컴포넌트 분리

##### A. 헤더 컴포넌트

```javascript
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

##### B. 상품 선택 컴포넌트

```javascript
class ProductSelectorComponent {
  constructor(productService, onProductSelect) {
    this.productService = productService;
    this.onProductSelect = onProductSelect;
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

  updateOptions() {
    const select = this.element.querySelector('#product-select');
    select.innerHTML = '';

    this.productService.products.forEach((product) => {
      const option = this.createProductOption(product);
      select.appendChild(option);
    });
  }

  createProductOption(product) {
    const option = document.createElement('option');
    option.value = product.id;

    const discountText = this.getDiscountText(product);
    const stockText = product.stock === 0 ? ' (품절)' : '';

    option.textContent = `${product.name} - ${product.price}원${stockText}${discountText}`;
    option.disabled = product.stock === 0;

    return option;
  }
}
```

#### Phase 4: 이벤트 핸들러 분리

```javascript
class CartEventHandler {
  constructor(cartService, productService, discountCalculator) {
    this.cartService = cartService;
    this.productService = productService;
    this.discountCalculator = discountCalculator;
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

  handleQuantityChange(productId, change) {
    const cartItem = this.cartService.getItemById(productId);
    if (!cartItem) return;

    const newQuantity = cartItem.quantity + change;

    if (newQuantity <= 0) {
      this.cartService.removeItem(productId);
      this.productService.updateProductStock(productId, -cartItem.quantity);
    } else if (
      newQuantity <=
      this.productService.getProductById(productId).stock + cartItem.quantity
    ) {
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

### 4.2 명명 규칙 적용

#### A. 함수명 표준화

```javascript
// 생성: create~, add~, push~, insert~, new~, append~, spawn~, make~, build~, generate~
createProductSelector();
addItemToCart();
buildCartSummary();

// 조회: get~, fetch~, query~
getProductById();
getCartTotal();
fetchDiscountRate();

// 변환: parse~, split~, transform~, serialize~
parseProductData();
transformPriceToDisplay();
serializeCartData();

// 수정: update~, modify~
updateProductStock();
modifyCartItem();

// 삭제: delete~, remove~
removeItemFromCart();
deleteCartItem();

// 검증: validate~, check~
validateProductAvailability();
checkStockLevel();

// 계산: calc~, compute~
calculateTotalPrice();
computeDiscountAmount();

// 제어: init~, configure~, start~, stop~
initializeCart();
configureDiscountRules();
startLightningSale();

// 저장: save~, store~
saveCartState();
storeUserPreferences();

// 로깅: log~, record~
logCartAction();
recordPurchaseEvent();
```

#### B. 변수명 표준화

```javascript
// 수량: count~, sum~, num~, min~, max~, total
itemCount, totalQuantity, maxStock;

// 상태: is~, has~, current~, selected~
isOnSale, hasStock, currentProduct, selectedItem;

// 진행형/과거형: ~ing, ~ed
isLoading, isCalculating, hasCalculated;

// 정보: ~name, ~title, ~desc, ~text, ~data
productName, itemTitle, cartDesc, displayText, userData;

// 식별자: ~ID, ~code, ~index, ~key
productID, itemCode, cartIndex, userKey;

// 시간: ~at, ~date
createdAt, updatedDate;

// 타입: ~type
productType, discountType;

// 컬렉션: ~s
products, cartItems, discountRules;

// 기타: item, temp, params, error
cartItem, tempData, requestParams, validationError;

// 변환: from(), of()
priceFromOriginal, discountOfItem;
```

### 4.3 매직 넘버 제거

```javascript
// 시간 관련 상수
const TIMING = {
  LIGHTNING_SALE_INTERVAL: 30000,
  RECOMMENDATION_INTERVAL: 60000,
  LIGHTNING_SALE_DELAY_MAX: 10000,
  RECOMMENDATION_DELAY_MAX: 20000
} as const;

// UI 관련 상수
const UI = {
  LOW_STOCK_THRESHOLD: 5,
  TOTAL_STOCK_WARNING_THRESHOLD: 50,
  BORDER_COLOR_WARNING: 'orange'
} as const;

// 할인 기준 수량
const DISCOUNT_THRESHOLDS = {
  INDIVIDUAL_ITEM: 10,
  BULK_PURCHASE: 30
} as const;

// 포인트 적립 기준
const POINT_RATES = {
  BASE_RATE: 0.001, // 0.1%
  TUESDAY_MULTIPLIER: 2,
  SET_BONUS: 50,
  FULL_SET_BONUS: 100,
  QUANTITY_BONUS_10: 20,
  QUANTITY_BONUS_20: 50,
  QUANTITY_BONUS_30: 100
} as const;
```

## 5. 구현 우선순위

### 5.1 Phase 1 (최우선)

1. 상수 정의 및 매직 넘버 제거
2. 기본 명명 규칙 적용
3. 상품 관리 모듈 분리

### 5.2 Phase 2 (고우선)

1. 할인 계산 모듈 분리
2. 포인트 계산 모듈 분리
3. UI 컴포넌트 기본 구조 분리

### 5.3 Phase 3 (중우선)

1. 이벤트 핸들러 분리
2. 테스트 가능한 구조로 개선
3. 에러 처리 개선

### 5.4 Phase 4 (저우선)

1. 성능 최적화
2. 접근성 개선
3. 국제화 지원

## 6. 예상 효과

### 6.1 가독성 향상

- 함수 길이 20줄 이하로 제한
- 명확한 명명 규칙으로 의도 파악 용이
- 매직 넘버 제거로 의미 명확화

### 6.2 유지보수성 향상

- 단일 책임 원칙으로 수정 영향 범위 최소화
- 모듈화로 기능별 독립적 개발 가능
- 테스트 가능한 구조로 버그 조기 발견

### 6.3 확장성 향상

- 새로운 할인 정책 추가 용이
- 새로운 상품 타입 추가 용이
- 새로운 UI 컴포넌트 추가 용이

## 7. 테스트 전략

### 7.1 기존 테스트 보존

- 현재 테스트 코드의 모든 케이스가 통과하도록 보장
- 리팩토링 과정에서 테스트를 지속적으로 실행

### 7.2 새로운 테스트 추가

- 각 모듈별 단위 테스트 추가
- 비즈니스 로직 테스트 강화
- UI 컴포넌트 테스트 추가

## 8. 마이그레이션 계획

### 8.1 점진적 리팩토링

1. 기존 코드와 새로운 코드를 병행 운영
2. 기능별로 점진적 마이그레이션
3. 각 단계별 테스트 통과 확인

### 8.2 롤백 전략

- 각 단계별 백업 지점 확보
- 문제 발생 시 즉시 이전 버전으로 복원 가능

## 9. 결론

이 리팩토링 계획을 통해 현재 코드의 주요 문제점들을 해결하고, 클린 코드 원칙에 부합하는 구조로 개선할 수 있습니다. 단계별 접근을 통해 안전하고 효과적인 리팩토링을 진행할 수 있을 것입니다.
