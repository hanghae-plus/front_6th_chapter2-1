# 5단계: 상태 관리 패턴 선택 및 구현

## 📋 개요

5번째 리팩토링에서는 전역 비즈니스 상태 변수들을 중앙화된 상태 관리 모듈로 통합했습니다. 이 과정에서 **Classic Module Pattern (IIFE)**과 **Hook-like 함수 패턴**을 비교 분석하고, 프로젝트에 가장 적합한 패턴을 선택했습니다.

## 🎯 목표

- [ ] 전역 비즈니스 상태 변수들을 중앙화된 모듈로 통합
- [ ] 상태 접근을 제어하고 캡슐화 강화
- [ ] 상태 관리 패턴 비교 및 최적 선택
- [ ] 모든 테스트 통과 유지

## 📊 상태 관리 패턴 비교

### 1. Classic Module Pattern (IIFE)

```javascript
export const CartState = (function () {
  // ===== Private 변수 =====
  let productInventory = [];
  let cartTotalAmount = 0;
  let cartItemCount = 0;
  let lastSelectedProduct = null;

  // ===== Private 함수들 =====
  function findProduct(productId) {
    return productInventory.find(p => p.id === productId);
  }

  function validateProduct(product) {
    return product !== null && product !== undefined;
  }

  // ===== Public API =====
  return {
    // 상태 조회
    useCartState() {
      return {
        productInventory: [...productInventory],
        cartTotalAmount,
        cartItemCount,
        lastSelectedProduct,
      };
    },
    getProductInventory() {
      return [...productInventory];
    },
    getProduct(productId) {
      return findProduct(productId) || null;
    },
    // ... 기타 메서드들
  };
})();
```

### 2. Hook-like 함수 패턴

```javascript
// 모듈 스코프 변수들
let productInventory = [];
let cartTotalAmount = 0;
let cartItemCount = 0;
let lastSelectedProduct = null;

// Private 헬퍼 함수들
function findProduct(productId) {
  return productInventory.find(p => p.id === productId);
}

function validateProduct(product) {
  return product !== null && product !== undefined;
}

// Public API 함수들
export function useCartState() {
  return {
    productInventory: [...productInventory],
    cartTotalAmount,
    cartItemCount,
    lastSelectedProduct,
  };
}

export function getProductInventory() {
  return [...productInventory];
}

export function getProduct(productId) {
  return findProduct(productId) || null;
}
// ... 기타 함수들
```

## 🔍 상세 비교 분석

### 📦 캡슐화 수준

#### IIFE 방식

```javascript
export const CartState = (function () {
  let secret = '절대 접근 불가'; // 완전히 private
  function privateHelper() {
    /* private 함수 */
  }

  return {
    publicMethod() {
      return secret;
    },
  };
})();

// secret과 privateHelper는 외부에서 절대 접근 불가!
console.log(CartState.secret); // undefined ✅
```

#### Hook-like 방식

```javascript
let secret = 'module scope'; // 같은 모듈의 다른 함수들이 접근 가능

function privateHelper() {
  /* 여전히 export 가능 */
}

export function useCartState() {
  return secret;
}

// 실수로 노출 가능
export function hackAccess() {
  return secret; // 접근 가능! ❌
}
```

### ⏰ 초기화 타이밍

#### IIFE 방식

```javascript
export const CartState = (function () {
  let data = [];
  console.log('모듈 로드 시 즉시 초기화!'); // import 시점에 실행

  return { getData: () => data };
})();
```

#### Hook-like 방식

```javascript
let data = [];

export function useCartState() {
  console.log('함수 호출할 때마다 실행'); // 매번 실행
  return { getData: () => data };
}
```

### 🎯 사용 방식

#### IIFE 방식

```javascript
import { CartState } from './state/cart.js';

// 하나의 객체로 API 그룹화
const inventory = CartState.getProductInventory();
CartState.updateCartTotals(1000, 5);
const state = CartState.useCartState();
```

#### Hook-like 방식

```javascript
import {
  getProductInventory,
  updateCartTotals,
  useCartState,
} from './state/cart.js';

// 개별 함수 import
const inventory = getProductInventory();
updateCartTotals(1000, 5);
const state = useCartState();
```

## ⚖️ 장단점 비교

### ✅ IIFE 방식의 장점

1. **완전한 캡슐화**: 진짜 private 변수/함수
2. **초기화 보장**: 모듈 로드 시 한 번만 실행
3. **네임스페이스**: 하나의 객체로 API 그룹화
4. **상태 보호**: 실수로 인한 상태 변경 방지
5. **Singleton 패턴**: 전역에서 하나의 인스턴스만 존재

### ❌ IIFE 방식의 단점

1. **Tree Shaking 제한**: 사용하지 않는 메서드도 번들에 포함
2. **타입스크립트 복잡성**: 개별 함수 타입 정의가 어려움
3. **React 패턴과 차이**: Hook 패턴과 다른 구조

### ✅ Hook-like 방식의 장점

1. **React 마이그레이션**: Hook 패턴과 완전 동일
2. **Tree Shaking**: 사용하지 않는 함수 제거 가능
3. **타입스크립트**: 개별 함수 타입 정의 용이
4. **테스트**: 개별 함수 단위 테스트 용이
5. **유연성**: 필요한 함수만 import 가능

### ❌ Hook-like 방식의 단점

1. **캡슐화 부족**: 모듈 스코프 변수에 접근 가능
2. **실수 가능성**: private 함수를 실수로 export 가능
3. **초기화 관리**: 매번 초기화 상태 체크 필요

## 🏆 패턴 선택 기준

### IIFE가 적합한 경우

- **완전한 상태 은닉**이 필요할 때
- **Singleton 패턴**이 필요할 때
- **초기화 로직**이 복잡할 때
- **상태 보호**가 중요할 때

### Hook-like가 적합한 경우

- **React 마이그레이션** 예정일 때
- **Tree Shaking** 최적화가 중요할 때
- **개별 함수 테스트**가 중요할 때
- **유연한 import**가 필요할 때

## 🎯 현재 프로젝트에서의 선택: IIFE

### 선택 근거

1. **상태 보호**: 장바구니 상태가 실수로 변경되면 안 됨
2. **단일 인스턴스**: 전역에서 하나의 장바구니만 필요
3. **완전한 캡슐화**: private 헬퍼 함수들이 외부 노출 방지
4. **초기화 보장**: 모듈 로드 시 상태 초기화 완료

## 🔧 주요 변경사항

### 1. CartState 모듈 생성 (`src/basic/state/cart.js`)

```javascript
/**
 * 장바구니 상태 관리 모듈 (Classic Module Pattern)
 * Private 변수와 함수를 캡슐화하고 Public API만 노출
 */
export const CartState = (function () {
  // ===== Private 변수 =====
  let productInventory = [];
  let cartTotalAmount = 0;
  let cartItemCount = 0;
  let lastSelectedProduct = null;

  // ===== Private 함수들 =====
  function findProduct(productId) {
    return productInventory.find(p => p.id === productId);
  }

  function validateProduct(product) {
    return product !== null && product !== undefined;
  }

  // ===== Public API =====
  return {
    // 상태 조회 메서드들
    useCartState() {
      /* ... */
    },
    getProductInventory() {
      /* ... */
    },
    getProduct(productId) {
      /* ... */
    },

    // 상태 업데이트 메서드들
    initializeCart(productData) {
      /* ... */
    },
    updateCartTotals(totalAmount, itemCount) {
      /* ... */
    },
    updateProductQuantity(productId, quantity) {
      /* ... */
    },

    // 유틸리티 메서드들
    hasProduct(productId) {
      /* ... */
    },
    hasStock(productId) {
      /* ... */
    },
    getTotalStock() {
      /* ... */
    },
  };
})();
```

### 2. main.basic.js에서 전역 변수 제거

**Before:**

```javascript
// 비즈니스 상태 (전역으로 유지)
let productInventory;
let cartTotalAmount = 0;
let cartItemCount = 0;
let lastSelectedProduct;

// 상태 초기화
cartTotalAmount = 0;
cartItemCount = 0;
lastSelectedProduct = null;
productInventory = PRODUCT_DATA;
```

**After:**

```javascript
import { CartState } from './state/cart.js';

// 전역 상태는 CartState 모듈로 이동

// 상태 초기화
CartState.initializeCart(PRODUCT_DATA);
```

### 3. 모든 전역 변수 참조를 CartState API 호출로 변경

**Before:**

```javascript
// 직접 전역 변수 접근
for (let i = 0; i < productInventory.length; i++) {
  initialStockTotal += productInventory[i].q;
}
itemToAdd.q--;
lastSelectedProduct = selectedItemId;
```

**After:**

```javascript
// CartState API를 통한 접근
const initialStockTotal = CartState.getTotalStock();
CartState.decreaseProductQuantity(itemToAdd.id, 1);
CartState.setLastSelectedProduct(selectedItemId);
```

## 📊 리팩토링 효과

### 코드 품질 향상

| 항목           | Before       | After          | 개선도       |
| -------------- | ------------ | -------------- | ------------ |
| 전역 변수      | 4개          | 0개            | ✅ 완전 제거 |
| 상태 캡슐화    | ❌ 없음      | ✅ 완전 캡슐화 | 🚀 대폭 개선 |
| 상태 접근 제어 | ❌ 직접 접근 | ✅ API 통제    | 🚀 대폭 개선 |
| 코드 안전성    | ⚠️ 위험      | ✅ 안전        | 🚀 대폭 개선 |

### Readability (가독성)

- ✅ **명확한 상태 관리**: CartState API로 의도가 명확함
- ✅ **일관된 접근 방식**: 모든 상태 조작이 API를 통해 이루어짐
- ✅ **자기 문서화**: 메서드 이름으로 기능 파악 가능

### Predictability (예측가능성)

- ✅ **제어된 상태 변경**: API를 통해서만 상태 변경 가능
- ✅ **일관된 반환 타입**: 모든 get 메서드가 일관된 형태 반환
- ✅ **명확한 책임 분리**: 상태 관리 로직이 한 곳에 집중

### Cohesion (응집도)

- ✅ **관련 기능 그룹화**: 장바구니 상태 관련 모든 기능이 한 모듈에 집중
- ✅ **단일 책임**: CartState는 오직 상태 관리만 담당

### Coupling (결합도)

- ✅ **낮은 결합도**: main.basic.js가 상태 구현에 의존하지 않음
- ✅ **인터페이스 분리**: 명확한 Public API로 의존성 최소화

## 🧪 절대 원칙 검증

### ✅ 코드 동작 보장

- 모든 기존 기능이 동일하게 작동
- 상태 변경 로직은 API 내부로 캡슐화

### ✅ 구조적 개선

- 전역 변수 → 캡슐화된 모듈
- 직접 접근 → 제어된 API 접근

### ✅ 테스트 통과

```bash
✓ src/advanced/__tests__/advanced.test.js (1 test) 5ms
✓ src/basic/__tests__/basic.test.js (102 tests | 16 skipped) 2603ms

Test Files  2 passed (2)
     Tests  87 passed | 16 skipped (103)
```

### ✅ 관심사 분리

- `src/basic/state/cart.js`: 상태 관리 전담
- `src/basic/main.basic.js`: UI 이벤트 처리 집중

## 🎓 학습 포인트

### 1. 모듈 패턴의 힘

- **IIFE를 통한 완전한 캡슐화**가 얼마나 강력한지 체험
- **Private vs Public API**의 명확한 구분의 중요성

### 2. 상태 관리 패턴 선택

- **프로젝트 요구사항에 맞는 패턴 선택**의 중요성
- **React 마이그레이션 vs 완전한 캡슐화** 간의 트레이드오프

### 3. 점진적 리팩토링

- **전역 상태를 한 번에 모듈로 이동**하는 전략의 효과성
- **API 설계의 중요성**: 직관적이고 일관된 메서드 명명

### 4. 캡슐화의 가치

- **실수 방지**: private 변수로 의도치 않은 상태 변경 방지
- **유지보수성**: 상태 변경 로직이 한 곳에 집중

## 🔮 다음 단계

1. **UI 로직 분리**: 남은 UI 관련 함수들을 별도 모듈로 분리
2. **이벤트 핸들러 분리**: 이벤트 처리 로직을 별도 모듈로 분리
3. **모듈 간 의존성 최적화**: 각 모듈의 책임과 의존성 명확화

---

_5번째 리팩토링을 통해 전역 상태를 완전히 캡슐화하고, Classic Module Pattern의 강력함을 체험했습니다. 이제 애플리케이션의 상태는 안전하게 보호되고 제어됩니다! 🎉_
