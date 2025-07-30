import { selectById } from '../utils/selector';
import { ProductsData } from './products';

let productSelect: HTMLSelectElement | null = null;
let lastSelectedProductId = ProductsData[0].id;

export function initProductSelect() {
  const select = selectById('product-select');

  if (!(select instanceof HTMLSelectElement)) {
    throw new Error('product-select not found');
  }

  productSelect = select;
}

export function getProductSelect() {
  if (!productSelect) {
    throw new Error('initProductSelect 함수를 먼저 호출해주세요.');
  }
  return productSelect;
}

export function getSelectedProductId() {
  if (!productSelect) {
    throw new Error('initProductSelect 함수를 먼저 호출해주세요.');
  }

  return productSelect.value;
}

export function getLastSelectedProductId() {
  return lastSelectedProductId;
}

export function setLastSelectedProductId(id: string) {
  lastSelectedProductId = id;
}
