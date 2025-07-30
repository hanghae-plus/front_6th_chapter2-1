import { findProduct, addProductQuantity } from './products';

interface Cart {
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

export function findCart(id: string) {
  const cart = carts.find((cart) => cart.id === id);

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

export function addToCart(id: string) {
  const quantity = 1;
  const cartIndex = safeFindIndex(id);

  validateQuantity(id, quantity);

  if (cartIndex < 0) {
    addCart({ id, quantity });
  } else {
    updateCart({ id, quantity });
  }

  addProductQuantity({ id, quantity: -quantity });
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
