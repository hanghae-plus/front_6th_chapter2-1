import { createCartItemElement } from '../components/CartItem.js';
import { handleCartItemAction } from '../components/CartItemActions.js';
import { products } from '../data/productList.js';
import { addItemToCart } from '../hooks/useAddToCart.js';
import { updateSelectOptions } from '../utils/updateSelectOptions.js';

export function bindCartEvents(sel, addBtn, cartDisp, { setProducts, handleCalculateCartStuff }) {
  let lastSel = null;
  let currentProducts = products;
  updateSelectOptions(sel, currentProducts);
  handleCalculateCartStuff(currentProducts);

  addBtn.addEventListener('click', function () {
    const selItem = sel.value;
    const { updatedProducts, addResult } = addItemToCart(currentProducts, cartDisp.children, selItem);
    if (!addResult) return;
    currentProducts = updatedProducts;
    if (setProducts) setProducts(currentProducts);
    if (addResult.error === 'out-of-stock') {
      alert('재고가 부족합니다.');
      return;
    }
    if (addResult.isNew) {
      const newItem = createCartItemElement(addResult.item, 1);
      cartDisp.appendChild(newItem);
    } else {
      const item = document.getElementById(addResult.item.id);
      if (item) {
        const qtyElem = item.querySelector('.quantity-number');
        qtyElem.textContent = addResult.newQty;
      }
    }
    handleCalculateCartStuff(currentProducts);
    lastSel = selItem;
  });

  cartDisp.addEventListener('click', function (event) {
    handleCartItemAction(
      event,
      currentProducts,
      cartDisp,
      updateSelectOptions,
      function () {
        handleCalculateCartStuff(currentProducts);
      },
      sel
    );
  });

  return () => lastSel;
}
