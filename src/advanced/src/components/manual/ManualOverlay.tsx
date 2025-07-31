import { useUiStore } from '../../store';
import { ManualColumn } from './ManualColumn';

export const ManualOverlay = () => {
  const { isManualOpen, closeManualOverlay } = useUiStore();

  const handleOverlayClick = (event: React.MouseEvent) => {
    if (event.target === event.currentTarget) {
      closeManualOverlay();
    }
  };

  if (!isManualOpen) return null;

  return (
    <div
      id="manual-overlay"
      className="fixed inset-0 bg-black/50 z-40 transition-opacity duration-300"
      onClick={handleOverlayClick}
    >
      <ManualColumn />
    </div>
  );
}; 