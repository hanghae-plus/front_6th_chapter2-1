import { useState, useCallback } from 'react';
import { CartItem, Product } from '../types';
import { productList } from '../data/productData';
import {
  addToCart,
  removeFromCart,
  updateCartItemQuantity,
} from '../services/cartService';
import { useErrorHandler } from './useErrorHandler';
import {
  handleOperationWithError,
  OPERATION_MESSAGES,
} from '../utils/errorFactory';

interface UseCartReturn {
  cartItems: ReadonlyArray<CartItem>;
  addItemToCart: (product: Product, quantity?: number) => void;
  removeItemFromCart: (productId: string) => void;
  updateItemQuantity: (productId: string, change: number) => void;
  addProductById: (productId: string) => void;
}

export const useCart = (): UseCartReturn => {
  const [cartItems, setCartItems] = useState<ReadonlyArray<CartItem>>([]);
  const { handleError, showProductNotFoundError } = useErrorHandler();

  const addItemToCart = useCallback(
    (
      product: Product,
      quantity: number = OPERATION_MESSAGES.QUANTITY.DEFAULT
    ) => {
      handleOperationWithError(
        () => {
          const updatedCart = addToCart(cartItems, product, quantity);
          setCartItems(updatedCart);
        },
        OPERATION_MESSAGES.CART.ADD_FAILED,
        handleError
      );
    },
    [cartItems, handleError]
  );

  const removeItemFromCart = useCallback(
    (productId: string) => {
      handleOperationWithError(
        () => {
          const updatedCart = removeFromCart(cartItems, productId);
          setCartItems(updatedCart);
        },
        OPERATION_MESSAGES.CART.REMOVE_FAILED,
        handleError
      );
    },
    [cartItems, handleError]
  );

  const updateItemQuantity = useCallback(
    (productId: string, change: number) => {
      handleOperationWithError(
        () => {
          const item = cartItems.find((item) => item.product.id === productId);
          if (!item) return;

          const newQuantity = item.quantity + change;

          if (newQuantity <= OPERATION_MESSAGES.QUANTITY.MIN) {
            removeItemFromCart(productId);
          } else {
            const updatedCart = updateCartItemQuantity(
              cartItems,
              productId,
              newQuantity
            );
            setCartItems(updatedCart);
          }
        },
        OPERATION_MESSAGES.CART.UPDATE_FAILED,
        handleError
      );
    },
    [cartItems, removeItemFromCart, handleError]
  );

  const addProductById = useCallback(
    (productId: string) => {
      const product = productList.find((p) => p.id === productId);
      if (!product) {
        showProductNotFoundError(productId);
        return;
      }
      addItemToCart(product, OPERATION_MESSAGES.QUANTITY.DEFAULT);
    },
    [addItemToCart, showProductNotFoundError]
  );

  return {
    cartItems,
    addItemToCart,
    removeItemFromCart,
    updateItemQuantity,
    addProductById,
  };
};
