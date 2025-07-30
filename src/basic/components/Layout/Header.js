export const Header = () => {
  const header = document.createElement('header');
  header.className =
    'py-5 px-8 flex justify-between items-center border-b border-gray-100 bg-white';
  header.innerHTML = `
    <h1 class="text-xl font-bold tracking-tight">Shopping Cart</h1>
    <div class="text-gray-400 text-xs">vanilla-js-example</div>
  `;
  return header;
};
