// products 상태를 모듈로 분리하여 getter/setter 제공
import { products as initialProducts } from '../data/productList.js';

let _products = initialProducts;

export function getProducts() {
  return _products;
}

export function setProducts(newProducts) {
  _products = newProducts;
}
