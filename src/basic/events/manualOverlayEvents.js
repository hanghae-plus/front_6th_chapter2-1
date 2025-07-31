export function bindManualOverlayEvents(manualToggleBtn, manualOverlayDiv) {
  manualToggleBtn.addEventListener('click', () => {
    manualOverlayDiv.classList.toggle('hidden');
    const manualColumn = manualOverlayDiv.querySelector('#manual-column');
    manualColumn.classList.toggle('translate-x-full');
  });
  manualOverlayDiv.addEventListener('click', (e) => {
    if (e.target === manualOverlayDiv) {
      manualOverlayDiv.classList.add('hidden');
      const manualColumn = manualOverlayDiv.querySelector('#manual-column');
      manualColumn.classList.add('translate-x-full');
    }
  });
  const manualCloseBtn = manualOverlayDiv.querySelector('#manual-close');
  if (manualCloseBtn) {
    manualCloseBtn.addEventListener('click', () => {
      manualOverlayDiv.classList.add('hidden');
      const manualColumn = manualOverlayDiv.querySelector('#manual-column');
      manualColumn.classList.add('translate-x-full');
    });
  }
}
