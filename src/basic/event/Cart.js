import { 
  getProductById, 
  getProductList,
  updateProductStock, 
  restoreProductStock,
  addToCart,
  removeFromCart
} from "../data/index.js";
import { PRODUCT_LIST } from "../data/constants.js";

import { updateHeaderItemCount } from "../render/Header.js";
import { updateCartSelectOptions, updateStockInfo } from "../render/CartSelectBox.js";
import { 
  updateCartSummary,
  updateTotalPrice,
  updateDiscountInfo,
  updateLoyaltyPoints,
  updateTuesdaySpecial
} from "../render/CartTotal.js";
import { addCartItem } from "../render/CartItemList.js";
import { updateLastSelectedProduct } from "./Auto.js";

// 장바구니에 상품 추가
export const handleAddToCart = () => {
  const productSelectElement = document.getElementById('product-select');
  if (!productSelectElement) return;

  const selectedProductId = productSelectElement.value;
  const selectedProduct = getProductById(selectedProductId);

  if (!selectedProductId || !selectedProduct) {
    alert('상품을 선택해주세요.');
    return;
  }

  if (selectedProduct.stock <= 0) {
    alert('품절된 상품입니다.');
    return;
  }

  // 기존 장바구니 아이템 확인
  const cartItemsContainer = document.getElementById('cart-items');
  let existingCartItem = null;
  
  if (cartItemsContainer) {
    // 정확히 같은 ID를 가진 DOM 요소 찾기
    existingCartItem = cartItemsContainer.querySelector(`#${selectedProductId}`);
  }

  // 원본 재고 데이터로 검증 (constants.js의 PRODUCT_LIST 사용)
  const originalProduct = PRODUCT_LIST.find(p => p.id === selectedProductId);
  const currentCartQuantity = existingCartItem 
    ? parseInt(existingCartItem.querySelector('.quantity-number').textContent) || 0
    : 0;
  
  // 원본 재고에서 새로운 총 수량 검증
  if (originalProduct.stock < currentCartQuantity + 1) {
    alert('재고가 부족합니다.');
    return;
  }

  if (existingCartItem) {
    // 기존 상품이 있으면 수량만 증가
    const quantityElement = existingCartItem.querySelector('.quantity-number');

    // 수량 업데이트 (DOM만)
    quantityElement.textContent = currentCartQuantity + 1;
    
    // cartList에도 추가
    addToCart(selectedProduct);
  } else {
    // 새 상품이면 cartList에 추가하고 DOM 렌더링
    addToCart(selectedProduct);
    addCartItem(selectedProduct);
  }

  // 재고 업데이트 및 UI 업데이트
  updateProductStock(selectedProductId, 1); // 재고 차감
  updateAllUI();
  updateLastSelectedProduct(selectedProductId);
};

// 장바구니 아이템 액션 처리 (수량 변경, 삭제)
export const handleCartItemActions = (event) => {
  const targetElement = event.target;
  
  // 수량 변경 버튼 클릭
  if (targetElement.classList.contains('quantity-change')) {
    event.preventDefault();
    event.stopPropagation();
    
    const productId = targetElement.dataset.productId;
    const cartItemElement = document.getElementById(productId);
    const product = getProductById(productId);
    
    if (!cartItemElement || !product) return;

    const quantityChange = parseInt(targetElement.dataset.change);
    const quantityElement = cartItemElement.querySelector('.quantity-number');
    const currentQuantity = parseInt(quantityElement.textContent);
    const newQuantity = currentQuantity + quantityChange;

    if (newQuantity > 0) {
      // 증가하는 경우: 재고 확인
      if (quantityChange > 0) {
        // 원본 재고 데이터로 검증 (constants.js의 PRODUCT_LIST 사용)
        const originalProduct = PRODUCT_LIST.find(p => p.id === product.id);
        if (newQuantity > originalProduct.stock) {
          alert('재고가 부족합니다.');
          return;
        }
        quantityElement.textContent = newQuantity;
        updateProductStock(product.id, quantityChange);
        addToCart(product);
      } else {
        // 감소하는 경우
        quantityElement.textContent = newQuantity;
        updateProductStock(product.id, quantityChange); // 재고 복원 (quantityChange는 음수)
        removeFromCart(product);
      }
    } else if (newQuantity <= 0) {
      // 수량이 0 이하가 되면 아이템 제거
      restoreProductStock(product.id, currentQuantity);
      cartItemElement.remove();
      
      // cartList 배열에서 완전 제거
      for (let i = 0; i < currentQuantity; i++) {
        removeFromCart(product);
      }
    }

    // UI 업데이트
    updateAllUI();
  }
  // 아이템 제거 버튼 클릭
  else if (targetElement.classList.contains('remove-item')) {
    event.preventDefault();
    event.stopPropagation();
    
    const productId = targetElement.dataset.productId;
    const cartItemElement = document.getElementById(productId);
    const product = getProductById(productId);
    
    if (!cartItemElement || !product) return;

    const quantityElement = cartItemElement.querySelector('.quantity-number');
    const removedQuantity = parseInt(quantityElement.textContent);
    restoreProductStock(product.id, removedQuantity);
    cartItemElement.remove();
    
    // cartList 배열에서 완전 제거
    for (let i = 0; i < removedQuantity; i++) {
      removeFromCart(product);
    }

    // UI 업데이트
    updateAllUI();
  }
};

// 모든 UI 업데이트 함수
const updateAllUI = () => {
  updateHeaderItemCount();
  updateCartSelectOptions();
  updateStockInfo();
  
  // CartTotal 관련 UI 업데이트
  updateCartSummary();
  updateTotalPrice();
  updateDiscountInfo();
  updateLoyaltyPoints();
  updateTuesdaySpecial();
}; 