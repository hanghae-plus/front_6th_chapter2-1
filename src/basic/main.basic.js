import { productList } from './product/productState.js';
import { cartState } from './cart/cartState.js';
import { pointState } from './point/pointState.js';
import { onAdd, onCartClick } from './handlers.js';
import { Header } from './components/Header.js';
import { Layout } from './components/Layout.js';
import { Selector } from './components/Selector.js';
import { HelpModal } from './components/HelpModal.js';
import { render } from './render.js';
import { startLightningSale } from './product/lightningSale.js';

function createShoppingCart() {
  const state = {
    productList: productList,
    cartItems: cartState.cartItems,
    lastSelectedProduct: cartState.lastSelectedProduct,
    totals: cartState.totals,
    bonus: pointState,
  };

  /* ---------- 부트스트랩 ---------- */
  function init() {
    const root = document.getElementById('app');
    root.innerHTML = '';
    root.appendChild(Header());

    const { grid, left, right } = Layout();
    root.appendChild(grid);
    grid.append(left, right);

    const { wrap, btn } = Selector();
    left.appendChild(wrap);

    const cartDiv = document.createElement('div');
    cartDiv.id = 'cart-items';
    left.appendChild(cartDiv);

    btn.addEventListener('click', () => onAdd(state));
    cartDiv.addEventListener('click', (e) => onCartClick(e, state));

    const { helpBtn, modal } = HelpModal();
    root.append(helpBtn, modal);

    render(state);
    startLightningSale(state);
  }

  return { init, state };
}

createShoppingCart().init();
