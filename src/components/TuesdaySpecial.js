export function createTuesdaySpecial({
  message = 'Tuesday Special 10% Applied',
}) {
  const container = document.createElement('div');
  container.className = 'flex items-center gap-2';
  container.innerHTML = `
    <span class="text-2xs">🎉</span>
    <span class="text-xs uppercase tracking-wide">${message}</span>
  `;
  return container;
}
