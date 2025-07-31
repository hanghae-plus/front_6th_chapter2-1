# 📊 현재 코드 상세 분석

## 📋 분석 개요

본 문서는 `main.basic.js` 파일의 현재 상태를 10가지 카테고리별로 상세 분석하여 리팩토링의 구체적인 목표를 제시합니다.

## 🔍 코드 스멜(Code Smell) 분석

### 1. 변수 선언과 네이밍의 문제점

#### 1.1 일관성 없는 변수 선언

```javascript
// 문제: var, let, const 혼용
var prodList, sel, addBtn, cartDisp, sum, stockInfo;
var lastSel,
  bonusPts = 0,
  totalAmt = 0,
  itemCnt = 0;
var PRODUCT_ONE = 'p1';
var p2 = 'p2';
var product_3 = 'p3';
var p4 = 'p4';
var PRODUCT_5 = `p5`;
```

**문제점**:

- 전역 스코프 오염
- 호이스팅으로 인한 예측 불가능한 동작
- 일관성 없는 선언 방식

#### 1.2 의미 없는 변수명

```javascript
// 문제: 축약어와 의미 불명한 변수명
var p, q, amt, sel, tgt;
var curItem, qtyElem, itemTot, disc;
var _p, idx, j, k;
```

**개선 방향**:

- `p` → `product`
- `q` → `quantity`
- `amt` → `amount`
- `sel` → `selector`
- `tgt` → `target`

#### 1.3 네이밍 컨벤션 불일치

```javascript
// 문제: 다양한 네이밍 스타일 혼재
const PRODUCT_ONE = 'p1'; // UPPER_SNAKE_CASE
let p4 = 'p4'; // camelCase
var product_3 = 'p3'; // snake_case
var totalAmt = 0; // 축약어 사용
```

### 2. 함수 설계의 문제점

#### 2.1 과도하게 긴 함수

```javascript
// 문제: 288줄의 거대한 함수
function handleCalculateCartStuff() {
  // 1. 초기화 (52줄)
  var cartItems, subTot, itemDiscounts, lowStockItems, idx;
  // ... 25개 이상의 변수 선언

  // 2. 재고 체크 (20줄)
  for (var idx = 0; idx < prodList.length; idx++) {
    if (prodList[idx].q < 5 && prodList[idx].q > 0) {
      lowStockItems.push(prodList[idx].name);
    }
  }

  // 3. 가격 계산 (80줄)
  for (let i = 0; i < cartItems.length; i++) {
    // 복잡한 계산 로직
  }

  // 4. 할인 적용 (40줄)
  // 5. 포인트 계산 (30줄)
  // 6. UI 업데이트 (50줄)
  // 7. 통계 수집 (16줄)
}
```

**문제점**:

- 단일 책임 원칙 위반 (8가지 책임)
- 테스트하기 어려움
- 디버깅 어려움
- 재사용 불가능

#### 2.2 함수 정의 위치의 혼란

```javascript
// 문제: 함수들이 흩어져 있음
function main() {
  /* 283줄 */
}
function onUpdateSelectOptions() {
  /* 101줄 */
}
function handleCalculateCartStuff() {
  /* 288줄 */
}
var doRenderBonusPoints = () => {
  /* 87줄 */
};
function onGetStockTotal() {
  /* 10줄 */
}
var handleStockInfoUpdate = () => {
  /* 19줄 */
};
function doUpdatePricesInCart() {
  /* 57줄 */
}
```

### 3. 중복 코드 패턴

#### 3.1 포인트 계산 중복 (5곳)

```javascript
// 패턴 1: handleCalculateCartStuff 함수 내부
points = Math.floor(totalAmt / 1000);
if (new Date().getDay() === 2) {
  points *= 2;
}

// 패턴 2: doRenderBonusPoints 함수 내부
basePoints = Math.floor(totalAmt / 1000);
if (new Date().getDay() === 2) {
  finalPoints = basePoints * 2;
}

// 패턴 3: 다른 곳에서 또 다른 방식
var tempTotal = Array.from(cartDisp.children).reduce((sum, item) => {
  // 또 다른 계산 방식
}, 0);
```

#### 3.2 재고 체크 중복 (3곳)

```javascript
// 패턴 1: onUpdateSelectOptions 함수
prodList.forEach(p => (totalStock += p.q));

// 패턴 2: handleCalculateCartStuff 함수
for (var idx = 0; idx < prodList.length; idx++) {
  if (prodList[idx].q < 5 && prodList[idx].q > 0) {
    lowStockItems.push(prodList[idx].name);
  }
}

// 패턴 3: onGetStockTotal 함수
function onGetStockTotal() {
  var sum = 0;
  for (i = 0; i < prodList.length; i++) {
    currentProduct = prodList[i];
    sum += currentProduct.q;
  }
  return sum;
}
```

#### 3.3 DOM 조작 중복

```javascript
// 여러 곳에서 반복되는 패턴
document.getElementById('loyalty-points').textContent = '...';
document.getElementById('loyalty-points').style.display = 'block';
document.getElementById('loyalty-points').innerHTML = '...';
```

### 4. 매직 넘버와 하드코딩

#### 4.1 설명 없는 숫자들

```javascript
// 문제: 의미 불명한 숫자들
if (quantity < 10) return 0; // 10의 의미?
if (itemCnt >= 30) {
} // 30의 의미?
totalAmt *= 1 - 0.1; // 0.1의 의미?
if (product.q < 5) {
} // 5의 의미?
setInterval(function () {}, 30000); // 30000의 의미?
```

#### 4.2 하드코딩된 할인율

```javascript
// 문제: 할인율이 코드에 하드코딩
if (curItem.id === PRODUCT_ONE) {
  disc = 10 / 100; // 10%
} else if (curItem.id === p2) {
  disc = 15 / 100; // 15%
} else if (curItem.id === product_3) {
  disc = 20 / 100; // 20%
}
```

### 5. 전역 상태 관리의 문제

#### 5.1 전역 변수 직접 조작

```javascript
// 문제: 전역 변수 직접 수정
totalAmt = 0;
itemCnt = 0;
lastSel = null;
prodList[idx].q--;
bonusPts = finalPoints;
```

#### 5.2 상태의 일관성 부재

```javascript
// 문제: DOM과 데이터 상태 불일치
qtyElem.textContent = newQty;
itemToAdd['q']--; // 동기화 안 됨
```

### 6. 비즈니스 로직과 UI의 혼재

#### 6.1 handleCalculateCartStuff 함수의 다중 책임

```javascript
function handleCalculateCartStuff() {
  // 비즈니스 로직
  totalAmt += itemTot * (1 - disc);

  // DOM 조작
  elem.style.fontWeight = q >= 10 ? 'bold' : 'normal';

  // UI 업데이트
  document.getElementById('item-count').textContent = '...';
}
```

### 7. 에러 처리 부재

#### 7.1 null 체크 누락

```javascript
// 문제: DOM 요소 null 체크 불완전
var totalDiv = sum.querySelector('.text-2xl');
if (totalDiv) {
  totalDiv.textContent = '₩' + Math.round(totalAmt).toLocaleString();
}
// 하지만 다른 곳에서는 체크하지 않음
```

#### 7.2 예외 상황 미처리

```javascript
// 문제: 배열이 비어있을 때 처리 없음
var luckyIdx = Math.floor(Math.random() * prodList.length);
var luckyItem = prodList[luckyIdx]; // prodList가 비어있으면?
```

### 8. 성능 문제

#### 8.1 불필요한 반복 계산

```javascript
// 문제: 매번 새로운 Date 객체 생성
if (new Date().getDay() === 2) {
}
if (new Date().getDay() === 2) {
}
```

#### 8.2 비효율적인 DOM 조작

```javascript
// 문제: innerHTML 반복 사용
summaryDetails.innerHTML += `...`;
summaryDetails.innerHTML += `...`;
summaryDetails.innerHTML += `...`;
```

### 9. 일관성 없는 코딩 스타일

#### 9.1 공백과 들여쓰기

```javascript
// 문제: 일관성 없는 공백
var opt = document.createElement('option');
let leftColumn = document.createElement('div');
```

#### 9.2 괄호 사용

```javascript
// 문제: 때로는 괄호 사용, 때로는 점 표기법
leftColumn['className'] = '...'
leftColumn.appendChild(...)
```

#### 9.3 문자열 표현

```javascript
// 문제: 따옴표 혼용
const PRODUCT_ONE = 'p1';
let p4 = 'p4';
productFive = `p5`;
```

### 10. 주석과 문서화

#### 10.1 의미 없는 주석

```javascript
// 문제: 의미 없는 주석
// Header
let header = document.createElement('div');

// 여기서도 카트 체크 (중복)
if (cartDisp.children.length === 0) {
}
```

#### 10.2 복잡한 로직에 대한 설명 부재

```javascript
// 문제: 복잡한 계산에 설명 없음
discRate = discRate + 0.1 * (1 - discRate);
```

## 📊 문제점 통계

### 함수별 분석

| 함수명                   | 라인 수 | 책임 개수 | 복잡도    |
| ------------------------ | ------- | --------- | --------- |
| main                     | 283     | 5         | 높음      |
| onUpdateSelectOptions    | 101     | 3         | 중간      |
| handleCalculateCartStuff | 288     | 8         | 매우 높음 |
| doRenderBonusPoints      | 87      | 4         | 높음      |
| onGetStockTotal          | 10      | 1         | 낮음      |
| handleStockInfoUpdate    | 19      | 2         | 낮음      |
| doUpdatePricesInCart     | 57      | 3         | 중간      |

### 중복 코드 통계

- **포인트 계산**: 5곳에서 중복
- **재고 체크**: 3곳에서 중복
- **DOM 조작**: 8곳에서 중복
- **화요일 체크**: 4곳에서 중복

### 매직 넘버 통계

- **할인율 관련**: 8개
- **수량 기준**: 6개
- **시간 관련**: 4개
- **재고 기준**: 3개

## 🎯 리팩토링 우선순위

### 🔴 Critical (즉시 해결)

1. 전역 변수 제거
2. handleCalculateCartStuff 함수 분할
3. 중복 코드 통합

### 🟡 High (높은 우선순위)

1. 매직 넘버 상수화
2. 일관된 코딩 스타일 적용
3. 에러 처리 추가

### 🟢 Medium (중간 우선순위)

1. 성능 최적화
2. 주석 개선
3. 문서화

## 📝 다음 단계

1. **03-refactoring-strategy.md** - 리팩토링 전략 수립
2. **04-module-pattern-design.md** - 모듈 패턴 설계
3. **05-function-decomposition.md** - 함수 분해 계획
