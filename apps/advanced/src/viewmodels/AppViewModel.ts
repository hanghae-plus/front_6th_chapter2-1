import { Product } from '../types/product.types';
import { useCartViewModel } from './CartViewModel';
import { useProductViewModel } from './ProductViewModel';

export const useAppViewModel = () => {
  const cartViewModel = useCartViewModel();
  const productViewModel = useProductViewModel();

  // 상품을 장바구니에 추가하는 통합 액션
  const addProductToCart = (product: Product, quantity: number) => {
    // 재고 확인
    if (quantity > product.stock) {
      throw new Error(`재고가 부족합니다. 현재 재고: ${product.stock}개`);
    }

    // 장바구니에 추가
    cartViewModel.addToCart(product, quantity);

    // 상품 재고 업데이트
    productViewModel.updateProductStock(product.id, quantity);
  };

  // 장바구니에서 상품 제거하는 통합 액션
  const removeProductFromCart = (productId: string) => {
    const cartItem = cartViewModel.cartItems.find(
      item => item.product.id === productId
    );

    if (cartItem) {
      // 장바구니에서 제거
      cartViewModel.removeFromCart(productId);

      // 상품 재고 복원
      productViewModel.updateProductStock(productId, -cartItem.quantity);
    }
  };

  // 장바구니 상품 수량 변경하는 통합 액션
  const updateCartItemQuantity = (productId: string, newQuantity: number) => {
    const cartItem = cartViewModel.cartItems.find(
      item => item.product.id === productId
    );

    if (cartItem) {
      const quantityDifference = newQuantity - cartItem.quantity;

      // 재고 확인 (현재 재고 + 장바구니 수량이 최대 가능 수량)
      const maxAvailableQuantity = cartItem.product.stock + cartItem.quantity;

      if (newQuantity > maxAvailableQuantity) {
        throw new Error(
          `재고가 부족합니다. 최대 가능 수량: ${maxAvailableQuantity}개`
        );
      }

      // 장바구니 수량 업데이트
      cartViewModel.updateQuantity(productId, newQuantity);

      // 상품 재고 업데이트 (quantityDifference가 양수면 재고 감소, 음수면 재고 증가)
      productViewModel.updateProductStock(productId, quantityDifference);
    }
  };

  // 장바구니 비우기 통합 액션
  const clearCart = () => {
    // 모든 상품의 재고를 복원
    cartViewModel.cartItems.forEach(item => {
      productViewModel.updateProductStock(item.product.id, -item.quantity);
    });

    // 장바구니 비우기
    cartViewModel.clearCart();
  };

  return {
    // Cart ViewModel
    cart: {
      items: cartViewModel.cartItems,
      summary: cartViewModel.cartSummary,
      isEmpty: cartViewModel.isEmpty,
      addToCart: addProductToCart,
      removeFromCart: removeProductFromCart,
      updateQuantity: updateCartItemQuantity,
      clearCart: clearCart
    },

    // Product ViewModel
    product: {
      products: productViewModel.products,
      allProducts: productViewModel.allProducts,
      selectedCategory: productViewModel.selectedCategory,
      searchTerm: productViewModel.searchTerm,
      sortBy: productViewModel.sortBy,
      sortOrder: productViewModel.sortOrder,
      availableCategories: productViewModel.availableCategories,
      totalProducts: productViewModel.totalProducts,
      hasActiveFilters: productViewModel.hasActiveFilters,
      setCategory: productViewModel.setCategory,
      setSearchTerm: productViewModel.setSearchTerm,
      setSort: productViewModel.setSort,
      resetFilters: productViewModel.resetFilters
    },

    // 통합 액션들
    addProductToCart,
    removeProductFromCart,
    updateCartItemQuantity,
    clearCart
  };
};
