# 🚀 JavaScript 리팩토링 여정: Dirty Code → Clean Code

## 📋 개요

이 문서는 `main.basic.js`의 복잡하고 유지보수가 어려운 코드를 단계별로 리팩토링하여 깔끔하고 유지보수 가능한 코드로 개선한 과정을 기록합니다.

## 🎯 초기 상태 분석

### 주요 문제점들
1. **전역변수 남용**: `prodList`, `bonusPts`, `stockInfo` 등 다수의 전역변수 사용
2. **네이밍 일관성 부재**: `onUpdateSelectOptions()`, `handleCalculateCartStuff()`, `doRenderBonusPoints()` 등 혼재된 네이밍 패턴
3. **단일 책임 원칙(SRP) 위반**: `handleCalculateCartStuff()` 함수가 150줄 넘으며 다중 책임
4. **성능 문제**: 중첩 반복문으로 O(n²) 복잡도
5. **하드코딩된 할인 로직**: 제품별 할인율이 if-else 체인으로 하드코딩
6. **안쓰는 변수와 DOM 조작 분산**: `bulkDisc`, `itemDisc` 등 선언만 하고 사용하지 않는 변수들
7. **매직 넘버와 문자열 하드코딩**: 30, 75, 90 등 의미 불분명한 숫자들
8. **변수 선언과 스코프 관리 문제**: 변수 선언이 함수 곳곳에 흩어져 있음
9. **함수 간 강한 결합도**: 전역변수를 통한 함수들 간의 강한 의존성

## 🛠️ 리팩토링 전략

### 1. Toss Frontend Design Guideline 적용
- **Readability**: 매직 넘버 상수화, 복잡한 조건 함수화, 구현 세부사항 추상화
- **Predictability**: 표준화된 반환 타입, 숨겨진 로직 명시화, 고유하고 설명적인 이름
- **Cohesion**: 형태 응집성, 기능/도메인별 구성, 매직 넘버를 로직과 연관
- **Coupling**: 조기 추상화 방지, 상태 관리 범위 설정, Props Drilling 제거

### 2. TypeScript + React 마이그레이션 준비
- **타입 안전성 준비**: 명시적 인터페이스 설계, any 타입 최소화
- **컴포넌트 분리**: UI 요소를 재사용 가능한 단위로 분리
- **상태 관리 구조화**: 전역/로컬 상태 분리, 불변성 유지
- **Custom Hook 패턴 준비**: 비즈니스 로직을 Hook으로 분리 가능하도록 구조화

## 📁 단계별 리팩토링 과정

### Phase 1: 상수 및 매직 넘버 추출
```javascript
// Before
if (itemCount >= 30) { ... }
if (product.quantity < 5) { ... }

// After
import { THRESHOLDS, DISCOUNT_RATES } from './constant';
if (itemCount >= THRESHOLDS.BULK_DISCOUNT_MIN) { ... }
if (product.quantity < THRESHOLDS.LOW_STOCK_WARNING) { ... }
```

**개선점:**
- 매직 넘버를 의미있는 상수로 추출
- `constant/index.js` 파일로 중앙 관리
- 코드 가독성 및 유지보수성 향상

### Phase 2: 복잡한 조건 로직 함수화
```javascript
// Before
if (newQty > 0 && newQty <= product.quantity + currentQty) { ... }

// After
const isValidQuantityChange = (newQty, product, currentQty) =>
  newQty > 0 && newQty <= product.quantity + currentQty;

if (isValidQuantityChange(newQty, product, currentQty)) { ... }
```

**개선점:**
- 복잡한 조건을 의미있는 함수명으로 추상화
- 조건 로직의 재사용성 향상
- 테스트 가능한 순수 함수로 분리

### Phase 3: 서비스 로직 분리

#### 3.1 검증 유틸리티 분리 (`utils/validationUtils.js`)
```javascript
export const hasKeyboardMouseSet = (hasKeyboard, hasMouse) =>
  hasKeyboard && hasMouse;

export const hasFullProductSet = (hasKeyboard, hasMouse, hasMonitorArm) =>
  hasKeyboard && hasMouse && hasMonitorArm;
```

#### 3.2 계산 서비스 분리 (`services/calculationService.js`)
```javascript
export function calculateCartSubtotal(cartItems, products, getCartItemQuantity) {
  // 소계 계산 로직
}

export function calculateFinalDiscounts(subTotal, itemCount, totalAmount) {
  // 최종 할인 계산 로직
}
```

#### 3.3 포인트 서비스 분리 (`services/pointService.js`)
```javascript
export function renderBonusPoints(appState, uiElements, domElements, ...) {
  // 포인트 계산 및 렌더링 로직
}
```

#### 3.4 카트 서비스 분리 (`services/cartService.js`)
```javascript
export function handleCalculateCartStuff(appState, uiElements, domElements, ...) {
  // 장바구니 계산 오케스트레이션
}
```

### Phase 4: UI 컴포넌트 분리

#### 4.1 헤더 컴포넌트 (`components/Header.js`)
```javascript
export const Header = (itemCount = 0) => { /* DOM 생성 */ };
export const updateHeader = itemCount => { /* UI 업데이트 */ };
```

#### 4.2 주문 요약 컴포넌트 (`components/OrderSummary.js`)
```javascript
export function OrderSummaryHTML() { /* HTML 생성 */ }
export function updateOrderSummaryUI(...) { /* UI 업데이트 */ }
```

#### 4.3 총액 및 할인 컴포넌트 (`components/TotalAndDiscount.js`)
```javascript
export function updateTotalAndDiscountUI(...) { /* 총액 및 할인 UI 업데이트 */ }
```

#### 4.4 장바구니 가격 컴포넌트 (`components/CartPrices.js`)
```javascript
export function updateCartPricesUI(products) { /* 장바구니 가격 UI 업데이트 */ }
```

#### 4.5 상품 선택 컴포넌트 (`components/ProductSelect.js`)
```javascript
export function updateProductSelectUI(products, totalStock) { /* 상품 선택 UI 업데이트 */ }
```

#### 4.6 레이아웃 컴포넌트 (`components/Layout.js`)
```javascript
export function Layout() { /* 메인 레이아웃 생성 */ }
```

#### 4.7 도움말 모달 컴포넌트 (`components/HelpModal.js`)
```javascript
export function HelpModal() { /* 도움말 모달 생성 */ }
```

#### 4.8 상품 선택기 컴포넌트 (`components/ProductSelector.js`)
```javascript
export function ProductSelector() { /* 상품 선택 영역 생성 */ }
```

#### 4.9 장바구니 표시 컴포넌트 (`components/CartDisplay.js`)
```javascript
export function CartDisplay() { /* 장바구니 표시 영역 생성 */ }
```

#### 4.10 이벤트 핸들러 컴포넌트 (`components/EventHandlers.js`)
```javascript
export function setupEventHandlers(...) { /* 모든 이벤트 리스너 설정 */ }
```

### Phase 5: 명시적 의존성 관리
```javascript
// Before: 전역변수 의존
function updateProductSelectUI() {
  // 전역변수 appState.products 사용
}

// After: 매개변수로 의존성 주입
function updateProductSelectUI(products, totalStock) {
  // 명시적으로 전달받은 매개변수 사용
}
```

**개선점:**
- 전역변수 의존성 제거
- 함수의 예측 가능성 향상
- 테스트 용이성 증가

### Phase 6: 네이밍 컨벤션 통일
```javascript
// Before: 혼재된 네이밍
onUpdateSelectOptions()
handleCalculateCartStuff()
doRenderBonusPoints()

// After: React 패턴 네이밍
updateProductSelectUI()
handleCalculateCartStuff()
renderBonusPoints()
```

**개선점:**
- React 컴포넌트 네이밍 패턴 적용
- 동사 + 대상 + UI 형태로 통일
- 의미 명확화

### Phase 7: 컴포넌트 네이밍 개선
```javascript
// Before: create 접두사 사용
export function createLayout() { ... }
export function createHelpModal() { ... }

// After: 명사형 네이밍
export function Layout() { ... }
export function HelpModal() { ... }
```

**개선점:**
- React 컴포넌트 네이밍 컨벤션 준수
- 더 간결하고 직관적인 이름

### Phase 8: 주석 정리
```javascript
// Before: 과도한 이모지 주석
// 🎯 캐시된 DOM 요소 사용 (중복 제거로 성능 향상)
// 🚀 애플리케이션 상태 초기화 (장바구니, 포인트, 선택 상태)

// After: 깔끔한 주석
const summaryDetails = document.getElementById('summary-details');
appState.cart.totalAmount = UI_CONSTANTS.INITIAL_CART_AMOUNT;
```

**개선점:**
- 불필요한 이모지 주석 제거
- 코드만 봐도 알 수 있는 내용의 주석 제거
- 일관성 있는 주석 스타일 적용

## 📊 리팩토링 결과

### 파일 구조 개선
```
src/basic/
├── main.basic.js (메인 애플리케이션 로직)
├── constant/
│   └── index.js (상수 정의)
├── components/
│   ├── Header.js
│   ├── Layout.js
│   ├── HelpModal.js
│   ├── ProductSelector.js
│   ├── CartDisplay.js
│   ├── OrderSummary.js
│   ├── TotalAndDiscount.js
│   ├── CartPrices.js
│   ├── ProductSelect.js
│   └── EventHandlers.js
├── services/
│   ├── cartService.js
│   ├── calculationService.js
│   └── pointService.js
└── utils/
    ├── validationUtils.js
    ├── stockUtils.js
    └── conditionUtils.js
```

### 코드 품질 개선 지표
- **함수 크기**: 150줄 → 평균 20-30줄
- **순환 복잡도**: 높음 → 낮음
- **의존성**: 강한 결합 → 느슨한 결합
- **테스트 가능성**: 어려움 → 용이함
- **재사용성**: 낮음 → 높음
- **가독성**: 낮음 → 높음

### 성능 개선
- **시간 복잡도**: O(n²) → O(n) (Map 사용)
- **DOM 조작**: 분산 → 집중
- **메모리 사용**: 효율적 캐싱 적용

## 🎯 핵심 학습 포인트

### 1. 단계적 접근의 중요성
- 한 번에 모든 것을 바꾸려 하지 않고 단계별로 진행
- 각 단계마다 테스트를 통한 검증
- 문제 발생 시 즉시 롤백 가능

### 2. 명시적 의존성 관리
- 전역변수 대신 매개변수로 의존성 주입
- 함수의 예측 가능성과 테스트 용이성 향상
- React의 props 패턴 준비

### 3. 관심사 분리 (Separation of Concerns)
- UI 로직과 비즈니스 로직 분리
- 계산 로직과 렌더링 로직 분리
- 각 컴포넌트의 단일 책임 원칙 준수

### 4. 네이밍의 중요성
- 일관된 네이밍 컨벤션 적용
- 의미있는 함수명과 변수명 사용
- React 패턴 준비

### 5. 상수 관리
- 매직 넘버를 의미있는 상수로 추출
- 중앙 집중식 상수 관리
- 유지보수성 향상

## 🔮 향후 개선 방향

### 1. TypeScript 마이그레이션
- 인터페이스 정의로 타입 안전성 확보
- 컴파일 타임 에러 검출
- 더 나은 IDE 지원

### 2. React 컴포넌트 변환
- 현재 컴포넌트 구조를 React 컴포넌트로 변환
- Hooks 패턴 적용
- 상태 관리 라이브러리 도입 고려

### 3. 테스트 커버리지 확대
- 단위 테스트 추가
- 통합 테스트 작성
- E2E 테스트 고려

### 4. 성능 최적화
- React.memo, useMemo, useCallback 적용
- 가상화(virtualization) 고려
- 번들 크기 최적화

## 📝 결론

이번 리팩토링을 통해 단순한 JavaScript 코드를 현대적이고 유지보수 가능한 구조로 개선했습니다. 각 단계에서 발생한 문제들을 해결하면서 실무에서 활용할 수 있는 다양한 리팩토링 기법들을 학습할 수 있었습니다.

특히 **단계적 접근**, **명시적 의존성 관리**, **관심사 분리**, **일관된 네이밍**의 중요성을 깊이 이해할 수 있었으며, 이는 향후 TypeScript와 React로의 마이그레이션을 위한 탄탄한 기반이 될 것입니다.

---

*이 문서는 실제 프로젝트에서 진행된 리팩토링 과정을 바탕으로 작성되었습니다.* 