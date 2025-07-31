# 브라운필드 Advanced 마이그레이션 - JavaScript → TypeScript React 전환

## 📋 프로젝트 개요

### 현재 상황 분석

- **소스 코드**: `apps/basic` - JavaScript 기반 모듈화된 쇼핑카트 애플리케이션
- **타겟 환경**: `apps/advanced` - TypeScript React 환경
- **마이그레이션 범위**: 전체 기능을 JavaScript → TypeScript React로 전환
- **테스트 기준**: 기존 `apps/basic`의 테스트를 React Testing Library로 변환
- **목표**: 클린 코드 원칙을 유지하면서 현대적인 React 패턴 적용

### 브라운필드 특성

#### 🏗️ 기존 아키텍처 (apps/basic)
```
apps/basic/src/
├── components/          # JavaScript 클래스 기반 컴포넌트
│   ├── CartDisplay.js
│   ├── ProductSelector.js
│   └── ...
├── core/               # 핵심 로직 (DOM 조작, 이벤트 관리)
│   ├── DomManager.js
│   ├── EventManager.js
│   └── UIUpdater.js
├── helpers/            # 비즈니스 로직
│   ├── CalculationEngine.js
│   ├── DiscountEngine.js
│   └── ...
├── constants/          # 상수 데이터
└── services/          # 애플리케이션 서비스
```

#### 🎯 목표 아키텍처 (apps/advanced)
```
apps/advanced/src/
├── components/         # React 함수형 컴포넌트
│   ├── cart/
│   ├── product/
│   └── ui/
├── hooks/             # 커스텀 React Hook
├── context/           # React Context API
├── types/             # TypeScript 타입 정의
├── constants/         # 타입화된 상수
└── utils/             # 순수 함수 유틸리티
```

## 🔄 마이그레이션 전략

### Phase 1: 기반 구조 구축 (Foundation Setup)

#### 1.1 타입 시스템 설계
```typescript
// 기존 JavaScript 구조를 TypeScript로 변환
// apps/basic/src/constants/Products.js → apps/advanced/src/types/product.types.ts

// Before (JavaScript)
export const PRODUCTS = [
  { id: 'p1', name: '노트북', price: 1200000, stock: 10 }
];

// After (TypeScript)
export interface Product {
  id: string;
  name: string;
  price: number;
  stock: number;
  category: string;
  description?: string;
}

export const PRODUCTS: Product[] = [
  { 
    id: 'p1', 
    name: '노트북', 
    price: 1200000, 
    stock: 10,
    category: 'electronics',
    description: '고성능 노트북'
  }
];
```

#### 1.2 상태 관리 설계
```typescript
// 기존 클래스 기반 상태 → React Context API

// Before (JavaScript)
class ShoppingCartState {
  constructor() {
    this.items = [];
    this.totalPrice = 0;
  }
  
  addItem(product) {
    // 상태 업데이트 로직
  }
}

// After (TypeScript + React)
interface CartState {
  items: CartItem[];
  totalPrice: number;
  totalDiscount: number;
  totalPoints: number;
}

const CartContext = createContext<CartContextType>();

export const CartProvider: React.FC = ({ children }) => {
  const [state, dispatch] = useReducer(cartReducer, initialState);
  // Context 제공
};
```

### Phase 2: 핵심 로직 마이그레이션 (Core Logic Migration)

#### 2.1 비즈니스 로직 변환
```typescript
// 기존 CalculationEngine → 커스텀 Hook

// Before (JavaScript)
class CalculationEngine {
  calculateDiscount(items, policies) {
    // 복잡한 할인 계산 로직
  }
}

// After (TypeScript + React Hook)
export const useCalculations = (cartItems: CartItem[]) => {
  const calculations = useMemo(() => {
    const subtotal = cartItems.reduce((sum, item) => sum + item.subtotal, 0);
    const discount = calculateDiscount(subtotal, DISCOUNT_POLICIES);
    const total = subtotal - discount;
    
    return { subtotal, discount, total };
  }, [cartItems]);
  
  return calculations;
};
```

#### 2.2 이벤트 시스템 변환
```typescript
// 기존 EventManager → React 이벤트 핸들러

// Before (JavaScript)
class EventManager {
  bindEvents() {
    document.getElementById('addBtn').addEventListener('click', this.handleAddToCart);
  }
  
  handleAddToCart() {
    // DOM 조작 로직
  }
}

// After (TypeScript + React)
const ProductSelector: React.FC = () => {
  const { addToCart } = useCart();
  
  const handleAddToCart = useCallback((product: Product) => {
    addToCart(product, 1);
  }, [addToCart]);
  
  return (
    <button onClick={() => handleAddToCart(product)}>
      장바구니 추가
    </button>
  );
};
```

### Phase 3: 컴포넌트 마이그레이션 (Component Migration)

#### 3.1 컴포넌트 변환 패턴
```typescript
// 기존 JavaScript 클래스 → React 함수형 컴포넌트

// Before (JavaScript)
class CartDisplay {
  constructor(element, cartState) {
    this.element = element;
    this.cartState = cartState;
  }
  
  render() {
    this.element.innerHTML = this.generateHTML();
  }
  
  generateHTML() {
    // HTML 문자열 생성
  }
}

// After (TypeScript + React)
interface CartDisplayProps {
  items: CartItem[];
  onRemove: (productId: string) => void;
  onUpdateQuantity: (productId: string, quantity: number) => void;
}

export const CartDisplay: React.FC<CartDisplayProps> = ({
  items,
  onRemove,
  onUpdateQuantity
}) => {
  const { subtotal, discount, total } = useCalculations(items);
  
  return (
    <div className="cart-display">
      {items.map(item => (
        <CartItem
          key={item.product.id}
          item={item}
          onRemove={() => onRemove(item.product.id)}
          onUpdateQuantity={(quantity) => onUpdateQuantity(item.product.id, quantity)}
        />
      ))}
      <OrderSummary subtotal={subtotal} discount={discount} total={total} />
    </div>
  );
};
```

#### 3.2 DOM 조작 → React 상태 기반 UI
```typescript
// 기존 DOM 직접 조작 → React 상태 기반 렌더링

// Before (JavaScript)
function updateCartDisplay() {
  const cartElement = document.getElementById('cart');
  cartElement.innerHTML = generateCartHTML(cartItems);
  updateTotalPrice();
}

// After (TypeScript + React)
const CartProvider: React.FC = ({ children }) => {
  const [cart, setCart] = useState<CartItem[]>([]);
  
  const addToCart = useCallback((product: Product, quantity: number) => {
    setCart(prevCart => {
      const existingItem = prevCart.find(item => item.product.id === product.id);
      if (existingItem) {
        return prevCart.map(item =>
          item.product.id === product.id
            ? { ...item, quantity: item.quantity + quantity }
            : item
        );
      }
      return [...prevCart, { product, quantity, subtotal: product.price * quantity }];
    });
  }, []);
  
  return (
    <CartContext.Provider value={{ cart, addToCart, removeFromCart }}>
      {children}
    </CartContext.Provider>
  );
};
```

## 🧪 테스트 마이그레이션 전략

### 기존 테스트 → React Testing Library

#### Before (JavaScript + Vitest)
```javascript
// apps/basic/src/__tests__/CartDisplay.test.js
import { describe, it, expect, beforeEach } from 'vitest';
import { CartDisplay } from '../components/CartDisplay.js';

describe('CartDisplay', () => {
  let cartDisplay;
  let mockElement;
  
  beforeEach(() => {
    mockElement = document.createElement('div');
    cartDisplay = new CartDisplay(mockElement, mockCartState);
  });
  
  it('should display cart items', () => {
    cartDisplay.render();
    expect(mockElement.innerHTML).toContain('노트북');
  });
});
```

#### After (TypeScript + React Testing Library)
```typescript
// apps/advanced/src/components/__tests__/CartDisplay.test.tsx
import { render, screen, fireEvent } from '@testing-library/react';
import { CartProvider } from '../../context/CartContext';
import { CartDisplay } from '../cart/CartDisplay';

const renderWithCart = (component: React.ReactElement) => {
  return render(<CartProvider>{component}</CartProvider>);
};

describe('CartDisplay', () => {
  it('should display cart items', () => {
    renderWithCart(<CartDisplay />);
    expect(screen.getByText('노트북')).toBeInTheDocument();
  });
  
  it('should update quantity when quantity changes', () => {
    const mockOnUpdateQuantity = vi.fn();
    renderWithCart(
      <CartDisplay onUpdateQuantity={mockOnUpdateQuantity} />
    );
    
    const quantityInput = screen.getByRole('spinbutton');
    fireEvent.change(quantityInput, { target: { value: '3' } });
    
    expect(mockOnUpdateQuantity).toHaveBeenCalledWith('p1', 3);
  });
});
```

## 🔧 기술적 도전과 해결책

### 1. 타입 안전성 확보

#### 문제: JavaScript → TypeScript 변환 시 타입 정의
```typescript
// 해결책: 점진적 타입 정의
// 1단계: 기본 타입 정의
interface Product {
  id: string;
  name: string;
  price: number;
  stock: number;
}

// 2단계: 세부 타입 정의
interface CartItem {
  product: Product;
  quantity: number;
  subtotal: number;
  discount: number;
}

// 3단계: 고급 타입 정의
type DiscountType = 'percentage' | 'fixed';
type CartAction = 
  | { type: 'ADD_TO_CART'; payload: { product: Product; quantity: number } }
  | { type: 'REMOVE_FROM_CART'; payload: { productId: string } };
```

### 2. 상태 관리 복잡성

#### 문제: 클래스 기반 → 함수형 상태 관리
```typescript
// 해결책: Context API + useReducer 패턴
const cartReducer = (state: CartState, action: CartAction): CartState => {
  switch (action.type) {
    case 'ADD_TO_CART': {
      const { product, quantity } = action.payload;
      const existingItem = state.items.find(item => item.product.id === product.id);
      
      if (existingItem) {
        return {
          ...state,
          items: state.items.map(item =>
            item.product.id === product.id
              ? { ...item, quantity: item.quantity + quantity }
              : item
          )
        };
      }
      
      return {
        ...state,
        items: [...state.items, { product, quantity, subtotal: product.price * quantity }]
      };
    }
    // ... 다른 액션들
  }
};
```

### 3. 성능 최적화

#### 문제: 불필요한 리렌더링
```typescript
// 해결책: React.memo, useMemo, useCallback 활용
export const CartItem = React.memo<CartItemProps>(({ item, onRemove, onUpdateQuantity }) => {
  const handleQuantityChange = useCallback((newQuantity: number) => {
    onUpdateQuantity(item.product.id, newQuantity);
  }, [item.product.id, onUpdateQuantity]);
  
  const subtotal = useMemo(() => {
    return item.product.price * item.quantity;
  }, [item.product.price, item.quantity]);
  
  return (
    <div className="cart-item">
      <span>{item.product.name}</span>
      <input
        type="number"
        value={item.quantity}
        onChange={(e) => handleQuantityChange(Number(e.target.value))}
      />
      <span>{subtotal.toLocaleString()}원</span>
      <button onClick={() => onRemove(item.product.id)}>삭제</button>
    </div>
  );
});
```

## 📊 마이그레이션 진행 상황 추적

### Phase별 체크리스트

#### Phase 1: 기반 구조 (Foundation)
- [ ] TypeScript 설정 완료
- [ ] 타입 정의 완료 (Product, CartItem, CartState 등)
- [ ] 상수 데이터 마이그레이션 완료
- [ ] 기본 폴더 구조 생성 완료

#### Phase 2: 핵심 로직 (Core Logic)
- [ ] Context API 구현 완료
- [ ] 커스텀 Hook 구현 완료 (useCart, useProducts, useCalculations)
- [ ] 비즈니스 로직 변환 완료
- [ ] 이벤트 시스템 변환 완료

#### Phase 3: 컴포넌트 (Components)
- [ ] ProductSelector 컴포넌트 변환 완료
- [ ] CartDisplay 컴포넌트 변환 완료
- [ ] CartItem 컴포넌트 변환 완료
- [ ] OrderSummary 컴포넌트 변환 완료
- [ ] NotificationBar 컴포넌트 변환 완료

#### Phase 4: 테스트 및 최적화 (Testing & Optimization)
- [ ] React Testing Library 설정 완료
- [ ] 컴포넌트 테스트 작성 완료
- [ ] Hook 테스트 작성 완료
- [ ] 성능 최적화 완료 (React.memo, useMemo, useCallback)
- [ ] 접근성 개선 완료

### 성공 지표

#### 기능적 지표
- [ ] 모든 기존 기능이 정상 작동
- [ ] 장바구니 추가/삭제/수량 변경
- [ ] 할인 계산 정확성
- [ ] 포인트 적립 계산
- [ ] 상품 검색 및 필터링

#### 기술적 지표
- [ ] TypeScript 컴파일 오류 없음
- [ ] 테스트 커버리지 80% 이상
- [ ] 번들 크기 최적화
- [ ] 성능 지표 개선

#### 코드 품질 지표
- [ ] 함수당 최대 50줄
- [ ] 컴포넌트당 최대 200줄
- [ ] 순환 복잡도 10 이하
- [ ] 타입 안전성 100%

## 🚀 구현 로드맵

### Week 1: 기반 구조 구축
- Day 1-2: TypeScript 설정 및 타입 정의
- Day 3-4: 상수 데이터 마이그레이션
- Day 5: 기본 폴더 구조 및 Context API

### Week 2: 핵심 로직 마이그레이션
- Day 1-2: 커스텀 Hook 구현
- Day 3-4: 비즈니스 로직 변환
- Day 5: 이벤트 시스템 변환

### Week 3: 컴포넌트 마이그레이션
- Day 1-2: ProductSelector 및 CartDisplay
- Day 3-4: CartItem 및 OrderSummary
- Day 5: NotificationBar 및 기타 UI 컴포넌트

### Week 4: 테스트 및 최적화
- Day 1-2: React Testing Library 설정 및 테스트 작성
- Day 3-4: 성능 최적화
- Day 5: 최종 검증 및 문서화

## 💡 브라운필드 모범 사례

### 1. 점진적 마이그레이션
```typescript
// 한 번에 모든 것을 바꾸지 말고 단계별로 진행
// 1단계: 타입 정의만 먼저
// 2단계: Context API 구현
// 3단계: 컴포넌트 하나씩 변환
// 4단계: 테스트 작성 및 최적화
```

### 2. 테스트 기반 개발
```typescript
// 각 단계마다 테스트를 먼저 작성
// 기존 기능을 보존하면서 점진적으로 개선
// 회귀 방지를 위한 자동화된 테스트
```

### 3. 타입 안전성 우선
```typescript
// TypeScript의 강력한 타입 시스템 활용
// 컴파일 타임에 오류 잡기
// 런타임 오류 최소화
```

### 4. 성능 고려
```typescript
// React의 렌더링 최적화 기법 활용
// 불필요한 리렌더링 방지
// 메모리 누수 방지
```

이 브라운필드 마이그레이션 전략을 통해 `apps/basic`의 JavaScript 기반 쇼핑카트 애플리케이션을 `apps/advanced`의 TypeScript React 환경으로 안전하고 체계적으로 전환할 수 있습니다. 