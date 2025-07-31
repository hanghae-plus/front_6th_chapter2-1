import { Product, SaleInfo } from 'types';
import { useNewCart } from 'cart/hooks';
import { createSafeContext } from 'shared/utils';

const CART = 'Cart';

interface CartContextType {
  // 상품 관련
  products: Product[];
  getProduct: (productId: string) => Product | null;

  // 장바구니 아이템 관련
  cartItems: Array<{ product: Product; quantity: number }>;
  getItemQuantity: (productId: string) => number;

  // 계산 관련
  cartTotal: number;
  loyaltyPoints: number;
  discountInfo: string;

  // 재고 관련
  stockStatus: string;

  // 액션 관련
  addToCart: (productId: string) => void;
  handleRemove: (productId: string) => void;
  handleQuantityChange: (productId: string, change: number) => void;
  updateSaleStatus: (productId: string, saleInfo: SaleInfo) => void;
  clearCart: () => void;
}

const [Provider, useCartContext] = createSafeContext<CartContextType>(CART);

export const useCart = () => useCartContext(CART);

interface CartProviderProps {
  children: React.ReactNode;
  initialProducts: Product[];
}

export function CartProvider({ children, initialProducts }: CartProviderProps) {
  const cartData = useNewCart({ initialProducts });

  return <Provider {...cartData}>{children}</Provider>;
}
