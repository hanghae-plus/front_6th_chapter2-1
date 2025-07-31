export const ProductAddToCartButton = (onClick) => {
  const button = document.createElement('button');
  button.id = 'add-to-cart';
  button.innerHTML = 'Add to Cart';
  button.className =
    'w-full py-3 bg-black text-white text-sm font-medium uppercase tracking-wider hover:bg-gray-800 transition-all';
  button.addEventListener('click', onClick);
  return button;
};
