import { create } from 'zustand';
import type { UiState } from '../types';

interface UiStore extends UiState {
  // Actions
  toggleManualOverlay: () => void;
  openManualOverlay: () => void;
  closeManualOverlay: () => void;
  reset: () => void;
}

const initialState: UiState = {
  isManualOpen: false,
};

export const useUiStore = create<UiStore>((set, get) => ({
  ...initialState,

  toggleManualOverlay: () => {
    set((state) => ({ isManualOpen: !state.isManualOpen }));
  },

  openManualOverlay: () => {
    set({ isManualOpen: true });
  },

  closeManualOverlay: () => {
    set({ isManualOpen: false });
  },

  reset: () => {
    set(initialState);
  },
})); 