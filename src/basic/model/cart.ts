import { isTuesday } from '../utils/day';
import { calculateRate } from '../utils/price';
import { CART_ITEMS_ID, selectById } from '../utils/selector';
import { findProduct, addProductQuantity, isBulk } from './products';

export interface Cart {
  id: string;
  quantity: number;
}

export interface DetailCart extends Cart {
  name: string;
  price: number;
  originalPrice: number;
  totalPrice: number;
}

let carts: Cart[] = [];

function safeFindIndex(id: string) {
  return carts.findIndex((cart) => cart.id === id);
}

function findIndex(id: string) {
  const index = safeFindIndex(id);

  if (index < 0) {
    throw new Error(`findIndex: ${id} not found`);
  }

  return index;
}

export function safeFindCart(id: string) {
  return carts.find((cart) => cart.id === id);
}

export function findCart(id: string) {
  const cart = safeFindCart(id);

  if (!cart) {
    throw new Error(`findCart: ${id} not found`);
  }

  return cart;
}

function validateQuantity(id: string, quantity: number): void {
  const product = findProduct(id);

  if (quantity > product.quantity) {
    throw new Error('재고가 부족합니다.');
  }
}

export function getCarts(): DetailCart[] {
  return carts.map((cart) => {
    const product = findProduct(cart.id);

    return {
      ...cart,
      price: product.price,
      originalPrice: product.originalPrice,
      name: product.name,
      totalPrice: product.price * cart.quantity,
    };
  });
}

function addCart({ id, quantity }: Cart) {
  carts.push({ id, quantity });
}

function updateCart({ id, quantity }: Cart) {
  const cartIndex = findIndex(id);
  carts[cartIndex].quantity = quantity;
}

export function addToCart({ id, quantity = 1 }: Cart) {
  const cartIndex = safeFindIndex(id);

  if (cartIndex < 0) {
    validateQuantity(id, quantity);
    addCart({ id, quantity });
    addProductQuantity({ id, quantity: -quantity });
  } else {
    addCartQuantity({ id, quantity });
  }
}

export function addCartQuantity({ id, quantity }: Cart) {
  const cartIndex = findIndex(id);

  validateQuantity(id, quantity);
  updateCart({ id, quantity: carts[cartIndex].quantity + quantity });
  addProductQuantity({ id, quantity: -quantity });
}

export function removeCart(id: string) {
  const cart = findCart(id);
  addProductQuantity({ id, quantity: cart.quantity });
  carts = carts.filter((cart) => cart.id !== id);
}

export function clearCart() {
  carts.forEach((cart) => {
    addProductQuantity({ id: cart.id, quantity: cart.quantity });
  });
  carts = [];
}

export function isCartTotalBulk(totalCount: number) {
  const TOTAL_BULK_SALE_THRESHOLD = 30;
  return totalCount >= TOTAL_BULK_SALE_THRESHOLD;
}

export function getCartItemQuantityFromDom() {
  const cartItems = Array.from(selectById(CART_ITEMS_ID).children);
  return cartItems.map((cartItem) => {
    const quantitySpane = cartItem.querySelector('.quantity-number');

    if (!(quantitySpane instanceof HTMLSpanElement)) {
      throw new Error('quantitySpan is not found');
    }

    return { id: cartItem.id, quantity: +(quantitySpane.textContent ?? '') };
  });
}

export function getCartTotalCount(carts: Cart[]) {
  return carts.reduce((acc, cart) => acc + cart.quantity, 0);
}

export function getCartTotalPrice(carts: Cart[]) {
  return carts.reduce(
    (acc, cart) => acc + cart.quantity * findProduct(cart.id).price,
    0
  );
}

export function getCartFinalPrice({
  carts,
  cartTotalCount,
}: {
  carts: Cart[];
  cartTotalCount: number;
}): number {
  const { totalPrice, bulkSaledTotalPrice } = carts.reduce(
    (acc, { quantity, id }) => {
      const { bulkSaleRate, price } = findProduct(id);
      const discountRate = isBulk({ quantity }) ? bulkSaleRate : 0;
      const totalPrice = quantity * price;
      acc.totalPrice += totalPrice;
      acc.bulkSaledTotalPrice += calculateRate(totalPrice, discountRate);
      return acc;
    },
    {
      totalPrice: 0,
      bulkSaledTotalPrice: 0,
    }
  );

  const TOTAL_BULK_SALE_RATE = 0.25;
  const currentBulkSaleRate = isCartTotalBulk(cartTotalCount)
    ? TOTAL_BULK_SALE_RATE
    : 0;

  const minTotalPrice = Math.min(
    calculateRate(totalPrice, currentBulkSaleRate),
    bulkSaledTotalPrice
  );

  const TUESDAY_SALE_RATE = 0.1;
  const tuesdaySaleRate = isTuesday() ? TUESDAY_SALE_RATE : 0;

  return calculateRate(minTotalPrice, tuesdaySaleRate);
}
