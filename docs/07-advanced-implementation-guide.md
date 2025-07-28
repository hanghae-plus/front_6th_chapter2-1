# Advanced 앱 구현 가이드

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
  startDate?: Date;
  endDate?: Date;
}
```

## 3. 상수 데이터 마이그레이션

### 3.1 상품 데이터

#### `src/constants/products.ts`
```typescript
import { Product } from '../types/product.types';

export const PRODUCTS: Product[] = [
  {
    id: 'p1',
    name: '노트북',
    price: 1200000,
    stock: 10,
    category: 'electronics',
    description: '고성능 노트북'
  },
  {
    id: 'p2',
    name: '마우스',
    price: 50000,
    stock: 50,
    category: 'electronics',
    description: '무선 마우스'
  },
  // ... 기존 상품 데이터 추가
];

export const getProductById = (id: string): Product | undefined => {
  return PRODUCTS.find(product => product.id === id);
};

export const getProductsByCategory = (category: string): Product[] => {
  return PRODUCTS.filter(product => product.category === category);
};
```

### 3.2 할인 정책

#### `src/constants/discountPolicies.ts`
```typescript
import { DiscountPolicy } from '../types/promotion.types';

export const DISCOUNT_POLICIES: DiscountPolicy[] = [
  {
    id: 'discount-1',
    type: 'percentage',
    value: 10,
    minAmount: 100000,
    maxDiscount: 50000,
    description: '10만원 이상 구매시 10% 할인'
  },
  // ... 기존 할인 정책 추가
];

export const calculateDiscount = (
  totalAmount: number,
  policies: DiscountPolicy[]
): number => {
  let totalDiscount = 0;
  
  for (const policy of policies) {
    if (totalAmount >= (policy.minAmount || 0)) {
      let discount = 0;
      
      if (policy.type === 'percentage') {
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
};
```

## 4. 상태 관리 구현

### 4.1 Context API 설정

#### `src/context/CartContext.tsx`
```typescript
import React, { createContext, useContext, useReducer, ReactNode } from 'react';
import { CartState, CartActions, CartItem } from '../types/cart.types';
import { Product } from '../types/product.types';

interface CartContextType extends CartState, CartActions {}

const CartContext = createContext<CartContextType | undefined>(undefined);

// 초기 상태
const initialState: CartState = {
  items: [],
  totalPrice: 0,
  totalDiscount: 0,
  totalPoints: 0,
  itemCount: 0,
};

// 액션 타입
type CartAction =
  | { type: 'ADD_TO_CART'; payload: { product: Product; quantity: number } }
  | { type: 'REMOVE_FROM_CART'; payload: { productId: string } }
  | { type: 'UPDATE_QUANTITY'; payload: { productId: string; quantity: number } }
  | { type: 'CLEAR_CART' };

// 리듀서
const cartReducer = (state: CartState, action: CartAction): CartState => {
  switch (action.type) {
    case 'ADD_TO_CART': {
      const { product, quantity } = action.payload;
      const existingItem = state.items.find(item => item.product.id === product.id);
      
      let newItems: CartItem[];
      if (existingItem) {
        newItems = state.items.map(item =>
          item.product.id === product.id
            ? { ...item, quantity: item.quantity + quantity }
            : item
        );
      } else {
        const newItem: CartItem = {
          product,
          quantity,
          subtotal: product.price * quantity,
          discount: 0,
          points: 0,
        };
        newItems = [...state.items, newItem];
      }
      
      return calculateCartTotals(newItems);
    }
    
    case 'REMOVE_FROM_CART': {
      const newItems = state.items.filter(
        item => item.product.id !== action.payload.productId
      );
      return calculateCartTotals(newItems);
    }
    
    case 'UPDATE_QUANTITY': {
      const { productId, quantity } = action.payload;
      const newItems = state.items.map(item =>
        item.product.id === productId
          ? { ...item, quantity: Math.max(0, quantity) }
          : item
      ).filter(item => item.quantity > 0);
      
      return calculateCartTotals(newItems);
    }
    
    case 'CLEAR_CART':
      return initialState;
      
    default:
      return state;
  }
};

// 총계 계산 함수
const calculateCartTotals = (items: CartItem[]): CartState => {
  const totalPrice = items.reduce((sum, item) => sum + item.subtotal, 0);
  const totalDiscount = items.reduce((sum, item) => sum + item.discount, 0);
  const totalPoints = items.reduce((sum, item) => sum + item.points, 0);
  const itemCount = items.reduce((sum, item) => sum + item.quantity, 0);
  
  return {
    items,
    totalPrice,
    totalDiscount,
    totalPoints,
    itemCount,
  };
};

// Provider 컴포넌트
export const CartProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [state, dispatch] = useReducer(cartReducer, initialState);
  
  const addToCart = (product: Product, quantity: number) => {
    dispatch({ type: 'ADD_TO_CART', payload: { product, quantity } });
  };
  
  const removeFromCart = (productId: string) => {
    dispatch({ type: 'REMOVE_FROM_CART', payload: { productId } });
  };
  
  const updateQuantity = (productId: string, quantity: number) => {
    dispatch({ type: 'UPDATE_QUANTITY', payload: { productId, quantity } });
  };
  
  const clearCart = () => {
    dispatch({ type: 'CLEAR_CART' });
  };
  
  const value: CartContextType = {
    ...state,
    addToCart,
    removeFromCart,
    updateQuantity,
    clearCart,
  };
  
  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
};

// Hook
export const useCart = (): CartContextType => {
  const context = useContext(CartContext);
  if (context === undefined) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
};
```

## 5. 커스텀 Hook 구현

### 5.1 계산 엔진 Hook

#### `src/hooks/useCalculations.ts`
```typescript
import { useMemo } from 'react';
import { CartItem } from '../types/cart.types';
import { DiscountPolicy } from '../types/promotion.types';
import { DISCOUNT_POLICIES } from '../constants/discountPolicies';

export const useCalculations = (cartItems: CartItem[]) => {
  const calculations = useMemo(() => {
    const subtotal = cartItems.reduce((sum, item) => sum + item.subtotal, 0);
    const discount = calculateDiscount(subtotal, DISCOUNT_POLICIES);
    const total = subtotal - discount;
    const points = Math.floor(total * 0.01); // 1% 포인트 적립
    
    return {
      subtotal,
      discount,
      total,
      points,
    };
  }, [cartItems]);
  
  return calculations;
};

const calculateDiscount = (
  totalAmount: number,
  policies: DiscountPolicy[]
): number => {
  let totalDiscount = 0;
  
  for (const policy of policies) {
    if (totalAmount >= (policy.minAmount || 0)) {
      let discount = 0;
      
      if (policy.type === 'percentage') {
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
};
```

### 5.2 상품 관리 Hook

#### `src/hooks/useProducts.ts`
```typescript
import { useState, useMemo } from 'react';
import { Product } from '../types/product.types';
import { PRODUCTS } from '../constants/products';

export const useProducts = () => {
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [searchTerm, setSearchTerm] = useState<string>('');
  
  const filteredProducts = useMemo(() => {
    let products = PRODUCTS;
    
    // 카테고리 필터링
    if (selectedCategory !== 'all') {
      products = products.filter(product => product.category === selectedCategory);
    }
    
    // 검색어 필터링
    if (searchTerm) {
      products = products.filter(product =>
        product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        product.description?.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }
    
    return products;
  }, [selectedCategory, searchTerm]);
  
  const categories = useMemo(() => {
    const uniqueCategories = [...new Set(PRODUCTS.map(product => product.category))];
    return ['all', ...uniqueCategories];
  }, []);
  
  return {
    products: filteredProducts,
    categories,
    selectedCategory,
    setSelectedCategory,
    searchTerm,
    setSearchTerm,
  };
};
```

## 6. 컴포넌트 구현

### 6.1 상품 선택 컴포넌트

#### `src/components/product/ProductSelector.tsx`
```typescript
import React from 'react';
import { Product } from '../../types/product.types';
import { useProducts } from '../../hooks/useProducts';
import { useCart } from '../../context/CartContext';

export const ProductSelector: React.FC = () => {
  const {
    products,
    categories,
    selectedCategory,
    setSelectedCategory,
    searchTerm,
    setSearchTerm,
  } = useProducts();
  
  const { addToCart } = useCart();
  
  const handleAddToCart = (product: Product) => {
    addToCart(product, 1);
  };
  
  return (
    <div className="product-selector">
      <div className="filters">
        <select
          value={selectedCategory}
          onChange={(e) => setSelectedCategory(e.target.value)}
          className="category-filter"
        >
          {categories.map(category => (
            <option key={category} value={category}>
              {category === 'all' ? '전체' : category}
            </option>
          ))}
        </select>
        
        <input
          type="text"
          placeholder="상품 검색..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="search-input"
        />
      </div>
      
      <div className="products-grid">
        {products.map(product => (
          <div key={product.id} className="product-card">
            <h3>{product.name}</h3>
            <p>{product.description}</p>
            <p className="price">{product.price.toLocaleString()}원</p>
            <p className="stock">재고: {product.stock}개</p>
            <button
              onClick={() => handleAddToCart(product)}
              disabled={product.stock === 0}
              className="add-to-cart-btn"
            >
              {product.stock === 0 ? '품절' : '장바구니 추가'}
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};
```

### 6.2 장바구니 표시 컴포넌트

#### `src/components/cart/CartDisplay.tsx`
```typescript
import React from 'react';
import { useCart } from '../../context/CartContext';
import { useCalculations } from '../../hooks/useCalculations';
import { CartItem } from './CartItem';

export const CartDisplay: React.FC = () => {
  const { items, removeFromCart, updateQuantity, clearCart } = useCart();
  const { subtotal, discount, total, points } = useCalculations(items);
  
  if (items.length === 0) {
    return (
      <div className="cart-empty">
        <h3>장바구니가 비어있습니다</h3>
        <p>상품을 추가해보세요!</p>
      </div>
    );
  }
  
  return (
    <div className="cart-display">
      <div className="cart-header">
        <h3>장바구니 ({items.length}개 상품)</h3>
        <button onClick={clearCart} className="clear-cart-btn">
          전체 삭제
        </button>
      </div>
      
      <div className="cart-items">
        {items.map(item => (
          <CartItem
            key={item.product.id}
            item={item}
            onRemove={() => removeFromCart(item.product.id)}
            onUpdateQuantity={(quantity) => updateQuantity(item.product.id, quantity)}
          />
        ))}
      </div>
      
      <div className="cart-summary">
        <div className="summary-row">
          <span>상품 금액:</span>
          <span>{subtotal.toLocaleString()}원</span>
        </div>
        <div className="summary-row">
          <span>할인 금액:</span>
          <span>-{discount.toLocaleString()}원</span>
        </div>
        <div className="summary-row total">
          <span>총 결제 금액:</span>
          <span>{total.toLocaleString()}원</span>
        </div>
        <div className="summary-row">
          <span>적립 포인트:</span>
          <span>{points.toLocaleString()}P</span>
        </div>
      </div>
    </div>
  );
};
```

## 7. 메인 앱 컴포넌트

#### `src/App.tsx`
```typescript
import React from 'react';
import { CartProvider } from './context/CartContext';
import { ProductSelector } from './components/product/ProductSelector';
import { CartDisplay } from './components/cart/CartDisplay';
import { NotificationBar } from './components/ui/NotificationBar';

const App: React.FC = () => {
  return (
    <CartProvider>
      <div className="app">
        <header className="app-header">
          <h1>쇼핑몰</h1>
        </header>
        
        <main className="app-main">
          <div className="product-section">
            <h2>상품 목록</h2>
            <ProductSelector />
          </div>
          
          <div className="cart-section">
            <h2>장바구니</h2>
            <CartDisplay />
          </div>
        </main>
        
        <NotificationBar />
      </div>
    </CartProvider>
  );
};

export default App;
```

## 8. 테스트 구현

### 8.1 컴포넌트 테스트 예시

#### `src/components/__tests__/ProductSelector.test.tsx`
```typescript
import { render, screen, fireEvent } from '@testing-library/react';
import { CartProvider } from '../../context/CartContext';
import { ProductSelector } from '../product/ProductSelector';

const renderWithCart = (component: React.ReactElement) => {
  return render(<CartProvider>{component}</CartProvider>);
};

describe('ProductSelector', () => {
  it('상품 목록을 렌더링한다', () => {
    renderWithCart(<ProductSelector />);
    
    expect(screen.getByText('노트북')).toBeInTheDocument();
    expect(screen.getByText('마우스')).toBeInTheDocument();
  });
  
  it('카테고리 필터링이 작동한다', () => {
    renderWithCart(<ProductSelector />);
    
    const categorySelect = screen.getByRole('combobox');
    fireEvent.change(categorySelect, { target: { value: 'electronics' } });
    
    expect(screen.getByText('노트북')).toBeInTheDocument();
    expect(screen.queryByText('다른카테고리상품')).not.toBeInTheDocument();
  });
  
  it('장바구니 추가 버튼이 작동한다', () => {
    renderWithCart(<ProductSelector />);
    
    const addButton = screen.getAllByText('장바구니 추가')[0];
    fireEvent.click(addButton);
    
    // 장바구니에 상품이 추가되었는지 확인
    // (실제 구현에서는 장바구니 상태 변화를 확인)
  });
});
```

## 9. 스타일링 가이드

### 9.1 CSS 모듈 사용 예시

#### `src/components/product/ProductSelector.module.css`
```css
.productSelector {
  padding: 20px;
}

.filters {
  display: flex;
  gap: 10px;
  margin-bottom: 20px;
}

.categoryFilter {
  padding: 8px;
  border: 1px solid #ddd;
  border-radius: 4px;
}

.searchInput {
  padding: 8px;
  border: 1px solid #ddd;
  border-radius: 4px;
  flex: 1;
}

.productsGrid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(250px, 1fr));
  gap: 20px;
}

.productCard {
  border: 1px solid #ddd;
  border-radius: 8px;
  padding: 15px;
  background: white;
}

.addToCartBtn {
  width: 100%;
  padding: 10px;
  background: #007bff;
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
}

.addToCartBtn:disabled {
  background: #ccc;
  cursor: not-allowed;
}
```

## 10. 다음 단계

1. **기본 구조 구현** - 위의 코드들을 순서대로 구현
2. **테스트 작성** - 각 컴포넌트와 Hook에 대한 테스트 작성
3. **스타일링 적용** - CSS 모듈 또는 Tailwind CSS 적용
4. **성능 최적화** - React.memo, useMemo, useCallback 적용
5. **접근성 개선** - ARIA 라벨, 키보드 네비게이션 추가

이 가이드를 따라하면 `apps/basic`의 기능을 완전히 `apps/advanced`로 마이그레이션할 수 있습니다. 