// 카트 내 수량 변경/삭제 등 UI 처리 및 상품 배열 업데이트 로직 분리
export function handleCartItemAction(event, products, cartDisp, updateSelectOptions, handleCalculateCartStuff, sel) {
  const tgt = event.target;
  const prodId = tgt.dataset.productId;
  const itemElem = cartDisp.querySelector(`#${prodId}`);
  if (!itemElem) return;
  const qtyElem = itemElem.querySelector('.quantity-number');
  if (tgt.classList.contains('quantity-change') || tgt.classList.contains('remove-item')) {
    const prod = products.find((p) => p.id === prodId);
    if (!prod) return;
    if (tgt.classList.contains('quantity-change')) {
      const qtyChange = parseInt(tgt.dataset.change);
      const currentQty = parseInt(qtyElem.textContent);
      const newQty = currentQty + qtyChange;
      if (newQty > 0 && newQty <= prod.quantity + currentQty) {
        qtyElem.textContent = newQty;
        prod.quantity -= qtyChange;
      } else if (newQty <= 0) {
        prod.quantity += currentQty;
        itemElem.remove();
      } else {
        alert('재고가 부족합니다.');
      }
    } else if (tgt.classList.contains('remove-item')) {
      const remQty = parseInt(qtyElem.textContent);
      prod.quantity += remQty;
      itemElem.remove();
    }
    handleCalculateCartStuff();
    updateSelectOptions(sel, products);
  }
}
