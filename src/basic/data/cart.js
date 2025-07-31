// 글로벌 상태 변수
let cartList = []; // 장바구니 목록

// 장바구니 초기화
export const initializeCart = () => {
  cartList = [];
  console.log('Cart initialized');
};

// 장바구니에 상품 추가
export const addToCart = (product) => {
  cartList.push({ ...product });
};

// 장바구니에서 상품 제거
export const removeFromCart = (product) => {
  const index = cartList.findIndex(item => item.id === product.id);
  if (index !== -1) {
    cartList.splice(index, 1);
  }
};

// 장바구니 목록 조회
export const getCartList = () => cartList;

// 장바구니 비우기
export const clearCart = () => {
  cartList = [];
};

// 장바구니 총 수량 계산 (DOM 기반)
export const calculateTotalItemCount = () => {
  const cartItems = document.getElementById('cart-items');
  if (!cartItems) return 0;
  
  let totalCount = 0;
  for (let i = 0; i < cartItems.children.length; i++) {
    const quantityElement = cartItems.children[i].querySelector('.quantity-number');
    if (quantityElement) {
      totalCount += parseInt(quantityElement.textContent) || 0;
    }
  }

  return totalCount;
}; 