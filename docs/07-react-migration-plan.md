# React 마이그레이션 계획서

## 📋 **개요**

`/basic` 폴더의 클린하게 리팩토링된 TypeScript 코드를 `/advanced` 폴더에서 React로 마이그레이션합니다.

### **목표**

- 기존 비즈니스 로직 100% 보존
- React 패턴과 best practices 적용
- 도메인 중심 아키텍처 유지
- 테스트 통과 보장

---

## 🏗️ **폴더 구조 설계**

```
src/advanced/
├── types/           ✅ 완료 - 공통 타입만 (IProduct)
├── constants/       ✅ 완료 - 공통 상수만 (현재 없음)
├── utils/           ✅ 완료 - 공용 유틸리티 함수
│   └── dateUtils.ts         (날짜 관련 순수 함수)
├── domains/         🔄 진행 예정 - 도메인별 React 훅
│   ├── products/
│   │   ├── constants.ts         ✅ 완료 (PRODUCT_IDS)
│   │   ├── useProductData.ts    🎯 다음 (상품 데이터 관리 훅)
│   │   └── ProductSelect.tsx    (상품 선택 컴포넌트)
│   ├── cart/
│   │   ├── types.ts             ✅ 완료 (ICartItem, ICartCalculation 등)
│   │   ├── useCartManager.ts    (장바구니 관리 훅)
│   │   ├── CartDisplay.tsx      (장바구니 목록 컴포넌트)
│   │   └── OrderSummary.tsx     (주문 요약 컴포넌트)
│   ├── points/
│   │   ├── constants.ts         ✅ 완료 (POINTS_RULES)
│   │   ├── types.ts             ✅ 완료 (IBonusPointsResult)
│   │   ├── usePointsManager.ts  (포인트 관리 훅)
│   │   └── PointsDisplay.tsx    (포인트 표시 컴포넌트)
│   ├── stock/
│   │   ├── constants.ts         ✅ 완료 (STOCK_THRESHOLDS)
│   │   ├── useStockManager.ts   (재고 관리 훅)
│   │   └── StockWarning.tsx     (재고 경고 컴포넌트)
│   ├── discounts/
│   │   ├── constants.ts         ✅ 완료 (DISCOUNT_RULES)
│   │   ├── types.ts             ✅ 완료 (IDiscountData)
│   │   ├── useDiscountManager.ts (할인 관리 훅)
│   │   └── DiscountInfo.tsx     (할인 정보 컴포넌트)
│   └── sales/
│       ├── constants.ts         ✅ 완료 (SALE_INTERVALS)
│       └── useSpecialSales.ts   (특별 세일 타이머 훅)
└── components/      🔄 진행 예정 - 레이아웃 컴포넌트
    ├── App.tsx              (메인 앱 컴포넌트)
    ├── Layout/
    │   ├── Header.tsx       (헤더 컴포넌트)
    │   ├── MainGrid.tsx     (그리드 레이아웃)
    │   └── HelpOverlay.tsx  (도움말 오버레이)
    └── common/
        └── Button.tsx       (공통 버튼 컴포넌트)
```

---

## 🚀 **마이그레이션 단계별 계획**

### **0단계: 테스트 파일 마이그레이션** ✅ **완료**

- [x] `src/basic/__tests__/basic.test.js` → `src/advanced/__tests__/advanced.test.jsx` 마이그레이션
- [x] React Testing Library 패턴으로 변환
- [x] DOM 조작 → React 컴포넌트 테스트로 변환
- [x] 모든 기존 테스트 케이스 동일하게 유지 (기능 검증 목적)
- [x] PRD 명세와 100% 일치 확인

### **1단계: 공통 모듈 설정** ✅ **완료**

- [x] 폴더 구조 생성 및 .gitkeep 추가
- [x] utils/dateUtils.ts: 날짜 유틸리티 복사
- [x] **도메인별 상수/타입 분리**:
  - [x] products/constants.ts: PRODUCT_IDS
  - [x] points/constants.ts: POINTS_RULES
  - [x] stock/constants.ts: STOCK_THRESHOLDS
  - [x] discounts/constants.ts: DISCOUNT_RULES
  - [x] sales/constants.ts: SALE_INTERVALS
  - [x] cart/types.ts: ICartItem, ICartCalculation
  - [x] points/types.ts: IBonusPointsResult
  - [x] discounts/types.ts: IDiscountData
- [x] **공통 모듈 정리**: types/, constants/ 폴더에는 진짜 공통으로 사용되는 것만

### **2단계: Products 도메인 React 훅 변환** 🎯 **다음**

#### **AS-IS (기존 구조)**

```typescript
// src/basic/domains/products/productData.ts
export const useProductData = {
  products: [...],
  getProducts(): IProduct[] { },
  findProductById(id: string): IProduct | null { },
  updateProductStock(id: string, change: number): void { },
  // ... 기타 메서드들
};
```

#### **TO-BE (React 훅)**

```typescript
// src/advanced/domains/products/useProductData.ts
export function useProductData() {
  const [products, setProducts] = useState<IProduct[]>([...초기데이터]);

  const findProductById = useCallback(
    (id: string) => {
      return products.find((p) => p.id === id) || null;
    },
    [products],
  );

  const updateProductStock = useCallback((id: string, change: number) => {
    setProducts((prev) => prev.map((p) => (p.id === id ? { ...p, q: p.q + change } : p)));
  }, []);

  return {
    products,
    findProductById,
    updateProductStock,
    // ... 기타 메서드들
  };
}
```

### **3단계: Cart 도메인 React 훅 변환**

#### **AS-IS (기존 구조)**

```typescript
// src/basic/domains/cart/cartManager.ts
export const useCartManager = {
  totalAmount: 0,
  itemCount: 0,
  getTotalAmount() {},
  calculateCartTotals(cartItems: HTMLCollection) {},
  // ...
};
```

#### **TO-BE (React 훅)**

```typescript
// src/advanced/domains/cart/useCartManager.ts
export function useCartManager() {
  const [cartItems, setCartItems] = useState<ICartItem[]>([]);
  const [totalAmount, setTotalAmount] = useState(0);

  const addToCart = useCallback((product: IProduct) => {
    // React 상태 업데이트 로직
  }, []);

  const removeFromCart = useCallback((productId: string) => {
    // React 상태 업데이트 로직
  }, []);

  return {
    cartItems,
    totalAmount,
    addToCart,
    removeFromCart,
    // ...
  };
}
```

### **4단계: Points/Stock/Discounts 도메인 변환**

각 도메인을 React 훅으로 변환:

- `usePointsManager`: 포인트 계산 및 관리
- `useStockManager`: 재고 상태 관리
- `useDiscountManager`: 할인 로직 관리

### **5단계: 특별 세일 타이머 React화**

#### **AS-IS (기존 구조)**

```typescript
// src/basic/main.basic.ts - startSpecialSaleTimers()
setTimeout(() => {
  setInterval(() => {
    // 번개세일 로직
  }, SALE_INTERVALS.LIGHTNING_SALE_INTERVAL);
}, lightningDelay);
```

#### **TO-BE (React 훅)**

```typescript
// src/advanced/domains/sales/useSpecialSales.ts
export function useSpecialSales() {
  const [isLightningsaleActive, setIsLightningSaleActive] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => {
      const interval = setInterval(() => {
        // 번개세일 로직
      }, SALE_INTERVALS.LIGHTNING_SALE_INTERVAL);
      return () => clearInterval(interval);
    }, lightningDelay);
    return () => clearTimeout(timer);
  }, []);

  return { isLightningsaleActive };
}
```

### **6단계: UI 컴포넌트 작성**

#### **주요 컴포넌트 구조**

1. **App.tsx** - 메인 앱 컴포넌트

   ```tsx
   export default function App() {
     const productData = useProductData();
     const cartManager = useCartManager();
     const pointsManager = usePointsManager();

     return (
       <div className="min-h-screen bg-gray-50">
         <Header />
         <MainGrid>
           <LeftColumn>
             <ProductSelect {...productData} />
             <CartDisplay {...cartManager} />
           </LeftColumn>
           <RightColumn>
             <OrderSummary {...cartManager} />
             <DiscountInfo />
             <PointsDisplay {...pointsManager} />
           </RightColumn>
         </MainGrid>
         <HelpOverlay />
       </div>
     );
   }
   ```

2. **ProductSelect.tsx** - 상품 선택 컴포넌트

   ```tsx
   interface ProductSelectProps {
     products: IProduct[];
     onAddToCart: (product: IProduct) => void;
   }

   export function ProductSelect({ products, onAddToCart }: ProductSelectProps) {
     const [selectedProductId, setSelectedProductId] = useState("");

     return (
       <div className="mb-6 pb-6 border-b border-gray-200">
         <select
           value={selectedProductId}
           onChange={(e) => setSelectedProductId(e.target.value)}
           className="w-full p-3 border border-gray-300 rounded-lg text-base mb-3"
         >
           {/* 옵션들 */}
         </select>
         <button onClick={handleAddToCart}>Add to Cart</button>
       </div>
     );
   }
   ```

3. **CartDisplay.tsx** - 장바구니 목록 컴포넌트
4. **OrderSummary.tsx** - 주문 요약 컴포넌트
5. **PointsDisplay.tsx** - 포인트 표시 컴포넌트

### **7단계: 이벤트 핸들링 React화**

#### **AS-IS (기존 구조)**

```typescript
// src/basic/utils/eventHandlers.ts
export function validateAddToCartInput(selectedId: string, product: IProduct | null) {
  // 검증 로직
}

export function calculateItemDisplayData(product: IProduct) {
  // 계산 로직
}
```

#### **TO-BE (React 패턴)**

```typescript
// 각 컴포넌트 내부에서 직접 처리
function ProductSelect() {
  const handleAddToCart = useCallback(() => {
    const validation = validateAddToCartInput(selectedId, product);
    if (!validation.isValid) return;

    onAddToCart(product);
  }, [selectedId, product, onAddToCart]);
}
```

---

## 🔧 **주요 변환 원칙**

### **1. 상태 관리**

- **AS-IS**: 객체의 프로퍼티로 상태 관리
  ```typescript
  export const useCartManager = {
    totalAmount: 0, // 글로벌 상태
    itemCount: 0,
  };
  ```
- **TO-BE**: React hooks로 상태 관리
  ```typescript
  const [totalAmount, setTotalAmount] = useState(0);
  const [itemCount, setItemCount] = useState(0);
  ```

### **2. 불변성**

- **AS-IS**: 이미 불변성 패턴 적용됨
  ```typescript
  useProductData.updateProductStock(id, change); // 내부에서 불변 업데이트
  ```
- **TO-BE**: React setState 패턴 사용
  ```typescript
  setProducts((prev) => prev.map((p) => (p.id === id ? { ...p, q: p.q + change } : p)));
  ```

### **3. DOM 조작 제거**

- **AS-IS**: DOM 직접 조작
  ```typescript
  const element = document.getElementById("cart-items");
  element.appendChild(newItem);
  ```
- **TO-BE**: JSX와 상태로 렌더링
  ```tsx
  {
    cartItems.map((item) => <CartItem key={item.id} item={item} />);
  }
  ```

### **4. 이벤트 핸들링**

- **AS-IS**: addEventListener 사용
  ```typescript
  addToCartButton.addEventListener("click", function () {});
  ```
- **TO-BE**: JSX 이벤트 핸들러
  ```tsx
  <button onClick={handleAddToCart}>Add to Cart</button>
  ```

---

## 📋 **체크리스트**

### **각 단계별 완료 조건**

#### **2단계: Products 도메인**

- [ ] `useProductData` 훅 구현
- [ ] 상품 목록 상태 관리
- [ ] 재고 업데이트 로직
- [ ] 가격 할인 로직
- [ ] `ProductSelect` 컴포넌트 구현

#### **3단계: Cart 도메인**

- [ ] `useCartManager` 훅 구현
- [ ] 장바구니 상태 관리
- [ ] 수량 증감 로직
- [ ] 총액 계산 로직
- [ ] `CartDisplay` 컴포넌트 구현
- [ ] `OrderSummary` 컴포넌트 구현

#### **4단계: 기타 도메인**

- [ ] `usePointsManager` 훅 구현
- [ ] `useStockManager` 훅 구현
- [ ] `useDiscountManager` 훅 구현
- [ ] 각 도메인 컴포넌트 구현

#### **5단계: 특별 세일**

- [ ] `useSpecialSales` 훅 구현
- [ ] 타이머 로직 React화
- [ ] 알림 처리 React화

#### **6단계: 메인 앱**

- [ ] `App.tsx` 구현
- [ ] 레이아웃 컴포넌트들 구현
- [ ] 도움말 오버레이 구현

#### **7단계: 최종 검증**

- [ ] 기존 기능 100% 동작 확인
- [ ] 테스트 통과 확인
- [ ] 성능 최적화 (memo, useMemo, useCallback)

---

## ⚠️ **주의사항**

1. **비즈니스 로직 보존**: 기존 로직의 동작을 100% 동일하게 유지
2. **점진적 변환**: 한 번에 모든 것을 바꾸지 않고 단계별로 진행
3. **테스트 우선**: 각 단계마다 기능 동작 확인
4. **React 패턴 준수**:
   - React.FC 사용 금지
   - 로직은 훅, 화면은 JSX로 분리
   - 직접 DOM 조작 금지
5. **주석 스타일 유지**: `/** */` 형식 유지, `//` 주석 지양

---

## 🎯 **예상 결과**

마이그레이션 완료 후:

- **기능**: 기존과 100% 동일한 쇼핑카트 기능
- **구조**: 클린한 React 컴포넌트 아키텍처
- **상태관리**: React hooks 기반 상태 관리
- **성능**: React 최적화 패턴 적용
- **유지보수성**: 도메인별 모듈화로 높은 응집도, 낮은 결합도

---

## 📅 **작업 순서**

1. **2단계 시작**: Products 도메인 React 훅 변환
2. **커밋**: Products 도메인 완료 후 커밋
3. **3단계 진행**: Cart 도메인 React 훅 변환
4. **커밋**: Cart 도메인 완료 후 커밋
5. **4-7단계**: 순차적으로 진행하며 각 단계마다 커밋

**다음 작업**:

1. ✅ **0단계 완료**: `advanced.test.jsx` 마이그레이션
2. ✅ **1단계 완료**: 도메인별 상수/타입 분리
3. 🎯 **2단계 시작**: `src/advanced/domains/products/useProductData.ts` 구현

### **커밋 순서**

1. `docs/07-react-migration-plan.md` 업데이트
2. `src/advanced/__tests__/advanced.test.js` 마이그레이션
3. `src/advanced/` 폴더 내 파일들 (도메인별 상수/타입 분리)
4. 이후 각 단계별 커밋

---

## 🔄 **도메인별 상수/타입 분리 상세**

### **현재 상태 분석**

- `src/advanced/constants/index.ts`: 모든 상수가 한 곳에 모여있음
- `src/advanced/types/index.ts`: 모든 타입이 한 곳에 모여있음

### **분리 원칙**

- **도메인 특화**: 특정 도메인에서만 사용되는 상수/타입 → 해당 도메인 폴더
- **공통 사용**: 여러 도메인에서 공통으로 사용 → 최상위 폴더 유지

### **분리 계획**

#### **상수 분리**

```typescript
// ❌ 현재: src/advanced/constants/index.ts (모든 상수 한 곳)
export const PRODUCT_IDS = { ... };           // → products/constants.ts
export const DISCOUNT_RULES = { ... };        // → discounts/constants.ts
export const STOCK_THRESHOLDS = { ... };      // → stock/constants.ts
export const POINTS_RULES = { ... };          // → points/constants.ts
export const SALE_INTERVALS = { ... };        // → sales/constants.ts

// ✅ 수정 후: 각 도메인별로 분리
// src/advanced/domains/products/constants.ts
export const PRODUCT_IDS = { ... };

// src/advanced/domains/discounts/constants.ts
export const DISCOUNT_RULES = { ... };
```

#### **타입 분리**

```typescript
// ❌ 현재: src/advanced/types/index.ts (모든 타입 한 곳)
export interface IProduct { ... }             // → products/types.ts (또는 공통 유지)
export interface ICartItem { ... }            // → cart/types.ts
export interface ICartCalculation { ... }     // → cart/types.ts
export interface IBonusPointsResult { ... }   // → points/types.ts
export interface IDiscountData { ... }        // → discounts/types.ts

// ✅ 수정 후: 도메인별로 분리하되, 공통 사용되는 것은 최상위 유지
// src/advanced/types/index.ts (진짜 공통 타입만)
export interface IProduct { ... }  // 여러 도메인에서 사용

// src/advanced/domains/cart/types.ts
export interface ICartItem { ... }
export interface ICartCalculation { ... }
```
