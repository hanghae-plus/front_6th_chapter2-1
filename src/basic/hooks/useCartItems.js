// 순수 함수: 카트 내 상품 정보를 products 기준으로 업데이트된 배열 반환
export function getUpdatedCartItems(cartItems, products) {
  const productMap = Object.fromEntries(products.map((p) => [p.id, p]));
  return Array.from(cartItems)
    .map((cartItem) => {
      const itemId = cartItem.id;
      const product = productMap[itemId];
      return product ? { cartItem, product } : null;
    })
    .filter(Boolean);
}
