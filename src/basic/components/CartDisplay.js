/**
 * Cart 도메인 전용 컴포넌트
 * Cart 관련 DOM 생성과 초기화를 담당
 */

export function createCartDisplay() {
  const cartDisplay = document.createElement("div");
  cartDisplay.id = "cart-items";
  cartDisplay.className = "cart-items";

  return cartDisplay;
}

export function updateCartDisplay(cartDisplay, cartItems) {
  if (!cartDisplay) return;

  cartDisplay.innerHTML = "";

  cartItems.forEach(item => {
    const cartItem = createSimpleCartItem(item);
    cartDisplay.appendChild(cartItem);
  });
}

function createSimpleCartItem(item) {
  const cartItem = document.createElement("div");
  cartItem.className = "cart-item";
  cartItem.dataset.productId = item.id;

  cartItem.innerHTML = `
    <span class="product-name">${item.name}</span>
    <span class="quantity">${item.quantity}</span>
    <span class="price">${item.price}</span>
  `;

  return cartItem;
}
