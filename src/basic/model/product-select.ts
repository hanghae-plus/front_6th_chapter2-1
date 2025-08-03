import { selectById } from '../utils/selector';

export function getSelectedProductId() {
  return selectById<HTMLSelectElement>('product-select').value;
}
