// store/state.ts
import { initializeProducts } from '../data/products.js';
import type { Product, CartItems, Elements } from '../types/index.js';

// 전역 상태
let state = {
  products: [] as Product[],
  cartItems: {} as CartItems,
  lastSelectedProductId: null as string | null,
  totalAmount: 0,
  totalQuantity: 0,
  bonusPoints: 0,
  elements: {} as Elements,
};

// 상태 초기화
export function initializeState(): void {
  state.products = initializeProducts();
  state.cartItems = {};
  state.lastSelectedProductId = null;
  state.totalAmount = 0;
  state.totalQuantity = 0;
  state.bonusPoints = 0;
}

// Getters
export function getProducts(): Product[] {
  return state.products;
}

export function getProduct(productId: string): Product | undefined {
  return state.products.find((p) => p.id === productId);
}

export function getCartItems(): CartItems {
  return state.cartItems;
}

export function getCartQuantity(productId: string): number {
  return state.cartItems[productId] || 0;
}

export function getLastSelectedProductId(): string | null {
  return state.lastSelectedProductId;
}

export function getTotalAmount(): number {
  return state.totalAmount;
}

export function getTotalQuantity(): number {
  return state.totalQuantity;
}

export function getBonusPoints(): number {
  return state.bonusPoints;
}

export function getElements(): Elements {
  return state.elements;
}

// Setters
export function setProducts(products: Product[]): void {
  state.products = products;
}

export function updateProduct(productId: string, updates: Partial<Product>): void {
  const product = state.products.find((p) => p.id === productId);
  if (product) {
    Object.assign(product, updates);
  }
}

export function setCartQuantity(productId: string, quantity: number): void {
  if (quantity > 0) {
    state.cartItems[productId] = quantity;
  } else {
    delete state.cartItems[productId];
  }
}

export function setLastSelectedProductId(productId: string): void {
  state.lastSelectedProductId = productId;
}

export function setTotalAmount(amount: number): void {
  state.totalAmount = amount;
}

export function setTotalQuantity(quantity: number): void {
  state.totalQuantity = quantity;
}

export function setBonusPoints(points: number): void {
  state.bonusPoints = points;
}

export function setElements(elements: Elements): void {
  state.elements = elements;
}