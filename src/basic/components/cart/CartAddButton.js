export const createCartAddButton = () => {
  const cartAddButton = document.createElement('button');
  cartAddButton.id = 'add-to-cart';
  cartAddButton.innerHTML = 'Add to Cart';
  cartAddButton.className =
    'w-full py-3 bg-black text-white text-sm font-medium uppercase tracking-wider hover:bg-gray-800 transition-all';

  return cartAddButton;
};
