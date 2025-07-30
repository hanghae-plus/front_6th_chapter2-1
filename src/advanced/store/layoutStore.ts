import { create } from 'zustand';

interface LayoutState {
  showHelpOverlay: boolean;
}

interface LayoutActions {
  setShowHelpOverlay: (showHelpOverlay: boolean) => void;
}

export const useLayoutStore = create<LayoutState & LayoutActions>(set => ({
  showHelpOverlay: false,

  setShowHelpOverlay: (showHelpOverlay: boolean) => {
    set({ showHelpOverlay });
  },
}));
