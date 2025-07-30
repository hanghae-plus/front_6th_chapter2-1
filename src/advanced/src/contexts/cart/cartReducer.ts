import type { Cart, CartAction, CartItem } from '../../types/cart';
import { calculateCartTotals } from '../../utils/cartUtils';

const productMap: Record<string, Omit<CartItem, 'quantity'>> = {
  p1: {
    id: 'p1',
    name: '버그 없애는 키보드',
    originalPrice: 10000,
    price: 8000,
    saleIcon: '⚡',
  },
  p2: {
    id: 'p2',
    name: '생산성 폭발 마우스',
    originalPrice: 20000,
    price: 15200,
    saleIcon: '⚡💝',
  },
  p3: {
    id: 'p3',
    name: '거북목 탈출 모니터암',
    originalPrice: 30000,
    price: 22800,
    saleIcon: '⚡💝',
  },
  p4: {
    id: 'p4',
    name: '에러 방지 노트북 파우치',
    originalPrice: 15000,
    price: 15000,
  },
  p5: {
    id: 'p5',
    name: '코딩할 때 듣는 Lo-Fi 스피커',
    originalPrice: 25000,
    price: 19000,
    saleIcon: '⚡💝',
  },
};

export const initialCartState: Cart = {
  items: [],
  totalAmount: 0,
  originalAmount: 0,
  discountAmount: 0,
  itemCount: 0,
  appliedDiscounts: [],
  loyaltyPoints: 0,
  pointsBreakdown: [],
};


export function cartReducer(state: Cart, action: CartAction): Cart {
  switch (action.type) {
    case 'ADD_ITEM': {
      const { productId, quantity } = action.payload;
      const product = productMap[productId];

      const existingItem = state.items.find((item) => item.id === productId);
      let updatedItems: CartItem[];
      if (existingItem) {
        // 기존 상품 수량 증가
        updatedItems = state.items.map((item) =>
          item.id === productId
            ? { ...item, quantity: item.quantity + quantity }
            : item
        );
      } else {
        // 새 상품 추가
        updatedItems = [...state.items, { ...product, quantity }];
      }
      return {
        ...state,
        items: updatedItems,
        ...calculateCartTotals(updatedItems),
      };
    }

    case 'ADJUST_QUANTITY': {
      const { productId, quantity } = action.payload;
      const updatedItems = state.items
        .map((item) =>
          item.id === productId
            ? { ...item, quantity: item.quantity + quantity }
            : item
        )
        .filter((item) => item.quantity > 0); // 수량이 0 이하가 되면 제거
      return {
        ...state,
        items: updatedItems,
        ...calculateCartTotals(updatedItems),
      };
    }

    case 'REMOVE_ITEM': {
      const { productId } = action.payload;
      const updatedItems = state.items.filter((item) => item.id !== productId);
      return {
        ...state,
        items: updatedItems,
        ...calculateCartTotals(updatedItems),
      };
    }

    default:
      return state;
  }
}
