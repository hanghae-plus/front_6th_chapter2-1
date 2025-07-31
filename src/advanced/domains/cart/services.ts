import { Product, ProductId } from '../product/types';
import {
  Cart,
  CartItem,
  CartOperationResult,
  createCartItem,
  createCartItemQuantity,
  createEmptyCart,
} from './types';

// 순수 함수로 구현된 장바구니 비즈니스 로직
export class CartService {
  static addProduct(
    cart: Cart,
    product: Product,
    quantity: number = 1
  ): CartOperationResult<Cart> {
    try {
      if (!product.stock.isAvailable) {
        return {
          success: false,
          error: '재고가 없는 상품입니다.',
        };
      }

      if (quantity > product.stock.quantity) {
        return {
          success: false,
          error: '재고가 부족합니다.',
        };
      }

      const existingItemIndex = cart.items.findIndex(
        (item) => item.product.id.value === product.id.value
      );

      let newItems: readonly CartItem[];

      if (existingItemIndex >= 0) {
        // 기존 아이템 수량 증가
        const existingItem = cart.items[existingItemIndex];
        const newQuantity = existingItem.quantity.value + quantity;

        if (newQuantity > product.stock.quantity) {
          return {
            success: false,
            error: '재고가 부족합니다.',
          };
        }

        const updatedItem = createCartItem(
          product,
          createCartItemQuantity(newQuantity)
        );
        newItems = cart.items.map((item, index) =>
          index === existingItemIndex ? updatedItem : item
        );
      } else {
        // 새 아이템 추가
        const newItem = createCartItem(
          product,
          createCartItemQuantity(quantity)
        );
        newItems = [...cart.items, newItem];
      }

      const newCart = CartService.recalculateCart(newItems);
      return {
        success: true,
        data: newCart,
      };
    } catch (error) {
      return {
        success: false,
        error:
          error instanceof Error
            ? error.message
            : '알 수 없는 오류가 발생했습니다.',
      };
    }
  }

  static removeProduct(
    cart: Cart,
    productId: ProductId
  ): CartOperationResult<Cart> {
    const newItems = cart.items.filter(
      (item) => item.product.id.value !== productId.value
    );

    const newCart = CartService.recalculateCart(newItems);
    return {
      success: true,
      data: newCart,
    };
  }

  static updateQuantity(
    cart: Cart,
    productId: ProductId,
    newQuantity: number
  ): CartOperationResult<Cart> {
    try {
      if (newQuantity <= 0) {
        return CartService.removeProduct(cart, productId);
      }

      const itemIndex = cart.items.findIndex(
        (item) => item.product.id.value === productId.value
      );

      if (itemIndex === -1) {
        return {
          success: false,
          error: '장바구니에 해당 상품이 없습니다.',
        };
      }

      const item = cart.items[itemIndex];

      if (newQuantity > item.product.stock.quantity) {
        return {
          success: false,
          error: '재고가 부족합니다.',
        };
      }

      const updatedItem = createCartItem(
        item.product,
        createCartItemQuantity(newQuantity)
      );

      const newItems = cart.items.map((cartItem, index) =>
        index === itemIndex ? updatedItem : cartItem
      );

      const newCart = CartService.recalculateCart(newItems);
      return {
        success: true,
        data: newCart,
      };
    } catch (error) {
      return {
        success: false,
        error:
          error instanceof Error
            ? error.message
            : '알 수 없는 오류가 발생했습니다.',
      };
    }
  }

  static clearCart(): Cart {
    return createEmptyCart();
  }

  static getTotalItemCount(cart: Cart): number {
    return cart.items.reduce((total, item) => total + item.quantity.value, 0);
  }

  static updateProductPrices(
    cart: Cart,
    updatedProducts: readonly Product[]
  ): Cart {
    const newItems = cart.items.map((item) => {
      const updatedProduct = updatedProducts.find(
        (p) => p.id.value === item.product.id.value
      );

      if (updatedProduct) {
        return createCartItem(updatedProduct, item.quantity);
      }

      return item;
    });

    return CartService.recalculateCart(newItems);
  }

  private static recalculateCart(items: readonly CartItem[]): Cart {
    const totalItems = items.reduce(
      (sum, item) => sum + item.quantity.value,
      0
    );
    const subtotalAmount = items.reduce(
      (sum, item) => sum + item.subtotal.amount,
      0
    );

    return {
      items,
      totalItems,
      subtotal: { amount: subtotalAmount, currency: 'KRW' },
    };
  }
}
