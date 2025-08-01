import { formatPrice } from './price';

export const getProductById = (productList, id) => {
  return productList.find((p) => p.id === id);
};

export const getLightningSaleProduct = (productList) => {
  const availableProducts = productList.filter(
    (product) => product.quantity > 0 && !product.isOnSale,
  );

  if (availableProducts.length === 0) return null;

  const randomIndex = Math.floor(Math.random() * availableProducts.length);
  return availableProducts[randomIndex];
};

export const findRecommendedProduct = (productList, excludeId) => {
  return productList.find(
    (product) => product.id !== excludeId && product.quantity > 0 && !product.isRecommended,
  );
};

export const getTotalStock = (productList) => {
  return productList.reduce((sum, p) => sum + p.quantity, 0);
};

export const getProductNameWithBadge = (product) => {
  let prefix = '';
  if (product.isOnSale && product.isRecommended) prefix = '⚡💝';
  else if (product.isOnSale) prefix = '⚡';
  else if (product.isRecommended) prefix = '💝';
  return `${prefix}${product.name}`;
};

export const getProductPriceHTML = (product) => {
  const price = formatPrice(product.price);
  const original = formatPrice(product.originalPrice);

  if (product.isOnSale && product.isRecommended) {
    return `<span class="line-through text-gray-400">${original}</span> <span class="text-purple-600">${price}</span>`;
  } else if (product.isOnSale) {
    return `<span class="line-through text-gray-400">${original}</span> <span class="text-red-500">${price}</span>`;
  } else if (product.isRecommended) {
    return `<span class="line-through text-gray-400">${original}</span> <span class="text-blue-500">${price}</span>`;
  }

  return price;
};
