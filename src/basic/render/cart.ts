import { CartItem } from '../components/cart/cart-tem';
import { findCart, getCarts } from '../model/cart';
import { selectById } from '../utils/selector';

export function renderCartItems() {
  const cartItems = selectById('cart-items');
  const carts = getCarts();

  cartItems.innerHTML = carts.map(CartItem).join('');
}

export function renderAddCartItem(id: string) {
  const cartItem = selectById('cart-items');
  const cart = findCart(id);

  cartItem.innerHTML += CartItem(cart);
}

export function renderUpdateCartQuantity(id: string, quantity: number) {
  const cartItem = document.getElementById(id);

  if (!(cartItem instanceof HTMLDivElement)) {
    throw new Error('cartItem is not found');
  }

  const quantitySpan = cartItem.querySelector('.quantity-number');

  if (!(quantitySpan instanceof HTMLSpanElement)) {
    throw new Error('quantitySpan is not found');
  }

  quantitySpan.textContent = quantity.toString();
}
