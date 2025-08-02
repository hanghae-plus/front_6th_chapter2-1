export function applyLightningSale(product) {
  if (product.quantity > 0 && !product.isOnLightningSale) {
    product.price = Math.round((product.originalPrice * 80) / 100);
    product.isOnLightningSale = true;
    return true;
  }
  return false;
}

export function applySuggestedSale(product) {
  if (product.quantity > 0 && !product.isSuggestedSale) {
    product.price = Math.round((product.price * (100 - 5)) / 100);
    product.isSuggestedSale = true;
    return true;
  }
  return false;
}

export function findProductById(products, productId) {
  return products.find((product) => product.id === productId);
}

export function findAvailableProductForSuggestion(products, excludeId) {
  return products.find(
    (product) =>
      product.id !== excludeId &&
      product.quantity > 0 &&
      !product.isSuggestedSale
  );
}

export function getRandomProduct(products) {
  const availableProducts = products.filter(
    (product) => product.quantity > 0 && !product.isOnLightningSale
  );

  if (availableProducts.length === 0) return null;

  const randomIndex = Math.floor(Math.random() * availableProducts.length);
  return availableProducts[randomIndex];
}


