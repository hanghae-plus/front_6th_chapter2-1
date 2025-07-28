export const createAddToCartBtn = () => {
  const addToCartBtn = document.createElement('button');
  addToCartBtn.id = 'add-to-cart';
  addToCartBtn.innerHTML = 'Add to Cart';
  addToCartBtn.className =
    'w-full py-3 bg-black text-white text-sm font-medium uppercase tracking-wider hover:bg-gray-800 transition-all';

  return addToCartBtn;
};
