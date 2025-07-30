import { create } from 'zustand';

interface LayoutState {
  showHelpOverlay: boolean;
}

interface LayoutActions {
  setShowHelpOverlay: (showHelpOverlay: boolean) => void;
}

const useLayoutStore = create<LayoutState & LayoutActions>(set => ({
  showHelpOverlay: false,

  setShowHelpOverlay: (showHelpOverlay: boolean) => {
    set({ showHelpOverlay });
  },
}));

export default useLayoutStore;
