import type { CartItem, Product } from "../types";
import { calculateCartTotals } from "../utils/cartUtils";
import { calculateBonusPoints } from "../utils/pointsUtils";

export class CartService {
  /**
   * 장바구니에 상품 추가
   */
  static addToCart(
    productId: string,
    products: Product[],
    cart: CartItem[]
  ): { newCart: CartItem[]; product?: Product } {
    const product = products.find((p) => p.id === productId);
    if (!product) {
      throw new Error("상품을 찾을 수 없습니다.");
    }

    const existingItem = cart.find((item) => item.id === productId);

    if (existingItem) {
      const newCart = cart.map((item) =>
        item.id === productId ? { ...item, quantity: item.quantity + 1 } : item
      );
      return { newCart, product };
    }

    const newItem: CartItem = {
      id: productId,
      name: product.name,
      val: product.val,
      quantity: 1,
      discount: 0,
    };

    return { newCart: [...cart, newItem], product };
  }

  /**
   * 장바구니 상품 수량 업데이트
   */
  static updateQuantity(
    id: string,
    quantity: number,
    cart: CartItem[]
  ): CartItem[] {
    if (quantity === 0) {
      return cart.filter((item) => item.id !== id);
    }

    return cart.map((item) => (item.id === id ? { ...item, quantity } : item));
  }

  /**
   * 장바구니에서 상품 제거
   */
  static removeFromCart(id: string, cart: CartItem[]): CartItem[] {
    return cart.filter((item) => item.id !== id);
  }

  /**
   * 장바구니 총계 계산
   */
  static calculateTotals(
    cart: CartItem[]
  ): ReturnType<typeof calculateCartTotals> {
    return calculateCartTotals(cart);
  }

  /**
   * 포인트 계산
   */
  static calculatePoints(
    cart: CartItem[],
    totalAmount: number,
    totalQty: number,
    isTuesday: boolean
  ): ReturnType<typeof calculateBonusPoints> {
    return calculateBonusPoints(cart, totalAmount, totalQty, isTuesday);
  }
}
