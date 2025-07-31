# React 프로젝트 리팩토링 계획서

## 📋 개요

현재 `@advanced/` 폴더의 React 프로젝트를 Radix UI의 `createSafeContext` 패턴과 관심사 분리 원칙에 따라 리팩토링합니다.

### 🎯 목표

1. **Radix UI의 `createSafeContext` 패턴 적용**: 안전한 Context 사용
2. **관심사 분리**: UI 로직과 비즈니스 로직 분리
3. **Hook 기반 아키텍처**: 재사용 가능한 커스텀 훅 생성
4. **타입 안전성 향상**: TypeScript 활용 극대화

## 🔍 현재 상태 분석

### 문제점

1. **Context 안전성 부족**: `createContext`의 기본값이 `undefined`
2. **관심사 혼재**: 컴포넌트 내에 UI 로직과 비즈니스 로직이 섞여있음
3. **재사용성 부족**: 로직이 컴포넌트에 직접 구현됨
4. **테스트 어려움**: UI와 로직이 결합되어 단위 테스트 복잡

### 현재 구조

```
src/advanced/
├── App.tsx (UI + 비즈니스 로직 혼재)
├── context/AppContext.tsx (기본 Context)
├── components/
│   ├── Cart/Cart.tsx
│   ├── ProductSelector/ProductSelector.tsx
│   └── OrderSummary/OrderSummary.tsx
└── utils/businessLogic.ts (순수 함수들)
```

## 🚀 리팩토링 계획

### Phase 1: Context 안전성 개선

#### 1.1 `createSafeContext` 유틸리티 생성

```typescript
// src/advanced/utils/createSafeContext.ts
export function createSafeContext<T>(displayName: string) {
  const Context = createContext<T | undefined>(undefined);
  Context.displayName = displayName;

  const useContext = () => {
    const context = React.useContext(Context);
    if (context === undefined) {
      throw new Error(`${displayName} must be used within a ${displayName}Provider`);
    }
    return context;
  };

  return [Context.Provider, useContext] as const;
}
```

#### 1.2 AppContext 리팩토링

```typescript
// src/advanced/context/AppContext.tsx
const [AppProvider, useAppContext] = createSafeContext<AppContextType>("App");
```

### Phase 2: 관심사 분리 - Hook 기반 아키텍처

#### 2.1 도메인별 Hook 생성

**Cart Hook**

```typescript
// src/advanced/hooks/useCart.ts
export function useCart() {
  const { state, dispatch } = useAppContext();

  const addToCart = useCallback(
    (productId: string, quantity: number) => {
      // 비즈니스 로직
    },
    [dispatch],
  );

  const removeFromCart = useCallback(
    (productId: string) => {
      // 비즈니스 로직
    },
    [dispatch],
  );

  return {
    cartItems: state.cartItems,
    addToCart,
    removeFromCart,
    updateQuantity,
  };
}
```

**Product Hook**

```typescript
// src/advanced/hooks/useProduct.ts
export function useProduct() {
  const { state, dispatch } = useAppContext();

  const selectProduct = useCallback(
    (productId: string) => {
      // 비즈니스 로직
    },
    [dispatch],
  );

  return {
    products: state.productList,
    selectedProduct: state.uiState.selectedProductId,
    selectProduct,
  };
}
```

**Order Hook**

```typescript
// src/advanced/hooks/useOrder.ts
export function useOrder() {
  const { state } = useAppContext();

  const calculation = useMemo(() => {
    return calculateCartTotals(state.cartItems, state.productList);
  }, [state.cartItems, state.productList]);

  return {
    calculation,
    totalAmount: calculation.totalAmount,
    discountRate: calculation.discountRate,
    loyaltyPoints: calculation.points.total,
  };
}
```

#### 2.2 UI 전용 Hook 생성

**Modal Hook**

```typescript
// src/advanced/hooks/useModal.ts
export function useModal() {
  const [isOpen, setIsOpen] = useState(false);

  const open = useCallback(() => setIsOpen(true), []);
  const close = useCallback(() => setIsOpen(false), []);

  return { isOpen, open, close };
}
```

**Notification Hook**

```typescript
// src/advanced/hooks/useNotification.ts
export function useNotification() {
  const showNotification = useCallback((message: string, type: "success" | "error") => {
    // 알림 로직
  }, []);

  return { showNotification };
}
```

**ItemCount Hook**

```typescript
// src/advanced/hooks/useItemCount.ts
export function useItemCount() {
  const { state } = useAppContext();

  const itemCount = useMemo(() => {
    return state.cartItems.reduce((sum, item) => sum + item.quantity, 0);
  }, [state.cartItems]);

  return { itemCount };
}
```

**HelpModal Hook**

```typescript
// src/advanced/hooks/useHelpModal.ts
export function useHelpModal() {
  const [isOpen, setIsOpen] = useState(false);

  const open = useCallback(() => setIsOpen(true), []);
  const close = useCallback(() => setIsOpen(false), []);
  const toggle = useCallback(() => setIsOpen((prev) => !prev), []);

  return { isOpen, open, close, toggle };
}
```

### Phase 3: 컴포넌트 리팩토링

#### 3.1 App 컴포넌트 분리

**Header 컴포넌트**

```typescript
// src/advanced/components/Header/Header.tsx
const Header: React.FC = () => {
  return (
    <div className="mb-8">
      <h1 className="tracking-extra-wide mb-2 text-xs font-medium uppercase">
        🛒 Hanghae Online Store
      </h1>
      <div className="text-5xl leading-none tracking-tight">Shopping Cart</div>
      <ItemCount />
    </div>
  );
};
```

**MainLayout 컴포넌트**

```typescript
// src/advanced/components/Layout/MainLayout.tsx
const MainLayout: React.FC = () => {
  return (
    <div className="grid flex-1 grid-cols-1 gap-6 overflow-hidden lg:grid-cols-[1fr_360px]">
      <div className="overflow-y-auto border border-gray-200 bg-white p-8">
        <ProductSelector />
        <Cart />
      </div>
      <div className="flex flex-col bg-black p-8 text-white">
        <OrderSummary />
      </div>
    </div>
  );
};
```

**HelpModal 컴포넌트**

```typescript
// src/advanced/components/HelpModal/HelpModal.tsx
const HelpModal: React.FC = () => {
  const { isOpen, close } = useHelpModal();

  if (!isOpen) return null;

  return (
    <div
      data-testid="manual-overlay"
      onClick={close}
      className="fixed inset-0 z-40 bg-black/50 transition-opacity duration-300"
    >
      <div
        data-testid="manual-column"
        className="fixed right-0 top-0 h-full w-80 bg-white p-6 shadow-2xl"
      >
        {/* 도움말 내용 */}
      </div>
    </div>
  );
};
```

**HelpToggle 컴포넌트**

```typescript
// src/advanced/components/HelpModal/HelpToggle.tsx
const HelpToggle: React.FC = () => {
  const { toggle } = useHelpModal();

  return (
    <button
      data-testid="help-toggle"
      onClick={toggle}
      className="fixed right-4 top-4 z-50 rounded-full bg-black p-3 text-white transition-colors hover:bg-gray-900"
    >
      {/* SVG 아이콘 */}
    </button>
  );
};
```

**ItemCount 컴포넌트**

```typescript
// src/advanced/components/ItemCount/ItemCount.tsx
const ItemCount: React.FC = () => {
  const { itemCount } = useItemCount();

  return (
    <p className="mt-3 text-sm font-normal text-gray-500">
      🛍️ {itemCount} items in cart
    </p>
  );
};
```

#### 3.2 기존 컴포넌트들

**Cart 컴포넌트**

```typescript
// src/advanced/components/Cart/Cart.tsx
const Cart: React.FC = () => {
  const { cartItems, removeFromCart, updateQuantity } = useCart();

  // UI 로직만 포함
  return (
    <div className="cart-container">
      {cartItems.map(item => (
        <CartItem
          key={item.id}
          item={item}
          onRemove={removeFromCart}
          onQuantityChange={updateQuantity}
        />
      ))}
    </div>
  );
};
```

**ProductSelector 컴포넌트**

```typescript
// src/advanced/components/ProductSelector/ProductSelector.tsx
const ProductSelector: React.FC = () => {
  const { products, selectedProduct, selectProduct } = useProduct();
  const { addToCart } = useCart();
  const { showNotification } = useNotification();

  // UI 로직만 포함
  return (
    <div className="product-selector">
      <select onChange={(e) => selectProduct(e.target.value)}>
        {/* 옵션들 */}
      </select>
      <button onClick={handleAddToCart}>Add to Cart</button>
    </div>
  );
};
```

**OrderSummary 컴포넌트**

```typescript
// src/advanced/components/OrderSummary/OrderSummary.tsx
const OrderSummary: React.FC = () => {
  const { calculation, totalAmount, discountRate, loyaltyPoints } = useOrder();

  // UI 로직만 포함
  return (
    <div className="order-summary">
      <div className="total">₩{totalAmount.toLocaleString()}</div>
      <div className="discount">{discountRate}% 할인</div>
      <div className="points">{loyaltyPoints}p 적립</div>
    </div>
  );
};
```

### Phase 4: 타입 안전성 강화

#### 4.1 엄격한 타입 정의

```typescript
// src/advanced/types/index.ts
export interface CartItem {
  id: string;
  name: string;
  price: number;
  quantity: number;
  // ... 기타 속성들
}

export interface Product {
  id: string;
  name: string;
  val: number;
  q: number;
  // ... 기타 속성들
}

export interface AppState {
  cartItems: CartItem[];
  productList: Product[];
  uiState: UIState;
  // ... 기타 상태들
}

export interface AppContextType {
  state: AppState;
  dispatch: React.Dispatch<AppAction>;
}
```

#### 4.2 Hook 반환 타입 정의

```typescript
// src/advanced/hooks/types.ts
export interface UseCartReturn {
  cartItems: CartItem[];
  addToCart: (productId: string, quantity: number) => void;
  removeFromCart: (productId: string) => void;
  updateQuantity: (productId: string, quantity: number) => void;
}

export interface UseProductReturn {
  products: Product[];
  selectedProduct: string | null;
  selectProduct: (productId: string) => void;
}
```

### Phase 5: 테스트 구조 개선

#### 5.1 Hook 테스트

```typescript
// src/advanced/hooks/__tests__/useCart.test.ts
describe("useCart", () => {
  it("should add item to cart", () => {
    // Hook 테스트 로직
  });

  it("should remove item from cart", () => {
    // Hook 테스트 로직
  });
});
```

#### 5.2 컴포넌트 테스트

```typescript
// src/advanced/components/__tests__/Cart.test.tsx
describe("Cart", () => {
  it("should render cart items", () => {
    // UI 테스트 로직
  });
});
```

## 📁 새로운 폴더 구조

```
src/advanced/
├── App.tsx (UI만)
├── context/
│   └── AppContext.tsx (createSafeContext 적용)
├── hooks/
│   ├── useCart.ts
│   ├── useProduct.ts
│   ├── useOrder.ts
│   ├── useModal.ts
│   ├── useNotification.ts
│   ├── useItemCount.ts (NEW)
│   ├── useHelpModal.ts (NEW)
│   └── types.ts
├── components/
│   ├── Header/
│   │   └── Header.tsx (NEW)
│   ├── Layout/
│   │   └── MainLayout.tsx (NEW)
│   ├── HelpModal/
│   │   ├── HelpModal.tsx (NEW)
│   │   └── HelpToggle.tsx (NEW)
│   ├── ItemCount/
│   │   └── ItemCount.tsx (NEW)
│   ├── Cart/
│   │   ├── Cart.tsx (UI만)
│   │   └── CartItem.tsx
│   ├── ProductSelector/
│   │   └── ProductSelector.tsx (UI만)
│   └── OrderSummary/
│       └── OrderSummary.tsx (UI만)
├── utils/
│   ├── createSafeContext.ts
│   └── businessLogic.ts
├── constants/
│   ├── index.ts
│   └── helpContent.ts (NEW)
└── types/
    └── index.ts
```

## 🎯 기대 효과

### 1. 코드 품질 향상

- **타입 안전성**: TypeScript의 엄격한 타입 체크
- **재사용성**: Hook 기반으로 로직 재사용 가능
- **테스트 용이성**: UI와 로직 분리로 단위 테스트 간소화

### 2. 개발자 경험 개선

- **명확한 책임 분리**: 각 Hook이 특정 도메인 담당
- **디버깅 용이성**: 로직이 Hook으로 분리되어 추적 가능
- **코드 가독성**: 컴포넌트는 UI에만 집중

### 3. 유지보수성 향상

- **모듈화**: 각 기능이 독립적인 Hook으로 분리
- **확장성**: 새로운 기능 추가 시 새로운 Hook 생성
- **버그 감소**: 타입 안전성과 명확한 구조로 버그 감소

## 📅 구현 일정

### Week 1: Foundation

- [ ] `createSafeContext` 유틸리티 구현
- [ ] AppContext 리팩토링
- [ ] 기본 Hook 구조 설계

### Week 2: Core Hooks

- [ ] `useCart` Hook 구현
- [ ] `useProduct` Hook 구현
- [ ] `useOrder` Hook 구현

### Week 3: UI Hooks

- [ ] `useModal` Hook 구현
- [ ] `useNotification` Hook 구현
- [ ] 컴포넌트 리팩토링

### Week 4: Testing & Polish

- [ ] Hook 테스트 작성
- [ ] 컴포넌트 테스트 업데이트
- [ ] 문서화 및 최종 검토

## 🚨 주의사항

1. **점진적 마이그레이션**: 기존 기능을 유지하면서 단계적으로 리팩토링
2. **하위 호환성**: 기존 API와의 호환성 유지
3. **성능 최적화**: 불필요한 리렌더링 방지
4. **에러 처리**: 안전한 Context 사용으로 런타임 에러 방지

## 📝 다음 단계

1. **팀 리뷰**: 이 계획서를 팀과 공유하고 피드백 수집
2. **우선순위 설정**: 가장 중요한 Hook부터 구현 시작
3. **테스트 전략**: 각 단계별 테스트 계획 수립
4. **문서화**: 새로운 아키텍처에 대한 개발자 가이드 작성

---

이 계획서는 React 프로젝트를 현대적이고 유지보수 가능한 구조로 개선하기 위한 로드맵입니다. 각 단계를 신중하게 진행하여 코드 품질과 개발자 경험을 크게 향상시킬 수 있습니다.

## 📊 Phase 6: 코드 품질 개선 분석 보고서

### 🔍 현재 상태 분석 결과

#### ✅ 잘 구현된 부분

- **아키텍처**: Hook과 컴포넌트의 명확한 분리
- **타입 안전성**: TypeScript를 활용한 강력한 타입 시스템
- **테스트 커버리지**: 48개 테스트 모두 통과
- **코드 구조**: 단일 책임 원칙을 잘 따르는 컴포넌트 분리

#### ⚠️ 개선이 필요한 부분

### 🚨 우선순위 높은 개선사항 (Critical)

#### 1. **TypeScript 오류 수정**

```typescript
// 발견된 오류들:
- src/advanced/components/OrderSummary/OrderSummary.tsx:12 - 'calculationWithDetails' 미사용
- src/advanced/hooks/useNotification.ts:10 - 'type' 매개변수 미사용
- src/advanced/utils/businessLogic.ts:118,347 - 'productList' 매개변수 미사용
```

#### 2. **DOM 직접 조작 제거**

```typescript
// src/advanced/components/OrderSummary/OrderSummary.tsx
// 현재: innerHTML 사용
document.getElementById("summary-details").innerHTML = summaryDetailsHTML;

// 개선 방향: React의 선언적 렌더링 사용
```

#### 3. **any 타입 제거**

```typescript
// src/advanced/components/ProductSelector/ProductSelector.tsx:56
const formatProductOption = (product: any) => { // ❌ any 사용

// 개선 방향:
const formatProductOption = (product: Product) => { // ✅ 타입 안전성 확보
```

### 🔧 중간 우선순위 개선사항

#### 4. **성능 최적화**

- **메모이제이션 개선**: `useMemo`, `useCallback` 활용도 증가
- **렌더링 최적화**: 불필요한 리렌더링 방지

#### 5. **코드 중복 제거**

- **상수 추출**: 하드코딩된 값들을 상수로 분리
- **유틸리티 함수 통합**: 비슷한 로직의 함수들 통합

#### 6. **에러 처리 강화**

- **타입 가드 개선**: 런타임 타입 검증 강화
- **에러 바운더리**: React Error Boundary 도입

### 📋 낮은 우선순위 개선사항

#### 7. **코드 스타일 개선**

- **일관된 네이밍**: 변수/함수명 통일성 확보
- **주석 개선**: JSDoc 스타일 주석 추가

#### 8. **테스트 개선**

- **테스트 코드 정리**: console.log 제거
- **테스트 커버리지**: 엣지 케이스 추가

#### 9. **접근성 개선**

- **ARIA 속성**: 스크린 리더 지원 강화
- **키보드 네비게이션**: 키보드 접근성 개선

### 🎯 구체적인 개선 제안

#### A. TypeScript 오류 수정

```typescript
// 1. 미사용 변수 제거
// src/advanced/components/OrderSummary/OrderSummary.tsx
// const calculationWithDetails = useMemo(() => { ... }); // 제거

// 2. 매개변수 활용 또는 제거
// src/advanced/hooks/useNotification.ts
const showNotification = useCallback(
  (message: string, _type: "success" | "error" | "info" = "info") => {
    alert(message);
  },
  [],
);
```

#### B. DOM 직접 조작 제거

```typescript
// 현재 방식 (제거 필요)
useEffect(() => {
  const summaryDetailsDiv = document.getElementById("summary-details");
  if (summaryDetailsDiv) {
    summaryDetailsDiv.innerHTML = summaryDetailsHTML;
  }
}, [summaryDetailsHTML]);

// 개선된 방식 (React 방식)
return (
  <div id="summary-details" className="space-y-3">
    {summaryDetails.map((detail, index) => (
      <div key={index} dangerouslySetInnerHTML={{ __html: detail }} />
    ))}
  </div>
);
```

#### C. 타입 안전성 강화

```typescript
// 현재 (개선 필요)
const formatProductOption = (product: any) => {
  // ...
};

// 개선된 방식
const formatProductOption = (product: Product): string => {
  // 타입 안전성 확보
};
```

### 📅 개선 작업 계획

#### Phase 6.1: Critical Fixes (즉시 수정)

- [ ] TypeScript 오류 수정
- [ ] 미사용 변수/매개변수 정리
- [ ] any 타입 제거

#### Phase 6.2: High Priority (1-2주 내)

- [ ] DOM 직접 조작 제거
- [ ] 에러 처리 강화
- [ ] 성능 최적화

#### Phase 6.3: Medium Priority (1개월 내)

- [ ] 코드 중복 제거
- [ ] 접근성 개선
- [ ] 테스트 개선

#### Phase 6.4: Low Priority (지속적 개선)

- [ ] 코드 스타일 개선
- [ ] 문서화 강화
- [ ] 모니터링 도구 도입

### 🎯 결론

`@advanced/` 프로젝트는 전반적으로 잘 구조화되어 있으나, 몇 가지 중요한 개선사항이 있습니다. 특히 **TypeScript 오류 수정**과 **DOM 직접 조작 제거**는 즉시 해결해야 할 우선순위가 높은 문제입니다. 이러한 개선을 통해 코드의 안정성, 유지보수성, 성능을 크게 향상시킬 수 있습니다.
