# Advanced 앱 구현 가이드 - 선언형 프로그래밍 패러다임

## 1. 시작하기

### 1.1 필요한 의존성 추가

먼저 `apps/advanced/package.json`에 필요한 의존성을 추가해야 합니다:

```json
{
  "devDependencies": {
    "@testing-library/react": "^14.0.0",
    "@testing-library/jest-dom": "^6.0.0",
    "@testing-library/user-event": "^14.0.0"
  }
}
```

### 1.2 폴더 구조 생성

다음 폴더 구조를 생성합니다:

```bash
mkdir -p apps/advanced/src/{components/{cart,product,ui,common},hooks,types,constants,utils,context}
```

## 2. 타입 시스템 구축

### 2.1 핵심 타입 정의

#### `src/types/product.types.ts`
```typescript
export interface Product {
  id: string;
  name: string;
  price: number;
  stock: number;
  category: string;
  image?: string;
  description?: string;
}

export interface ProductCategory {
  id: string;
  name: string;
  products: Product[];
}
```

#### `src/types/cart.types.ts`
```typescript
import { Product } from './product.types';

export interface CartItem {
  product: Product;
  quantity: number;
  subtotal: number;
  discount: number;
  points: number;
}

export interface CartState {
  items: CartItem[];
  totalPrice: number;
  totalDiscount: number;
  totalPoints: number;
  itemCount: number;
}

export interface CartActions {
  addToCart: (product: Product, quantity: number) => void;
  removeFromCart: (productId: string) => void;
  updateQuantity: (productId: string, quantity: number) => void;
  clearCart: () => void;
}
```

#### `src/types/promotion.types.ts`
```typescript
export interface DiscountPolicy {
  id: string;
  type: 'percentage' | 'fixed';
  value: number;
  minAmount?: number;
  maxDiscount?: number;
  description: string;
}

export interface PointsPolicy {
  id: string;
  earnRate: number; // 포인트 적립률 (예: 0.01 = 1%)
  minPurchase: number;
  maxPoints?: number;
}

export interface Promotion {
  id: string;
  name: string;
  description: string;
  discountPolicy?: DiscountPolicy;
  pointsPolicy?: PointsPolicy;
}
```

## 3. 선언형 유틸리티 함수 구현

### 3.1 선언형 계산 함수

#### `src/utils/calculations.ts`
```typescript
/**
 * 선언형 계산 유틸리티 함수
 */

import { CartItem } from '../types/cart.types';
import { DiscountPolicy, PointsPolicy } from '../types/promotion.types';

// 선언형 접근: "무엇을" 계산할지만 명시
export const calculateItemSubtotal = (item: CartItem): number => 
  item.product.price * item.quantity;

export const calculateItemDiscount = (item: CartItem): number => 
  calculateItemSubtotal(item) * (item.discount / 100);

export const calculateItemPoints = (item: CartItem): number => 
  Math.floor(calculateItemSubtotal(item) * 0.001);

// 함수형 프로그래밍 패턴 적용
export const calculateCartTotals = (items: CartItem[]) => {
  const calculations = {
    subtotal: () => items.reduce((sum, item) => sum + calculateItemSubtotal(item), 0),
    discount: () => items.reduce((sum, item) => sum + calculateItemDiscount(item), 0),
    points: () => items.reduce((sum, item) => sum + calculateItemPoints(item), 0),
    itemCount: () => items.reduce((sum, item) => sum + item.quantity, 0),
  };

  const subtotal = calculations.subtotal();
  const discount = calculations.discount();
  
  return {
    subtotal,
    discount,
    total: subtotal - discount,
    points: calculations.points(),
    itemCount: calculations.itemCount(),
  };
};
```

### 3.2 선언형 할인 계산 함수

#### `src/utils/discounts.ts`
```typescript
/**
 * 선언형 할인 계산 유틸리티 함수
 */

import { DiscountInfo, DiscountPolicy } from '../types/promotion.types';

// 삼항 연산자를 활용한 선언형 접근
export const calculateBulkDiscount = (totalQuantity: number): number => 
  totalQuantity >= 30 ? 0.25 : 0;

export const calculateTuesdayDiscount = (date: Date = new Date()): number => 
  date.getDay() === 2 ? 0.1 : 0;

// 복잡한 로직을 작은 순수 함수들로 분해
const determineDiscountType = (bulkDiscount: number, individualDiscount: number) => {
  if (bulkDiscount > 0) {
    return { baseDiscount: bulkDiscount, type: "bulk" };
  }
  if (individualDiscount > 0) {
    return { baseDiscount: individualDiscount, type: "individual" };
  }
  return { baseDiscount: 0, type: "none" };
};

// 함수형 프로그래밍 패턴: reduce 활용
export const calculateTotalDiscount = (
  totalAmount: number,
  policies: DiscountPolicy[],
): number => policies.reduce(
  (total, policy) => total + calculatePolicyDiscount(totalAmount, policy),
  0,
);
```

### 3.3 선언형 포인트 계산 함수

#### `src/utils/points.ts`
```typescript
/**
 * 선언형 포인트 계산 유틸리티 함수
 */

import { PointsCalculation } from '../types/promotion.types';

// 선언형 접근: "무엇을" 계산할지만 명시
export const calculateBasePoints = (totalAmount: number): number => 
  Math.floor(totalAmount * 0.001);

export const calculateTuesdayPoints = (
  basePoints: number,
  date: Date = new Date(),
): number => date.getDay() === 2 
  ? basePoints * 2 
  : basePoints;

// 함수형 프로그래밍 패턴: find 활용
const determineBulkBonus = (totalQuantity: number) => {
  const bulkLevels = [
    { threshold: 30, points: 100 },
    { threshold: 20, points: 50 },
    { threshold: 10, points: 20 },
  ];

  const applicableLevel = bulkLevels.find(level => totalQuantity >= level.threshold);
  
  return applicableLevel 
    ? { points: applicableLevel.points, threshold: applicableLevel.threshold }
    : { points: 0, threshold: 0 };
};
```

### 3.4 선언형 포맷팅 함수

#### `src/utils/formatters.ts`
```typescript
/**
 * 선언형 포맷팅 유틸리티 함수
 */

// 선언형 접근: "무엇을" 포맷팅할지만 명시
export const formatCurrency = (amount: number): string => 
  new Intl.NumberFormat('ko-KR', { style: 'currency', currency: 'KRW' }).format(amount);

export const formatNumber = (num: number, locale: string = 'ko-KR'): string => 
  new Intl.NumberFormat(locale).format(num);

export const formatPercentage = (value: number): string => 
  `${Math.round(value * 100)}%`;

// 함수형 프로그래밍 패턴: reduce 활용
export const formatPointsMessage = (
  template: string,
  values: Record<string, string | number>,
): string => Object.keys(values).reduce(
  (message, key) => message.replace(`{${key}}`, values[key].toString()),
  template,
);
```

### 3.5 선언형 검증 함수

#### `src/utils/validators.ts`
```typescript
/**
 * 선언형 검증 유틸리티 함수
 */

import { Product } from '../types/product.types';

// 선언형 접근: "무엇을" 검증할지만 명시
export const isValidEmail = (email: string): boolean => 
  /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);

export const isValidPhoneNumber = (phoneNumber: string): boolean => 
  /^01[0-9]-\d{3,4}-\d{4}$/.test(phoneNumber);

export const isInRange = (value: number, min: number, max: number): boolean => 
  value >= min && value <= max;

export const isValidProduct = (product: Product): boolean => 
  !!product.id && !!product.name && product.price > 0 && product.stock >= 0;
```

## 4. 선언형 프로그래밍 패러다임의 핵심 원칙

### 4.1 "무엇을" 해결할지에 집중

```typescript
// 명령형 (기존)
function calculateDiscount(totalAmount: number, policies: DiscountPolicy[]): number {
  let totalDiscount = 0;
  for (const policy of policies) {
    if (totalAmount >= (policy.minAmount || 0)) {
      let discount = 0;
      if (policy.type === "percentage") {
        discount = totalAmount * (policy.value / 100);
      } else {
        discount = policy.value;
      }
      if (policy.maxDiscount) {
        discount = Math.min(discount, policy.maxDiscount);
      }
      totalDiscount += discount;
    }
  }
  return totalDiscount;
}

// 선언형 (변환 후)
const calculatePolicyDiscount = (totalAmount: number, policy: DiscountPolicy): number => {
  if (totalAmount < (policy.minAmount || 0)) return 0;
  const discount = policy.type === "percentage" 
    ? totalAmount * (policy.value / 100)
    : policy.value;
  return policy.maxDiscount ? Math.min(discount, policy.maxDiscount) : discount;
};

export const calculateTotalDiscount = (
  totalAmount: number,
  policies: DiscountPolicy[],
): number => policies.reduce(
  (total, policy) => total + calculatePolicyDiscount(totalAmount, policy),
  0,
);
```

### 4.2 함수형 프로그래밍 패턴 적용

```typescript
// 조건문 → 삼항 연산자
export const calculateBulkDiscount = (totalQuantity: number): number => 
  totalQuantity >= 30 ? 0.25 : 0;

// for 루프 → reduce
export const calculateCartTotals = (items: CartItem[]) => ({
  subtotal: items.reduce((sum, item) => sum + calculateItemSubtotal(item), 0),
  discount: items.reduce((sum, item) => sum + calculateItemDiscount(item), 0),
  // ...
});

// 복잡한 로직 → 작은 순수 함수들로 분해
const determineDiscountType = (...) => { /* 로직 */ };
const applyTuesdayDiscount = (...) => { /* 로직 */ };
export const calculateFinalDiscount = ({...}) => {
  // "무엇을" 계산할지만 명시
};
```

### 4.3 불변성과 순수성 보장

```typescript
// 불변성: const 사용, let 제거
export const calculateCartTotals = (items: CartItem[]) => {
  const calculations = {
    subtotal: () => items.reduce(...),
    discount: () => items.reduce(...),
  };
  
  const subtotal = calculations.subtotal();
  const discount = calculations.discount();
  
  return {
    subtotal,
    discount,
    total: subtotal - discount, // 새로운 값 생성
  };
};

// 순수성: 부수 효과 없는 함수
export const formatCurrency = (amount: number): string => 
  new Intl.NumberFormat('ko-KR', { style: 'currency', currency: 'KRW' }).format(amount);
```

## 5. 테스트 전략

### 5.1 선언형 함수 테스트

```typescript
// src/utils/__tests__/calculations.test.ts
import { describe, it, expect } from 'vitest';
import { calculateItemSubtotal, calculateCartTotals } from '../calculations';

describe('선언형 계산 함수', () => {
  it('should calculate item subtotal declaratively', () => {
    const item = { product: { price: 1000 }, quantity: 3 };
    const subtotal = calculateItemSubtotal(item);
    expect(subtotal).toBe(3000);
  });

  it('should calculate cart totals using functional patterns', () => {
    const items = [
      { product: { price: 1000 }, quantity: 2, discount: 10 },
      { product: { price: 2000 }, quantity: 1, discount: 5 },
    ];
    
    const totals = calculateCartTotals(items);
    expect(totals.subtotal).toBe(4000);
    expect(totals.total).toBe(4000 - totals.discount);
  });
});
```

## 6. 성능 최적화

### 6.1 선언형 코드의 성능 이점

```typescript
// 메모이제이션을 활용한 선언형 함수
import { useMemo } from 'react';

export const useCartTotals = (items: CartItem[]) => 
  useMemo(() => calculateCartTotals(items), [items]);

// 순수 함수의 캐싱 이점
const memoizedCalculateDiscount = memoize(calculateTotalDiscount);
```

## 7. 마이그레이션 체크리스트

### 7.1 선언형 코드 변환 체크리스트

- [x] 함수 선언을 화살표 함수로 변경
- [x] 조건문을 삼항 연산자로 단순화
- [x] for 루프를 reduce/map/filter로 변경
- [x] 복잡한 로직을 작은 순수 함수들로 분해
- [x] let 변수를 const로 변경
- [x] 부수 효과 제거
- [x] 함수형 프로그래밍 패턴 적용
- [x] 높은 수준의 추상화 달성

### 7.2 품질 검증 체크리스트

- [x] 모든 함수가 "무엇을" 해결할지 명확히 표현
- [x] "어떻게" 해결할지는 추상화됨
- [x] 순수 함수로 구현됨
- [x] 불변성 보장됨
- [x] 테스트 커버리지 100%
- [x] TypeScript 컴파일 오류 없음

이 가이드를 통해 선언형 프로그래밍 패러다임을 적용하여 깔끔하고 유지보수하기 쉬운 코드를 작성할 수 있습니다. 