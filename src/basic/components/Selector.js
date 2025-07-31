const Selector = (selector) => {
  // selector element
  const $selector = document.createElement('select');
  $selector.id = 'product-select';
  $selector.className = 'w-full p-3 border border-gray-300 rounded-lg text-base mb-3';

  return $selector;
};

export default Selector;
