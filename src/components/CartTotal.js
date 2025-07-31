export function createCartTotal({ total = 0, loyaltyPoints = 0 }) {
  const container = document.createElement('div');
  container.innerHTML = `
    <div class="flex justify-between items-baseline">
      <span class="text-sm uppercase tracking-wider">Total</span>
      <div class="text-2xl tracking-tight">₩${total.toLocaleString()}</div>
    </div>
    <div id="loyalty-points" class="text-xs text-blue-400 mt-2 text-right">적립 포인트: ${loyaltyPoints}p</div>
  `;
  return container;
}
