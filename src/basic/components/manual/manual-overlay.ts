import { appendChildren } from '../../utils/append-children';
import {
  MANUAL_COLUMN_ID,
  MANUAL_OVERLAY_ID,
  selectById,
} from '../../utils/selector';

interface Props {
  children: HTMLElement[];
}

export const ManualOverlay = ({ children }: Props) => {
  const manualOverlay = document.createElement('div');
  manualOverlay.id = MANUAL_OVERLAY_ID;
  manualOverlay.className =
    'fixed inset-0 bg-black/50 z-40 hidden transition-opacity duration-300';
  manualOverlay.onclick = () => {
    const manualOverlay = selectById(MANUAL_OVERLAY_ID);
    const manualColumn = selectById(MANUAL_COLUMN_ID);

    if (!manualOverlay || !manualColumn) {
      throw new Error('manualOverlay not found');
    }

    manualOverlay.classList.add('hidden');
    manualColumn.classList.add('translate-x-full');
  };

  appendChildren(manualOverlay, children);

  return manualOverlay;
};
