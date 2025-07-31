# 4단계: DOM 지역변수화 및 선언적 네이밍

## 📖 개요

전역변수로 관리되던 DOM 참조들을 main() 함수의 지역변수로 이동하고, 동시에 모든 변수명을 선언적으로 개선하는 리팩토링을 수행했습니다. compute, calculate와 같은 함수가 당연히 수행하는 일에 대한 설명은 지양하고, 변수의 역할과 목적을 명확히 표현하는 네이밍을 적용했습니다.

## 🎯 목표

- **전역 스코프 최소화**: DOM 참조들을 지역변수로 이동
- **선언적 네이밍**: 변수명만으로 역할과 목적을 명확히 표현
- **클로저 패턴 적용**: 이벤트 리스너에서 지역변수에 안전하게 접근
- **불필요한 변수 제거**: 사용되지 않는 전역변수 완전 제거
- **절대적 원칙 준수**: 기능 변경 없이 구조적 개선만 수행

## 🔍 리팩토링 대상 분석

### 전역변수 분류

```javascript
// 리팩토링 전 전역변수들
let prodList; // 상품 데이터 (비즈니스 상태)
let bonusPts = 0; // 보너스 포인트 (사용되지 않음)
let stockInfo; // 재고 정보 DOM (DOM 참조)
let itemCnt; // 아이템 카운트 (비즈니스 상태)
let lastSel; // 마지막 선택 상품 (비즈니스 상태)
let sel; // 상품 선택 DOM (DOM 참조)
let addBtn; // 추가 버튼 DOM (DOM 참조)
let totalAmt = 0; // 총 금액 (비즈니스 상태)
let cartDisp; // 장바구니 표시 DOM (DOM 참조)
let sum; // 총액 표시 DOM (사용되지 않음)
```

### 분리 전략

- **✅ 지역변수로 이동**: DOM 참조들 (`sel`, `addBtn`, `cartDisp`, `stockInfo`, `sum`)
- **✅ 선언적 네이밍**: 모든 변수명을 역할 중심으로 개선
- **✅ 완전 제거**: 사용되지 않는 변수들 (`bonusPts`, `sum`)
- **🔄 상태 유지**: 비즈니스 상태들 (향후 상태 관리 모듈로 이동 예정)

## 🛠️ 주요 변경 사항

### 1. DOM 참조 지역변수화

#### AS-IS: 전역 DOM 참조

```javascript
let sel; // 전역 변수
let addBtn; // 전역 변수
let cartDisp; // 전역 변수
let stockInfo; // 전역 변수
let sum; // 전역 변수 (사용되지 않음)

function main() {
  sel = document.createElement('select');
  addBtn = document.createElement('button');
  // ... 전역변수에 할당
}

// 함수 외부에서 이벤트 리스너 등록
addBtn.addEventListener('click', () => {
  // 전역변수 접근
});
```

#### TO-BE: 지역변수 + 클로저 패턴

```javascript
// 비즈니스 상태만 전역으로 유지
let productInventory;
let cartTotalAmount = 0;
let cartItemCount;
let lastSelectedProduct;

function main() {
  // DOM 요소들을 지역변수로 관리
  const productSelector = document.createElement('select');
  const addToCartButton = document.createElement('button');
  const cartDisplayArea = document.createElement('div');
  const stockStatusDisplay = document.createElement('div');

  // 이벤트 리스너에서 클로저로 지역변수 접근
  addToCartButton.addEventListener('click', () => {
    const selectedItemId = productSelector.value; // 클로저 접근
    // ...
  });
}
```

### 2. 선언적 변수명 개선

#### DOM 요소 네이밍

```javascript
// AS-IS → TO-BE
sel              → productSelector        // 상품 선택기
addBtn           → addToCartButton       // 장바구니 추가 버튼
cartDisp         → cartDisplayArea       // 장바구니 표시 영역
stockInfo        → stockStatusDisplay    // 재고 상태 표시
sum              → orderSummaryTotal     // 주문 요약 총계 (제거됨)
```

#### 비즈니스 상태 네이밍

```javascript
// AS-IS → TO-BE
prodList         → productInventory      // 상품 재고 목록
totalAmt         → cartTotalAmount       // 장바구니 총액
itemCnt          → cartItemCount         // 장바구니 아이템 수
lastSel          → lastSelectedProduct   // 마지막 선택 상품
bonusPts         → (제거됨)              // 사용되지 않음
```

#### 로컬 변수 네이밍 개선

```javascript
// AS-IS → TO-BE
selItem          → selectedItemId        // 선택된 아이템 ID
hasItem          → hasValidItem          // 유효한 아이템 여부
itemToAdd        → itemToAdd             // 유지 (명확함)
suggest          → suggestedProduct      // 추천 상품
qtyElem          → quantityElement       // 수량 요소
newQty           → newQuantity           // 새로운 수량
currentQty       → currentQuantity       // 현재 수량
initStock        → initialStockTotal     // 초기 재고 총합
tgt              → targetElement         // 대상 요소
prodId           → productId             // 상품 ID
itemElem         → cartItemElement       // 장바구니 아이템 요소
prod             → correspondingProduct  // 해당 상품
prdIdx           → productIndex          // 상품 인덱스
qtyChange        → quantityChange        // 수량 변경
remQty           → removedQuantity       // 제거된 수량
```

### 3. Compute/Calculate 용어 제거

#### 함수형 동작 설명 제거

```javascript
// AS-IS: 함수가 당연히 하는 일 설명
initStock        → initialStockTotal     // "계산"이 아닌 "초기값"
handleCalculateCartStuff → handleCartUpdate // "계산"이 아닌 "업데이트"

// 변수명에서 계산 과정 제거
let calculatedTotal → let cartTotalAmount  // 결과에 집중
let computedValue   → let displayValue     // 용도에 집중
```

## 📊 코드 품질 개선 효과

### 스코프 최적화

- **전역변수 감소**: 10개 → 4개 (60% 감소)
- **DOM 참조 지역화**: 5개 DOM 참조가 모두 main() 지역변수로 이동
- **네임스페이스 충돌 방지**: DOM 요소들이 전역 스코프에서 격리

### 가독성 향상

```javascript
// AS-IS: 의미 파악 어려움
if (sel.value && hasItem) {
  cartDisp.appendChild(newItem);
  lastSel = selItem;
}

// TO-BE: 의도가 명확함
if (productSelector.value && hasValidItem) {
  cartDisplayArea.appendChild(newCartItem);
  lastSelectedProduct = selectedItemId;
}
```

### 안전성 강화

- **의도하지 않은 변경 방지**: DOM 참조들이 외부에서 접근 불가
- **생명주기 관리**: DOM 요소들이 main() 함수와 동일한 생명주기
- **메모리 최적화**: 함수 종료 시 DOM 참조들 자동 해제

## 🧪 절대적 원칙 준수 검증

### ✅ 코드 동작 보존

- **테스트 통과율**: 100% (87 passed | 16 skipped)
- **기능 동작**: 모든 UI 상호작용 및 비즈니스 로직 보존
- **이벤트 처리**: 클로저 패턴으로 안전한 DOM 요소 접근

### ✅ 구조적 개선

- **스코프 최적화**: 전역 스코프 최소화
- **변수 역할 명확화**: 네이밍으로 의도 표현
- **관심사 분리**: DOM 관리와 비즈니스 상태 구분

### ✅ 관심사 분리

- **DOM 생명주기**: main() 함수 내부로 제한
- **비즈니스 상태**: 전역으로 유지 (향후 상태 관리 모듈화 예정)
- **이벤트 처리**: 클로저로 안전한 상태 접근

## 🎓 적용된 Clean Code 원칙

### Intention Revealing Names

```javascript
// 변수명만으로 역할과 목적이 명확함
const productSelector = document.createElement('select');
const addToCartButton = document.createElement('button');
const cartDisplayArea = document.createElement('div');
const stockStatusDisplay = document.createElement('div');
```

### Avoid Mental Mapping

```javascript
// AS-IS: 개발자가 의미를 추측해야 함
let sel, addBtn, cartDisp;

// TO-BE: 의미가 즉시 이해됨
const productSelector, addToCartButton, cartDisplayArea;
```

### Use Searchable Names

```javascript
// AS-IS: 축약형으로 검색 어려움
(sel.value, addBtn.click, cartDisp.appendChild);

// TO-BE: 완전한 이름으로 검색 용이
(productSelector.value, addToCartButton.click, cartDisplayArea.appendChild);
```

### Function Arguments (Closure Pattern)

```javascript
// 전역변수 의존성 제거 → 클로저 패턴
addToCartButton.addEventListener('click', () => {
  // 지역변수에 클로저로 안전하게 접근
  const selectedItemId = productSelector.value;
  cartDisplayArea.appendChild(newCartItem);
});
```

## 📈 리팩토링 성과

### 정량적 성과

- **전역변수 감소**: 10개 → 4개 (60% 감소)
- **DOM 참조 지역화**: 5개 → 0개 (100% 지역화)
- **불필요한 변수 제거**: 2개 (`bonusPts`, `sum`)
- **테스트 통과율**: 100% 유지

### 정성적 성과

- **코드 의도 명확화**: 변수명만으로 역할 파악 가능
- **네임스페이스 안전성**: DOM 참조 충돌 방지
- **개발자 경험 개선**: IDE 자동완성 및 검색 용이성 향상
- **향후 리팩토링 준비**: 상태 관리 모듈화를 위한 기반 마련

## 🔄 다음 단계 예고

### 비즈니스 상태 모듈화 준비

현재 전역으로 남아있는 비즈니스 상태들을 별도 상태 관리 모듈로 중앙화:

```javascript
// 향후 상태 관리 모듈화 대상
let productInventory; // → cartState.productInventory
let cartTotalAmount = 0; // → cartState.totalAmount
let cartItemCount; // → cartState.itemCount
let lastSelectedProduct; // → cartState.lastSelected
```

### 기대 효과

- **상태 접근 통일화**: 일관된 상태 관리 인터페이스
- **상태 변경 추적**: 상태 업데이트 로직 중앙화
- **테스트 용이성**: 상태 모킹 및 격리 테스트 가능
- **확장성**: 새로운 상태 추가 시 구조적 일관성 유지

이번 DOM 지역변수화 및 선언적 네이밍 리팩토링을 통해 코드의 가독성과 안전성이 크게 향상되었으며, 향후 상태 관리 모듈화를 위한 견고한 기반을 마련했습니다.
