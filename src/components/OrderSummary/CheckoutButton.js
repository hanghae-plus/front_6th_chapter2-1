export function createCheckoutButton() {
  const button = document.createElement('button');
  button.className =
    'w-full py-4 bg-white text-black text-sm font-normal uppercase tracking-super-wide cursor-pointer transition-all hover:-translate-y-0.5 hover:shadow-lg hover:shadow-black/30';
  button.textContent = 'Proceed to Checkout';

  return button;
}
