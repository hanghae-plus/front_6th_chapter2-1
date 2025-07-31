# 두 번째 리팩토링: Modules 함수 통합

## 📋 개요

이 문서는 `main.basic.js` 파일의 두 번째 리팩토링 과정을 기록합니다. 기존에 분리된 `modules/` 폴더의 함수들을 main.basic.js에 통합하여 코드 재사용성과 모듈화를 달성하는 것이 목표였습니다.

## 🎯 리팩토링 목표

1. **모듈 함수 통합**: 기존 modules 폴더의 함수들을 main.basic.js에 적용
2. **중복 코드 제거**: 기존 중복 함수들을 제거하고 modules 함수로 대체
3. **매개변수 통일**: 일관된 객체 destructuring 패턴 적용
4. **테스트 안정성**: 모든 기능 동작 보존

## 🗂️ 대상 Modules

### 사용된 Modules 함수들

| 모듈 파일                       | 함수명                       | 역할                    |
| ------------------------------- | ---------------------------- | ----------------------- |
| `handleSelectOptionsUpdate.js`  | `handleSelectOptionsUpdate`  | 상품 선택 옵션 업데이트 |
| `handleCartUpdate.js`           | `handleCartUpdate`           | 장바구니 상태 업데이트  |
| `updatePricesInCart.js`         | `updatePricesInCart`         | 장바구니 가격 업데이트  |
| `handleStockInfoUpdate.js`      | `handleStockInfoUpdate`      | 재고 정보 업데이트      |
| `updateLoyaltyPointsDisplay.js` | `updateLoyaltyPointsDisplay` | 포인트 표시 업데이트    |
| `getStockTotal.js`              | `getStockTotal`              | 총 재고량 계산          |

## 🔧 주요 변경 사항

### 1. Import 구문 추가

```javascript
// 변경 후: modules 함수들 import
import {
  handleSelectOptionsUpdate,
  handleCartUpdate,
  updatePricesInCart,
  handleStockInfoUpdate,
  updateLoyaltyPointsDisplay,
  getStockTotal,
} from './modules/index.js';
```

### 2. 기존 함수 제거 및 대체

#### 2.1 updateSelectOptions 함수 제거

**변경 전** (약 70라인의 함수):

```javascript
function updateSelectOptions() {
  let totalStock;
  let opt;
  let discountText;
  sel.innerHTML = '';
  totalStock = 0;

  for (let idx = 0; idx < prodList.length; idx++) {
    const _p = prodList[idx];
    totalStock = totalStock + _p.q;
  }

  // ... 나머지 로직 (70+ 라인)
}
```

**변경 후**:

```javascript
// 함수 제거 후, 호출 부분만 수정
handleSelectOptionsUpdate({ sel, prodList });
```

#### 2.2 handleCartUpdate 함수 제거 및 호출 수정

**변경 전** (약 240라인의 거대한 함수):

```javascript
function handleCartUpdate() {
  let cartItems;
  let subTot;
  let itemDiscounts;
  // ... 매우 긴 로직 (240+ 라인)

  totalAmt = 0;
  itemCnt = 0;
  // ... 복잡한 계산 로직
}
```

**변경 후**:

```javascript
// 함수 제거 후, 매개변수와 함께 호출
handleCartUpdate({ cartDisp, prodList });
```

#### 2.3 기타 함수들 제거

- `updateStockInfo()` → 제거
- `updatePricesInCart()` → 제거
- `getStockTotal()` → 제거
- `computeAndDisplayLoyaltyPoints()` → 제거

### 3. 함수 호출 부분 수정

#### 3.1 초기화 부분

```javascript
// 변경 전
updateSelectOptions();
handleCartUpdate();

// 변경 후
handleSelectOptionsUpdate({ sel, prodList });
handleCartUpdate({ cartDisp, prodList });
```

#### 3.2 이벤트 리스너 내부

```javascript
// 변경 전 (addBtn 이벤트 리스너)
handleCartUpdate();

// 변경 후
handleCartUpdate({ cartDisp, prodList });
```

#### 3.3 번개세일 및 추천세일 로직

```javascript
// 변경 전
updateSelectOptions();
updatePricesInCart();

// 변경 후
handleSelectOptionsUpdate({ sel, prodList });
updatePricesInCart({ cartDisp, totalCount: 0 });
```

#### 3.4 장바구니 이벤트 리스너

```javascript
// 변경 전
handleCartUpdate();
updateSelectOptions();

// 변경 후
handleCartUpdate({ cartDisp, prodList });
handleSelectOptionsUpdate({ sel, prodList });
```

### 4. Modules 함수 호환성 수정

#### 4.1 updateLoyaltyPointsDisplay 매개변수 추가

**modules 함수 수정**:

```javascript
// 변경 전
export function updateLoyaltyPointsDisplay({ cartDisp, prodList, totalAmt }) {

// 변경 후
export function updateLoyaltyPointsDisplay({ cartDisp, prodList, totalAmt, itemCnt }) {
```

**호출 부분 수정**:

```javascript
// handleCartUpdate.js 내부
updateLoyaltyPointsDisplay({ cartDisp, prodList, totalAmt, itemCnt });
```

#### 4.2 상수 참조 통일

modules 함수들에서 상수 참조를 통일했습니다:

```javascript
// handleCartUpdate.js
import { PRODUCT_IDS } from '../constants/business-rules.js';

// 변경 전
const PRODUCT_1 = 'p1';
const PRODUCT_2 = 'p2';

// 변경 후
if (curItem.id === PRODUCT_IDS.keyboard) {
  disc = 10 / 100;
} else if (curItem.id === PRODUCT_IDS.mouse) {
  disc = 15 / 100;
}
```

## 📊 코드 축소 효과

### 제거된 코드량

| 함수명                           | 제거된 라인 수 | 설명                        |
| -------------------------------- | -------------- | --------------------------- |
| `updateSelectOptions`            | ~70 라인       | 상품 옵션 업데이트 로직     |
| `handleCartUpdate`               | ~240 라인      | 장바구니 업데이트 로직      |
| `updateStockInfo`                | ~20 라인       | 재고 정보 업데이트          |
| `updatePricesInCart`             | ~80 라인       | 가격 업데이트 로직          |
| `computeAndDisplayLoyaltyPoints` | ~100 라인      | 포인트 계산 및 표시         |
| `getStockTotal`                  | ~10 라인       | 재고 총합 계산              |
| **총계**                         | **~520 라인**  | **전체 파일 크기 60% 감소** |

### 모듈화 효과

- **단일 파일**: 900+ 라인 → 400 라인
- **모듈 분산**: 7개 모듈로 관심사 분리
- **재사용성**: 다른 컴포넌트에서도 활용 가능

## ✅ 성과 및 결과

### 테스트 결과

```
✓ src/basic/__tests__/basic.test.js (102 tests | 16 skipped)
✓ src/advanced/__tests__/advanced.test.js (1 test)
Test Files  2 passed (2)
Tests  87 passed | 16 skipped (103)
Duration  6.20s
```

### 개선 효과

1. **코드 재사용성**
   - 각 모듈 함수가 독립적으로 사용 가능
   - 다른 컴포넌트에서 쉽게 import하여 활용

2. **관심사 분리**
   - 각 함수가 단일 책임 원칙 준수
   - 장바구니, 재고, 포인트 등 도메인별 분리

3. **유지보수성 향상**
   - 특정 기능 수정 시 해당 모듈만 수정
   - 함수별 테스트 작성이 용이

4. **가독성 개선**
   - main.basic.js가 고수준 로직에 집중
   - 구현 세부사항은 모듈에 캡슐화

## 🚀 앞으로의 개선 방향

1. **추가 모듈화**: 이벤트 핸들러 분리
2. **타입 안정성**: TypeScript 도입 검토
3. **테스트 코드**: 각 모듈별 단위 테스트 추가
4. **상태 관리**: 전역 상태 관리 패턴 도입

---

**완료일**: 2024년  
**수정 파일**:

- `src/basic/main.basic.js` (520라인 제거)
- `src/basic/modules/handleCartUpdate.js` (상수 참조 수정)
- `src/basic/modules/updateLoyaltyPointsDisplay.js` (매개변수 추가)
