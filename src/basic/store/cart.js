import { products } from "./products";

export const cartState = {
  selectedProductId: null,
  items: [],
  totalAmount: 0,
  itemCount: 0,
  products, // 단순 참조용 (products는 불변하니까..?)
};
