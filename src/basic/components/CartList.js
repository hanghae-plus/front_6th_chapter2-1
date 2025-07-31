export function createCartList() {
  const cartList = document.createElement("div");
  cartList.id = "cart-items";
  cartList.className = "cart-items";

  return cartList;
}
