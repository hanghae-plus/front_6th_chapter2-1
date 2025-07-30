# 전역 변수 완전 제거 리팩토링

## 🚨 코드 스멜

### **전역 네임스페이스 오염**

```javascript
// 8개의 전역 변수가 모든 스코프를 오염시킴
let bonusPts = 0;
let stockInfo;
let itemCnt = 0;
let lastSel = null;
let sel;
let totalAmt = 0;
let cartDisp;
let sum;
```

- 모든 함수에서 전역 변수에 직접 접근하여 예측 불가능한 부작용 발생
- 함수 간 암시적 의존성으로 코드 이해 어려움
- 테스트 시 전역 상태 초기화 필요

### **변수와 사용처의 물리적 거리감**

```javascript
let sum; // 87번 줄에서 선언

function main() {
  // ... 70줄 후 ...
  sum = rightColumn.querySelector('#cart-total'); // 157번 줄에서 초기화
}

function handleCalculateCartStuff() {
  // ... 100줄 후 ...
  const totalDiv = sum.querySelector('.text-2xl'); // 273번 줄에서 사용
}
```

- 변수 선언, 초기화, 사용이 파일 전체에 흩어져 있어 흐름 파악 어려움
- 변수의 생명주기와 용도를 한눈에 파악하기 어려움

### **함수 간 암시적 데이터 공유**

```javascript
function handleCalculateCartStuff() {
  totalAmt = 0; // 전역 변수 변경
  itemCnt = 0;
  // 계산 로직...
  doRenderBonusPoints(); // 전역 변수에 의존하는 함수 호출
}

function doRenderBonusPoints() {
  let basePoints = Math.floor(totalAmt * POINT_RATES.BASE_RATE); // 전역 변수 사용
  // totalAmt가 어디서 설정되었는지 함수만 봐서는 알 수 없음
}
```

## ⚠️ 문제 시나리오

### **예측 불가능한 상태 변경**

```javascript
// 시나리오: 포인트 계산이 0p로 나오는 버그 발생
function someOtherFunction() {
  totalAmt = 0; // 실수로 전역 변수 초기화
}

function doRenderBonusPoints() {
  let basePoints = Math.floor(totalAmt * POINT_RATES.BASE_RATE); // 0이 되어버림
  // 어디서 totalAmt가 0이 되었는지 추적하기 어려움
}
```

### **DOM 참조의 생명주기 문제**

```javascript
let stockInfo; // 전역으로 DOM 참조 저장

function main() {
  stockInfo = selectorContainer.querySelector('#stock-status');
}

function handleStockInfoUpdate() {
  stockInfo.textContent = infoMsg; // DOM이 이미 제거되었다면?
}
```

### **서비스 간 상태 공유의 복잡성**

```javascript
let lastSel = null; // 마지막 선택 상품을 전역으로 관리

function startSuggestSale(prodList, lastSel, ...) {
  // lastSel이 언제 어떻게 변경되는지 예측 어려움
}

function handleAddToCart() {
  lastSel = selItem; // 다른 곳에서 이 변경을 알 수 있을까?
}
```

## 🔧 단계별 해결 과정

### **1단계: 간단한 로컬화 (sum, bonusPts)**

```javascript
// Before: 전역 변수
let sum;
function main() {
  sum = rightColumn.querySelector('#cart-total');
}
function handleCalculateCartStuff() {
  const totalDiv = sum.querySelector('.text-2xl');
}

// After: 로컬 변수
function handleCalculateCartStuff() {
  const sum = rightColumn.querySelector('#cart-total'); // 사용처에서 직접 선언
  const totalDiv = sum.querySelector('.text-2xl');
}
```

**트러블슈팅**: `sum` 변수는 한 함수에서만 사용되어 쉽게 로컬화 가능했음

### **2단계: 매개변수 전달 패턴 (itemCnt, totalAmt)**

```javascript
// Before: 전역 상태 공유
let totalAmt = 0;
let itemCnt = 0;

function handleCalculateCartStuff() {
  totalAmt = calculatedTotal;
  itemCnt = calculatedCount;
  doRenderBonusPoints(); // 전역 변수에 의존
}

function doRenderBonusPoints() {
  let basePoints = Math.floor(totalAmt * POINT_RATES.BASE_RATE);
}

// After: 명시적 매개변수 전달
function handleCalculateCartStuff() {
  let totalAmt = calculatedTotal; // 로컬 변수
  let itemCnt = calculatedCount;
  doRenderBonusPoints(totalAmt, itemCnt); // 명시적 전달
}

function doRenderBonusPoints(totalAmt, itemCnt) { // 의존성 명확화
  let basePoints = Math.floor(totalAmt * POINT_RATES.BASE_RATE);
}
```

**트러블슈팅**: 처음에 `doRenderBonusPoints`에서 `totalAmt is not defined` 에러 발생. 함수 시그니처에 매개변수 추가하여 해결.

### **3단계: DOM 직접 접근 패턴 (stockInfo)**

```javascript
// Before: 전역으로 DOM 참조 저장
let stockInfo;
function main() {
  stockInfo = selectorContainer.querySelector('#stock-status');
}
function handleStockInfoUpdate() {
  stockInfo.textContent = infoMsg;
}

// After: 필요할 때 DOM 직접 접근
function handleStockInfoUpdate() {
  const stockInfo = document.getElementById('stock-status'); // 사용시점에 검색
  stockInfo.textContent = infoMsg;
}
```

**트러블슈팅**: DOM 참조를 미리 저장할 필요가 없음을 깨달음. ID로 직접 접근하는 것이 더 안전하고 명확함.

### **4단계: 상태 캡슐화 패턴 (lastSel)**

```javascript
// Before: 전역 변수로 상태 관리
let lastSel = null;
function startSuggestSale(prodList, lastSel, ...) { }
function handleAddToCart() {
  lastSel = selItem;
}

// After: 상태 객체로 캡슐화
const lastSelectionState = {
  value: null,
  get: () => lastSelectionState.value,
  set: (newValue) => { lastSelectionState.value = newValue; }
};

function startSuggestSale(prodList, lastSelectionState.get, ...) { }
function handleAddToCart() {
  lastSelectionState.set(selItem); // 의도가 명확한 상태 변경
}
```

**트러블슈팅**: 단순 전역 변수보다 getter/setter 패턴이 상태 변경 의도를 명확하게 표현함.

### **5단계: 완전한 DOM 직접 접근 (sel, cartDisp)**

```javascript
// Before: DOM 참조를 전역으로 저장
let sel;
let cartDisp;

function main() {
  sel = selectorContainer.querySelector('#product-select');
  cartDisp = createCartDisplay();
}

function handleAddToCart() {
  const selItem = sel.value;
}

function handleCalculateCartStuff() {
  const cartItems = cartDisp.children;
}

// After: 각 함수에서 필요할 때 DOM 접근
function handleAddToCart() {
  const sel = document.getElementById('product-select'); // 직접 접근
  const selItem = sel.value;
}

function handleCalculateCartStuff() {
  const cartDisp = document.getElementById('cart-items'); // 직접 접근
  const cartItems = cartDisp.children;
}
```

**트러블슈팅**: DOM 참조를 미리 저장하는 것보다 필요할 때 직접 접근하는 것이 메모리 효율적이고 코드 이해가 쉬움.

## ✅ 개선 후 효과

### **함수 독립성 확보**

각 함수가 필요한 데이터를 명시적으로 받거나 직접 접근하여 함수만 봐도 동작을 이해할 수 있게 됨. 전역 상태에 의존하지 않아 테스트와 디버깅이 쉬워짐.

### **변수 생명주기 최적화**

변수가 필요한 순간에 생성되고 스코프를 벗어나면 즉시 해제되어 메모리 효율성 향상. 변수의 용도와 범위가 명확해져서 코드 가독성 크게 개선.

### **부작용 완전 제거**

전역 상태 변경으로 인한 예상치 못한 동작이 완전히 사라짐. 함수 호출 순서나 타이밍에 관계없이 일관된 동작 보장.

### **디버깅 용이성**

문제가 발생했을 때 해당 함수 내부만 확인하면 되므로 디버깅 범위가 크게 축소됨. 상태 변경 추적이 명확해져서 버그 원인 파악 시간 절약.

## 🎯 핵심 교훈

**"전역 변수는 필요악이 아니라 제거 가능한 기술 부채"**

단계적 접근으로 가장 복잡해 보이는 전역 변수도 로컬화, 매개변수화, 캡슐화, 직접 접근 패턴을 통해 완전히 제거할 수 있음을 확인. 각 단계마다 테스트를 실행하여 안전성을 보장하는 것이 핵심.