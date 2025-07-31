import type { Cart, CartAction, CartItem } from '../../types/cart';
import { calculateCartTotals } from '../../utils/cartUtils';
import { getProducts } from '../../services/saleService';

function getProductMap(): Record<string, Omit<CartItem, 'quantity'>> {
  const products = getProducts();
  const productMap: Record<string, Omit<CartItem, 'quantity'>> = {};
  
  products.forEach(product => {
    productMap[product.id] = {
      id: product.id,
      name: product.name,
      originalPrice: product.originalPrice,
      price: product.price,
      saleIcon: product.saleIcon,
      isLightningSale: product.isLightningSale,
      isSuggestSale: product.isSuggestSale,
    };
  });
  
  return productMap;
}

export const initialCartState: Cart = {
  items: [],
  totalAmount: 0,
  originalAmount: 0,
  realOriginalAmount: 0,
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
      const productMap = getProductMap();
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

    case 'UPDATE_PRICES': {
      const productMap = getProductMap();
      
      const updatedItems = state.items.map((item) => {
        const updatedProduct = productMap[item.id];
        if (updatedProduct) {
          return {
            ...item,
            price: updatedProduct.price,
            originalPrice: updatedProduct.originalPrice,
            saleIcon: updatedProduct.saleIcon,
            isLightningSale: updatedProduct.isLightningSale,
            isSuggestSale: updatedProduct.isSuggestSale,
          };
        }
        return item;
      });

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
