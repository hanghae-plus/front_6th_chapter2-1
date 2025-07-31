# 첫 번째 리팩토링: 함수명 개선 및 상수 분리

## 📋 개요

이 문서는 `main.basic.js` 파일의 첫 번째 리팩토링 과정을 기록합니다. 주요 목표는 선언적 함수명으로 변경하고 매직넘버를 의미있는 상수로 분리하는 것이었습니다.

## 🎯 리팩토링 목표

1. **함수명 개선**: `calculate` 단어 제거 및 선언적 네이밍
2. **상수 분리**: 매직넘버를 별도 모듈로 추출
3. **데이터 구조 통일**: 일관된 속성명 사용
4. **테스트 안정성**: 모든 기능 동작 보존

## 🔧 주요 변경 사항

### 1. 함수명 개선

#### 변경 전

```javascript
const doRenderBonusPoints = () => {
  // 포인트 계산 및 UI 업데이트 로직
};
```

#### 변경 후

```javascript
const computeAndDisplayLoyaltyPoints = () => {
  // 포인트 계산 및 UI 업데이트 로직
};
```

**개선 효과**:

- `calculate` 단어 제거로 사용자 요구사항 충족
- `computeAndDisplay`로 함수의 두 가지 책임 명시
- `LoyaltyPoints`로 도메인 의미 명확화

### 2. 상수 모듈 생성

#### 2.1 비즈니스 규칙 상수 (`constants/business-rules.js`)

```javascript
// 할인 규칙
export const DISCOUNT_RATES = {
  bulkPurchase: {
    threshold: 30,
    rate: 0.25, // 25%
  },
  individual: {
    threshold: 10,
    rates: {
      keyboard: 0.1, // 10%
      mouse: 0.15, // 15%
      monitorArm: 0.2, // 20%
      laptopPouch: 0.05, // 5%
      speaker: 0.25, // 25%
    },
  },
  tuesdaySpecial: {
    rate: 0.1, // 10%
  },
};

// 상품 ID
export const PRODUCT_IDS = {
  keyboard: 'p1',
  mouse: 'p2',
  monitorArm: 'p3',
  laptopPouch: 'p4',
  speaker: 'p5',
};

// 포인트 적립 규칙
export const LOYALTY_POINTS = {
  baseRate: 1000, // 1000원당 1포인트
  setBonuses: {
    keyboardMouse: 50, // 키보드+마우스
    fullSet: 100, // 키보드+마우스+모니터암
  },
  bulkBonuses: {
    small: { threshold: 10, points: 20 }, // 10개+
    medium: { threshold: 20, points: 50 }, // 20개+
    large: { threshold: 30, points: 100 }, // 30개+
  },
  tuesdayMultiplier: 2,
};
```

#### 2.2 상품 데이터 상수 (`constants/product-data.js`)

```javascript
export const PRODUCT_DATA = [
  {
    id: PRODUCT_IDS.keyboard,
    name: '버그 없애는 키보드',
    val: 10000,
    originalVal: 10000,
    q: 50,
    onSale: false,
    suggestSale: false,
  },
  // ... 나머지 상품들
];
```

### 3. 상수 참조 변경

#### 변경 전

```javascript
const PRODUCT_ONE = 'p1';
const p2 = 'p2';
const product_3 = 'p3';
const p4 = 'p4';
const PRODUCT_5 = `p5`;

// 하드코딩된 로직
if (curItem.id === PRODUCT_ONE) {
  disc = 10 / 100;
} else if (curItem.id === p2) {
  disc = 15 / 100;
}
```

#### 변경 후

```javascript
import { PRODUCT_IDS } from './constants/business-rules.js';

// 상수를 사용한 로직
if (curItem.id === PRODUCT_IDS.keyboard) {
  disc = 10 / 100;
} else if (curItem.id === PRODUCT_IDS.mouse) {
  disc = 15 / 100;
}
```

### 4. 데이터 구조 통일

기존 코드에서 사용하던 `val`, `originalVal`, `q` 속성명을 유지하여 호환성을 보장했습니다.

```javascript
// 기존 코드와 호환되도록 속성명 유지
export const PRODUCT_DATA = [
  {
    id: PRODUCT_IDS.keyboard,
    name: '버그 없애는 키보드',
    val: 10000, // price → val 유지
    originalVal: 10000, // originalPrice → originalVal 유지
    q: 50, // quantity → q 유지
    onSale: false,
    suggestSale: false,
  },
];
```

## ✅ 성과 및 결과

### 테스트 결과

```
✓ src/basic/__tests__/basic.test.js (102 tests | 16 skipped)
Test Files  2 passed (2)
Tests  87 passed | 16 skipped (103)
```

### 개선 효과

1. **가독성 향상**
   - 함수명이 수행하는 작업을 명확히 표현
   - 매직넘버가 의미있는 상수명으로 대체

2. **유지보수성 개선**
   - 비즈니스 규칙 변경 시 상수 파일만 수정
   - 일관된 네이밍 컨벤션 적용

3. **확장성 증대**
   - 새로운 상품 추가 시 PRODUCT_IDS만 확장
   - 할인 규칙 변경이 용이함

## 🚀 다음 단계

이 리팩토링을 통해 코드의 기본적인 품질이 향상되었으며, 다음 단계인 **모듈 분리 및 함수 통합**을 위한 기반이 마련되었습니다.

---

**완료일**: 2024년  
**수정 파일**:

- `src/basic/main.basic.js`
- `src/basic/constants/business-rules.js` (신규)
- `src/basic/constants/product-data.js` (신규)
