export function attachCartEventListener(
  cartContainer,
  findProductById,
  handleCalculateCartStuff,
  onUpdateSelectOptions,
) {
  cartContainer.addEventListener('click', function (event) {
    const tgt = event.target;
    let quantityElem;

    if (
      tgt.classList.contains('quantity-change') ||
      tgt.classList.contains('remove-item')
    ) {
      const prodId = tgt.dataset.productId;
      const itemElem = document.getElementById(prodId);
      const prod = findProductById(prodId);

      // 수량 변경 처리
      if (tgt.classList.contains('quantity-change')) {
        const quantityChange = parseInt(tgt.dataset.change);
        quantityElem = itemElem.querySelector('.quantity-number');
        const currentQuantity = parseInt(quantityElem.textContent);
        const newQuantity = currentQuantity + quantityChange;

        if (
          newQuantity > 0 &&
          newQuantity <= prod.availableStock + currentQuantity
        ) {
          quantityElem.textContent = newQuantity;
          prod.availableStock -= quantityChange;
        } else if (newQuantity <= 0) {
          prod.availableStock += currentQuantity;
          itemElem.remove();
        } else {
          alert('재고가 부족합니다.');
        }
      }
      // 상품 삭제 처리
      else if (tgt.classList.contains('remove-item')) {
        quantityElem = itemElem.querySelector('.quantity-number');
        const removeQuantity = parseInt(quantityElem.textContent);
        prod.availableStock += removeQuantity;
        itemElem.remove();
      }

      // 재고 부족 상품 체크
      if (prod && prod.availableStock < 5) {
      }

      handleCalculateCartStuff();
      onUpdateSelectOptions();
    }
  });
}
