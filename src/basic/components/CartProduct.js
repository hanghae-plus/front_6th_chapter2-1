export const createCartProduct = () => {
  const cartProduct = document.createElement('div');
  cartProduct.className =
    'grid grid-cols-[80px_1fr_auto] gap-5 py-5 border-b border-gray-100 first:pt-0 last:border-b-0 last:pb-0';

  return cartProduct;
};
