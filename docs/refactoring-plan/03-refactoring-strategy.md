# 🎯 리팩토링 전략 및 방법론

## 📋 전략 개요

본 문서는 `main.basic.js` 파일의 리팩토링을 위한 체계적인 전략과 방법론을 제시합니다.

## 🏗️ 리팩토링 접근 방법

### 1. 점진적 개선 (Incremental Refactoring)

#### 원칙

- **한 번에 하나씩**: 한 번에 하나의 문제만 해결
- **작은 단위**: 작은 변경사항으로 시작
- **지속적 검증**: 각 단계마다 기능 검증
- **안전한 전환**: 기존 기능 유지하면서 개선

#### 장점

- 리스크 최소화
- 문제 발생 시 빠른 롤백
- 팀 협업 시 충돌 최소화
- 학습 효과 극대화

### 2. 테스트 주도 리팩토링 (Test-Driven Refactoring)

#### 원칙

- **리팩토링 전 테스트 작성**
- **각 변경 후 테스트 실행**
- **기능 동작 보장**
- **회귀 버그 방지**

## 📅 3단계 리팩토링 계획

### Phase 1: 긴급 수술 (1-2일)

#### 목표

- 가장 심각한 문제들을 즉시 해결
- 코드의 기본 구조 개선
- 향후 리팩토링을 위한 기반 마련

#### 주요 작업

##### 1.1 전역 변수 제거

```javascript
// Before: 전역 변수 오염
var prodList, sel, addBtn, cartDisp, sum, stockInfo;
var lastSel,
  bonusPts = 0,
  totalAmt = 0,
  itemCnt = 0;

// After: 모듈 패턴 적용
const ShoppingCart = (() => {
  let state = {
    products: [],
    cart: [],
    totalAmount: 0,
    itemCount: 0,
    lastSelected: null,
    bonusPoints: 0,
  };

  return {
    init,
    addToCart,
    removeFromCart,
    calculateTotal,
    // ... public API
  };
})();
```

##### 1.2 거대 함수 분할

```javascript
// Before: 288줄의 거대한 함수
function handleCalculateCartStuff() {
  /* 288줄 */
}

// After: 작은 함수들로 분할
function calculateSubtotal(cartItems) {
  /* 15줄 */
}
function applyDiscounts(subtotal, cartItems) {
  /* 20줄 */
}
function calculatePoints(totalAmount) {
  /* 10줄 */
}
function updateUI(total, points) {
  /* 15줄 */
}
function checkLowStock() {
  /* 10줄 */
}
```

##### 1.3 중복 코드 통합

```javascript
// Before: 5곳에서 중복되는 포인트 계산
// 각각 다른 방식으로 구현

// After: 공통 함수로 통합
function calculateLoyaltyPoints(totalAmount, isTuesday = false) {
  let points = Math.floor(totalAmount / 1000);
  if (isTuesday) {
    points *= 2;
  }
  return points;
}
```

#### 성공 지표

- [ ] 전역 변수 100% 제거
- [ ] 288줄 함수를 10개 이하 함수로 분할
- [ ] 중복 코드 80% 이상 제거

### Phase 2: 코드 품질 개선 (2-3일)

#### 목표

- 코드의 가독성과 유지보수성 향상
- 일관된 코딩 스타일 적용
- 에러 처리 강화

#### 주요 작업

##### 2.1 매직 넘버 상수화

```javascript
// Before: 의미 불명한 숫자들
if (quantity < 10) return 0;
if (itemCnt >= 30) {
}
if (product.q < 5) {
}

// After: 명명된 상수
const DISCOUNT_THRESHOLDS = {
  BULK_PURCHASE: 10,
  MASS_PURCHASE: 30,
  LOW_STOCK: 5,
};

if (quantity < DISCOUNT_THRESHOLDS.BULK_PURCHASE) return 0;
if (itemCnt >= DISCOUNT_THRESHOLDS.MASS_PURCHASE) {
}
if (product.quantity < DISCOUNT_THRESHOLDS.LOW_STOCK) {
}
```

##### 2.2 변수명 개선

```javascript
// Before: 의미 불명한 변수명
var p, q, amt, sel, tgt;
var curItem, qtyElem, itemTot, disc;

// After: 의미 있는 변수명
const product, quantity, amount, selector, target;
const currentItem, quantityElement, itemTotal, discount;
```

##### 2.3 일관된 코딩 스타일 적용

```javascript
// Before: 혼재된 스타일
var prodList, sel, addBtn;
const PRODUCT_ONE = 'p1';
let p4 = 'p4';

// After: 일관된 스타일
const products = [];
const productSelector = document.getElementById('product-select');
const addButton = document.getElementById('add-to-cart');
```

##### 2.4 에러 처리 추가

```javascript
// Before: null 체크 누락
var totalDiv = sum.querySelector('.text-2xl');
totalDiv.textContent = '₩' + Math.round(totalAmt);

// After: 안전한 접근
const totalDiv = sum?.querySelector('.text-2xl');
if (totalDiv) {
  totalDiv.textContent = `₩${Math.round(totalAmt).toLocaleString()}`;
}
```

#### 성공 지표

- [ ] 매직 넘버 100% 상수화
- [ ] 변수명 90% 이상 개선
- [ ] 일관된 코딩 스타일 100% 적용
- [ ] 에러 처리 80% 이상 추가

### Phase 3: 구조 개선 (3-4일)

#### 목표

- 비즈니스 로직과 UI 분리
- 성능 최적화
- 확장성 향상

#### 주요 작업

##### 3.1 비즈니스 로직 분리

```javascript
// Before: 비즈니스 로직과 UI 혼재
function handleCalculateCartStuff() {
  // 비즈니스 로직
  totalAmt += itemTot * (1 - disc);

  // DOM 조작
  elem.style.fontWeight = q >= 10 ? 'bold' : 'normal';
}

// After: 분리된 구조
class CartCalculator {
  calculateTotal(cartItems) {
    // 순수한 비즈니스 로직
  }

  applyDiscounts(total, cartItems) {
    // 순수한 할인 계산
  }
}

class CartUI {
  updateDisplay(total, points) {
    // 순수한 UI 업데이트
  }
}
```

##### 3.2 성능 최적화

```javascript
// Before: 비효율적인 DOM 조작
summaryDetails.innerHTML += `...`;
summaryDetails.innerHTML += `...`;
summaryDetails.innerHTML += `...`;

// After: 효율적인 DOM 조작
const fragment = document.createDocumentFragment();
items.forEach(item => {
  const element = createItemElement(item);
  fragment.appendChild(element);
});
summaryDetails.appendChild(fragment);
```

##### 3.3 모듈화 및 재사용성 향상

```javascript
// Before: 모든 것이 하나의 파일에
// 903줄의 모든 코드

// After: 모듈별 분리
// cart.js - 장바구니 로직
// discount.js - 할인 계산
// points.js - 포인트 시스템
// ui.js - UI 렌더링
// constants.js - 상수 정의
```

#### 성공 지표

- [ ] 비즈니스 로직과 UI 100% 분리
- [ ] 성능 50% 이상 향상
- [ ] 모듈화 80% 이상 완료

## 🛠️ 리팩토링 도구 및 방법

### 1. 코드 분석 도구

- **ESLint**: 코드 품질 검사
- **Prettier**: 코드 포맷팅
- **SonarQube**: 코드 복잡도 분석

### 2. 테스트 도구

- **Jest**: 단위 테스트
- **Testing Library**: DOM 테스트
- **Cypress**: E2E 테스트

### 3. 버전 관리

- **Git**: 변경사항 추적
- **Feature Branch**: 안전한 개발
- **Pull Request**: 코드 리뷰

## 📊 리팩토링 진행 상황 추적

### 체크리스트

#### Phase 1: 긴급 수술

- [ ] 전역 변수 제거 완료
- [ ] handleCalculateCartStuff 함수 분할 완료
- [ ] 중복 코드 통합 완료
- [ ] 기본 기능 테스트 통과

#### Phase 2: 코드 품질

- [ ] 매직 넘버 상수화 완료
- [ ] 변수명 개선 완료
- [ ] 일관된 코딩 스타일 적용 완료
- [ ] 에러 처리 추가 완료

#### Phase 3: 구조 개선

- [ ] 비즈니스 로직 분리 완료
- [ ] 성능 최적화 완료
- [ ] 모듈화 완료
- [ ] 최종 테스트 통과

### 성공 지표 모니터링

#### 정량적 지표

- 코드 라인 수: 903줄 → 목표 500줄
- 함수 개수: 8개 → 목표 25개
- 전역 변수: 10개 → 목표 0개
- 중복 코드: 90% 이상 제거

#### 정성적 지표

- 코드 가독성: 15/100 → 목표 80/100
- 유지보수성: 10/100 → 목표 85/100
- 테스트 가능성: 5/100 → 목표 90/100

## 🚨 리스크 관리

### 주요 리스크

1. **기능 손실**: 리팩토링 중 기존 기능 손실
2. **성능 저하**: 구조 변경으로 인한 성능 문제
3. **팀 혼란**: 변경사항으로 인한 팀 혼란

### 대응 방안

1. **단계별 테스트**: 각 단계마다 철저한 테스트
2. **백업 관리**: 각 단계 전 백업 생성
3. **문서화**: 모든 변경사항 문서화
4. **팀 소통**: 정기적인 진행상황 공유

## 📝 다음 단계

1. **04-module-pattern-design.md** - 모듈 패턴 상세 설계
2. **05-function-decomposition.md** - 함수 분해 상세 계획
3. **06-code-quality-improvements.md** - 코드 품질 개선 가이드
4. **07-testing-strategy.md** - 테스트 전략
5. **08-implementation-checklist.md** - 구현 체크리스트

## 🎯 결론

이 전략을 통해 체계적이고 안전한 리팩토링을 수행하여 코드의 품질을 크게 향상시킬 수 있습니다. 각 단계를 신중하게 진행하면서 지속적인 검증을 통해 성공적인 리팩토링을 완료할 수 있을 것입니다.
