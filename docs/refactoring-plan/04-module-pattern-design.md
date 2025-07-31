# 🏗️ 모듈 패턴 설계

## 📋 개요

본 문서는 전역 변수 문제를 해결하기 위한 모듈 패턴 설계를 상세히 제시합니다.

## 🎯 모듈 패턴의 목적

### 현재 문제점

```javascript
// 현재: 전역 변수 오염
var prodList, sel, addBtn, cartDisp, sum, stockInfo;
var lastSel,
  bonusPts = 0,
  totalAmt = 0,
  itemCnt = 0;
```

### 해결 목표

- 전역 스코프 오염 방지
- 상태 관리 중앙화
- 캡슐화를 통한 데이터 보호
- 명확한 Public API 제공

## 🏛️ 모듈 패턴 아키텍처

### 1. 전체 구조 설계

```javascript
const ShoppingCart = (() => {
  // ===== Private State =====
  let state = {
    products: [],
    cart: [],
    totalAmount: 0,
    itemCount: 0,
    lastSelected: null,
    bonusPoints: 0,
    ui: {
      productSelector: null,
      addButton: null,
      cartDisplay: null,
      summaryElement: null,
      stockInformation: null,
    },
  };

  // ===== Private Functions =====
  function initializeProducts() {}
  function calculateSubtotal() {}
  function applyDiscounts() {}
  function calculatePoints() {}
  function updateUI() {}
  function handleEvents() {}

  // ===== Public API =====
  return {
    init,
    addToCart,
    removeFromCart,
    updateQuantity,
    calculateTotal,
    getState,
    destroy,
  };
})();
```

### 2. 상태 관리 설계

#### 2.1 상태 객체 구조

```javascript
const state = {
  // 상품 데이터
  products: [
    {
      id: 'p1',
      name: '버그 없애는 키보드',
      price: 10000,
      originalPrice: 10000,
      quantity: 50,
      onSale: false,
      suggestSale: false,
    },
    // ... 더 많은 상품
  ],

  // 장바구니 데이터
  cart: [
    {
      productId: 'p1',
      quantity: 2,
      price: 10000,
    },
  ],

  // 계산 결과
  totalAmount: 0,
  itemCount: 0,
  bonusPoints: 0,

  // UI 상태
  lastSelected: null,

  // DOM 요소 참조
  ui: {
    productSelector: null,
    addButton: null,
    cartDisplay: null,
    summaryElement: null,
    stockInformation: null,
  },
};
```

#### 2.2 상태 접근 메서드

```javascript
// Private 상태 접근 함수들
function getProducts() {
  return [...state.products]; // 복사본 반환
}

function getCart() {
  return [...state.cart];
}

function getTotalAmount() {
  return state.totalAmount;
}

function setTotalAmount(amount) {
  state.totalAmount = amount;
}

function updateProduct(productId, updates) {
  const product = state.products.find(p => p.id === productId);
  if (product) {
    Object.assign(product, updates);
  }
}
```

### 3. Private 함수 설계

#### 3.1 초기화 함수

```javascript
function initializeProducts() {
  state.products = [
    {
      id: 'p1',
      name: '버그 없애는 키보드',
      price: 10000,
      originalPrice: 10000,
      quantity: 50,
      onSale: false,
      suggestSale: false,
    },
    {
      id: 'p2',
      name: '생산성 폭발 마우스',
      price: 20000,
      originalPrice: 20000,
      quantity: 30,
      onSale: false,
      suggestSale: false,
    },
    // ... 나머지 상품들
  ];
}

function initializeUI() {
  state.ui.productSelector = document.getElementById('product-select');
  state.ui.addButton = document.getElementById('add-to-cart');
  state.ui.cartDisplay = document.getElementById('cart-items');
  state.ui.summaryElement = document.getElementById('cart-total');
  state.ui.stockInformation = document.getElementById('stock-status');
}
```

#### 3.2 계산 함수들

```javascript
function calculateSubtotal() {
  return state.cart.reduce((total, item) => {
    const product = state.products.find(p => p.id === item.productId);
    return total + product.price * item.quantity;
  }, 0);
}

function applyDiscounts(subtotal) {
  let discountedTotal = subtotal;

  // 개별 상품 할인
  state.cart.forEach(item => {
    if (item.quantity >= 10) {
      const product = state.products.find(p => p.id === item.productId);
      const discountRate = getProductDiscountRate(product.id);
      discountedTotal -= product.price * item.quantity * discountRate;
    }
  });

  // 전체 수량 할인
  if (state.itemCount >= 30) {
    discountedTotal *= 0.75; // 25% 할인
  }

  // 화요일 할인
  if (isTuesday()) {
    discountedTotal *= 0.9; // 10% 할인
  }

  return discountedTotal;
}

function calculatePoints(totalAmount) {
  let points = Math.floor(totalAmount / 1000);

  if (isTuesday()) {
    points *= 2;
  }

  // 추가 보너스 포인트
  points += calculateBonusPoints();

  return points;
}
```

#### 3.3 UI 업데이트 함수들

```javascript
function updateProductSelector() {
  const selector = state.ui.productSelector;
  if (!selector) return;

  selector.innerHTML = '';

  state.products.forEach(product => {
    const option = document.createElement('option');
    option.value = product.id;
    option.textContent = formatProductOption(product);
    option.disabled = product.quantity === 0;
    selector.appendChild(option);
  });
}

function updateCartDisplay() {
  const cartDisplay = state.ui.cartDisplay;
  if (!cartDisplay) return;

  cartDisplay.innerHTML = '';

  state.cart.forEach(item => {
    const product = state.products.find(p => p.id === item.productId);
    const element = createCartItemElement(product, item);
    cartDisplay.appendChild(element);
  });
}

function updateSummary() {
  const summaryElement = state.ui.summaryElement;
  if (!summaryElement) return;

  const totalDiv = summaryElement.querySelector('.text-2xl');
  if (totalDiv) {
    totalDiv.textContent = `₩${state.totalAmount.toLocaleString()}`;
  }

  const pointsDiv = document.getElementById('loyalty-points');
  if (pointsDiv) {
    pointsDiv.textContent = `적립 포인트: ${state.bonusPoints}p`;
  }
}
```

### 4. Public API 설계

#### 4.1 초기화 및 정리

```javascript
function init() {
  initializeProducts();
  initializeUI();
  updateProductSelector();
  handleEvents();
  startSpecialSales();
}

function destroy() {
  // 이벤트 리스너 제거
  if (state.ui.addButton) {
    state.ui.addButton.removeEventListener('click', handleAddToCart);
  }

  // 상태 초기화
  state = {
    products: [],
    cart: [],
    totalAmount: 0,
    itemCount: 0,
    lastSelected: null,
    bonusPoints: 0,
    ui: {
      productSelector: null,
      addButton: null,
      cartDisplay: null,
      summaryElement: null,
      stockInformation: null,
    },
  };
}
```

#### 4.2 장바구니 조작

```javascript
function addToCart(productId) {
  const product = state.products.find(p => p.id === productId);
  if (!product || product.quantity <= 0) {
    return false;
  }

  const existingItem = state.cart.find(item => item.productId === productId);

  if (existingItem) {
    existingItem.quantity++;
  } else {
    state.cart.push({
      productId,
      quantity: 1,
      price: product.price,
    });
  }

  product.quantity--;
  state.lastSelected = productId;

  recalculate();
  updateUI();

  return true;
}

function removeFromCart(productId) {
  const itemIndex = state.cart.findIndex(item => item.productId === productId);
  if (itemIndex === -1) return false;

  const item = state.cart[itemIndex];
  const product = state.products.find(p => p.id === productId);

  if (product) {
    product.quantity += item.quantity;
  }

  state.cart.splice(itemIndex, 1);

  recalculate();
  updateUI();

  return true;
}

function updateQuantity(productId, newQuantity) {
  const item = state.cart.find(item => item.productId === productId);
  const product = state.products.find(p => p.id === productId);

  if (!item || !product) return false;

  const quantityDifference = newQuantity - item.quantity;

  if (product.quantity < quantityDifference) {
    return false; // 재고 부족
  }

  item.quantity = newQuantity;
  product.quantity -= quantityDifference;

  if (newQuantity <= 0) {
    removeFromCart(productId);
  } else {
    recalculate();
    updateUI();
  }

  return true;
}
```

#### 4.3 계산 및 조회

```javascript
function calculateTotal() {
  const subtotal = calculateSubtotal();
  const discountedTotal = applyDiscounts(subtotal);
  const points = calculatePoints(discountedTotal);

  state.totalAmount = discountedTotal;
  state.bonusPoints = points;

  return {
    subtotal,
    discountedTotal,
    points,
  };
}

function getState() {
  return {
    products: getProducts(),
    cart: getCart(),
    totalAmount: state.totalAmount,
    itemCount: state.itemCount,
    bonusPoints: state.bonusPoints,
  };
}
```

### 5. 이벤트 핸들링

#### 5.1 이벤트 리스너 설정

```javascript
function handleEvents() {
  if (state.ui.addButton) {
    state.ui.addButton.addEventListener('click', handleAddToCart);
  }

  if (state.ui.cartDisplay) {
    state.ui.cartDisplay.addEventListener('click', handleCartClick);
  }
}

function handleAddToCart() {
  const selector = state.ui.productSelector;
  if (!selector) return;

  const selectedProductId = selector.value;
  if (!selectedProductId) return;

  addToCart(selectedProductId);
}

function handleCartClick(event) {
  const target = event.target;

  if (target.classList.contains('quantity-change')) {
    const productId = target.dataset.productId;
    const change = parseInt(target.dataset.change);
    const item = state.cart.find(item => item.productId === productId);

    if (item) {
      updateQuantity(productId, item.quantity + change);
    }
  } else if (target.classList.contains('remove-item')) {
    const productId = target.dataset.productId;
    removeFromCart(productId);
  }
}
```

### 6. 특별 세일 시스템

#### 6.1 번개세일

```javascript
function startSpecialSales() {
  // 번개세일 시작
  setTimeout(() => {
    setInterval(() => {
      const availableProducts = state.products.filter(
        p => p.quantity > 0 && !p.onSale
      );
      if (availableProducts.length > 0) {
        const randomProduct =
          availableProducts[
            Math.floor(Math.random() * availableProducts.length)
          ];
        applyLightningSale(randomProduct);
      }
    }, 30000);
  }, Math.random() * 10000);
}

function applyLightningSale(product) {
  product.price = Math.round(product.originalPrice * 0.8);
  product.onSale = true;

  alert(`⚡번개세일! ${product.name}이(가) 20% 할인 중입니다!`);

  updateProductSelector();
  updateUI();
}
```

#### 6.2 추천할인

```javascript
function startRecommendationSales() {
  setTimeout(() => {
    setInterval(() => {
      if (state.cart.length > 0 && state.lastSelected) {
        const availableProducts = state.products.filter(
          p => p.id !== state.lastSelected && p.quantity > 0 && !p.suggestSale
        );

        if (availableProducts.length > 0) {
          const recommendProduct = availableProducts[0];
          applyRecommendationSale(recommendProduct);
        }
      }
    }, 60000);
  }, Math.random() * 20000);
}

function applyRecommendationSale(product) {
  product.price = Math.round(product.price * 0.95);
  product.suggestSale = true;

  alert(`💝 ${product.name}은(는) 어떠세요? 지금 구매하시면 5% 추가 할인!`);

  updateProductSelector();
  updateUI();
}
```

## 🔧 구현 가이드

### 1. 단계별 구현 순서

1. **기본 모듈 구조 생성**
2. **상태 객체 정의**
3. **Private 함수 구현**
4. **Public API 구현**
5. **이벤트 핸들링 추가**
6. **특별 세일 시스템 구현**

### 2. 테스트 전략

```javascript
// 모듈 테스트 예시
describe('ShoppingCart Module', () => {
  beforeEach(() => {
    ShoppingCart.init();
  });

  afterEach(() => {
    ShoppingCart.destroy();
  });

  test('should add product to cart', () => {
    const result = ShoppingCart.addToCart('p1');
    expect(result).toBe(true);

    const state = ShoppingCart.getState();
    expect(state.cart).toHaveLength(1);
    expect(state.cart[0].productId).toBe('p1');
  });

  test('should calculate total correctly', () => {
    ShoppingCart.addToCart('p1');
    ShoppingCart.addToCart('p1');

    const result = ShoppingCart.calculateTotal();
    expect(result.discountedTotal).toBeGreaterThan(0);
  });
});
```

### 3. 마이그레이션 전략

1. **기존 코드 백업**
2. **새 모듈 구현**
3. **기능별 점진적 교체**
4. **테스트 및 검증**
5. **기존 코드 제거**

## 📊 예상 효과

### 정량적 효과

- 전역 변수: 10개 → 0개
- 상태 관리: 분산 → 중앙화
- 함수 응집도: 30% → 85%

### 정성적 효과

- 코드 가독성: 15/100 → 80/100
- 유지보수성: 10/100 → 85/100
- 테스트 가능성: 5/100 → 90/100

## 🚀 다음 단계

1. **05-function-decomposition.md** - 함수 분해 계획
2. **06-code-quality-improvements.md** - 코드 품질 개선
3. **07-testing-strategy.md** - 테스트 전략
