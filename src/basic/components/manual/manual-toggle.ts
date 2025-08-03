import { html } from '../../utils/html';
import {
  MANUAL_COLUMN_ID,
  MANUAL_OVERLAY_ID,
  selectById,
} from '../../utils/selector';

export const ManualToggle = () => {
  const manualToggle = document.createElement('button');
  manualToggle.className =
    'fixed top-4 right-4 bg-black text-white p-3 rounded-full hover:bg-gray-900 transition-colors z-50';
  manualToggle.innerHTML = html`
    <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path
        stroke-linecap="round"
        stroke-linejoin="round"
        stroke-width="2"
        d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
      ></path>
    </svg>
  `;
  manualToggle.onclick = () => {
    const manualOverlay = selectById(MANUAL_OVERLAY_ID);
    const manualColumn = selectById(MANUAL_COLUMN_ID);

    if (!manualOverlay || !manualColumn) {
      throw new Error('manualOverlay not found');
    }

    manualOverlay.classList.toggle('hidden');
    manualColumn.classList.toggle('translate-x-full');
  };

  return manualToggle;
};
