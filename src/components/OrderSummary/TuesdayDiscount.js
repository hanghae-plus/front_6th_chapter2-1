export function createTuesdayDiscount({
  isTuesday = false,
  total = 0,
  tuesdayMessage = 'Tuesday Special 10% Applied',
}) {
  const container = document.createElement('div');

  if (isTuesday && total > 0) {
    container.innerHTML = `
      <div class="flex items-center space-x-2">
        <span class="text-purple-400">🌟</span>
        <span class="text-sm text-purple-400">${tuesdayMessage}</span>
      </div>
    `;
    container.classList.remove('hidden');
  } else {
    container.classList.add('hidden');
  }

  return container;
}
