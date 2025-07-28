import { createCartItem } from './CartItem';

export function createCartDisplay() {
  const container = document.createElement('div');
  container.id = 'cart-items';

  // CartDisplay에 addItem 메서드 추가
  container.addItem = function (product) {
    const newItem = createCartItem(product);
    container.appendChild(newItem);
    return newItem;
  };

  // CartDisplay에 setupEventListeners 메서드 추가
  container.setupEventListeners = function ({
    findProductById,
    getQuantityFromElement,
    handleCalculateCartStuff,
    onUpdateSelectOptions,
  }) {
    container.addEventListener('click', function (event) {
      const tgt = event.target;
      if (
        tgt.classList.contains('quantity-change') ||
        tgt.classList.contains('remove-item')
      ) {
        const prodId = tgt.dataset.productId;
        const itemElem = document.getElementById(prodId);
        const prod = findProductById(prodId);

        if (tgt.classList.contains('quantity-change')) {
          const qtyChange = parseInt(tgt.dataset.change);
          const qtyElem = itemElem.querySelector('.quantity-number');
          const currentQty = getQuantityFromElement(qtyElem);
          const newQty = currentQty + qtyChange;

          if (newQty > 0 && newQty <= prod.q + currentQty) {
            qtyElem.textContent = newQty;
            prod.q -= qtyChange;
          } else if (newQty <= 0) {
            prod.q += currentQty;
            itemElem.remove();
          } else {
            alert('재고가 부족합니다.');
          }
        } else if (tgt.classList.contains('remove-item')) {
          const qtyElem = itemElem.querySelector('.quantity-number');
          const remQty = getQuantityFromElement(qtyElem);
          prod.q += remQty;
          itemElem.remove();
        }

        handleCalculateCartStuff();
        onUpdateSelectOptions();
      }
    });
  };

  return container;
}
