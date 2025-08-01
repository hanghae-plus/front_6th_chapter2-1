# 리팩토링 전략 및 실행 계획

## 개요
본 문서는 더티코드 분석 결과를 바탕으로 체계적인 리팩토링 전략과 단계별 실행 계획을 제시합니다.

## 리팩토링 원칙

### 1. 점진적 개선 (Incremental Improvement)
- 한 번에 모든 것을 바꾸지 않고 단계적으로 개선
- 각 단계마다 테스트 실행으로 기능 보장
- 작은 단위의 변경으로 위험성 최소화

### 2. 테스트 주도 리팩토링 (Test-Driven Refactoring)  
- 기존 테스트가 모두 통과하는 상태 유지
- 리팩토링 전후 동일한 동작 보장
- 새로운 구조에 맞는 추가 테스트 고려

### 3. 클린코드 원칙 준수
- **단일 책임 원칙 (SRP)**: 하나의 함수는 하나의 책임만
- **DRY 원칙**: 중복 코드 제거
- **가독성 우선**: 의미 있는 네이밍과 명확한 구조
- **관심사 분리**: 비즈니스 로직과 UI 로직 분리

## 6단계 리팩토링 전략

### 1단계: 함수 분해 및 단일 책임 원칙 적용 🔴
**목표**: 거대한 함수들을 작은 단위로 분해

#### 1.1 main() 함수 분해
```javascript
// 현재: 235줄의 거대한 함수
function main() { /* 모든 초기화 코드 */ }

// 목표: 책임별로 분리된 함수들
function initializeApp() { /* 앱 초기화 */ }
function createDOMElements() { /* DOM 요소 생성 */ }
function setupEventListeners() { /* 이벤트 리스너 설정 */ }
function startPromotionTimers() { /* 프로모션 타이머 시작 */ }
```

#### 1.2 handleCalculateCartStuff() 함수 분해
```javascript
// 현재: 240줄의 계산 함수
function handleCalculateCartStuff() { /* 모든 계산 로직 */ }

// 목표: 각 계산 로직을 별도 함수로 분리
function calculateSubtotal() { /* 소계 계산 */ }
function applyDiscounts() { /* 할인 적용 */ }
function calculatePoints() { /* 포인트 계산 */ }
function updateCartDisplay() { /* 장바구니 화면 업데이트 */ }
```

**우선순위**: 🔴 최고 (즉시 실행)
**예상 소요시간**: 2-3일

### 2단계: 전역 상태 관리 개선 🔴  
**목표**: 14개 전역 변수를 체계적으로 관리

#### 2.1 상태 객체 생성
```javascript
// 현재: 산발적인 전역 변수들
var prodList, bonusPts, stockInfo, itemCnt, lastSel, sel, addBtn, totalAmt;

// 목표: 구조화된 상태 관리
const AppState = {
  products: [],
  cart: {
    items: [],
    totalAmount: 0,
    itemCount: 0
  },
  ui: {
    selector: null,
    addButton: null,
    cartDisplay: null
  },
  promotions: {
    lastSelectedProduct: null,
    activePromotions: []
  }
};
```

#### 2.2 상태 접근 캡슐화
```javascript
// 상태 접근 함수들
function getProducts() { return AppState.products; }
function getCart() { return AppState.cart; }
function updateCartTotal(amount) { AppState.cart.totalAmount = amount; }
```

**우선순위**: 🔴 최고
**예상 소요시간**: 1-2일

### 3단계: 중복 코드 제거 및 유틸리티 함수 생성 🔴
**목표**: DRY 원칙 적용으로 중복 제거

#### 3.1 공통 로직 추출
```javascript
// 중복된 상품 검색 로직을 유틸리티 함수로
function findProductById(productId) {
  return AppState.products.find(product => product.id === productId);
}

// 중복된 DOM 요소 업데이트 로직
function updateElementText(selector, text) {
  const element = document.querySelector(selector);
  if (element) element.textContent = text;
}

// 중복된 가격 포맷팅 로직
function formatPrice(amount) {
  return `₩${Math.round(amount).toLocaleString()}`;
}
```

#### 3.2 할인 계산 로직 통합
```javascript
// 현재: 여러 곳에 흩어진 할인 로직들
// 목표: 통합된 할인 계산 시스템
const DiscountCalculator = {
  calculateItemDiscount(product, quantity) { /* */ },
  calculateBulkDiscount(totalQuantity) { /* */ },
  calculateTuesdayDiscount(amount) { /* */ },
  calculatePromotionDiscount(product) { /* */ }
};
```

**우선순위**: 🔴 최고
**예상 소요시간**: 1-2일

### 4단계: 상수 정의 및 설정 분리 🟡
**목표**: 매직넘버 제거 및 설정 외부화

#### 4.1 상수 정의
```javascript
// 현재: 하드코딩된 값들
if (totalStock < 50) { /* */ }
setTimeout(..., 30000);
disc = 10 / 100;

// 목표: 의미 있는 상수들
const CONSTANTS = {
  STOCK_WARNING_THRESHOLD: 50,
  LOW_STOCK_THRESHOLD: 5,
  LIGHTNING_SALE_INTERVAL: 30000,
  SUGGESTION_SALE_INTERVAL: 60000,
  TUESDAY: 2,
  
  DISCOUNTS: {
    KEYBOARD: 0.10,
    MOUSE: 0.15, 
    MONITOR_ARM: 0.20,
    POUCH: 0.05,
    SPEAKER: 0.25,
    BULK_30_ITEMS: 0.25,
    TUESDAY_ADDITIONAL: 0.10,
    LIGHTNING_SALE: 0.20,
    SUGGESTION_SALE: 0.05
  },
  
  POINTS: {
    BASE_RATE: 0.001,
    TUESDAY_MULTIPLIER: 2,
    COMBO_KEYBOARD_MOUSE: 50,
    FULL_SET_BONUS: 100,
    BULK_10_ITEMS: 20,
    BULK_20_ITEMS: 50,
    BULK_30_ITEMS: 100
  }
};
```

#### 4.2 제품 데이터 외부화
```javascript
// 현재: 하드코딩된 상품 데이터
// 목표: 구조화된 상품 설정
const PRODUCTS_CONFIG = [
  {
    id: 'p1',
    name: '버그 없애는 키보드',
    price: 10000,
    initialStock: 50,
    bulkDiscountRate: 0.10,
    bulkDiscountThreshold: 10,
    type: 'keyboard'
  },
  // ... 다른 상품들
];
```

**우선순위**: 🟡 중간
**예상 소요시간**: 1일

### 5단계: DOM 조작 최적화 및 관심사 분리 🟡
**목표**: 비즈니스 로직과 UI 로직 완전 분리

#### 5.1 UI 컨트롤러 분리
```javascript
// 비즈니스 로직 (순수 함수들)
const CartLogic = {
  addItem(cart, product, quantity) { /* 순수한 계산 로직 */ },
  removeItem(cart, productId) { /* 순수한 계산 로직 */ },
  calculateTotal(cart) { /* 순수한 계산 로직 */ }
};

// UI 업데이트 담당
const UIController = {
  updateCartDisplay(cart) { /* DOM 조작만 */ },
  updatePriceDisplay(total) { /* DOM 조작만 */ },
  updateStockStatus(products) { /* DOM 조작만 */ }
};
```

#### 5.2 이벤트 핸들러 분리
```javascript
// 현재: 로직과 DOM 조작이 혼재된 이벤트 핸들러
// 목표: 역할별로 분리된 핸들러
const EventHandlers = {
  onAddToCart(productId) {
    const updatedCart = CartLogic.addItem(AppState.cart, productId);
    AppState.cart = updatedCart;
    UIController.updateCartDisplay(updatedCart);
  },
  
  onQuantityChange(productId, change) {
    const updatedCart = CartLogic.updateQuantity(AppState.cart, productId, change);
    AppState.cart = updatedCart;
    UIController.updateCartDisplay(updatedCart);
  }
};
```

**우선순위**: 🟡 중간
**예상 소요시간**: 2일

### 6단계: 모듈화 및 테스트 개선 🟢
**목표**: 코드 구조 최적화 및 테스트 용이성 향상

#### 6.1 모듈 분리
```javascript
// modules/CartManager.js
export class CartManager {
  constructor(products) { /* */ }
  addItem(productId, quantity) { /* */ }
  removeItem(productId) { /* */ }
  getTotal() { /* */ }
}

// modules/DiscountEngine.js  
export class DiscountEngine {
  calculateDiscounts(cart, promotions) { /* */ }
}

// modules/PromotionManager.js
export class PromotionManager {
  startLightningSale() { /* */ }
  startSuggestionSale() { /* */ }
}
```

#### 6.2 의존성 주입 적용
```javascript
// 현재: 전역 변수에 의존
// 목표: 의존성 주입으로 테스트 용이성 향상
class ShoppingCartApp {
  constructor(cartManager, discountEngine, promotionManager, uiController) {
    this.cartManager = cartManager;
    this.discountEngine = discountEngine;
    this.promotionManager = promotionManager;
    this.uiController = uiController;
  }
}
```

**우선순위**: 🟢 낮음 (안정화 후)
**예상 소요시간**: 2-3일

## Agent 활용 전략

### 1. 한국어 React 코드 리뷰어 활용
- 각 리팩토링 단계 완료 후 코드 리뷰 요청
- 클린코드 원칙 준수 여부 검증
- 개선 사항 제안 받기

### 2. 단계별 Agent 요청 전략
```bash
# 1단계: 함수 분해
"main() 함수를 단일 책임 원칙에 따라 5개 함수로 분해해줘"

# 2단계: 상태 관리
"14개 전역 변수를 AppState 객체로 캡슐화해줘"

# 3단계: 중복 제거  
"상품 검색 로직의 중복을 findProductById 유틸리티 함수로 통합해줘"

# 4단계: 상수 정의
"하드코딩된 할인율들을 DISCOUNTS 상수 객체로 정의해줘"

# 5단계: 관심사 분리
"DOM 조작 코드를 UIController로 분리해줘"
```

## 리팩토링 검증 방법

### 1. 테스트 기반 검증
```bash
# 각 단계마다 실행
npm run test:basic

# 테스트 통과 확인
✓ 모든 할인 정책 테스트 통과
✓ 장바구니 기능 테스트 통과  
✓ UI 상호작용 테스트 통과
```

### 2. 코드 품질 지표
- **함수 평균 길이**: 현재 80줄 → 목표 20줄 이하
- **전역 변수 수**: 현재 14개 → 목표 0개
- **중복 코드**: 현재 4곳 → 목표 0곳
- **매직넘버**: 현재 15개+ → 목표 0개

### 3. 성능 유지 확인
- 할인 계산 정확성
- UI 반응성 유지
- 메모리 사용량 최적화

## 위험 요소 및 대응책

### 1. 기능 변경 위험
**위험**: 리팩토링 중 기존 기능 손상
**대응**: 각 단계마다 테스트 실행, 작은 단위 변경

### 2. 성능 저하 위험  
**위험**: 과도한 추상화로 인한 성능 저하
**대응**: 성능 측정 및 필요시 최적화

### 3. 과도한 엔지니어링
**위험**: 불필요한 복잡성 도입
**대응**: 실용적 접근, 과제 요구사항 우선

## 심화과제 연계 전략

### React + TypeScript 전환 준비
1. **비즈니스 로직 순수 함수화**: React 컴포넌트로 쉽게 이동
2. **상태 관리 구조화**: Redux/Zustand 등으로 자연스럽게 전환
3. **타입 정의 준비**: 이미 구조화된 데이터로 TypeScript 인터페이스 작성 용이
4. **컴포넌트 경계 명확화**: UI 로직 분리로 컴포넌트 설계 수월

## 예상 일정

| 단계 | 내용 | 소요시간 | 우선순위 |
|-----|------|---------|---------|
| 1단계 | 함수 분해 | 2-3일 | 🔴 최고 |
| 2단계 | 상태 관리 개선 | 1-2일 | 🔴 최고 |  
| 3단계 | 중복 코드 제거 | 1-2일 | 🔴 최고 |
| 4단계 | 상수 정의 | 1일 | 🟡 중간 |
| 5단계 | 관심사 분리 | 2일 | 🟡 중간 |
| 6단계 | 모듈화 | 2-3일 | 🟢 낮음 |

**총 예상 기간**: 9-13일

## 성공 기준

### 정량적 기준
- [ ] 모든 기존 테스트 통과 (100%)
- [ ] 함수 평균 길이 20줄 이하
- [ ] 전역 변수 0개
- [ ] 중복 코드 블록 0개
- [ ] 매직넘버 0개

### 정성적 기준  
- [ ] 코드 가독성 향상
- [ ] 새로운 기능 추가 용이성
- [ ] 테스트 작성 용이성
- [ ] React 전환 준비 완료

이 전략을 통해 체계적이고 안전한 리팩토링을 수행하여 유지보수 가능한 클린코드를 만들어보겠습니다.