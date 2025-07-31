# 6단계: 함수형 패러다임으로의 마이그레이션

## 📋 개요

6번째 리팩토링에서는 Classic Module Pattern (IIFE)에서 **함수형 패러다임**으로 완전히 전환했습니다. 이는 사용자의 명확한 개발 철학("객체지향보다 함수형 패러다임을 지향하고, 그 방향으로 일관성을 지키면서 개발하고 싶어")에 따른 설계 결정이었습니다.

## 🎯 목표

- [ ] Classic Module Pattern에서 함수형 패러다임으로 완전 전환
- [ ] 불변성(Immutability) 보장
- [ ] 순수 함수(Pure Functions) 중심 설계
- [ ] 부수 효과(Side Effects) 최소화
- [ ] 모든 테스트 통과 유지

## 🤔 **패러다임 선택 고민 과정**

### **1단계: Hook-like vs 현재 방식 비교**

#### **사용자 피드백 분석**

> "그리고 훅처럼 변수를 그냥 return해서 사용하는건 적절하지 못할까?"

이 질문에서 **직관적인 사용성**에 대한 고민이 시작되었습니다.

#### **Hook-like 방식의 장점 발견**

```javascript
// 현재 방식 (복잡한 API)
const inventory = CartState.getProductInventory();
const total = CartState.getCartTotalAmount();
const count = CartState.getCartItemCount();

// Hook-like 방식 (직접 변수 return)
const { productInventory, cartTotalAmount, cartItemCount } =
  CartState.useCartState();
```

**결론**: Hook-like 방식이 더 간결하고 React 마이그레이션에 유리함을 확인

### **2단계: 개발 철학 명확화**

#### **사용자의 명확한 방향성 제시**

> "내가 지향하는 패러다임은 객체지향보다 함수형 패러다임이고, 그 방향으로 일관성을 지키면서 개발하고 싶어"

이 피드백으로 **함수형 패러다임으로의 완전한 전환** 필요성을 확인

#### **함수형 패러다임의 핵심 원칙 정의**

1. **불변성 (Immutability)**: 상태를 직접 변경하지 않음
2. **순수 함수 (Pure Functions)**: 부수 효과 없는 함수들
3. **부수 효과 최소화**: 예측 가능한 동작
4. **함수 합성 (Function Composition)**: 작은 함수들의 조합

## ⚖️ **패러다임 비교 분석**

### **Classic Module Pattern (IIFE) vs 함수형**

#### **1. 상태 관리 방식**

**IIFE 방식:**

```javascript
export const CartState = (function () {
  // Private 변수 (캡슐화)
  let productInventory = [];
  let cartTotalAmount = 0;

  return {
    getProductInventory() {
      return [...productInventory];
    },
    updateCartTotals(total, count) {
      cartTotalAmount = total; // 직접 변경
      cartItemCount = count;
    },
  };
})();
```

**함수형 방식:**

```javascript
// 불변 상태 객체
export const createInitialCartState = () => ({
  productInventory: [],
  cartTotalAmount: 0,
  cartItemCount: 0,
  lastSelectedProduct: null,
});

// 순수 함수 - 새로운 상태 반환
export const updateCartTotals = (state, totalAmount, itemCount) => ({
  ...state,
  cartTotalAmount: totalAmount,
  cartItemCount: itemCount,
});
```

#### **2. 함수 특성**

**IIFE 방식:**

```javascript
// 메서드 - 내부 상태에 의존
decreaseProductQuantity(productId, amount = 1) {
  const product = findProduct(productId);
  if (validateProduct(product)) {
    product.q = Math.max(0, product.q - amount); // 직접 변경
  }
}
```

**함수형 방식:**

```javascript
// 순수 함수 - 입력만 의존, 새로운 상태 반환
export const decreaseProductQuantity = (state, productId, amount = 1) => ({
  ...state,
  productInventory: state.productInventory.map(product =>
    product.id === productId
      ? { ...product, q: Math.max(0, product.q - amount) }
      : product
  ),
});
```

#### **3. 상태 접근 방식**

**IIFE 방식:**

```javascript
// 캡슐화된 상태 - 메서드를 통해서만 접근
const inventory = CartState.getProductInventory();
CartState.decreaseProductQuantity('product1', 1);
```

**함수형 방식:**

```javascript
// 명시적 상태 전달 - 모든 함수가 상태를 매개변수로 받음
const inventory = getProductInventory(cartState);
cartState = decreaseProductQuantity(cartState, 'product1', 1);
```

### **4. 테스트 용이성**

**IIFE 방식:**

```javascript
// 객체 상태에 의존하는 테스트
test('should decrease product quantity', () => {
  CartState.initializeCart([{ id: '1', q: 10 }]);
  CartState.decreaseProductQuantity('1', 3);
  const product = CartState.getProduct('1');
  expect(product.q).toBe(7);
});
```

**함수형 방식:**

```javascript
// 순수 함수 테스트 - 입출력만 검증
test('should decrease product quantity', () => {
  const initialState = {
    productInventory: [{ id: '1', q: 10 }],
  };
  const newState = decreaseProductQuantity(initialState, '1', 3);
  expect(newState.productInventory[0].q).toBe(7);
  expect(initialState.productInventory[0].q).toBe(10); // 원본 불변
});
```

## 🔧 **주요 변경사항**

### **1. 상태 관리 구조 변경**

**Before (IIFE):**

```javascript
export const CartState = (function () {
  let productInventory = [];
  let cartTotalAmount = 0;
  let cartItemCount = 0;
  let lastSelectedProduct = null;

  return {
    getProductInventory() {
      return [...productInventory];
    },
    decreaseProductQuantity(productId, amount) {
      /* 직접 변경 */
    },
  };
})();
```

**After (함수형):**

```javascript
export const createInitialCartState = () => ({
  productInventory: [],
  cartTotalAmount: 0,
  cartItemCount: 0,
  lastSelectedProduct: null,
});

export const getProductInventory = state => [...state.productInventory];

export const decreaseProductQuantity = (state, productId, amount = 1) => ({
  ...state,
  productInventory: state.productInventory.map(product =>
    product.id === productId
      ? { ...product, q: Math.max(0, product.q - amount) }
      : product
  ),
});
```

### **2. main.basic.js 사용 방식 변경**

**Before (IIFE):**

```javascript
import { CartState } from './state/cart.js';

// 전역 상태는 CartState 모듈로 이동

function main() {
  // 상태 초기화
  CartState.initializeCart(PRODUCT_DATA);

  // 상태 사용
  const inventory = CartState.getProductInventory();
  CartState.decreaseProductQuantity(itemId, 1);
  CartState.setLastSelectedProduct(selectedId);
}
```

**After (함수형):**

```javascript
import {
  createInitialCartState,
  initializeCart,
  getProductInventory,
  decreaseProductQuantity,
  setLastSelectedProduct,
} from './state/cart.js';

// 전역 상태 (함수형 - 단일 상태 객체)
let cartState = createInitialCartState();

function main() {
  // 상태 초기화 (새로운 상태 반환)
  cartState = initializeCart(cartState, PRODUCT_DATA);

  // 상태 사용 (불변성 보장)
  const inventory = getProductInventory(cartState);
  cartState = decreaseProductQuantity(cartState, itemId, 1);
  cartState = setLastSelectedProduct(cartState, selectedId);
}
```

### **3. 불변성 보장 패턴 적용**

**상품 수량 변경:**

```javascript
// 배열 내 특정 객체 불변 업데이트
export const updateProductQuantity = (state, productId, quantity) => ({
  ...state,
  productInventory: state.productInventory.map(product =>
    product.id === productId ? { ...product, q: quantity } : product
  ),
});
```

**세일 상태 업데이트:**

```javascript
// 조건부 속성 업데이트
export const updateProductSaleStatus = (state, productId, saleInfo) => ({
  ...state,
  productInventory: state.productInventory.map(product =>
    product.id === productId
      ? {
          ...product,
          ...(saleInfo.onSale !== undefined && { onSale: saleInfo.onSale }),
          ...(saleInfo.suggestSale !== undefined && {
            suggestSale: saleInfo.suggestSale,
          }),
          ...(saleInfo.val !== undefined && { val: saleInfo.val }),
        }
      : product
  ),
});
```

## 📊 **리팩토링 효과**

### **코드 품질 향상**

| 항목      | IIFE 패턴         | 함수형 패턴      | 개선도       |
| --------- | ----------------- | ---------------- | ------------ |
| 상태 변경 | 직접 변경         | 불변성 보장      | 🚀 대폭 개선 |
| 함수 특성 | 메서드 (부수효과) | 순수 함수        | 🚀 대폭 개선 |
| 테스트성  | 객체 상태 의존    | 입출력만 검증    | 🚀 대폭 개선 |
| 예측성    | 내부 상태 숨김    | 명시적 상태 전달 | 🚀 대폭 개선 |
| 디버깅    | 상태 추적 어려움  | 상태 흐름 명확   | 🚀 대폭 개선 |

### **Readability (가독성)**

- ✅ **명시적 상태 흐름**: 모든 상태 변경이 명확하게 보임
- ✅ **순수 함수**: 함수 이름만으로 동작 예측 가능
- ✅ **일관된 패턴**: 모든 상태 변환이 동일한 패턴

### **Predictability (예측가능성)**

- ✅ **순수 함수**: 같은 입력 → 항상 같은 출력
- ✅ **불변성**: 예상치 못한 상태 변경 불가능
- ✅ **명시적 의존성**: 함수가 무엇에 의존하는지 명확

### **Cohesion (응집도)**

- ✅ **관련 함수 그룹화**: 상태 조회, 상태 변환, 유틸리티 함수별 그룹화
- ✅ **단일 책임**: 각 함수가 하나의 명확한 작업만 수행

### **Coupling (결합도)**

- ✅ **낮은 결합도**: 순수 함수로 의존성 최소화
- ✅ **명시적 인터페이스**: 상태를 매개변수로 명시적 전달

## 🧪 **절대 원칙 검증**

### **✅ 코드 동작 보장**

- 모든 기존 기능이 동일하게 작동
- 상태 변경 로직은 불변성을 보장하는 방식으로 구현

### **✅ 구조적 개선**

- IIFE 캡슐화 → 함수형 순수 함수들
- 직접 상태 변경 → 불변성 보장 상태 변환

### **✅ 테스트 통과**

```bash
✓ src/advanced/__tests__/advanced.test.js (1 test) 4ms
✓ src/basic/__tests__/basic.test.js (102 tests | 16 skipped) 3102ms

Test Files  2 passed (2)
     Tests  87 passed | 16 skipped (103)
```

### **✅ 관심사 분리**

- `src/basic/state/cart.js`: 순수 함수형 상태 관리
- `src/basic/main.basic.js`: UI 이벤트 처리와 상태 조합

## 🎓 **학습 포인트**

### **1. 패러다임 전환의 의미**

- **철학적 일관성**: 개발자의 사고방식과 코드 구조의 일치
- **도구가 아닌 사고방식**: 함수형은 단순한 기법이 아닌 사고의 전환

### **2. 불변성의 힘**

- **예측 가능성**: 상태가 예상치 못하게 변경되지 않음
- **디버깅 용이성**: 상태 변화 추적이 명확
- **동시성 안전**: race condition 방지

### **3. 순수 함수의 가치**

- **테스트 용이성**: 입출력만 검증하면 됨
- **재사용성**: 다른 컨텍스트에서도 안전하게 사용
- **함수 합성**: 작은 함수들을 조합하여 복잡한 로직 구성

### **4. 명시적 설계의 중요성**

- **숨겨진 의존성 제거**: 모든 의존성이 매개변수로 명시
- **사이드 이펙트 최소화**: 함수의 동작이 명확하게 드러남

## 🔮 **확장 가능성**

### **1. 함수 합성 예시**

```javascript
// 여러 상태 변환을 조합
const addItemToCart = (state, productId) =>
  setLastSelectedProduct(
    decreaseProductQuantity(state, productId, 1),
    productId
  );

// 파이프라인 패턴
const pipe = (initialValue, ...functions) =>
  functions.reduce((value, fn) => fn(value), initialValue);

const processCartAction = (state, productId, quantity) =>
  pipe(
    state,
    state => decreaseProductQuantity(state, productId, quantity),
    state => setLastSelectedProduct(state, productId),
    state =>
      updateCartTotals(state, calculateTotal(state), calculateCount(state))
  );
```

### **2. 리듀서 패턴으로 확장**

```javascript
const cartReducer = (state, action) => {
  switch (action.type) {
    case 'ADD_ITEM':
      return decreaseProductQuantity(state, action.productId, action.quantity);
    case 'REMOVE_ITEM':
      return increaseProductQuantity(state, action.productId, action.quantity);
    case 'SET_SALE':
      return updateProductSaleStatus(state, action.productId, action.saleInfo);
    default:
      return state;
  }
};
```

### **3. React Hooks와의 자연스러운 연결**

```javascript
// 현재 함수형 API
const { productInventory, cartTotalAmount } = useCartState(cartState);

// 미래 React Hook (거의 동일한 패턴)
const { productInventory, cartTotalAmount } = useCartState();
```

## 🏆 **패러다임 전환 성과**

### **✅ 달성한 함수형 원칙들**

1. **불변성**: 모든 상태 변경이 새로운 객체 생성
2. **순수성**: 모든 함수가 부수 효과 없음
3. **명시성**: 모든 의존성이 매개변수로 전달
4. **조합성**: 작은 함수들을 쉽게 조합 가능
5. **예측성**: 같은 입력은 항상 같은 출력

### **📈 개발 생산성 향상**

- **테스트 작성 시간 단축**: 순수 함수는 테스트가 간단
- **디버깅 시간 단축**: 상태 흐름이 명확하게 추적 가능
- **리팩토링 안전성**: 불변성으로 예상치 못한 부작용 방지

### **🔧 유지보수성 강화**

- **기능 추가**: 새로운 순수 함수 추가가 기존 코드에 영향 없음
- **버그 수정**: 특정 함수만 수정하면 되어 영향 범위 최소화
- **성능 최적화**: 함수별로 독립적인 최적화 가능

---

_6번째 리팩토링을 통해 Classic Module Pattern에서 함수형 패러다임으로 완전히 전환했습니다. 이제 코드는 불변성, 순수성, 명시성을 모두 갖춘 함수형 스타일이 되었습니다! 🎉_
