export function calculateTotalStock(products) {
  return products.reduce((total, product) => total + product.q, 0);
}

export function getLowStockItems(products, threshold) {
  return products.filter(product => product.q < threshold && product.q > 0);
}
